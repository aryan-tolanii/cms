import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { getFilterSuggestions } from "@/services/filterService";

export default function AutocompleteField({
  type,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  multiple = false,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef();

  useEffect(() => {
    clearTimeout(debounceRef.current);

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

  const selectedValues = multiple ? value || [] : [];

  const trimmedSearch = search.trim();

  const hasExactMatch = useMemo(() => {
    return options.some(
      (item) => item.value.toLowerCase() === trimmedSearch.toLowerCase(),
    );
  }, [options, trimmedSearch]);

  const showCreateOption = trimmedSearch.length > 0 && !hasExactMatch;

  const handleSelect = (selected) => {
    if (!multiple) {
      onChange(selected);
      setOpen(false);
      setSearch("");
      return;
    }

    if (selectedValues.includes(selected)) {
      onChange(selectedValues.filter((v) => v !== selected));
    } else {
      onChange([...selectedValues, selected]);
    }

    setSearch("");
  };

  const displayValue = multiple
    ? selectedValues.length > 0
      ? selectedValues.join(", ")
      : placeholder
    : value || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            disabled={disabled}
            className="w-full justify-between"
          />
        }
      >
        <span className="truncate">{displayValue}</span>

        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
      </PopoverTrigger>

      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${type}...`}
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                {options.length > 0 && (
                  <CommandGroup heading="Suggestions">
                    {options.map((item) => {
                      const selected = multiple
                        ? selectedValues.includes(item.value)
                        : value === item.value;

                      return (
                        <CommandItem
                          key={item.value}
                          value={item.value}
                          onSelect={() => handleSelect(item.value)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selected ? "opacity-100" : "opacity-0",
                            )}
                          />

                          <div className="flex w-full justify-between">
                            <span>{item.value}</span>

                            <span className="text-muted-foreground text-xs">
                              {item.usageCount}
                            </span>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )}

                {showCreateOption && (
                  <CommandGroup heading="Actions">
                    <CommandItem
                      value={`create-${trimmedSearch}`}
                      onSelect={() => handleSelect(trimmedSearch)}
                    >
                      <span className="font-medium">
                        + Create "{trimmedSearch}"
                      </span>
                    </CommandItem>
                  </CommandGroup>
                )}

                {!showCreateOption && options.length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No results found.
                  </div>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
