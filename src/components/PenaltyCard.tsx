import { AlertTriangle, Skull } from "lucide-react";

export interface Penalty {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  dueDate: string;
}

interface PenaltyCardProps {
  penalty: Penalty;
}

export const PenaltyCard = ({ penalty }: PenaltyCardProps) => {
  const severityConfig = {
    low: {
      color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
      icon: AlertTriangle,
    },
    medium: {
      color: "text-orange-400 border-orange-400/30 bg-orange-400/5",
      icon: AlertTriangle,
    },
    high: {
      color: "text-destructive border-destructive/30 bg-destructive/5",
      icon: Skull,
    },
  };

  const config = severityConfig[penalty.severity];
  const Icon = config.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border p-4 transition-all hover:scale-[1.02] ${config.color}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 animate-glow-pulse" />
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold">{penalty.title}</h3>
          <p className="text-sm opacity-90">{penalty.description}</p>
          <div className="text-xs font-mono opacity-75">
            Due: {penalty.dueDate}
          </div>
        </div>
        <div className="px-2 py-1 rounded border text-xs font-mono uppercase opacity-75">
          {penalty.severity}
        </div>
      </div>
    </div>
  );
};
