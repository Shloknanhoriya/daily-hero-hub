import { TrendingUp, Target, CheckCircle2, AlertCircle } from "lucide-react";

interface StatsPanelProps {
  totalQuests: number;
  completedQuests: number;
  activePenalties: number;
  completionRate: number;
}

export const StatsPanel = ({
  totalQuests,
  completedQuests,
  activePenalties,
  completionRate,
}: StatsPanelProps) => {
  const stats = [
    {
      icon: Target,
      label: "Total Quests",
      value: totalQuests,
      color: "text-primary",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: completedQuests,
      color: "text-green-400",
    },
    {
      icon: AlertCircle,
      label: "Active Penalties",
      value: activePenalties,
      color: "text-destructive",
    },
    {
      icon: TrendingUp,
      label: "Success Rate",
      value: `${completionRate}%`,
      color: "text-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg border border-system-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative space-y-2">
            <div className="flex items-center justify-between">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
