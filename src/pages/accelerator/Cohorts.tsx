import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import { Plus, Search, Filter } from "lucide-react";

interface Cohort {
  id: string;
  name: string;
  duration: string;
  cadence: string;
  mentors: string[];
  startups: Startup[];
  status: "active" | "completed" | "upcoming";
}

interface Startup {
  id: string;
  name: string;
  stage: string;
  revenue: string;
  runway: string;
  burnMultiple: number;
  status: "on-track" | "at-risk" | "critical";
  lastReview: string;
}

const mockCohorts: Cohort[] = [
  {
    id: "c1",
    name: "Batch 2024-A",
    duration: "Jan 2024 – Jun 2024",
    cadence: "Monthly",
    mentors: ["Sarah K.", "Ahmed M.", "David L."],
    status: "active",
    startups: [
      { id: "s1", name: "NovaPay", stage: "Series A", revenue: "$120K", runway: "8 mo", burnMultiple: 3.2, status: "at-risk", lastReview: "Feb 20, 2026" },
      { id: "s2", name: "CloudMesh", stage: "Seed", revenue: "$45K", runway: "14 mo", burnMultiple: 1.5, status: "on-track", lastReview: "Feb 22, 2026" },
      { id: "s3", name: "HealthBridge", stage: "Pre-Seed", revenue: "$8K", runway: "3 mo", burnMultiple: 5.1, status: "critical", lastReview: "Feb 18, 2026" },
      { id: "s4", name: "DataLoop", stage: "Seed", revenue: "$62K", runway: "11 mo", burnMultiple: 2.0, status: "on-track", lastReview: "Feb 25, 2026" },
      { id: "s5", name: "AgriFlow", stage: "Pre-Seed", revenue: "$12K", runway: "6 mo", burnMultiple: 2.8, status: "at-risk", lastReview: "Jan 30, 2026" },
    ],
  },
  {
    id: "c2",
    name: "Batch 2024-B",
    duration: "Jul 2024 – Dec 2024",
    cadence: "Bi-weekly",
    mentors: ["Lisa W.", "Omar H."],
    status: "active",
    startups: [
      { id: "s6", name: "EduSpark", stage: "Seed", revenue: "$34K", runway: "10 mo", burnMultiple: 1.8, status: "on-track", lastReview: "Feb 28, 2026" },
      { id: "s7", name: "FinLedger", stage: "Series A", revenue: "$200K", runway: "18 mo", burnMultiple: 1.2, status: "on-track", lastReview: "Feb 26, 2026" },
      { id: "s8", name: "GreenRoute", stage: "Pre-Seed", revenue: "$5K", runway: "4 mo", burnMultiple: 4.5, status: "critical", lastReview: "Feb 15, 2026" },
    ],
  },
];

const statusStyles: Record<string, string> = {
  "on-track": "bg-success/10 text-success",
  "at-risk": "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
};

export default function Cohorts() {
  const [selectedCohort, setSelectedCohort] = useState<Cohort>(mockCohorts[0]);
  const [search, setSearch] = useState("");
  const { canAccess } = useRole();
  const navigate = useNavigate();

  const filteredStartups = selectedCohort.startups.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Left: Cohort List */}
      <div className="w-72 border-r flex flex-col bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Cohorts</h2>
            {canAccess(["admin", "program_manager"]) && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                    <Plus className="h-3 w-3" /> New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Cohort</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label className="text-xs">Cohort Name</Label>
                      <Input placeholder="e.g. Batch 2025-A" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Duration</Label>
                      <Input placeholder="e.g. Jan 2025 – Jun 2025" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Evaluation Cadence</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select cadence" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Create Cohort</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {mockCohorts.map((cohort) => (
            <button
              key={cohort.id}
              onClick={() => setSelectedCohort(cohort)}
              className={`w-full text-left p-4 border-b transition-colors hover:bg-muted/50 ${
                selectedCohort.id === cohort.id ? "bg-muted" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{cohort.name}</p>
                <Badge variant={cohort.status === "active" ? "default" : "outline"} className={`text-xs ${cohort.status === "active" ? "bg-accent text-accent-foreground" : ""}`}>
                  {cohort.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{cohort.startups.length} startups · {cohort.cadence}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Cohort Details */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-6xl">
          {/* Cohort Header */}
          <div>
            <h1 className="text-xl font-semibold">{selectedCohort.name}</h1>
            <div className="flex gap-4 mt-2">
              <span className="text-xs text-muted-foreground">Duration: {selectedCohort.duration}</span>
              <span className="text-xs text-muted-foreground">Cadence: {selectedCohort.cadence}</span>
            </div>
          </div>

          {/* Mentors */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Assigned Mentors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {selectedCohort.mentors.map((m) => (
                  <Badge key={m} variant="outline" className="text-xs">{m}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search & Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search startups..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-36 h-9 text-sm">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="on-track">On Track</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Startup Table */}
          <Card className="shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold">Startup</TableHead>
                  <TableHead className="text-xs font-semibold">Stage</TableHead>
                  <TableHead className="text-xs font-semibold">Revenue</TableHead>
                  <TableHead className="text-xs font-semibold">Runway</TableHead>
                  <TableHead className="text-xs font-semibold">Burn Multiple</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold">Last Review</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStartups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                      No startups found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStartups.map((s) => (
                    <TableRow
                      key={s.id}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => navigate(`/accelerator/cohorts/${selectedCohort.id}/${s.id}`)}
                    >
                      <TableCell className="font-medium text-sm">{s.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.stage}</TableCell>
                      <TableCell className="text-sm">{s.revenue}</TableCell>
                      <TableCell className="text-sm">{s.runway}</TableCell>
                      <TableCell className="text-sm">
                        <span className={s.burnMultiple > 3 ? "text-destructive font-medium" : ""}>
                          {s.burnMultiple}x
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${statusStyles[s.status]}`}>
                          {s.status.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.lastReview}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
