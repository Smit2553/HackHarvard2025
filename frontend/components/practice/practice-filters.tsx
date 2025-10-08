interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface PracticeFiltersProps {
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export function PracticeFilters({
  options,
  selected,
  onSelect,
}: PracticeFiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`cursor-pointer px-3 py-1.5 text-sm rounded-md transition-colors ${
            selected === option.value
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {option.label}
          {option.count !== undefined && ` (${option.count})`}
        </button>
      ))}
    </div>
  );
}
