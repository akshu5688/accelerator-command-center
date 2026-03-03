import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, GripVertical } from "lucide-react";

interface PipelineCard {
  id: string;
  startupName: string;
  founderName: string;
  score: number | null;
  aiFit: "strong" | "medium" | "weak" | null;
  reviewer: string | null;
}

type Stage = "applied" | "screening" | "shortlisted" | "interview" | "accepted" | "rejected";

const stageLabels: Record<Stage, string> = {
  applied: "Applied",
  screening: "Screening",
  shortlisted: "Shortlisted",
  interview: "Interview",
  accepted: "Accepted",
  rejected: "Rejected",
};

const stageHeaderColors: Record<Stage, string> = {
  applied: "border-t-muted-foreground",
  screening: "border-t-accent",
  shortlisted: "border-t-accent",
  interview: "border-t-foreground",
  accepted: "border-t-success",
  rejected: "border-t-destructive",
};

const fitColors: Record<string, string> = {
  strong: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  weak: "bg-destructive/10 text-destructive",
};

const initialData: Record<Stage, PipelineCard[]> = {
  applied: [
    { id: "a3", startupName: "EduWave", founderName: "Liam Chen", score: null, aiFit: null, reviewer: null },
    { id: "a8", startupName: "HealthPulse", founderName: "Zara Osei", score: 6.0, aiFit: "medium", reviewer: "Lisa W." },
  ],
  screening: [
    { id: "a2", startupName: "MedBridge", founderName: "Amara Diallo", score: 7.1, aiFit: "medium", reviewer: "Ahmed M." },
    { id: "a6", startupName: "AgriSense", founderName: "Fatima Hassan", score: 7.8, aiFit: "medium", reviewer: null },
  ],
  shortlisted: [
    { id: "a1", startupName: "PayStack Lite", founderName: "James Okafor", score: 8.2, aiFit: "strong", reviewer: "Sarah K." },
  ],
  interview: [
    { id: "a4", startupName: "CarbonZero", founderName: "Priya Sharma", score: 9.0, aiFit: "strong", reviewer: "Sarah K." },
  ],
  accepted: [
    { id: "a7", startupName: "QuantumPay", founderName: "Noah Kim", score: 8.5, aiFit: "strong", reviewer: "Ahmed M." },
  ],
  rejected: [
    { id: "a5", startupName: "LogiTrack", founderName: "Carlos Rivera", score: 4.5, aiFit: "weak", reviewer: "David L." },
  ],
};

const stages: Stage[] = ["applied", "screening", "shortlisted", "interview", "accepted", "rejected"];

export default function Pipeline() {
  const navigate = useNavigate();
  const [pipeline, setPipeline] = useState(initialData);
  const [dragging, setDragging] = useState<{ stage: Stage; cardId: string } | null>(null);

  const handleDragStart = (stage: Stage, cardId: string) => {
    setDragging({ stage, cardId });
  };

  const handleDrop = (targetStage: Stage) => {
    if (!dragging || dragging.stage === targetStage) {
      setDragging(null);
      return;
    }
    setPipeline((prev) => {
      const card = prev[dragging.stage].find((c) => c.id === dragging.cardId);
      if (!card) return prev;
      return {
        ...prev,
        [dragging.stage]: prev[dragging.stage].filter((c) => c.id !== dragging.cardId),
        [targetStage]: [...prev[targetStage], card],
      };
    });
    setDragging(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="h-12 border-b flex items-center px-4 bg-card shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8 mr-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold">Application Pipeline</span>
        <span className="text-xs text-muted-foreground ml-3">Drag cards between stages</span>
      </div>

      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 min-w-max h-full">
          {stages.map((stage) => (
            <div
              key={stage}
              className={`w-72 flex flex-col bg-muted/30 rounded-lg border-t-2 ${stageHeaderColors[stage]}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage)}
            >
              <div className="px-3 py-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stageLabels[stage]}</span>
                <Badge variant="outline" className="text-[10px]">{pipeline[stage].length}</Badge>
              </div>
              <div className="flex-1 overflow-auto px-2 pb-2 space-y-2">
                {pipeline[stage].length === 0 ? (
                  <div className="h-24 rounded-md border border-dashed flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">No applications</p>
                  </div>
                ) : (
                  pipeline[stage].map((card) => (
                    <Card
                      key={card.id}
                      draggable
                      onDragStart={() => handleDragStart(stage, card.id)}
                      className="shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/accelerator/applications/application/${card.id}`)}
                    >
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{card.startupName}</p>
                            <p className="text-xs text-muted-foreground">{card.founderName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-6">
                          {card.score !== null && (
                            <span className="text-xs font-semibold">{card.score.toFixed(1)}</span>
                          )}
                          {card.aiFit && (
                            <Badge className={`text-[10px] ${fitColors[card.aiFit]}`}>{card.aiFit} fit</Badge>
                          )}
                        </div>
                        {card.reviewer && (
                          <p className="text-[10px] text-muted-foreground ml-6">Reviewer: {card.reviewer}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
