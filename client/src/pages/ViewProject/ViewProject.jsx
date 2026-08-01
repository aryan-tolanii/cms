import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Phone,
  MapPin,
  Activity,
  Image as ImageIcon,
  Video,
  FileText,
  ShieldCheck,
  Search,
  Pencil,
  ArrowLeft,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PROJECT_SECTIONS } from "@/constants/projectSections";
import projectService from "@/services/project/projectService";
import { ROUTES } from "@/constants/routes";

export default function ViewProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading: loading, isError } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectService.getProject(id),
    enabled: !!id,
  });

  const project = data?.project || data?.data?.project || data?.data || data;

  const handleEditSection = (sectionSlug) => {
    const editPath = ROUTES.PROJECT_EDIT.replace(":id", id);
    navigate(`${editPath}?section=${sectionSlug}`);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading project details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">Failed to load project details.</div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center text-red-500">Project not found.</div>
    );
  }

  const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {project.general?.projectName || "Untitled Project"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Project Overview Details
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate(ROUTES.PROJECT_EDIT.replace(":id", id))}
        >
          <Pencil className="mr-2 h-4 w-4" /> Edit Full Project
        </Button>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. General Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              {PROJECT_SECTIONS.general.label}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditSection(PROJECT_SECTIONS.general.slug)}
            >
              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 pt-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Title:</span>{" "}
              {project.general?.projectName || "N/A"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Project Type:
              </span>{" "}
              {project.general?.projectType || "N/A"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Category:
              </span>{" "}
              {project.projectCategory === "portfolio" ? "Portfolio Tour" : "Individual Project"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Description:
              </span>{" "}
              {project.general?.description || "N/A"}
            </div>
          </CardContent>
        </Card>

        {/* 2. Contact Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {PROJECT_SECTIONS.contact.label}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditSection(PROJECT_SECTIONS.contact.slug)}
            >
              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 pt-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Phone:</span>{" "}
              {project.contact?.phone || "N/A"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Email:</span>{" "}
              {project.contact?.email || "N/A"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                WhatsApp:
              </span>{" "}
              {project.contact?.whatsapp || "N/A"}
            </div>
          </CardContent>
        </Card>

        {/* 3. Location */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {PROJECT_SECTIONS.location.label}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditSection(PROJECT_SECTIONS.location.slug)}
            >
              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 pt-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">
                Address:
              </span>{" "}
              {project.location?.address || "N/A"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">City:</span>{" "}
              {project.location?.city || "N/A"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">State:</span>{" "}
              {project.location?.state || "N/A"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Pincode:
              </span>{" "}
              {project.location?.pincode || "N/A"}
            </div>
          </CardContent>
        </Card>

        {/* 4. Project Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              {PROJECT_SECTIONS.status.label}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditSection(PROJECT_SECTIONS.status.slug)}
            >
              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 pt-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Status:</span>{" "}
              {project.status?.status || "Draft"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Featured:
              </span>{" "}
              {project.status?.featured ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Published:
              </span>{" "}
              {project.status?.published ? "Yes" : "No"}
            </div>
          </CardContent>
        </Card>

        {/* 5. Main Media & Banner */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              {PROJECT_SECTIONS.media.label}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditSection(PROJECT_SECTIONS.media.slug)}
            >
              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 pt-2 text-sm">
            {project.media?.coverImage?.url ? (
              <div className="flex items-center gap-3">
                <img
                  src={`${API_BASE_URL}${project.media.coverImage.url}`}
                  alt="Banner"
                  className="h-16 w-24 object-cover rounded border"
                />
                <span className="text-xs text-muted-foreground">
                  Cover Image
                </span>
              </div>
            ) : (
              <p className="text-muted-foreground">No cover image uploaded.</p>
            )}
          </CardContent>
        </Card>

        {/* 6. Gallery */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              {PROJECT_SECTIONS.gallery.label}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditSection(PROJECT_SECTIONS.gallery.slug)}
            >
              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
            </Button>
          </CardHeader>
          <CardContent className="pt-2 text-sm">
            {(() => {
              const allImages = project.media?.gallery?.flatMap(album => album.images) || [];
              if (allImages.length > 0) {
                return (
                  <div className="grid grid-cols-4 gap-2">
                    {allImages.slice(0, 4).map((img, idx) => (
                      <img
                        key={idx}
                        src={`${API_BASE_URL}${img.url}`}
                        alt={`Gallery ${idx + 1}`}
                        className="h-16 w-full object-cover rounded border"
                      />
                    ))}
                    {allImages.length > 4 && (
                      <div className="h-16 flex items-center justify-center bg-muted rounded text-xs font-medium">
                        +{allImages.length - 4} more
                      </div>
                    )}
                  </div>
                );
              }
              return <p className="text-muted-foreground">No gallery images added.</p>;
            })()}
          </CardContent>
        </Card>

        {/* 7. Videos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Video className="h-4 w-4 text-primary" />
              {PROJECT_SECTIONS.videos.label}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditSection(PROJECT_SECTIONS.videos.slug)}
            >
              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 pt-2 text-sm">
            {project.videos && project.videos.length > 0 ? (
              <ul className="list-disc pl-4 space-y-1">
                {project.videos.map((vid, idx) => (
                  <li key={idx} className="truncate text-blue-600 underline">
                    <a
                      href={vid.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {vid.title || `Video ${idx + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No videos linked.</p>
            )}
          </CardContent>
        </Card>

        {/* 8. Brochure & Attachments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              {PROJECT_SECTIONS.brochure.label}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditSection(PROJECT_SECTIONS.brochure.slug)}
            >
              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 pt-2 text-sm">
            {project.brochures && project.brochures.length > 0 ? (
              <ul className="list-disc pl-4 space-y-1">
                {project.brochures.map((doc, idx) => (
                  <li key={idx} className="truncate text-blue-600 underline">
                    <a href={`${API_BASE_URL}${doc.url}`} target="_blank" rel="noreferrer">
                      <FileText className="inline h-4 w-4 mr-1" /> {doc.title || `Brochure ${idx + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No brochure uploaded.</p>
            )}
          </CardContent>
        </Card>

        {/* 9. Legal Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {PROJECT_SECTIONS.legal.label}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditSection(PROJECT_SECTIONS.legal.slug)}
            >
              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 pt-2 text-sm">
            {project.legalDocuments && project.legalDocuments.length > 0 ? (
              <ul className="list-disc pl-4 space-y-1">
                {project.legalDocuments.map((doc, idx) => (
                  <li key={idx} className="truncate text-blue-600 underline">
                    <a href={`${API_BASE_URL}${doc.url}`} target="_blank" rel="noreferrer">
                      <ShieldCheck className="inline h-4 w-4 mr-1" /> {doc.title || `Legal Document ${idx + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No legal documents uploaded.</p>
            )}
          </CardContent>
        </Card>

        {/* 10. SEO Metadata */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              {PROJECT_SECTIONS.seo.label}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditSection(PROJECT_SECTIONS.seo.slug)}
            >
              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 pt-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">
                Meta Title:
              </span>{" "}
              {project.seo?.metaTitle || "N/A"}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Meta Description:
              </span>{" "}
              {project.seo?.metaDescription || "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
