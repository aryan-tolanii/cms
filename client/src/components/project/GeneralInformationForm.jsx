import { useEffect, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import projectService from "@/services/project/projectService";
import AutocompleteField from "@/components/common/AutocompleteField";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const GeneralInformationForm = ({ projectType }) => {
  const { register, watch, setValue, control } = useFormContext();

  const slugEdited = useRef(false);

  const projectName = watch("general.projectName");
  const addToPortfolio = watch("addToPortfolio");

  const { data: portfolioResponse } = useQuery({
    queryKey: ["portfolioTours"],
    queryFn: projectService.getPortfolioTours,
    enabled: projectType === "individual",
  });

  const portfolioTours = portfolioResponse?.data?.items || [];

  useEffect(() => {
    if (!projectName) return;

    if (!slugEdited.current) {
      setValue("general.slug", slugify(projectName), {
        shouldDirty: true,
      });
    }
  }, [projectName, setValue]);

  useEffect(() => {
    if (projectType === "individual" && !addToPortfolio) {
      setValue("parentProject", "");
    }
  }, [addToPortfolio, projectType, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {projectType === "individual" && (
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" {...register("addToPortfolio")} />

              <span className="text-sm font-medium">
                Add to Existing Portfolio Tour
              </span>
            </label>

            {addToPortfolio && (
              <div className="space-y-2">
                <Label htmlFor="parentProject">Portfolio Tour</Label>

                <select
                  id="parentProject"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register("parentProject")}
                  defaultValue=""
                >
                  <option value="">Select Portfolio Tour</option>

                  {portfolioTours.map((tour) => (
                    <option key={tour._id} value={tour._id}>
                      {tour.general.projectName}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-slate-500">
                  Choose the Portfolio Tour this project belongs to.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>

            <Input
              id="projectName"
              placeholder="Skyline Residency"
              {...register("general.projectName")}
            />
          </div>

          <div className="space-y-2">
            <Label>Builder Name</Label>

            <Controller
              control={control}
              name="general.builderName"
              render={({ field }) => (
                <Input {...field} placeholder="Enter builder name" />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectType">Project Type</Label>

            <select
              id="projectType"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("general.projectType")}
              defaultValue=""
            >
              <option value="" disabled>
                Select Project Type
              </option>

              <option value="Residential">Residential</option>

              <option value="Commercial">Commercial</option>

              <option value="Industrial">Industrial</option>

              <option value="Mixed Use">Mixed Use</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>

          <Textarea
            id="description"
            rows={6}
            placeholder="Enter project description..."
            {...register("general.description")}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralInformationForm;
