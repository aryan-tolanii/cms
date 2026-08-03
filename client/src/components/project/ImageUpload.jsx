import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";

const MAX_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const ImageUpload = ({
    label,
    value,
    accept = "image/*",
    onChange,
}) => {
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!value) {
            setPreview(null);
            return;
        }

        // Existing image from database
        if (
            typeof value === "object" &&
            value.url &&
            !(value instanceof File)
        ) {
            setPreview(getImageUrl(value.url));
            return;
        }

        // Newly selected image
        if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value);

            setPreview(objectUrl);

            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        }
    }, [value]);

    const validateAndUpload = (file) => {
        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            );
            return;
        }

        if (file.size > MAX_SIZE) {
            toast.error(
                "Image size must be less than 10 MB."
            );
            return;
        }

        onChange(file);
    };

    const handleChange = (event) => {
        const file = event.target.files?.[0];

        validateAndUpload(file);

        event.target.value = "";
    };

    const handleRemove = () => {
        onChange(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setIsDragging(false);

        const file = event.dataTransfer.files?.[0];

        validateAndUpload(file);
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium">
                {label}
            </label>

            <input
                ref={fileInputRef}
                hidden
                type="file"
                accept={accept}
                onChange={handleChange}
            />

            {!(preview && value) ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
            flex
            h-64
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-xl
            border-2
            border-dashed
            transition-all
            duration-200

            ${isDragging
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-300 bg-slate-50 hover:border-black hover:bg-slate-100"
                        }
          `}
                >
                    <ImagePlus
                        size={52}
                        className="mb-4 text-slate-400"
                    />

                    <p className="font-semibold">
                        {isDragging
                            ? "Drop image here"
                            : "Click or Drag an image here"}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                        JPG, JPEG, PNG, WEBP
                    </p>

                    <p className="text-xs text-slate-400">
                        Maximum size: 10 MB
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="group relative overflow-hidden rounded-xl border">
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-72 w-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        <div
                            className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                gap-3
                bg-black/50
                opacity-0
                transition-opacity
                duration-300
                group-hover:opacity-100
              "
                        >
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Change Image
                            </Button>

                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleRemove}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-4">
                        <div>
                            <p className="max-w-xs truncate font-medium">
                                {value instanceof File
                                    ? value.name
                                    : "Current Thumbnail"}
                            </p>

                            <p className="text-sm text-slate-500">
                                {value instanceof File
                                    ? `${(value.size / 1024 / 1024).toFixed(2)} MB`
                                    : "Already uploaded"}
                            </p>
                        </div>

                        <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Ready
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;