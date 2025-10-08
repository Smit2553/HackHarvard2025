import { Search } from "lucide-react";

interface PracticeSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PracticeSearch({
  value,
  onChange,
  placeholder,
}: PracticeSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 text-sm border border-border/50 rounded-lg bg-transparent focus:outline-none focus:border-border transition-colors"
      />
    </div>
  );
}
