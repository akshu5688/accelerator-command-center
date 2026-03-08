import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
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
  conditional?: {
    sourceQuestionId: string;
    value: string;
  } | null;
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

let counter = 1;

function parseOptions(
  raw: unknown,
): {
  items?: string[];
  conditional?: { sourceQuestionId: string; value: string };
} {
  if (Array.isArray(raw)) {
    return { items: raw.filter((item): item is string => typeof item === "string") };
  }
  if (raw && typeof raw === "object") {
    const record = raw as Record<string, unknown>;
    const maybeItems = Array.isArray(record.items)
      ? record.items.filter((item): item is string => typeof item === "string")
      : undefined;
    const maybeConditional = record.conditional;
    if (
      maybeConditional &&
      typeof maybeConditional === "object" &&
      typeof (maybeConditional as Record<string, unknown>).sourceQuestionId === "string" &&
      typeof (maybeConditional as Record<string, unknown>).value === "string"
    ) {
      return {
        items: maybeItems,
        conditional: {
          sourceQuestionId: (maybeConditional as Record<string, string>).sourceQuestionId,
          value: (maybeConditional as Record<string, string>).value,
        },
      };
    }
    return { items: maybeItems };
  }
  return {};
}

function getQuestionValueOptions(question: Question | undefined): string[] | null {
  if (!question) return null;
  if (question.type === "yes_no") return ["Yes", "No"];
  if ((question.type === "multiple_choice" || question.type === "dropdown") && question.options?.length) {
    return question.options;
  }
  return null;
}

function generatePublishSlug(title: string, fallbackId?: string | null): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const suffix = (fallbackId ?? crypto.randomUUID()).replace(/-/g, "").slice(0, 8);
  return `${base || "form"}-${suffix}`;
}

