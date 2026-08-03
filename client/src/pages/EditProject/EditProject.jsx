import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import useProjectForm from "@/hooks/useProjectForm";
import projectService from "@/services/project/projectService";

import { ROUTES } from "@/constants/routes";
import { PROJECT_SECTIONS } from "@/constants/projectSections";

import ProjectForm from "@/components/project/ProjectForm";
import PortfolioTourForm from "@/components/project/PortfolioTourForm";

const EditProject = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const sectionParam = searchParams.get("section");

  const methods = useProjectForm();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectService.getProject(id);

        methods.reset(response.data.project);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
          "Failed to load project."
        );

        navigate(ROUTES.PROJECTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, methods, navigate]);

  useEffect(() => {
    if (!isLoading && sectionParam) {
      const section = Object.values(PROJECT_SECTIONS).find(
        (sec) => sec.slug === sectionParam
      );

      if (section) {
        setTimeout(() => {
          const element = document.getElementById(section.id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    }
  }, [isLoading, sectionParam]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Thumbnail
      const coverImage = data.media?.coverImage instanceof File ? data.media.coverImage : null;

      // Gallery Albums
      const galleryAlbums = data.media?.gallery || [];
      const cleanAlbums = galleryAlbums
        .map((album) => ({
          ...album,
          images: (album.images || []).filter((img) => !img.file),
        }))
        .filter((album) => album.albumName?.trim() !== "");

      // Documents
      const brochures = data.brochures || [];
      const legalDocuments = data.legalDocuments || [];
      const floorPlans = data.floorPlans || [];

      // Filter out new file objects before sending JSON
      if (data.media) {
        data.media.coverImage = coverImage ? null : data.media.coverImage;
        data.media.gallery = cleanAlbums;
      }
      
      data.brochures = brochures.filter((doc) => !doc.file && doc.url);
      data.legalDocuments = legalDocuments.filter((doc) => !doc.file && doc.url);
      data.floorPlans = floorPlans.filter((doc) => !doc.file && doc.url);

      // Intercept custom project type
      if (data.general?.projectType === "Custom" && data.general?.customProjectType) {
        data.general.projectType = data.general.customProjectType;
      }
      if (data.general) {
        delete data.general.customProjectType;
      }

      // Update project JSON data
      const response = await projectService.updateProject(id, data);

      // Upload new thumbnail
      if (coverImage) {
        await projectService.uploadCoverImage(id, coverImage);
      }

      // Upload newly added gallery images inside albums
      for (const album of galleryAlbums) {
        if (!album.albumName?.trim()) continue;

        const newImages = (album.images || []).filter((img) => img.file);
        
        await Promise.all(
          newImages.map((image, index) =>
            projectService.uploadGalleryImage(id, image.file, {
              albumName: album.albumName.trim(),
              caption: image.caption || "",
              alt: image.alt || "",
              displayOrder: index,
            })
          )
        );
      }

      // Upload new brochures
      const newBrochures = brochures.filter((doc) => doc.file);
      await Promise.all(
        newBrochures.map((brochure) =>
          projectService.uploadBrochure(id, brochure.file, brochure.title)
        )
      );

      // Upload new legal documents
      const newLegalDocs = legalDocuments.filter((doc) => doc.file);
      await Promise.all(
        newLegalDocs.map((document) =>
          projectService.uploadLegalDocument(id, document.file, document.title)
        )
      );

      // Upload new floor plans
      const newFloorPlans = floorPlans.filter((doc) => doc.file);
      await Promise.all(
        newFloorPlans.map((floorPlan) =>
          projectService.uploadFloorPlan(id, floorPlan.file, floorPlan.title)
        )
      );

      toast.success(
        response.message ||
        "Project updated successfully."
      );

      navigate(ROUTES.PROJECTS);
    } catch (error) {
      const responseData = error?.response?.data;

      console.log("Validation Error:", responseData);

      if (responseData?.errors?.length) {
        toast.error(
          responseData.errors
            .map(
              (err) =>
                `${err.field}: ${err.message}`
            )
            .join("\n")
        );
      } else {
        toast.error(
          responseData?.message ||
          error.message ||
          "Failed to update project."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white p-12 text-center">
        Loading project...
      </div>
    );
  }

  const isPortfolioTour = methods.watch("projectCategory") === "portfolio";

  if (isPortfolioTour) {
    return (
      <PortfolioTourForm
        methods={methods}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <ProjectForm
      methods={methods}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      title="Edit Project"
      description="Update the project details below."
      submitButtonText="Save Changes"
    />
  );
};

export default EditProject;