import { Activity, Zap, Target } from "lucide-react";

interface SystemHeaderProps {
  userName: string;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  streak: number;
}

export const SystemHeader = ({ userName, level, currentXP, nextLevelXP, streak }: SystemHeaderProps) => {
  const xpPercentage = (currentXP / nextLevelXP) * 100;

  return (
    <div className="relative overflow-hidden rounded-xl border border-system-border bg-gradient-to-br from-system-card to-background p-6 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
      
      <div className="relative space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              SYSTEM INTERFACE
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Player: <span className="text-primary font-semibold">{userName}</span>
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">LEVEL</div>
              <div className="text-2xl font-bold text-primary animate-glow-pulse">{level}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">STREAK</div>
              <div className="text-2xl font-bold text-secondary flex items-center gap-1">
                <Zap className="h-5 w-5" />
                {streak}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Target className="h-3 w-3" />
              EXPERIENCE
            </span>
            <span className="text-foreground font-mono">
              {currentXP} / {nextLevelXP} XP
            </span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-muted border border-system-border">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 shadow-[0_0_10px_rgba(45,212,191,0.5)]"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
