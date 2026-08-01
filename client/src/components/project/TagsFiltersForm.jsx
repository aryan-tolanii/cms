import { Controller, useFormContext } from "react-hook-form";

import AutocompleteField from "@/components/common/AutocompleteField";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

const TagsFiltersForm = () => {
    const { control } = useFormContext();

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Tags & Filters
                </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">

                {/* City */}
                <div className="space-y-2">
                    <Label>City</Label>

                    <Controller
                        name="filters.city"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteField
                                type="city"
                                value={field.value || ""}
                                onChange={field.onChange}
                                placeholder="Select or create city"
                            />
                        )}
                    />
                </div>

                {/* Area */}
                <div className="space-y-2">
                    <Label>Area</Label>

                    <Controller
                        name="filters.area"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteField
                                type="area"
                                value={field.value || ""}
                                onChange={field.onChange}
                                placeholder="Select or create area"
                            />
                        )}
                    />
                </div>

                {/* Property Type */}
                <div className="space-y-2">
                    <Label>Property Type</Label>

                    <Controller
                        name="filters.propertyType"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteField
                                type="propertyType"
                                value={field.value || ""}
                                onChange={field.onChange}
                                placeholder="Select or create property type"
                            />
                        )}
                    />
                </div>

                {/* Amenities */}
                <div className="space-y-2">
                    <Label>Amenities</Label>

                    <Controller
                        name="filters.amenities"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteField
                                type="amenity"
                                multiple
                                value={field.value || []}
                                onChange={field.onChange}
                                placeholder="Select amenities"
                            />
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Tags</Label>

                    <Controller
                        name="filters.tags"
                        control={control}
                        render={({ field }) => (
                            <AutocompleteField
                                type="tag"
                                multiple
                                value={field.value || []}
                                onChange={field.onChange}
                                placeholder="Select tags"
                            />
                        )}
                    />
                </div>

            </CardContent>
        </Card>
    );
};

export default TagsFiltersForm;