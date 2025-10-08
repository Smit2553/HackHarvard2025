import { Circle, Diamond, CheckCircle2 } from "lucide-react";

interface DifficultyBadgeProps {
  difficulty: "easy" | "medium" | "hard";
  variant?: "icon" | "badge" | "text";
}

export function DifficultyBadge({
  difficulty,
  variant = "badge",
}: DifficultyBadgeProps) {
  const config = {
    easy: {
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-500",
      bgColor: "bg-green-100 dark:bg-green-950/30",
      label: "Easy",
    },
    medium: {
      icon: Circle,
      color: "text-orange-600 dark:text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-950/30",
      label: "Medium",
    },
    hard: {
      icon: Diamond,
      color: "text-red-600 dark:text-red-500",
      bgColor: "bg-red-100 dark:bg-red-950/30",
      label: "Hard",
    },
  };

  const { icon: Icon, color, bgColor, label } = config[difficulty];

  if (variant === "icon") {
    return <Icon className={`w-4 h-4 ${color}`} />;
  }

  if (variant === "text") {
    return <span className={`text-sm font-medium ${color}`}>{label}</span>;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${color} ${bgColor}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
