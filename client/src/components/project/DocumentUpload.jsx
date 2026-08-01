import { useRef, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const MAX_SIZE = 20 * 1024 * 1024;

const ALLOWED_TYPES = ["application/pdf"];

const DocumentUpload = ({
  label,
  value = [],
  onChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const validateFiles = (files) => {
    const validFiles = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not a PDF.`);
        continue;
      }

      if (file.size > MAX_SIZE) {
        toast.error(`${file.name} exceeds 20 MB.`);
        continue;
      }

      validFiles.push({
        title: file.name.replace(/\.pdf$/i, ""),
        file,
      });
    }

    if (validFiles.length) {
      onChange([...(value || []), ...validFiles]);
    }
  };

  const handleChange = (event) => {
    validateFiles(Array.from(event.target.files || []));

    event.target.value = "";
  };

  const handleRemove = (index) => {
    const updated = [...value];
    updated.splice(index, 1);

    onChange(updated);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    validateFiles(Array.from(event.dataTransfer.files || []));
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">
        {label}
      </label>

      <input
        ref={fileInputRef}
        hidden
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleChange}
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 bg-slate-50 hover:border-black hover:bg-slate-100"
          }`}
      >
        <Upload
          size={50}
          className="mb-4 text-slate-400"
        />

        <p className="font-semibold">
          {isDragging
            ? "Drop PDF files here"
            : "Click or Drag PDF files here"}
        </p>

        <p className="mt-2 text-sm text-slate-500">
          PDF only
        </p>

        <p className="text-xs text-slate-400">
          Maximum size: 20 MB each
        </p>
      </div>

      {value?.length > 0 && (
        <div className="space-y-3">
          {value.map((document, index) => {
            const file =
              document.file || document;

            return (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border bg-slate-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-red-500" />

                  <div>
                    <p className="font-medium">
                      {file.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(
                        2
                      )}{" "}
                      MB
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() =>
                    handleRemove(index)
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;