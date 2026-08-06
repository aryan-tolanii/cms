import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { getFilterSuggestions } from "@/services/filterService";
import { cn } from "@/lib/utils";

export default function AutocompleteField({
  type,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  multiple = false,
}) {
  const [search, setSearch] = useState(multiple ? "" : (value || ""));
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef();

  // Sync external value changes for single mode
  useEffect(() => {
    if (!multiple && value !== search) {
      setSearch(value || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, multiple]);

  // Fetch suggestions
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!search.trim()) {
      setOptions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await getFilterSuggestions(type, search);
        setOptions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [search, type]);

  const selectedValues = multiple ? (value || []) : [];

  const suggestion = useMemo(() => {
    if (!search.trim()) return "";
    const lowerSearch = search.toLowerCase();
    const match = options.find((opt) => opt.value.toLowerCase().startsWith(lowerSearch));
    return match ? match.value : "";
  }, [search, options]);

  const ghostTextValue = suggestion 
    ? search + suggestion.substring(search.length) 
    : "";

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (!multiple) {
      onChange(val);
    }
  };

  const handleAccept = (val) => {
    if (!val.trim()) return;
    if (multiple) {
      if (!selectedValues.includes(val)) {
        onChange([...selectedValues, val]);
      }
      setSearch("");
    } else {
      setSearch(val);
      onChange(val);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab" || e.key === "ArrowRight") {
      if (ghostTextValue && ghostTextValue.toLowerCase() !== search.toLowerCase()) {
        e.preventDefault();
        handleAccept(ghostTextValue);
      } else if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission
        if (search.trim()) {
          handleAccept(search.trim());
        }
      }
    } else if (e.key === "Backspace" && search === "" && multiple && selectedValues.length > 0) {
      e.preventDefault();
      onChange(selectedValues.slice(0, -1));
    }
  };

  const removePill = (valToRemove) => {
    onChange(selectedValues.filter((v) => v !== valToRemove));
  };

  return (
    <div 
      className={cn(
        "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {multiple && selectedValues.map((val) => (
        <span 
          key={val} 
          className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
        >
          {val}
          <button
            type="button"
            onClick={() => removePill(val)}
            disabled={disabled}
            className="hover:text-destructive focus:outline-none"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      
      <div className="relative flex-1 min-w-[120px]">
        {/* Ghost Text */}
        <input
          type="text"
          readOnly
          tabIndex={-1}
          className="absolute inset-0 w-full bg-transparent p-0 text-sm text-muted-foreground border-none focus:outline-none pointer-events-none"
          value={ghostTextValue}
        />
        {/* Actual Input */}
        <input
          type="text"
          disabled={disabled}
          className="relative z-10 w-full bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground border-none focus:outline-none"
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder={multiple && selectedValues.length > 0 ? "" : placeholder}
        />
      </div>

      {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  );
}
