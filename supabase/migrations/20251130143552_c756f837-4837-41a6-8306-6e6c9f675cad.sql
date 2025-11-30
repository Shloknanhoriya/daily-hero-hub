-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create user_progress table to track XP, level, and streak
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  level INTEGER NOT NULL DEFAULT 1,
  current_xp INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own progress"
ON public.user_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON public.user_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.user_progress
FOR UPDATE
USING (auth.uid() = user_id);

-- Create activity_log table
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  xp_awarded INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own activity log"
ON public.activity_log
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
ON public.activity_log
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to award XP
CREATE OR REPLACE FUNCTION public.award_xp(
  p_user_id UUID,
  p_xp_amount INTEGER,
  p_activity_type TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS TABLE (
  new_level INTEGER,
  new_xp INTEGER,
  leveled_up BOOLEAN
) AS $$
DECLARE
  v_current_xp INTEGER;
  v_current_level INTEGER;
  v_total_xp INTEGER;
  v_new_level INTEGER;
  v_xp_for_next_level INTEGER;
  v_leveled_up BOOLEAN := FALSE;
BEGIN
  SELECT current_xp, level, total_xp
  INTO v_current_xp, v_current_level, v_total_xp
  FROM public.user_progress
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    INSERT INTO public.user_progress (user_id, current_xp, level, total_xp)
    VALUES (p_user_id, p_xp_amount, 1, p_xp_amount);
    v_current_xp := p_xp_amount;
    v_current_level := 1;
    v_total_xp := p_xp_amount;
  ELSE
    v_current_xp := v_current_xp + p_xp_amount;
    v_total_xp := v_total_xp + p_xp_amount;
  END IF;
  
  v_new_level := v_current_level;
  LOOP
    v_xp_for_next_level := v_new_level * 1000;
    IF v_current_xp >= v_xp_for_next_level THEN
      v_current_xp := v_current_xp - v_xp_for_next_level;
      v_new_level := v_new_level + 1;
      v_leveled_up := TRUE;
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  UPDATE public.user_progress
  SET 
    current_xp = v_current_xp,
    level = v_new_level,
    total_xp = v_total_xp,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  INSERT INTO public.activity_log (user_id, activity_type, xp_awarded, description)
  VALUES (p_user_id, p_activity_type, p_xp_amount, p_description);
  
  RETURN QUERY SELECT v_new_level, v_current_xp, v_leveled_up;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update streak
CREATE OR REPLACE FUNCTION public.update_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_last_activity DATE;
  v_current_streak INTEGER;
  v_new_streak INTEGER;
BEGIN
  SELECT last_activity_date, streak
  INTO v_last_activity, v_current_streak
  FROM public.user_progress
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    INSERT INTO public.user_progress (user_id, streak, last_activity_date)
    VALUES (p_user_id, 1, CURRENT_DATE);
    RETURN 1;
  END IF;
  
  IF v_last_activity = CURRENT_DATE THEN
    RETURN v_current_streak;
  ELSIF v_last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
    v_new_streak := v_current_streak + 1;
  ELSE
    v_new_streak := 1;
  END IF;
  
  UPDATE public.user_progress
  SET 
    streak = v_new_streak,
    last_activity_date = CURRENT_DATE,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN v_new_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER update_user_progress_updated_at
BEFORE UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();