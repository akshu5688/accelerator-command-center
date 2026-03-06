import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function CheckEmail() {
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? "";
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<"success" | "error" | null>(null);

  const handleResend = async () => {
    if (!email || !isSupabaseConfigured() || !supabase) return;
    setIsResending(true);
    setResendMessage(null);
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) throw error;
      setResendMessage("success");
    } catch {
      setResendMessage("error");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center rounded-lg border bg-card p-8 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent mb-4">
            <Mail className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a confirmation link to <strong>{email || "your email"}</strong>. Please verify, then come back and login.
          </p>
          {isSupabaseConfigured() && email && (
            <div className="mt-6 w-full space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResend}
                disabled={isResending}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Resend confirmation email"
                )}
              </Button>
              {resendMessage === "success" && (
                <p className="text-xs text-success">Email sent! Check your inbox.</p>
              )}
              {resendMessage === "error" && (
                <p className="text-xs text-destructive">Failed to resend. Try again later.</p>
              )}
            </div>
          )}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/" className="text-accent hover:underline">← Back to home</Link>
          {" · "}
          <Link to="/login" className="text-accent hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
