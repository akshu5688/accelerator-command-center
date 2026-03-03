import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import {
  Type, AlignLeft, ListChecks, ChevronDown, Upload, Hash, ToggleLeft, Heading,
  GripVertical, Trash2, ArrowLeft, Eye, Save, Lock,
} from "lucide-react";

type QuestionType = "short_text" | "long_text" | "multiple_choice" | "dropdown" | "file_upload" | "number" | "yes_no" | "section_header";

interface Question {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  description: string;
  options?: string[];
}

const questionBlocks: { type: QuestionType; label: string; icon: React.ElementType }[] = [
  { type: "short_text", label: "Short Text", icon: Type },
  { type: "long_text", label: "Long Text", icon: AlignLeft },
  { type: "multiple_choice", label: "Multiple Choice", icon: ListChecks },
  { type: "dropdown", label: "Dropdown", icon: ChevronDown },
  { type: "file_upload", label: "File Upload", icon: Upload },
  { type: "number", label: "Number", icon: Hash },
  { type: "yes_no", label: "Yes / No", icon: ToggleLeft },
  { type: "section_header", label: "Section Header", icon: Heading },
];

const initialQuestions: Question[] = [
  { id: "q1", type: "section_header", label: "Founder Information", required: false, description: "" },
  { id: "q2", type: "short_text", label: "Full Name", required: true, description: "Legal name of the primary founder" },
  { id: "q3", type: "short_text", label: "Email Address", required: true, description: "" },
  { id: "q4", type: "short_text", label: "Startup Name", required: true, description: "" },
  { id: "q5", type: "dropdown", label: "Industry", required: true, description: "", options: ["FinTech", "HealthTech", "EdTech", "Climate", "SaaS", "Other"] },
  { id: "q6", type: "section_header", label: "Traction & Financials", required: false, description: "" },
  { id: "q7", type: "number", label: "Monthly Revenue (USD)", required: true, description: "Current MRR" },
  { id: "q8", type: "dropdown", label: "Stage", required: true, description: "", options: ["Idea", "Pre-Seed", "Seed", "Series A", "Series B+"] },
  { id: "q9", type: "long_text", label: "What problem are you solving?", required: true, description: "Max 500 characters" },
  { id: "q10", type: "file_upload", label: "Pitch Deck", required: false, description: "PDF or PPTX, max 20MB" },
];

let counter = 11;

