import React, { Component, ErrorInfo, ReactNode } from "react";
import { Zap } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="w-full max-w-md text-center space-y-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 mx-auto">
              <Zap className="h-5 w-5 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground text-sm">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
            <button
              onClick={() => window.location.href = "/"}
              className="text-accent hover:underline font-medium"
            >
              Go to home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
