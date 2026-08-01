import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import projectService from "@/services/project/projectService";

import { Button } from "@/components/ui/button";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DeleteProjectDialog = ({ project }) => {
    const queryClient = useQueryClient();

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);

            const response = await projectService.deleteProject(project._id);

            toast.success(
                response.message || "Project deleted successfully."
            );

            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                error.message ||
                "Failed to delete project."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                title="Delete Project"
            >
                <Trash2 size={16} />
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete Project?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        This will remove{" "}
                        <strong>
                            {project.general.projectName}
                        </strong>{" "}
                        from the active portfolio.

                        <br />
                        <br />

                        This action can be reversed directly from the
                        database because the project is soft deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting
                            ? "Deleting..."
                            : "Delete Project"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteProjectDialog;