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
    <div className="relative overflow-hidden rounded-xl border-2 border-primary/30 bg-gradient-to-br from-system-card via-background to-system-card p-8 shadow-[0_0_50px_rgba(45,212,191,0.2)]">
      {/* Animated scan line effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="h-[200%] w-full bg-[var(--scan-line)] animate-scan-line" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(45, 212, 191, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(45, 212, 191, 0.5) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />
      
      <div className="relative space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full animate-glow-pulse" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-shimmer" style={{
                backgroundSize: '200% auto'
              }}>
                SYSTEM INTERFACE
              </h1>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 ml-4 font-mono">
              <Activity className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-xs uppercase tracking-wider">Hunter:</span>
              <span className="text-foreground font-semibold text-lg">{userName}</span>
            </p>
          </div>
          
          <div className="flex gap-6">
            <div className="text-right group">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Level</div>
              <div className="text-4xl font-bold text-primary animate-float relative">
                {level}
                <div className="absolute inset-0 animate-glow-pulse blur-xl opacity-50" />
              </div>
            </div>
            <div className="w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
            <div className="text-right group">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Streak</div>
              <div className="text-4xl font-bold text-secondary flex items-center gap-2 animate-float">
                <Zap className="h-6 w-6 animate-pulse" />
                {streak}
                <div className="absolute inset-0 animate-glow-pulse blur-xl opacity-50" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground flex items-center gap-2 font-mono uppercase tracking-wider">
              <Target className="h-4 w-4 text-primary" />
              Experience Points
            </span>
            <span className="text-foreground font-mono text-lg font-bold">
              <span className="text-primary">{currentXP}</span>
              <span className="text-muted-foreground mx-2">/</span>
              <span className="text-secondary">{nextLevelXP}</span>
              <span className="text-muted-foreground ml-1 text-xs">XP</span>
            </span>
          </div>
          <div className="relative h-4 overflow-hidden rounded-full bg-muted/50 border-2 border-primary/20 shadow-inner">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm" />
            
            {/* Progress bar with multiple layers */}
            <div className="relative h-full">
              <div
                className="h-full bg-gradient-to-r from-primary via-primary to-secondary transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${xpPercentage}%` }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{
                  backgroundSize: '200% 100%'
                }} />
                
                {/* Glow effect */}
                <div className="absolute inset-0 shadow-[0_0_20px_rgba(45,212,191,0.8)]" />
              </div>
            </div>
            
            {/* Percentage text overlay */}
            {xpPercentage > 10 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white drop-shadow-[0_0_3px_rgba(0,0,0,0.8)] font-mono">
                  {Math.round(xpPercentage)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
