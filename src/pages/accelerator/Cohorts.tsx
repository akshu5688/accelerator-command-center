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
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus, Search, Filter } from "lucide-react";

interface Cohort {
  id: string;
  name: string;
  duration: string;
  cadence: string;
  startups: Startup[];
  status: "active" | "completed" | "upcoming";
}

interface Startup {
  id: string;
  name: string;
  stage: string;
  revenue: string;
  runway: string;
  burnMultiple: number | null;
  status: "on-track" | "at-risk" | "critical";
  lastReview: string;
}

const statusStyles: Record<string, string> = {
  "on-track": "bg-success/10 text-success",
  "at-risk": "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
};

export default function Cohorts() {
  const queryClient = useQueryClient();
  const { workspaceId } = useWorkspace();
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "on-track" | "at-risk" | "critical">("all");
  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newCadence, setNewCadence] = useState("monthly");
  const { canAccess } = useRole();
  const navigate = useNavigate();
  const { data: cohorts = [] } = useQuery({
    queryKey: ["cohorts", workspaceId],
    enabled: !!workspaceId && !!supabase,
    queryFn: async () => {
      if (!supabase || !workspaceId) return [];

      const [cohortsRes, startupsRes] = await Promise.all([
        supabase.from("cohorts").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false }),
        supabase.from("startups").select("*").eq("workspace_id", workspaceId),
      ]);

      const startupRows = startupsRes.data ?? [];

      return (cohortsRes.data ?? []).map((c) => ({
        id: c.id,
        name: c.name,
        duration: c.duration ?? "—",
        cadence: c.cadence ?? "—",
        status: c.status as Cohort["status"],
        startups: startupRows
          .filter((s) => s.cohort_id === c.id)
          .map((s) => ({
            id: s.id,
            name: s.name,
            stage: s.stage ?? "—",
            revenue: s.revenue !== null ? `$${Math.round(s.revenue / 1000)}K` : "—",
            runway: s.runway_months !== null ? `${s.runway_months} mo` : "—",
            burnMultiple: s.burn_multiple,
            status: s.status as Startup["status"],
            lastReview: s.last_review_date ? new Date(s.last_review_date).toLocaleDateString() : "—",
          })),
      }));
    },
  });
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!supabase || !workspaceId || !newName.trim()) return;
      await supabase.from("cohorts").insert({
        workspace_id: workspaceId,
        name: newName.trim(),
        duration: newDuration || null,
        cadence: newCadence,
        status: "active",
      });
    },
    onSuccess: () => {
      setNewName("");
      setNewDuration("");
      setNewCadence("monthly");
      queryClient.invalidateQueries({ queryKey: ["cohorts", workspaceId] });
    },
  });
  const selectedCohort = cohorts.find((c) => c.id === selectedCohortId) ?? cohorts[0];

  const filteredStartups = (selectedCohort?.startups ?? []).filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                      <Input placeholder="e.g. Batch 2025-A" className="mt-1" value={newName} onChange={(e) => setNewName(e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Duration</Label>
                      <Input placeholder="e.g. Jan 2025 – Jun 2025" className="mt-1" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Evaluation Cadence</Label>
                      <Select value={newCadence} onValueChange={setNewCadence}>
                        <SelectTrigger><SelectValue placeholder="Select cadence" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => createMutation.mutate()}
                    >
                      Create Cohort
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {cohorts.map((cohort) => (
            <button
              key={cohort.id}
              onClick={() => setSelectedCohortId(cohort.id)}
              className={`w-full text-left p-4 border-b transition-colors hover:bg-muted/50 ${
                selectedCohort?.id === cohort.id ? "bg-muted" : ""
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
          {cohorts.length === 0 && (
            <div className="p-4 text-xs text-muted-foreground">No cohorts yet.</div>
          )}
        </div>
      </div>

      {/* Right: Cohort Details */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-6xl">
          {/* Cohort Header */}
          <div>
            <h1 className="text-xl font-semibold">{selectedCohort?.name ?? "No cohort selected"}</h1>
            <div className="flex gap-4 mt-2">
              <span className="text-xs text-muted-foreground">Duration: {selectedCohort?.duration ?? "—"}</span>
              <span className="text-xs text-muted-foreground">Cadence: {selectedCohort?.cadence ?? "—"}</span>
            </div>
          </div>

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
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
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
                      onClick={() => selectedCohort && navigate(`/accelerator/cohorts/${selectedCohort.id}/${s.id}`)}
                    >
                      <TableCell className="font-medium text-sm">{s.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.stage}</TableCell>
                      <TableCell className="text-sm">{s.revenue}</TableCell>
                      <TableCell className="text-sm">{s.runway}</TableCell>
                      <TableCell className="text-sm">
                        {s.burnMultiple !== null ? (
                          <span className={s.burnMultiple > 3 ? "text-destructive font-medium" : ""}>
                            {s.burnMultiple}x
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
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
