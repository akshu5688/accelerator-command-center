import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Users,
  TrendingUp,
  FileCheck,
  BarChart3,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Cohort Management",
    description: "Track and manage startup cohorts with health monitoring and milestone tracking.",
  },
  {
    icon: FileCheck,
    title: "Application Pipeline",
    description: "Streamlined application review, form builder, and response management.",
  },
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    description: "Revenue distribution, flagged startups, and upcoming review dashboards.",
  },
  {
    icon: TrendingUp,
    title: "Startup Profiles",
    description: "Detailed profiles for each startup with progress and performance metrics.",
  },
];

const stats = [
  { value: "20+", label: "Active Startups" },
  { value: "2", label: "Cohorts Running" },
  { value: "4", label: "Flagged for Review" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
              <Sparkles className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">EERA Accelerator</span>
          </div>
          <Link to="/accelerator/dashboard">
            <Button variant="outline" size="sm" className="gap-2">
              Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 pt-20 pb-16 md:pt-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--accent)/0.15),transparent)]" />
        <div className="flex max-w-3xl flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
            Accelerator Command Center
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Power your startup
            <span className="block text-accent">accelerator program</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Manage cohorts, track portfolio health, review applications, and drive growth—all from one unified platform.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/accelerator/dashboard">
              <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                Enter Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/accelerator/applications">
              <Button size="lg" variant="outline">
                View Applications
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-0">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <span className="text-3xl font-bold text-accent md:text-4xl">{stat.value}</span>
                <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to run an accelerator
            </h2>
            <p className="mt-4 text-muted-foreground">
              Built for program managers, admins, and mentors to collaborate and scale.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 transition-colors hover:border-accent/50">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30 py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-8 text-center shadow-sm md:p-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Access the platform and start managing your accelerator program today.
            </p>
            <Link to="/accelerator/dashboard" className="mt-8 inline-block">
              <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                Enter Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="font-medium text-foreground">EERA Accelerator</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EERA Accelerator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
