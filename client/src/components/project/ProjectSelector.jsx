import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const ProjectSelector = ({ onContinue }) => {
  const [selectedType, setSelectedType] = useState("");

  const handleContinue = () => {
    if (!selectedType) return;

    onContinue(selectedType);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Create New</CardTitle>

        <CardDescription>
          Choose what you would like to create.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">

        <label
          className={`block cursor-pointer rounded-xl border p-5 transition ${
            selectedType === "portfolio"
              ? "border-black bg-slate-50"
              : "border-slate-200 hover:border-slate-400"
          }`}
        >
          <div className="flex items-start gap-4">

            <input
              type="radio"
              name="projectType"
              value="portfolio"
              checked={selectedType === "portfolio"}
              onChange={(e) =>
                setSelectedType(e.target.value)
              }
              className="mt-1"
            />

            <div>
              <h3 className="font-semibold text-lg">
                Portfolio Tour
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create a Portfolio Tour that can contain multiple
                Individual Projects.
              </p>
            </div>

          </div>
        </label>

        <label
          className={`block cursor-pointer rounded-xl border p-5 transition ${
            selectedType === "individual"
              ? "border-black bg-slate-50"
              : "border-slate-200 hover:border-slate-400"
          }`}
        >
          <div className="flex items-start gap-4">

            <input
              type="radio"
              name="projectType"
              value="individual"
              checked={selectedType === "individual"}
              onChange={(e) =>
                setSelectedType(e.target.value)
              }
              className="mt-1"
            />

            <div>
              <h3 className="font-semibold text-lg">
                Individual Project
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create a standalone project or add it to an existing
                Portfolio Tour later.
              </p>
            </div>

          </div>
        </label>

        <div className="flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!selectedType}
          >
            Continue
          </Button>
        </div>

      </CardContent>
    </Card>
  );
};

export default ProjectSelector;