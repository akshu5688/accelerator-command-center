import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ArrowLeft, Lock, RefreshCw, Upload, MessageSquare, Star } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

const revenueData = [
  { month: "Sep", revenue: 8000 },
  { month: "Oct", revenue: 12000 },
  { month: "Nov", revenue: 18000 },
  { month: "Dec", revenue: 22000 },
  { month: "Jan", revenue: 28000 },
  { month: "Feb", revenue: 34000 },
];

const expenseBreakdown = [
  { name: "Payroll", value: 45 },
  { name: "Infrastructure", value: 20 },
  { name: "Marketing", value: 15 },
  { name: "Operations", value: 12 },
  { name: "Other", value: 8 },
];

const COLORS = ["hsl(24, 44%, 60%)", "hsl(24, 44%, 72%)", "hsl(24, 44%, 50%)", "hsl(24, 44%, 40%)", "hsl(24, 44%, 80%)"];

const milestones = [
  { id: 1, title: "Launch MVP", status: "completed", owner: "Founder", due: "Jan 15, 2026", progress: 100 },
  { id: 2, title: "Reach 100 users", status: "on-track", owner: "Growth Lead", due: "Mar 1, 2026", progress: 72 },
  { id: 3, title: "Close pilot with enterprise", status: "at-risk", owner: "Founder", due: "Mar 30, 2026", progress: 30 },
  { id: 4, title: "Hire CTO", status: "on-track", owner: "Founder", due: "Apr 15, 2026", progress: 50 },
];

const reviews = [
  { date: "Feb 20, 2026", reviewer: "Sarah K.", score: 4, flags: "Burn rate increasing", actions: "Review marketing spend" },
  { date: "Jan 20, 2026", reviewer: "Ahmed M.", score: 3, flags: "Product velocity slowing", actions: "Reprioritize roadmap" },
  { date: "Dec 20, 2025", reviewer: "David L.", score: 4, flags: "None", actions: "Continue current trajectory" },
];

const documents = [
  { name: "Pitch Deck v3.pdf", type: "Pitch", date: "Feb 15, 2026", size: "2.4 MB" },
  { name: "Financial Model Q1.xlsx", type: "Financial", date: "Feb 10, 2026", size: "1.1 MB" },
  { name: "Product Roadmap.pdf", type: "Product", date: "Jan 28, 2026", size: "890 KB" },
  { name: "Cap Table.xlsx", type: "Legal", date: "Jan 15, 2026", size: "340 KB" },
];

const milestoneStatusStyles: Record<string, string> = {
  completed: "bg-success/10 text-success",
  "on-track": "bg-accent/10 text-accent",
  "at-risk": "bg-destructive/10 text-destructive",
};

