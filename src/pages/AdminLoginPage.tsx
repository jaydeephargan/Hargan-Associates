import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FormEvent } from "react";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = error.message || "Unable to sign in.";
        toast({ title: "Login failed", description: msg, variant: "destructive" });

        if (msg.toLowerCase().includes("email not confirmed")) {
          const { error: resendError } = await supabase.auth.resend({
            type: "signup",
            email,
          });
          if (resendError) {
            toast({
              title: "Could not resend email",
              description: resendError.message,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Confirmation email sent",
              description: "Please check your inbox and confirm, then try signing in again.",
            });
          }
        }
        return;
      }

      // Occasionally navigation can happen before storage/state settles; confirm we have a session.
      const session = data.session ?? (await supabase.auth.getSession()).data.session;
      if (!session) {
        toast({
          title: "Login incomplete",
          description: "Signed in, but no session was created. Please refresh and try again.",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Welcome back!" });
      navigate("/admin");
    } catch (err) {
      console.error("Admin login failed:", err);
      toast({
        title: "Login failed",
        description: "Unexpected error while signing in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 p-3 rounded-full bg-primary/10 w-fit">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-xl font-display">
            Admin <span className="text-gold">Login</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to access the admin dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="w-4 h-4 mr-2" />
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
