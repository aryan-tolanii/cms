import { useNavigate } from "react-router-dom";
import { BadgeCheck, Edit, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

import DeleteProjectDialog from "./DeleteProjectDialog";
import { getImageUrl } from "@/lib/utils";

const statusStyles = {
  Draft: "bg-yellow-100 text-yellow-700",
  Published: "bg-green-100 text-green-700",
  Archived: "bg-slate-200 text-slate-700",
};

const ProjectTable = ({ projects }) => {
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(
      ROUTES.PROJECT_EDIT.replace(":id", id)
    );
  };

  const handleView = (id) => {
    navigate(
      ROUTES.PROJECT_VIEW.replace(":id", id)
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-6 py-4 text-left">
              Project
            </th>
            <th className="px-6 py-4 text-left">
              Type
            </th>
            <th className="px-6 py-4 text-left">
              Status
            </th>
            <th className="px-6 py-4 text-left">
              Featured
            </th>
            <th className="px-6 py-4 text-left">
              Updated
            </th>
            <th className="px-6 py-4 text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <tr
              key={project._id}
              className="border-t transition hover:bg-slate-50"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-lg border bg-slate-100">
                    {project.media?.coverImage?.url ? (
                      <img
                        src={getImageUrl(project.media.coverImage.url)}
                        alt={
                          project.media.coverImage.alt ||
                          project.general.projectName
                        }
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div>
                    <h3
                      className={`font-semibold ${
                        project.projectCategory ===
                        "portfolio"
                          ? "text-blue-700"
                          : ""
                      }`}
                    >
                      {project.general.projectName}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {project.general.builderName}
                    </p>

                    <p className="text-xs text-slate-400">
                      {project.projectCategory ===
                      "portfolio"
                        ? "Portfolio Tour"
                        : project.general.projectType}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 align-middle">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    project.projectCategory ===
                    "portfolio"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {project.projectCategory ===
                  "portfolio"
                    ? "Portfolio Tour"
                    : "Individual Project"}
                </span>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyles[
                      project.status.status
                    ]
                  }`}
                >
                  {project.status.status}
                </span>
              </td>

              <td className="px-6 py-4">
                {project.status.featured ? (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Star
                      className="fill-yellow-500"
                      size={16}
                    />
                    Yes
                  </div>
                ) : (
                  "-"
                )}
              </td>

              <td className="px-6 py-4 text-sm text-slate-500">
                {new Date(
                  project.updatedAt
                ).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  <Button
                    size="icon-sm"
                    variant="outline"
                    title="Edit Project"
                    onClick={() =>
                      handleEdit(project._id)
                    }
                  >
                    <Edit size={16} />
                  </Button>

                  <Button
                    size="icon-sm"
                    variant="outline"
                    title="View Project"
                    onClick={() =>
                      handleView(project._id)
                    }
                  >
                    <BadgeCheck size={16} />
                  </Button>

                  <DeleteProjectDialog
                    project={project}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;