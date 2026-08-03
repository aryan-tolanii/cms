import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getImageUrl } from "@/lib/utils";

const GalleryLightbox = ({ images, open, onOpenChange }) => {
  if (!images || images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle>Project Gallery ({images.length} Photos)</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img, idx) => (
              <div key={idx} className="flex flex-col gap-2 group">
                <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
                  <a href={getImageUrl(img.url)} target="_blank" rel="noreferrer">
                    <img
                      src={getImageUrl(img.url)}
                      alt={img.alt || `Gallery image ${idx + 1}`}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </a>
                </div>
                {img.caption && (
                  <p className="text-sm text-center text-muted-foreground font-medium">{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryLightbox;
