import { useEffect } from "react";
import { useBlocker } from "react-router-dom";
import { PROJECT_SECTIONS } from "@/constants/projectSections";
import { FormProvider } from "react-hook-form";

import GeneralInformationForm from "./GeneralInformationForm";
import MediaInformationForm from "./CoverImageForm";
import SEOInformationForm from "./SEOInformationForm";
import StatusInformationForm from "./StatusInformationForm";
import TagsFiltersForm from "./TagsFiltersForm";
import SpecificationsForm from "./SpecificationsForm";
import StickyActionBar from "./StickyActionBar";

const PortfolioTourForm = ({
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
                        Create Portfolio Tour
                    </h1>

                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Create a Portfolio Tour that can contain multiple Individual Projects.
                    </p>
                </div>

                {/* General Information */}
                <div id={PROJECT_SECTIONS.general.id}>
                    <GeneralInformationForm projectType="portfolio" />
                </div>

                <TagsFiltersForm />

                <SpecificationsForm />

                {/* Cover Image */}
                <div id={PROJECT_SECTIONS.media.id}>
                    <MediaInformationForm
                        title="Cover Image"
                        thumbnailLabel="Portfolio Tour Thumbnail"
                        showGallery={false}
                        showBrochures={false}
                        showLegalDocuments={false}
                    />
                </div>

                {/* SEO */}
                <div id={PROJECT_SECTIONS.seo.id}>
                    <SEOInformationForm />
                </div>

                {/* Status */}
                <div id={PROJECT_SECTIONS.status.id}>
                    <StatusInformationForm />
                </div>

                <StickyActionBar 
                    isSubmitting={isSubmitting} 
                    submitButtonText="Create Portfolio Tour" 
                />
            </form>
        </FormProvider>
    );
};

export default PortfolioTourForm;