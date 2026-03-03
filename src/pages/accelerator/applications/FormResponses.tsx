import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Filter, Download, ArrowLeft, UserPlus, ArrowRight } from "lucide-react";

interface Application {
  id: string;
  applicantName: string;
  startupName: string;
  stage: string;
  score: number | null;
  reviewer: string | null;
  industry: string;
  revenue: string;
  dateApplied: string;
  status: "applied" | "screening" | "shortlisted" | "interview" | "accepted" | "rejected";
  aiFit: "strong" | "medium" | "weak" | null;
}

const mockApplications: Application[] = [
  { id: "a1", applicantName: "James Okafor", startupName: "PayStack Lite", stage: "Seed", score: 8.2, reviewer: "Sarah K.", industry: "FinTech", revenue: "$45K", dateApplied: "Mar 1, 2026", status: "shortlisted", aiFit: "strong" },
  { id: "a2", applicantName: "Amara Diallo", startupName: "MedBridge", stage: "Pre-Seed", score: 7.1, reviewer: "Ahmed M.", industry: "HealthTech", revenue: "$12K", dateApplied: "Feb 28, 2026", status: "screening", aiFit: "medium" },
  { id: "a3", applicantName: "Liam Chen", startupName: "EduWave", stage: "Seed", score: null, reviewer: null, industry: "EdTech", revenue: "$28K", dateApplied: "Feb 27, 2026", status: "applied", aiFit: null },
  { id: "a4", applicantName: "Priya Sharma", startupName: "CarbonZero", stage: "Series A", score: 9.0, reviewer: "Sarah K.", industry: "Climate", revenue: "$180K", dateApplied: "Feb 26, 2026", status: "interview", aiFit: "strong" },
  { id: "a5", applicantName: "Carlos Rivera", startupName: "LogiTrack", stage: "Pre-Seed", score: 4.5, reviewer: "David L.", industry: "Logistics", revenue: "$3K", dateApplied: "Feb 25, 2026", status: "rejected", aiFit: "weak" },
  { id: "a6", applicantName: "Fatima Hassan", startupName: "AgriSense", stage: "Seed", score: 7.8, reviewer: null, industry: "AgriTech", revenue: "$55K", dateApplied: "Feb 24, 2026", status: "screening", aiFit: "medium" },
  { id: "a7", applicantName: "Noah Kim", startupName: "QuantumPay", stage: "Seed", score: 8.5, reviewer: "Ahmed M.", industry: "FinTech", revenue: "$92K", dateApplied: "Feb 23, 2026", status: "accepted", aiFit: "strong" },
  { id: "a8", applicantName: "Zara Osei", startupName: "HealthPulse", stage: "Pre-Seed", score: 6.0, reviewer: "Lisa W.", industry: "HealthTech", revenue: "$8K", dateApplied: "Feb 22, 2026", status: "applied", aiFit: "medium" },
];

const stageColors: Record<string, string> = {
  applied: "bg-muted text-muted-foreground",
  screening: "bg-accent/10 text-accent",
  shortlisted: "bg-accent/20 text-accent",
  interview: "bg-primary/10 text-foreground",
  accepted: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

const fitColors: Record<string, string> = {
  strong: "text-success",
  medium: "text-warning",
  weak: "text-destructive",
};

export default function FormResponses() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = mockApplications.filter((a) => {
    const matchSearch =
      a.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      a.startupName.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === "all" || a.status === stageFilter;
    return matchSearch && matchStage;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };
  const toggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map((a) => a.id));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/accelerator/applications/forms")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Batch 2025-A Application</h1>
          <p className="text-sm text-muted-foreground">{mockApplications.length} responses</p>
        </div>
      </div>

      {/* View toggle */}
      <Tabs defaultValue="table">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="table" className="text-xs">Table</TabsTrigger>
            <TabsTrigger value="pipeline" className="text-xs" onClick={() => navigate("/accelerator/applications/pipeline")}>
              Pipeline
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <div className="flex items-center gap-2 mr-2">
                <span className="text-xs text-muted-foreground">{selected.length} selected</span>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  <UserPlus className="h-3 w-3" /> Assign Reviewer
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  <ArrowRight className="h-3 w-3" /> Move Stage
                </Button>
              </div>
            )}
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <Download className="h-3 w-3" /> Export CSV
            </Button>
          </div>
        </div>
      </Tabs>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search applicants..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-40 h-9 text-sm">
            <Filter className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="screening">Screening</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox checked={selected.length === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead className="text-xs font-semibold">Applicant</TableHead>
              <TableHead className="text-xs font-semibold">Startup</TableHead>
              <TableHead className="text-xs font-semibold">Stage</TableHead>
              <TableHead className="text-xs font-semibold">Score</TableHead>
              <TableHead className="text-xs font-semibold">AI Fit</TableHead>
              <TableHead className="text-xs font-semibold">Reviewer</TableHead>
              <TableHead className="text-xs font-semibold">Industry</TableHead>
              <TableHead className="text-xs font-semibold">Revenue</TableHead>
              <TableHead className="text-xs font-semibold">Applied</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-12 text-muted-foreground text-sm">
                  No applications match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((a) => (
                <TableRow
                  key={a.id}
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => navigate(`/accelerator/applications/application/${a.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selected.includes(a.id)} onCheckedChange={() => toggleSelect(a.id)} />
                  </TableCell>
                  <TableCell className="font-medium text-sm">{a.applicantName}</TableCell>
                  <TableCell className="text-sm">{a.startupName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.stage}</TableCell>
                  <TableCell className="text-sm font-medium">{a.score !== null ? a.score.toFixed(1) : "—"}</TableCell>
                  <TableCell>
                    {a.aiFit ? (
                      <span className={`text-xs font-medium ${fitColors[a.aiFit]}`}>{a.aiFit}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.reviewer || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.industry}</TableCell>
                  <TableCell className="text-sm">{a.revenue}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.dateApplied}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs capitalize ${stageColors[a.status]}`}>{a.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
