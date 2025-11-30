import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Zap, Shield } from "lucide-react";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back, Hunter!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Hunter registration complete! Logging you in...");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
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

      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-2xl opacity-20" />
        
        <div className="relative bg-card border-2 border-primary/30 rounded-2xl shadow-[0_0_50px_rgba(45,212,191,0.2)] p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-12 bg-gradient-to-b from-primary to-secondary rounded-full animate-glow-pulse" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-shimmer" style={{
                backgroundSize: '200% auto'
              }}>
                {isLogin ? "HUNTER LOGIN" : "HUNTER REGISTRATION"}
              </h1>
              <div className="w-2 h-12 bg-gradient-to-b from-secondary to-primary rounded-full animate-glow-pulse" />
            </div>
            
            <p className="text-muted-foreground flex items-center justify-center gap-2 font-mono">
              {isLogin ? (
                <>
                  <Shield className="h-4 w-4 text-primary" />
                  Enter the System
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-secondary" />
                  Begin Your Journey
                </>
              )}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hunter@system.com"
                required
                className="bg-background/50 border-primary/30 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-background/50 border-primary/30 focus:border-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : isLogin ? (
                "Enter System"
              ) : (
                "Register Hunter"
              )}
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              {isLogin ? (
                <>
                  New Hunter? <span className="text-primary font-semibold">Register here</span>
                </>
              ) : (
                <>
                  Returning Hunter? <span className="text-primary font-semibold">Login here</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
