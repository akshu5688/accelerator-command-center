import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, TrendingUp, Users, Calendar, Lock } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

const cohortSummary = [
  { name: "Batch 2024-A", startups: 12, status: "active", health: "good" },
  { name: "Batch 2024-B", startups: 8, status: "active", health: "at-risk" },
  { name: "Batch 2023-C", startups: 15, status: "completed", health: "good" },
];

const revenueData = [
  { cohort: "2024-A", revenue: 420000 },
  { cohort: "2024-B", revenue: 180000 },
  { cohort: "2023-C", revenue: 890000 },
  { cohort: "2023-B", revenue: 650000 },
  { cohort: "2023-A", revenue: 340000 },
];

const flaggedStartups = [
  { name: "NovaPay", issue: "Burn multiple > 3x", severity: "high" },
  { name: "HealthBridge", issue: "Runway < 4 months", severity: "high" },
  { name: "DataLoop", issue: "Missed 2 milestones", severity: "medium" },
  { name: "AgriFlow", issue: "No financial update (30d)", severity: "low" },
];

const upcomingReviews = [
  { startup: "NovaPay", date: "Mar 8, 2026", reviewer: "Sarah K." },
  { startup: "CloudMesh", date: "Mar 10, 2026", reviewer: "Ahmed M." },
  { startup: "HealthBridge", date: "Mar 12, 2026", reviewer: "David L." },
];

const severityColor: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/10 text-warning",
  low: "bg-muted text-muted-foreground",
};

export default function AcceleratorDashboard() {
  const { role } = useRole();
  const isLimited = role === "mentor";

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Portfolio health overview</p>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-48 h-9 text-sm">
            <SelectValue placeholder="Filter by cohort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cohorts</SelectItem>
            <SelectItem value="2024-a">Batch 2024-A</SelectItem>
            <SelectItem value="2024-b">Batch 2024-B</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active Cohorts</p>
              <Users className="h-4 w-4 text-accent" />
            </div>
            <p className="text-2xl font-bold mt-1">2</p>
            <p className="text-xs text-muted-foreground mt-1">20 startups total</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg Revenue</p>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <p className="text-2xl font-bold mt-1">$42K</p>
            <p className="text-xs text-success mt-1">+12% MoM</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Flagged</p>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-2xl font-bold mt-1">4</p>
            <p className="text-xs text-destructive mt-1">2 critical</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Upcoming Reviews</p>
              <Calendar className="h-4 w-4 text-accent" />
            </div>
            <p className="text-2xl font-bold mt-1">3</p>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Revenue Distribution by Cohort</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="cohort" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v / 1000}K`} />
                  <Tooltip formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="hsl(24, 44%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cohort Summary */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Active Cohorts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cohortSummary.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.startups} startups</p>
                </div>
                <Badge variant={c.health === "good" ? "outline" : "destructive"} className="text-xs">
                  {c.health === "good" ? "Healthy" : "At Risk"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flagged Startups */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Flagged Startups
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLimited ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Lock className="h-5 w-5 mb-2" />
                <p className="text-sm">Restricted view</p>
              </div>
            ) : (
              <div className="space-y-2">
                {flaggedStartups.map((s) => (
                  <div key={s.name} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.issue}</p>
                    </div>
                    <Badge className={`text-xs ${severityColor[s.severity]}`}>{s.severity}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Reviews */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Upcoming Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingReviews.map((r) => (
                <div key={r.startup} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">{r.startup}</p>
                    <p className="text-xs text-muted-foreground">{r.reviewer}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Future Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["AI Risk Detection", "Cohort Benchmarking", "LP Report Export"].map((feature) => (
          <Card key={feature} className="shadow-sm border-dashed opacity-60">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <Badge variant="outline" className="mb-2 text-xs">Coming Soon</Badge>
              <p className="text-sm font-medium">{feature}</p>
              <p className="text-xs text-muted-foreground mt-1">Available in future release</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
