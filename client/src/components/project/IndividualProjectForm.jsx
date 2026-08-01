import { useEffect } from "react";
import { useBlocker } from "react-router-dom";
import { PROJECT_SECTIONS } from "@/constants/projectSections";
import { FormProvider } from "react-hook-form";

import GeneralInformationForm from "./GeneralInformationForm";
import ContactInformationForm from "./ContactInformationForm";
import LocationInformationForm from "./LocationInformationForm";
import MediaInformationForm from "./CoverImageForm";
import VideoInformationForm from "./VideoInformationForm";
import StatusInformationForm from "./StatusInformationForm";
import SEOInformationForm from "./SEOInformationForm";
import TagsFiltersForm from "./TagsFiltersForm";
import SpecificationsForm from "./SpecificationsForm";
import StickyActionBar from "./StickyActionBar";

const IndividualProjectForm = ({
  methods,
  onSubmit,
  isSubmitting = false,
}) => {
  const isDirty = methods.formState.isDirty;

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirm = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (confirm) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-8 pb-24"
      >
        <div>
          <h1 className="text-3xl font-bold dark:text-slate-50">
            Create Individual Project
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Fill in the Individual Project details below.
          </p>
        </div>

        <div id={PROJECT_SECTIONS.general.id}>
          <GeneralInformationForm projectType="individual" />
        </div>

        <TagsFiltersForm />

        <SpecificationsForm />

        <div id={PROJECT_SECTIONS.contact.id}>
          <ContactInformationForm />
        </div>

        <div id={PROJECT_SECTIONS.location.id}>
          <LocationInformationForm />
        </div>

        <div id={PROJECT_SECTIONS.media.id}>
          <MediaInformationForm
            title="Media Information"
            thumbnailLabel="Project Thumbnail"
          />
        </div>

        <div id={PROJECT_SECTIONS.videos.id}>
          <VideoInformationForm />
        </div>

        <div id={PROJECT_SECTIONS.status.id}>
          <StatusInformationForm />
        </div>

        <div id={PROJECT_SECTIONS.seo.id}>
          <SEOInformationForm />
        </div>

        <StickyActionBar 
          isSubmitting={isSubmitting} 
          submitButtonText="Create Project" 
        />
      </form>
    </FormProvider>
  );
};

export default IndividualProjectForm;