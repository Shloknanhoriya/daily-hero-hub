import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserProgress {
  id: string;
  user_id: string;
  level: number;
  current_xp: number;
  total_xp: number;
  streak: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserProgress = () => {
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ["user-progress"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      // If no progress exists, create initial record
      if (!data) {
        const { data: newProgress, error: insertError } = await supabase
          .from("user_progress")
          .insert({ user_id: user.id })
          .select()
          .single();
        
        if (insertError) throw insertError;
        return newProgress as UserProgress;
      }
      
      return data as UserProgress;
    },
  });

  const updateStreak = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.rpc("update_streak", {
        p_user_id: user.id,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-progress"] });
    },
  });

  const awardXP = useMutation({
    mutationFn: async ({
      xpAmount,
      activityType,
      description,
    }: {
      xpAmount: number;
      activityType: string;
      description?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.rpc("award_xp", {
        p_user_id: user.id,
        p_xp_amount: xpAmount,
        p_activity_type: activityType,
        p_description: description,
      });

      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      if (data.leveled_up) {
        toast.success(`LEVEL UP! You are now level ${data.new_level}!`, {
          description: "Your training has paid off!",
          duration: 5000,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["user-progress"] });
    },
  });

  return {
    progress,
    isLoading,
    updateStreak,
    awardXP,
    nextLevelXP: progress ? progress.level * 1000 : 1000,
  };
};
