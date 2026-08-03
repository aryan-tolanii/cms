import { useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";
import { FormProvider, useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import MediaInformationForm from "./CoverImageForm";
import StickyActionBar from "./StickyActionBar";

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const PortfolioTourFields = () => {
    const { register, watch, setValue } = useFormContext();
    const slugEdited = useRef(false);
    const projectName = watch("general.projectName");

    useEffect(() => {
        if (!projectName) return;
        if (!slugEdited.current) {
            setValue("general.slug", slugify(projectName), { shouldDirty: true });
        }
    }, [projectName, setValue]);

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Basic Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="projectName">Tour Title</Label>
                        <Input
                            id="projectName"
                            placeholder="e.g. ABC Group Virtual Tour"
                            {...register("general.projectName")}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                            id="tagline"
                            placeholder="Driven by Purpose. Powered by People..."
                            {...register("general.tagline")}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            rows={4}
                            placeholder="Trusted by 1500+ families..."
                            {...register("general.description")}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contact & Location Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                placeholder="413,414,415, Gruham Plaza..."
                                {...register("location.address")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="googleMaps">Google Maps Link</Label>
                            <Input
                                id="googleMaps"
                                placeholder="https://maps.google.com/..."
                                {...register("location.googleMaps")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                placeholder="+91 99799 78551"
                                {...register("contact.phone")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Website Link</Label>
                            <Input
                                id="website"
                                placeholder="https://..."
                                {...register("contact.website")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram Link</Label>
                            <Input
                                id="instagram"
                                placeholder="https://instagram.com/..."
                                {...register("contact.instagram")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="facebook">Facebook Link</Label>
                            <Input
                                id="facebook"
                                placeholder="https://facebook.com/..."
                                {...register("contact.facebook")}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Logo */}
            <MediaInformationForm
                title="Logo"
                thumbnailLabel="Upload Logo"
                showGallery={false}
                showBrochures={false}
                showLegalDocuments={false}
                showFloorPlans={false}
                showThumbnailImage={true}
            />
        </div>
    );
};

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
                onSubmit={methods.handleSubmit((data) => {
                    // Inject default values for removed fields to satisfy backend schema
                    if (!data.general.builderName) {
                        data.general.builderName = data.general.projectName;
                    }
                    if (!data.general.projectType) {
                        data.general.projectType = "Commercial"; 
                    }
                    if (!data.status.status) {
                        data.status.status = "Published";
                        data.status.published = true;
                    }
                    onSubmit(data);
                })}
                className="space-y-8 pb-24"
            >
                <div>
                    <h1 className="text-3xl font-bold dark:text-slate-50">
                        Portfolio Tour Configuration
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Configure the modal popup for the portfolio tour.
                    </p>
                </div>

                <PortfolioTourFields />

                <StickyActionBar 
                    isSubmitting={isSubmitting} 
                    submitButtonText="Save Configuration" 
                />
            </form>
        </FormProvider>
    );
};

export default PortfolioTourForm;