export default function StartupProfile() {
  const { cohortId, startupId } = useParams();
  const navigate = useNavigate();
  const { role, canAccess } = useRole();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/accelerator/cohorts")} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">NovaPay</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">Series A</Badge>
            <Badge variant="outline" className="text-xs">Fintech</Badge>
            <Badge className="text-xs bg-warning/10 text-warning">At Risk</Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="financials" className="text-xs">Financials</TabsTrigger>
          <TabsTrigger value="milestones" className="text-xs">Milestones & OKRs</TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs">Review Logs</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Founder Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span className="text-xs text-muted-foreground">Name</span><span className="text-sm font-medium">Karim Al-Rashid</span></div>
                <div className="flex justify-between"><span className="text-xs text-muted-foreground">Email</span><span className="text-sm">karim@novapay.io</span></div>
                <div className="flex justify-between"><span className="text-xs text-muted-foreground">Industry</span><span className="text-sm">Fintech</span></div>
                <div className="flex justify-between"><span className="text-xs text-muted-foreground">Stage</span><span className="text-sm">Series A</span></div>
                <div className="flex justify-between"><span className="text-xs text-muted-foreground">Location</span><span className="text-sm">Dubai, UAE</span></div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Traction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span className="text-xs text-muted-foreground">MRR</span><span className="text-sm font-medium">$34K</span></div>
                <div className="flex justify-between"><span className="text-xs text-muted-foreground">Growth Rate</span><span className="text-sm text-success">+22% MoM</span></div>
                <div className="flex justify-between"><span className="text-xs text-muted-foreground">Users</span><span className="text-sm">2,400</span></div>
                <div className="flex justify-between"><span className="text-xs text-muted-foreground">NPS</span><span className="text-sm">62</span></div>
                <div className="flex justify-between"><span className="text-xs text-muted-foreground">Churn</span><span className="text-sm">3.2%</span></div>
              </CardContent>
            </Card>
          </div>
          {/* KPI Snapshot */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Revenue", value: "$34K", change: "+22%" },
              { label: "Runway", value: "8 mo", change: "" },
              { label: "Burn Multiple", value: "3.2x", change: "" },
              { label: "Team Size", value: "12", change: "+2" },
            ].map((kpi) => (
              <Card key={kpi.label} className="shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
                  <p className="text-lg font-bold mt-1">{kpi.value}</p>
                  {kpi.change && <p className="text-xs text-success mt-0.5">{kpi.change}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Financials Tab (READ-ONLY) */}
        <TabsContent value="financials" className="space-y-6 mt-6">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-dashed">
            <RefreshCw className="h-4 w-4 text-accent" />
            <span className="text-xs text-muted-foreground font-medium">Synced from Founder Workspace</span>
            <Lock className="h-3 w-3 text-muted-foreground ml-auto" />
            <span className="text-xs text-muted-foreground">Read-only</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Monthly Burn", value: "$42K" },
              { label: "Runway", value: "8 months" },
              { label: "Cash on Hand", value: "$336K" },
              { label: "LTV:CAC", value: "3.2x" },
            ].map((m) => (
              <Card key={m.label} className="shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground font-medium">{m.label}</p>
                  <p className="text-lg font-bold mt-1">{m.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v / 1000}K`} />
                      <Tooltip formatter={(v: number) => [`$${(v / 1000).toFixed(0)}K`, "Revenue"]} />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(24, 44%, 60%)" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                        {expenseBreakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => [`${v}%`]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-3 mt-2 justify-center">
                  {expenseBreakdown.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-4 mt-6">
          {milestones.map((m) => (
            <Card key={m.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-medium">{m.title}</h3>
                    <Badge className={`text-xs ${milestoneStatusStyles[m.status]}`}>
                      {m.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{m.owner}</span>
                    <span>Due: {m.due}</span>
                  </div>
                </div>
                <Progress value={m.progress} className="h-1.5" />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{m.progress}%</span>
                  {canAccess(["admin", "program_manager", "mentor"]) && (
                    <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                      <MessageSquare className="h-3 w-3" /> Comment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4 mt-6">
          {canAccess(["admin", "program_manager", "mentor"]) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1">
                  <Star className="h-3 w-3" /> Add Review
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label className="text-xs">Score (1–5)</Label>
                    <Select>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Score" /></SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <SelectItem key={s} value={String(s)}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Red Flags</Label>
                    <Textarea placeholder="Note any concerns..." className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Suggested Actions</Label>
                    <Textarea placeholder="Recommended next steps..." className="mt-1" />
                  </div>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Submit Review</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {role === "founder" && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-dashed">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Internal review notes are not visible to founders</span>
            </div>
          )}

          <Card className="shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold">Date</TableHead>
                  <TableHead className="text-xs font-semibold">Reviewer</TableHead>
                  <TableHead className="text-xs font-semibold">Score</TableHead>
                  <TableHead className="text-xs font-semibold">Red Flags</TableHead>
                  <TableHead className="text-xs font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm">{r.date}</TableCell>
                    <TableCell className="text-sm">{r.reviewer}</TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className={`h-3 w-3 ${idx < r.score ? "text-accent fill-accent" : "text-muted"}`} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.flags}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.actions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4 mt-6">
          <div className="flex items-center gap-3">
            <Select defaultValue="all">
              <SelectTrigger className="w-36 h-9 text-sm">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pitch">Pitch</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
              </SelectContent>
            </Select>
            {canAccess(["admin", "program_manager"]) && (
              <Button size="sm" variant="outline" className="gap-1 text-xs">
                <Upload className="h-3 w-3" /> Upload
              </Button>
            )}
          </div>
          <Card className="shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold">File Name</TableHead>
                  <TableHead className="text-xs font-semibold">Type</TableHead>
                  <TableHead className="text-xs font-semibold">Date</TableHead>
                  <TableHead className="text-xs font-semibold">Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((d) => (
                  <TableRow key={d.name}>
                    <TableCell className="text-sm font-medium">{d.name}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{d.type}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{d.date}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{d.size}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
