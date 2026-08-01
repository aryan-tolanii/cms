import { Loader2 } from "lucide-react";

const StickyActionBar = ({ isSubmitting, submitButtonText, onCancel }) => {
  return (
    <div className="fixed bottom-0 left-[260px] right-0 z-50 flex items-center justify-end gap-4 border-t bg-white/80 dark:bg-slate-950/80 p-4 backdrop-blur-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_6px_-1px_rgba(255,255,255,0.05)]">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg px-6 py-2.5 font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-2 rounded-lg bg-black dark:bg-white px-8 py-2.5 font-medium text-white dark:text-black transition-colors hover:bg-slate-800 dark:hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? "Saving..." : submitButtonText}
      </button>
    </div>
  );
};

export default StickyActionBar;
