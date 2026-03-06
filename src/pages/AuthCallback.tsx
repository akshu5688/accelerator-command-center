import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Zap, Loader2, CheckCircle2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        setStatus("error");
        setErrorMsg("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
        return;
      }
      try {
        // Process hash/query params from Supabase redirect (email confirmation, OAuth, etc.)
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setStatus("error");
          setErrorMsg(error.message);
          return;
        }
        // Clear hash from URL to avoid re-processing
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
        setStatus("success");
        setTimeout(() => navigate("/login", { state: { emailConfirmed: true }, replace: true }), 2000);
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Confirmation failed");
      }
    };
    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent mx-auto">
          <Zap className="h-5 w-5 text-accent-foreground" />
        </div>
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold text-foreground">Confirming your email...</h1>
            <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto" />
          </>
        )}
        {status === "success" && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Email confirmed!</h1>
            <p className="text-muted-foreground">Please log in with your email and password.</p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-foreground">Confirmation failed</h1>
            <p className="text-muted-foreground">
              {errorMsg ?? "The link may have expired. Please try signing up again."}
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="text-accent hover:underline font-medium"
            >
              Go to sign up
            </button>
          </>
        )}
      </div>
    </div>
  );
}
