import { useState, useEffect } from "react";
import { SystemHeader } from "@/components/SystemHeader";
import { QuestCard, Quest } from "@/components/QuestCard";
import { PenaltyCard, Penalty } from "@/components/PenaltyCard";
import { StatsPanel } from "@/components/StatsPanel";
import { ChatBot } from "@/components/ChatBot";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageSquare, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useUserProgress } from "@/hooks/useUserProgress";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  const { progress, isLoading, updateStreak, awardXP, nextLevelXP } = useUserProgress();
  const navigate = useNavigate();

  // Update streak on mount
  useEffect(() => {
    updateStreak.mutate();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const [quests, setQuests] = useState<Quest[]>([
    {
      id: "3",
      title: "Morning Exercise",
      description: "Complete 30 minutes of cardio and strength training",
      xpReward: 50,
      deadline: "2025-01-13 08:00",
      completed: true,
      difficulty: "easy",
    },
    {
      id: "5",
      title: "10 Coding Problems",
      description: "Solve 10 mixed-difficulty coding problems to sharpen skills",
      xpReward: 75,
      deadline: "2025-01-13 23:59",
      completed: false,
      difficulty: "easy",
    },
    {
      id: "4",
      title: "Maintain GitHub, LinkedIn",
      description: "Update profiles with recent projects and share a progress post",
      xpReward: 100,
      deadline: "2025-01-14 22:00",
      completed: false,
      difficulty: "medium",
    },
    {
      id: "1",
      title: "Start Machine Learning Project",
      description: "Finish the neural network implementation for Image Classification",
      xpReward: 150,
      deadline: "2025-01-15 18:00",
      completed: false,
      difficulty: "moderate",
    },
    {
      id: "2",
      title: "Study Data Structures",
      description: "Review Binary Trees and Graph Algorithms for 2 hours",
      xpReward: 80,
      deadline: "2025-01-13 20:00",
      completed: false,
      difficulty: "medium",
    },
  ]);

  const [penalties] = useState<Penalty[]>([
    {
      id: "p1",
      title: "Missed Yesterday's Workout",
      description: "Complete double cardio session today or face XP deduction",
      severity: "medium",
      dueDate: "2025-01-13 23:59",
    },
    {
      id: "p2",
      title: "Late Assignment Submission",
      description: "Submit the pending Database project within 24 hours",
      severity: "high",
      dueDate: "2025-01-14 18:00",
    },
  ]);

  const handleCompleteQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((quest) => {
        if (quest.id === questId && !quest.completed) {
          // Award XP to the user
          awardXP.mutate({
            xpAmount: quest.xpReward,
            activityType: "quest_completed",
            description: quest.title,
          });
          
          toast.success(`Quest Completed! +${quest.xpReward} XP`, {
            description: quest.title,
            duration: 3000,
          });
          return { ...quest, completed: true };
        }
        return quest;
      })
    );
  };

  const totalQuests = quests.length;
  const completedQuests = quests.filter((q) => q.completed).length;
  const activePenalties = penalties.length;
  const completionRate = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-2xl font-mono animate-glow-pulse">Loading System...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative container mx-auto px-4 py-8 space-y-8 animate-slide-up">
        <SystemHeader
          userName="Hunter"
          level={progress?.level || 1}
          currentXP={progress?.current_xp || 0}
          nextLevelXP={nextLevelXP}
          streak={progress?.streak || 0}
        />

        <StatsPanel
          totalQuests={totalQuests}
          completedQuests={completedQuests}
          activePenalties={activePenalties}
          completionRate={completionRate}
        />

        <Tabs defaultValue="quests" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-card border border-system-border">
            <TabsTrigger
              value="quests"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Daily Quests
            </TabsTrigger>
            <TabsTrigger
              value="penalties"
              className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground"
            >
              Penalty Tasks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quests" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <div className="h-1 w-8 bg-gradient-to-r from-primary to-secondary rounded" />
                ACTIVE QUESTS
              </h2>
              <div className="text-sm text-muted-foreground font-mono">
                {completedQuests}/{totalQuests} Completed
              </div>
            </div>
            
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {quests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onComplete={handleCompleteQuest}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="penalties" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <div className="h-1 w-8 bg-gradient-to-r from-destructive to-orange-500 rounded" />
                PENALTY ZONE
              </h2>
              <div className="text-sm text-destructive font-mono">
                {activePenalties} Active
              </div>
            </div>
            
            {penalties.length > 0 ? (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {penalties.map((penalty) => (
                    <PenaltyCard key={penalty.id} penalty={penalty} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
                <div className="text-6xl">✨</div>
                <div className="text-xl font-semibold text-foreground">
                  No Active Penalties
                </div>
                <div className="text-muted-foreground">
                  Keep up the excellent work, Player!
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Floating Buttons */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-4">
          <Button
            onClick={() => setShowChatBot(true)}
            className="h-14 w-14 rounded-full shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:shadow-[0_0_50px_rgba(45,212,191,0.8)] transition-all animate-float"
            size="icon"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="h-14 w-14 rounded-full border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all"
            size="icon"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* ChatBot Modal */}
        {showChatBot && <ChatBot onClose={() => setShowChatBot(false)} />}
      </div>
    </div>
  );
};

export default Index;