export default function FormBuilder() {
  const navigate = useNavigate();
  const { formId } = useParams();
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [selected, setSelected] = useState<string | null>("q2");
  const [isDraft, setIsDraft] = useState(true);

  const addQuestion = (type: QuestionType) => {
    const id = `q${counter++}`;
    const q: Question = {
      id,
      type,
      label: type === "section_header" ? "New Section" : "Untitled Question",
      required: false,
      description: "",
      options: type === "multiple_choice" || type === "dropdown" ? ["Option 1", "Option 2"] : undefined,
    };
    setQuestions((prev) => [...prev, q]);
    setSelected(id);
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (selected === id) setSelected(null);
  };

  const updateQuestion = (id: string, patch: Partial<Question>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const selectedQ = questions.find((q) => q.id === selected);

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      {/* Top bar */}
      <div className="h-12 border-b flex items-center justify-between px-4 bg-card shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/accelerator/applications/forms")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">Form Builder</span>
          <Badge variant="outline" className={`text-xs ${isDraft ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>
            {isDraft ? "Draft" : "Published"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
            <Eye className="h-3 w-3" /> Preview
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs gap-1 bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => setIsDraft(false)}
          >
            <Save className="h-3 w-3" /> {isDraft ? "Publish" : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left: Question blocks */}
        <div className="w-56 border-r bg-card overflow-auto shrink-0">
          <div className="p-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Question Blocks</p>
            <div className="space-y-1">
              {questionBlocks.map((block) => (
                <button
                  key={block.type}
                  onClick={() => addQuestion(block.type)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted/50 transition-colors"
                >
                  <block.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{block.label}</span>
                </button>
              ))}
            </div>
          </div>
          <Separator />
          <div className="p-3">
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Conditional logic</span>
              <Badge variant="outline" className="text-[10px] ml-auto">Soon</Badge>
            </div>
          </div>
        </div>

        {/* Center: Form canvas */}
        <div className="flex-1 overflow-auto bg-muted/30 p-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="mb-6">
              <Input
                className="text-lg font-semibold border-none bg-transparent px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground"
                defaultValue={formId === "new" ? "" : "Batch 2025-A Application"}
                placeholder="Form Title"
              />
              <Input
                className="text-sm text-muted-foreground border-none bg-transparent px-0 h-auto mt-1 focus-visible:ring-0 placeholder:text-muted-foreground/60"
                defaultValue=""
                placeholder="Optional description..."
              />
            </div>

            {questions.map((q) => (
              <Card
                key={q.id}
                className={`shadow-sm cursor-pointer transition-all ${
                  selected === q.id ? "ring-2 ring-accent" : "hover:shadow-md"
                }`}
                onClick={() => setSelected(q.id)}
              >
                <CardContent className="p-4">
                  {q.type === "section_header" ? (
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground/40" />
                      <Heading className="h-4 w-4 text-accent" />
                      <span className="text-sm font-semibold">{q.label}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground/40 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{q.label}</span>
                            {q.required && <span className="text-destructive text-xs">*</span>}
                          </div>
                          {q.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{q.description}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {questionBlocks.find((b) => b.type === q.type)?.label}
                        </Badge>
                      </div>
                      {/* Preview area */}
                      <div className="ml-6">
                        {q.type === "short_text" && (
                          <div className="h-9 rounded-md border bg-muted/20 px-3 flex items-center text-xs text-muted-foreground">Short answer</div>
                        )}
                        {q.type === "long_text" && (
                          <div className="h-20 rounded-md border bg-muted/20 px-3 pt-2 text-xs text-muted-foreground">Long answer</div>
                        )}
                        {q.type === "number" && (
                          <div className="h-9 rounded-md border bg-muted/20 px-3 flex items-center text-xs text-muted-foreground">0</div>
                        )}
                        {q.type === "file_upload" && (
                          <div className="h-16 rounded-md border border-dashed bg-muted/20 flex items-center justify-center text-xs text-muted-foreground">
                            <Upload className="h-4 w-4 mr-1" /> Drop file here
                          </div>
                        )}
                        {q.type === "yes_no" && (
                          <div className="flex gap-3">
                            <Badge variant="outline" className="text-xs">Yes</Badge>
                            <Badge variant="outline" className="text-xs">No</Badge>
                          </div>
                        )}
                        {(q.type === "multiple_choice" || q.type === "dropdown") && q.options && (
                          <div className="space-y-1">
                            {q.options.map((opt, i) => (
                              <div key={i} className="h-7 rounded border bg-muted/20 px-3 flex items-center text-xs text-muted-foreground">
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Question settings */}
        <div className="w-64 border-l bg-card overflow-auto shrink-0">
          {selectedQ ? (
            <div className="p-4 space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Question Settings</p>
              <div>
                <Label className="text-xs">Label</Label>
                <Input
                  className="mt-1 text-sm"
                  value={selectedQ.label}
                  onChange={(e) => updateQuestion(selectedQ.id, { label: e.target.value })}
                />
              </div>
              {selectedQ.type !== "section_header" && (
                <>
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Input
                      className="mt-1 text-sm"
                      value={selectedQ.description}
                      onChange={(e) => updateQuestion(selectedQ.id, { description: e.target.value })}
                      placeholder="Helper text..."
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Required</Label>
                    <Switch
                      checked={selectedQ.required}
                      onCheckedChange={(v) => updateQuestion(selectedQ.id, { required: v })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span>Character limit</span>
                    <Badge variant="outline" className="text-[10px] ml-auto">Soon</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span>Validation rules</span>
                    <Badge variant="outline" className="text-[10px] ml-auto">Soon</Badge>
                  </div>
                </>
              )}
              <Separator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 text-xs text-destructive hover:text-destructive gap-1"
                onClick={() => removeQuestion(selectedQ.id)}
              >
                <Trash2 className="h-3 w-3" /> Remove Question
              </Button>
            </div>
          ) : (
            <div className="p-4 flex flex-col items-center justify-center h-full text-muted-foreground">
              <p className="text-xs">Select a question to edit settings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
