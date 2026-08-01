import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import useProjectForm from "@/hooks/useProjectForm";
import projectService from "@/services/project/projectService";

import { ROUTES } from "@/constants/routes";

import ProjectSelector from "@/components/project/ProjectSelector";
import PortfolioTourForm from "@/components/project/PortfolioTourForm";
import IndividualProjectForm from "@/components/project/IndividualProjectForm";

const CreateProject = () => {
  const methods = useProjectForm();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const coverImage = data.media?.coverImage;
      const galleryAlbums = data.media?.gallery || [];
      const brochures = data.brochures || [];
      const legalDocuments = data.legalDocuments || [];
      const floorPlans = data.floorPlans || [];

      // Temporary debugging logs
      console.log("Cover:", coverImage);
      console.log("Gallery Albums:", galleryAlbums);
      console.log("Brochures:", brochures);
      console.log("Legal Documents:", legalDocuments);
      console.log("Floor Plans:", floorPlans);

      // Remove File objects before sending JSON
      if (data.media) {
        data.media.coverImage = null;
        data.media.gallery = [];
      }

      data.brochures = [];
      data.legalDocuments = [];
      data.floorPlans = [];

      const response = await projectService.createProject(data);

      const project = response.data?.project;

      // Upload cover image
      if (coverImage) {
        await projectService.uploadCoverImage(project._id, coverImage);
      }

      // Upload gallery albums and images
      for (const album of galleryAlbums) {
        if (!album.albumName?.trim()) continue;

        const images = album.images || [];

        const newImages = images.filter((img) => img.file);

        await Promise.all(
          newImages.map((image, index) =>
            projectService.uploadGalleryImage(project._id, image.file, {
              albumName: album.albumName.trim(),
              caption: image.caption || "",
              alt: image.alt || "",
              displayOrder: index,
            }),
          ),
        );
      }

      // Upload brochures
      const newBrochures = brochures.filter((doc) => doc.file);
      await Promise.all(
        newBrochures.map((brochure) =>
          projectService.uploadBrochure(
            project._id,
            brochure.file,
            brochure.title,
          ),
        ),
      );

      // Upload legal documents
      const newLegalDocs = legalDocuments.filter((doc) => doc.file);
      await Promise.all(
        newLegalDocs.map((document) =>
          projectService.uploadLegalDocument(
            project._id,
            document.file,
            document.title,
          ),
        ),
      );

      // Upload floor plans
      const newFloorPlans = floorPlans.filter((doc) => doc.file);
      await Promise.all(
        newFloorPlans.map((floorPlan) =>
          projectService.uploadFloorPlan(
            project._id,
            floorPlan.file,
            floorPlan.title,
          ),
        ),
      );

      toast.success(response.message || "Project created successfully.");

      methods.reset();
      navigate(ROUTES.PROJECTS);
    } catch (error) {
      const responseData = error?.response?.data;

      if (responseData?.errors?.length) {
        toast.error(
          responseData.errors
            .map((err) => `${err.field}: ${err.message}`)
            .join("\n"),
        );
      } else {
        toast.error(
          responseData?.message || error.message || "Failed to create project.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedType) {
    return (
      <ProjectSelector
        onContinue={(type) => {
          methods.setValue("projectCategory", type);
          setSelectedType(type);
        }}
      />
    );
  }

  if (selectedType === "portfolio") {
    return (
      <PortfolioTourForm
        methods={methods}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <IndividualProjectForm
      methods={methods}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default CreateProject;