export default function FormBuilder() {
  const navigate = useNavigate();
  const { formId } = useParams();
  const queryClient = useQueryClient();
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const isNew = formId === "new";
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isDraft, setIsDraft] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, string>>({});

  const { isLoading } = useQuery({
    queryKey: ["form-builder", formId, workspaceId],
    enabled: !isNew && !!formId && !!workspaceId && !!supabase,
    queryFn: async () => {
      if (!supabase || !workspaceId || !formId || isNew) return null;

      const { data: form } = await supabase
        .from("forms")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("id", formId)
        .single();
      const { data: qs } = await supabase
        .from("form_questions")
        .select("*")
        .eq("form_id", formId)
        .order("sort_order", { ascending: true });

      if (form) {
        setTitle(form.name);
        setDescription(form.description ?? "");
        setDeadline(form.deadline ? form.deadline.slice(0, 10) : "");
        setIsDraft(form.status !== "open");
      }
      if (qs && qs.length > 0) {
        const mapped = qs.map((q) => ({
            id: q.id,
            type: q.type as QuestionType,
            label: q.label,
            required: q.required,
            description: q.description ?? "",
            options: parseOptions(q.options).items,
            conditional: parseOptions(q.options).conditional ?? null,
          }));
        setQuestions(mapped);
        setSelected(mapped[0]?.id ?? null);
      }
      return null;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (publish: boolean) => {
      if (!supabase || !workspaceId) return;

      const cleanTitle = title.trim();
      const cleanDescription = description.trim();
      const requiredWithoutLabel = questions.some(
        (q) => q.type !== "section_header" && q.required && !q.label.trim(),
      );

      if (publish) {
        if (!cleanTitle) throw new Error("Form title is required before publishing.");
        if (questions.length === 0) throw new Error("Add at least one question before publishing.");
        if (requiredWithoutLabel) throw new Error("Required questions must have labels.");
      }

      if (deadline && Number.isNaN(new Date(`${deadline}T00:00:00.000Z`).getTime())) {
        throw new Error("Deadline is invalid.");
      }

      let activeFormId = formId;
      let existingVersion = 1;
      let existingSlug: string | null = null;

      if (!isNew && formId) {
        const { data: existing, error: existingError } = await supabase
          .from("forms")
          .select("version, publish_slug")
          .eq("id", formId)
          .eq("workspace_id", workspaceId)
          .single();
        if (existingError) throw existingError;
        existingVersion = existing?.version ?? 1;
        existingSlug = existing?.publish_slug ?? null;
      }

      const nextVersion = publish ? existingVersion + (isNew ? 0 : 1) : existingVersion;
      const publishSlug = publish ? (existingSlug ?? generatePublishSlug(cleanTitle, activeFormId)) : existingSlug;
      const publishLink = publishSlug ? `${window.location.origin}/apply/${publishSlug}` : null;
      const publishedAt = publish ? new Date().toISOString() : null;

      if (isNew) {
        const { data: inserted, error: insertError } = await supabase
          .from("forms")
          .insert({
            workspace_id: workspaceId,
            name: cleanTitle,
            description: cleanDescription || null,
            deadline: deadline || null,
            status: publish ? "open" : "draft",
            published_at: publishedAt,
            publish_slug: publishSlug,
            publish_link: publishLink,
            version: nextVersion,
          })
          .select("id")
          .single();
        if (insertError) throw insertError;
        activeFormId = inserted?.id ?? null;
      } else if (formId) {
        const { error: updateError } = await supabase
          .from("forms")
          .update({
            name: cleanTitle,
            description: cleanDescription || null,
            deadline: deadline || null,
            status: publish ? "open" : "draft",
            published_at: publish ? publishedAt : undefined,
            publish_slug: publish ? publishSlug : undefined,
            publish_link: publish ? publishLink : undefined,
            version: publish ? nextVersion : existingVersion,
          })
          .eq("id", formId)
          .eq("workspace_id", workspaceId);
        if (updateError) throw updateError;
      }

      if (!activeFormId) return;

      const { error: deleteError } = await supabase.from("form_questions").delete().eq("form_id", activeFormId);
      if (deleteError) throw deleteError;
      if (questions.length > 0) {
        const { error: questionInsertError } = await supabase.from("form_questions").insert(
          questions.map((q, index) => ({
            form_id: activeFormId,
            sort_order: index,
            type: q.type,
            label: q.label,
            required: q.required,
            description: q.description || null,
            options: serializeQuestionOptions(q),
            version: publish ? nextVersion : existingVersion,
          })),
        );
        if (questionInsertError) throw questionInsertError;
      }

      await queryClient.invalidateQueries({ queryKey: ["forms", workspaceId] });
      if (isNew) {
        navigate(`/accelerator/applications/forms/${activeFormId}/builder`, { replace: true });
      }
      return { publish };
    },
    onSuccess: (result) => {
      const published = result?.publish ?? false;
      setIsDraft(!published);
      toast({
        title: published ? "Form published" : "Draft saved",
        description: published
          ? "Your form is now live and ready to accept responses."
          : "Your changes were saved as draft.",
      });
    },
    onError: (error) => {
      toast({
        title: "Could not save form",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const addQuestion = (type: QuestionType) => {
    const id = `q${counter++}`;
    const q: Question = {
      id,
      type,
      label: type === "section_header" ? "New Section" : "Untitled Question",
      required: false,
      description: "",
      options: type === "multiple_choice" || type === "dropdown" ? ["Option 1", "Option 2"] : undefined,
      conditional: null,
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
  const selectedIndex = useMemo(
    () => questions.findIndex((q) => q.id === selectedQ?.id),
    [questions, selectedQ?.id],
  );
  const conditionalSourceQuestions = useMemo(
    () =>
      selectedIndex <= 0
        ? []
        : questions.slice(0, selectedIndex).filter((q) => q.type !== "section_header"),
    [questions, selectedIndex],
  );
  const selectedConditionalSource = useMemo(
    () => conditionalSourceQuestions.find((q) => q.id === selectedQ?.conditional?.sourceQuestionId),
    [conditionalSourceQuestions, selectedQ?.conditional?.sourceQuestionId],
  );
  const selectedConditionalValues = useMemo(
    () => getQuestionValueOptions(selectedConditionalSource),
    [selectedConditionalSource],
  );

  const serializeQuestionOptions = (question: Question) => {
    const payload: Record<string, unknown> = {};
    if ((question.type === "multiple_choice" || question.type === "dropdown") && question.options?.length) {
      payload.items = question.options;
    }
    if (
      question.conditional?.sourceQuestionId &&
      question.conditional?.value &&
      question.conditional.value.trim().length > 0
    ) {
      payload.conditional = {
        sourceQuestionId: question.conditional.sourceQuestionId,
        value: question.conditional.value,
      };
    }
    return Object.keys(payload).length ? payload : null;
  };

  const isPreviewQuestionVisible = (question: Question) => {
    if (!question.conditional?.sourceQuestionId) return true;
    return previewAnswers[question.conditional.sourceQuestionId] === question.conditional.value;
  };

  useEffect(() => {
    if (isPreviewOpen) {
      setPreviewAnswers({});
    }
  }, [isPreviewOpen]);

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
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="h-3 w-3" /> Preview
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs gap-1 bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => {
              saveMutation.mutate(true);
            }}
            disabled={saveMutation.isPending || !title.trim()}
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
              <span>Conditional logic available in settings</span>
            </div>
          </div>
        </div>

        {/* Center: Form canvas */}
        <div className="flex-1 overflow-auto bg-muted/30 p-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="mb-6">
              <Input
                className="text-lg font-semibold border-none bg-transparent px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Form Title"
              />
              <Input
                className="text-sm text-muted-foreground border-none bg-transparent px-0 h-auto mt-1 focus-visible:ring-0 placeholder:text-muted-foreground/60"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
              />
              <div className="pt-3 max-w-xs">
                <Label className="text-xs text-muted-foreground">Close date (optional)</Label>
                <Input
                  type="date"
                  className="mt-1 h-8 text-sm"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
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
                          {q.conditional?.sourceQuestionId && q.conditional.value && (
                            <p className="text-[11px] text-muted-foreground mt-1">
                              Visible when{" "}
                              <span className="font-medium">
                                {questions.find((item) => item.id === q.conditional?.sourceQuestionId)?.label ?? "question"}
                              </span>{" "}
                              is <span className="font-medium">{q.conditional.value}</span>
                            </p>
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
            {questions.length === 0 && (
              <Card className="shadow-sm border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground text-sm">
                  Add question blocks from the left panel to build this form.
                </CardContent>
              </Card>
            )}
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Conditional Logic</Label>
                      <Switch
                        checked={Boolean(selectedQ.conditional)}
                        onCheckedChange={(enabled) => {
                          updateQuestion(selectedQ.id, {
                            conditional: enabled ? { sourceQuestionId: "", value: "" } : null,
                          });
                        }}
                      />
                    </div>
                    {selectedQ.conditional && (
                      <div className="space-y-2">
                        <Select
                          value={selectedQ.conditional.sourceQuestionId}
                          onValueChange={(value) =>
                            updateQuestion(selectedQ.id, {
                              conditional: { sourceQuestionId: value, value: "" },
                            })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select source question" />
                          </SelectTrigger>
                          <SelectContent>
                            {conditionalSourceQuestions.map((q) => (
                              <SelectItem key={q.id} value={q.id} className="text-xs">
                                {q.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {selectedQ.conditional.sourceQuestionId && (
                          selectedConditionalValues ? (
                            <Select
                              value={selectedQ.conditional.value}
                              onValueChange={(value) =>
                                updateQuestion(selectedQ.id, {
                                  conditional: {
                                    sourceQuestionId: selectedQ.conditional?.sourceQuestionId ?? "",
                                    value,
                                  },
                                })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Show this question when..." />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedConditionalValues.map((value) => (
                                  <SelectItem key={value} value={value} className="text-xs">
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              className="h-8 text-xs"
                              placeholder="Show when answer equals..."
                              value={selectedQ.conditional.value}
                              onChange={(e) =>
                                updateQuestion(selectedQ.id, {
                                  conditional: {
                                    sourceQuestionId: selectedQ.conditional?.sourceQuestionId ?? "",
                                    value: e.target.value,
                                  },
                                })}
                            />
                          )
                        )}
                      </div>
                    )}
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
      <div className="h-10 border-t px-4 flex items-center justify-end bg-card">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => saveMutation.mutate(false)}
          disabled={saveMutation.isPending || isLoading || !title.trim()}
        >
          Save Draft
        </Button>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title || "Untitled Form"}</DialogTitle>
            <DialogDescription>
              {description || "This is how applicants will see your form."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {questions.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-6 text-sm text-muted-foreground text-center">
                  No questions yet. Add question blocks to preview your form.
                </CardContent>
              </Card>
            ) : (
              questions.filter(isPreviewQuestionVisible).map((q) => (
                <Card key={`preview-${q.id}`} className="shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    {q.type === "section_header" ? (
                      <h3 className="text-base font-semibold">{q.label}</h3>
                    ) : (
                      <>
                        <div>
                          <Label className="text-sm font-medium">
                            {q.label}
                            {q.required && <span className="text-destructive ml-1">*</span>}
                          </Label>
                          {q.description && (
                            <p className="text-xs text-muted-foreground mt-1">{q.description}</p>
                          )}
                        </div>

                        {q.type === "short_text" && (
                          <Input
                            placeholder="Short answer"
                            value={previewAnswers[q.id] ?? ""}
                            onChange={(e) => setPreviewAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                          />
                        )}
                        {q.type === "long_text" && (
                          <Textarea
                            placeholder="Long answer"
                            rows={4}
                            value={previewAnswers[q.id] ?? ""}
                            onChange={(e) => setPreviewAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                          />
                        )}
                        {q.type === "number" && (
                          <Input
                            type="number"
                            placeholder="0"
                            value={previewAnswers[q.id] ?? ""}
                            onChange={(e) => setPreviewAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                          />
                        )}
                        {q.type === "file_upload" && (
                          <div className="h-24 rounded-md border border-dashed flex items-center justify-center text-xs text-muted-foreground">
                            Upload area
                          </div>
                        )}
                        {q.type === "yes_no" && (
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={previewAnswers[q.id] === "Yes" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPreviewAnswers((prev) => ({ ...prev, [q.id]: "Yes" }))}
                            >
                              Yes
                            </Button>
                            <Button
                              type="button"
                              variant={previewAnswers[q.id] === "No" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPreviewAnswers((prev) => ({ ...prev, [q.id]: "No" }))}
                            >
                              No
                            </Button>
                          </div>
                        )}
                        {(q.type === "multiple_choice" || q.type === "dropdown") && (
                          <Select
                            value={previewAnswers[q.id] ?? ""}
                            onValueChange={(value) => setPreviewAnswers((prev) => ({ ...prev, [q.id]: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              {(q.options ?? []).map((opt, index) => (
                                <SelectItem key={`${q.id}-${index}`} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
