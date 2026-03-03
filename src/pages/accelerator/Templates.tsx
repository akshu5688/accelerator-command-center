import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Edit, ArrowRight } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  lastUpdated: string;
  appliedTo: number;
}

const milestoneTemplates: Template[] = [
  { id: "t1", name: "Standard Accelerator Track", description: "12-week milestone structure for early-stage startups", type: "milestone", lastUpdated: "Feb 15, 2026", appliedTo: 3 },
  { id: "t2", name: "Deep Tech Track", description: "Extended 16-week structure for R&D-heavy startups", type: "milestone", lastUpdated: "Jan 20, 2026", appliedTo: 1 },
];

const rubricTemplates: Template[] = [
  { id: "t3", name: "Monthly Evaluation Rubric", description: "Standard scoring rubric for monthly founder reviews", type: "rubric", lastUpdated: "Feb 10, 2026", appliedTo: 2 },
  { id: "t4", name: "Demo Day Rubric", description: "Final evaluation for investment committee", type: "rubric", lastUpdated: "Jan 5, 2026", appliedTo: 1 },
];

const scoringModels: Template[] = [
  { id: "t5", name: "Weighted KPI Score", description: "Revenue (30%), Growth (25%), Retention (20%), Team (15%), Product (10%)", type: "scoring", lastUpdated: "Feb 8, 2026", appliedTo: 2 },
];

const kpiFrameworks: Template[] = [
  { id: "t6", name: "SaaS Metrics Framework", description: "MRR, Churn, LTV, CAC, NPS, DAU/MAU", type: "kpi", lastUpdated: "Feb 12, 2026", appliedTo: 4 },
  { id: "t7", name: "Marketplace Metrics", description: "GMV, Take Rate, Liquidity, Supply/Demand ratio", type: "kpi", lastUpdated: "Jan 28, 2026", appliedTo: 1 },
];

function TemplateCard({ template }: { template: Template }) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="text-sm font-semibold">{template.name}</h3>
            <p className="text-xs text-muted-foreground">{template.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Updated {template.lastUpdated}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">Applied to {template.appliedTo} cohorts</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><Edit className="h-3 w-3" /> Edit</Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><Copy className="h-3 w-3" /> Duplicate</Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><ArrowRight className="h-3 w-3" /> Apply</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TemplateSection({ title, templates }: { title: string; templates: Template[] }) {
  return (
    <div className="space-y-3">
      {templates.map((t) => (
        <TemplateCard key={t.id} template={t} />
      ))}
      {templates.length === 0 && (
        <Card className="shadow-sm border-dashed">
          <CardContent className="p-8 text-center text-muted-foreground text-sm">
            No templates yet. Create your first template.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Templates() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Templates</h1>
          <p className="text-sm text-muted-foreground">Standardize evaluations and milestones across cohorts</p>
        </div>
        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs">
          Create Template
        </Button>
      </div>

      <Tabs defaultValue="milestones">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="milestones" className="text-xs">Milestone Templates</TabsTrigger>
          <TabsTrigger value="rubrics" className="text-xs">Evaluation Rubrics</TabsTrigger>
          <TabsTrigger value="scoring" className="text-xs">Scoring Models</TabsTrigger>
          <TabsTrigger value="kpi" className="text-xs">KPI Frameworks</TabsTrigger>
        </TabsList>
        <TabsContent value="milestones" className="mt-6">
          <TemplateSection title="Milestone Templates" templates={milestoneTemplates} />
        </TabsContent>
        <TabsContent value="rubrics" className="mt-6">
          <TemplateSection title="Evaluation Rubrics" templates={rubricTemplates} />
        </TabsContent>
        <TabsContent value="scoring" className="mt-6">
          <TemplateSection title="Scoring Models" templates={scoringModels} />
        </TabsContent>
        <TabsContent value="kpi" className="mt-6">
          <TemplateSection title="KPI Frameworks" templates={kpiFrameworks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
