import { CheckCircle2, Circle, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  deadline: string;
  completed: boolean;
  difficulty: "easy" | "moderate" | "medium" | "hard";
}

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
}

export const QuestCard = ({ quest, onComplete }: QuestCardProps) => {
  const difficultyColors = {
    easy: "text-green-400 border-green-400/30",
    moderate: "text-blue-400 border-blue-400/30",
    medium: "text-yellow-400 border-yellow-400/30",
    hard: "text-red-400 border-red-400/30",
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
        quest.completed
          ? "border-primary/50 bg-primary/5"
          : "border-system-border bg-card hover:border-primary/30"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {quest.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary animate-glow-pulse" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <h3
                className={`font-semibold text-lg ${
                  quest.completed ? "text-primary line-through" : "text-foreground"
                }`}
              >
                {quest.title}
              </h3>
            </div>
            
            <p className="text-sm text-muted-foreground ml-7">{quest.description}</p>
          </div>

          <div className={`px-3 py-1 rounded-full border text-xs font-mono uppercase ${difficultyColors[quest.difficulty]}`}>
            {quest.difficulty}
          </div>
        </div>

        <div className="flex items-center justify-between ml-7">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{quest.deadline}</span>
            </div>
            <div className="flex items-center gap-1 text-secondary">
              <Award className="h-4 w-4" />
              <span className="font-mono font-semibold">+{quest.xpReward} XP</span>
            </div>
          </div>

          {!quest.completed && (
            <Button
              onClick={() => onComplete(quest.id)}
              variant="outline"
              size="sm"
              className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
