import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "dropdown"
  | "file_upload"
  | "number"
  | "yes_no"
  | "section_header";

type FormQuestion = {
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
};

function parseOptions(raw: unknown): {
  items?: string[];
  conditional?: { sourceQuestionId: string; value: string };
} {
  if (Array.isArray(raw)) {
    return { items: raw.filter((item): item is string => typeof item === "string") };
  }
  if (raw && typeof raw === "object") {
    const record = raw as Record<string, unknown>;
    const items = Array.isArray(record.items)
      ? record.items.filter((item): item is string => typeof item === "string")
      : undefined;
    const conditional = record.conditional as Record<string, unknown> | undefined;
    if (conditional && typeof conditional.sourceQuestionId === "string" && typeof conditional.value === "string") {
      return { items, conditional: { sourceQuestionId: conditional.sourceQuestionId, value: conditional.value } };
    }
    return { items };
  }
  return {};
}

export default function PublicForm() {
  const { publishSlug } = useParams();
  const { toast } = useToast();
  const [applicantName, setApplicantName] = useState("");
  const [startupName, setStartupName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: formData, isLoading } = useQuery({
    queryKey: ["public-form", publishSlug],
    enabled: !!publishSlug && !!supabase,
    queryFn: async () => {
      if (!supabase || !publishSlug) return null;
      const { data: form } = await supabase
        .from("forms")
        .select("*")
        .eq("publish_slug", publishSlug)
        .eq("status", "open")
        .maybeSingle();
      if (!form) return null;

      const { data: questions } = await supabase
        .from("form_questions")
        .select("*")
        .eq("form_id", form.id)
        .order("sort_order", { ascending: true });

      const mapped: FormQuestion[] = (questions ?? []).map((q) => ({
        id: q.id,
        type: q.type as QuestionType,
        label: q.label,
        required: q.required,
        description: q.description ?? "",
        options: parseOptions(q.options).items,
        conditional: parseOptions(q.options).conditional ?? null,
      }));
      return { form, questions: mapped };
    },
  });

  const visibleQuestions = useMemo(() => {
    const all = formData?.questions ?? [];
    return all.filter((q) => {
      if (!q.conditional?.sourceQuestionId) return true;
      return answers[q.conditional.sourceQuestionId] === q.conditional.value;
    });
  }, [formData?.questions, answers]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!supabase || !formData?.form) return;
      if (!applicantName.trim() || !startupName.trim()) {
        throw new Error("Applicant and startup name are required.");
      }
      for (const question of visibleQuestions) {
        if (question.type !== "section_header" && question.required && !(answers[question.id] ?? "").trim()) {
          throw new Error(`Please answer required question: ${question.label}`);
        }
      }

      const { error } = await supabase.from("applications").insert({
        workspace_id: formData.form.workspace_id,
        form_id: formData.form.id,
        applicant_name: applicantName.trim(),
        startup_name: startupName.trim(),
        email: email.trim() || null,
        status: "applied",
        stage: "Applied",
        payload: { answers },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Application submitted", description: "Your response has been recorded." });
      setApplicantName("");
      setStartupName("");
      setEmail("");
      setAnswers({});
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div className="min-h-screen p-8 text-sm text-muted-foreground">Loading form...</div>;
  }

  if (!formData?.form) {
    return <div className="min-h-screen p-8 text-sm text-muted-foreground">This form is unavailable.</div>;
  }

  return (
    <div className="min-h-screen bg-muted/20 p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <Card>
          <CardContent className="p-6 space-y-3">
            <h1 className="text-2xl font-semibold">{formData.form.name}</h1>
            {formData.form.description && <p className="text-sm text-muted-foreground">{formData.form.description}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label>Applicant Name *</Label>
              <Input className="mt-1" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} />
            </div>
            <div>
              <Label>Startup Name *</Label>
              <Input className="mt-1" value={startupName} onChange={(e) => setStartupName(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input className="mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {visibleQuestions.map((q) => (
          <Card key={q.id}>
            <CardContent className="p-6 space-y-3">
              {q.type === "section_header" ? (
                <h3 className="text-lg font-semibold">{q.label}</h3>
              ) : (
                <>
                  <div>
                    <Label>
                      {q.label} {q.required ? "*" : ""}
                    </Label>
                    {q.description && <p className="text-xs text-muted-foreground mt-1">{q.description}</p>}
                  </div>
                  {q.type === "short_text" && (
                    <Input value={answers[q.id] ?? ""} onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))} />
                  )}
                  {q.type === "long_text" && (
                    <Textarea rows={4} value={answers[q.id] ?? ""} onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))} />
                  )}
                  {q.type === "number" && (
                    <Input type="number" value={answers[q.id] ?? ""} onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))} />
                  )}
                  {q.type === "yes_no" && (
                    <div className="flex gap-2">
                      <Button type="button" variant={answers[q.id] === "Yes" ? "default" : "outline"} onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: "Yes" }))}>Yes</Button>
                      <Button type="button" variant={answers[q.id] === "No" ? "default" : "outline"} onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: "No" }))}>No</Button>
                    </div>
                  )}
                  {(q.type === "multiple_choice" || q.type === "dropdown") && (
                    <Select value={answers[q.id] ?? ""} onValueChange={(value) => setAnswers((prev) => ({ ...prev, [q.id]: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {(q.options ?? []).map((opt) => (
                          <SelectItem key={`${q.id}-${opt}`} value={opt}>
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
        ))}

        <div className="flex justify-end">
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => submitMutation.mutate()}
            disabled={submitMutation.isPending}
          >
            Submit Application
          </Button>
        </div>
      </div>
    </div>
  );
}
