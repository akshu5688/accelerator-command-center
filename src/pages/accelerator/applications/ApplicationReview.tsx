import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useNavigate, useParams } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import {
  ArrowLeft, Brain, CheckCircle, AlertTriangle, XCircle, Sparkles,
  Clock, Tag, MessageSquare, ArrowUpRight, Lock,
} from "lucide-react";

const applicationData = {
  id: "a1",
  applicantName: "James Okafor",
  startupName: "PayStack Lite",
  email: "james@paystack-lite.com",
  industry: "FinTech",
  stage: "Seed",
  revenue: "$45K MRR",
  teamSize: 8,
  dateApplied: "Mar 1, 2026",
  status: "shortlisted" as const,
  sections: [
    {
      title: "Founder Information",
      answers: [
        { question: "Full Name", answer: "James Okafor" },
        { question: "Email Address", answer: "james@paystack-lite.com" },
        { question: "Startup Name", answer: "PayStack Lite" },
        { question: "Industry", answer: "FinTech" },
      ],
    },
    {
      title: "Traction & Financials",
      answers: [
        { question: "Monthly Revenue (USD)", answer: "$45,000" },
        { question: "Stage", answer: "Seed" },
        { question: "What problem are you solving?", answer: "Small businesses in Africa lose 15-20% of revenue to payment processing friction. PayStack Lite simplifies merchant onboarding and reduces transaction costs by 40% through direct bank integration and mobile money rails." },
        { question: "Pitch Deck", answer: "paystack-lite-deck-2026.pdf" },
      ],
    },
    {
      title: "Team & Vision",
      answers: [
        { question: "Team Size", answer: "8 (4 engineers, 2 ops, 1 design, 1 BD)" },
        { question: "Previous Exits", answer: "Co-founder previously built and sold PayMerchant (acqui-hired by GTBank)" },
        { question: "12-month goal", answer: "Reach $150K MRR and expand to 3 new markets (Kenya, Tanzania, Rwanda)" },
      ],
    },
  ],
  ai: {
    summary: "PayStack Lite is a payment infrastructure startup targeting African SMBs. Strong founder-market fit with previous fintech exit. Clear traction with $45K MRR and growing. Well-defined expansion strategy. Team appears technically capable with strong engineering ratio.",
    strengths: [
      "Strong founder with previous exit in same domain",
      "Clear product-market fit with measurable traction",
      "$45K MRR demonstrates real demand",
      "Well-defined expansion roadmap",
    ],
    risks: [
      "Payment infrastructure is heavily regulated across African markets",
      "Competition from established players (Flutterwave, Paystack)",
      "Cross-border expansion introduces FX complexity",
    ],
    fitRating: "strong" as const,
    suggestedDecision: "Recommend shortlisting. Strong team, clear traction, and domain expertise. Regulatory risk should be explored in interview stage.",
    confidence: 0.87,
  },
  reviewHistory: [
    { date: "Mar 2, 2026", reviewer: "Sarah K.", action: "Moved to Screening", notes: "Strong application. Clear traction." },
    { date: "Mar 3, 2026", reviewer: "Ahmed M.", action: "Scored 8.2", notes: "Excellent founder background. Revenue is solid for stage." },
    { date: "Mar 3, 2026", reviewer: "Sarah K.", action: "Moved to Shortlisted", notes: "Agreed with Ahmed. Worth interviewing." },
  ],
};

const stageColors: Record<string, string> = {
  applied: "bg-muted text-muted-foreground",
  screening: "bg-accent/10 text-accent",
  shortlisted: "bg-accent/20 text-accent",
  interview: "bg-primary/10 text-foreground",
  accepted: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

export default function ApplicationReview() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { role, canAccess } = useRole();
  const [score, setScore] = useState([8]);
  const [recommendation, setRecommendation] = useState("shortlist");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>(["Strong Team"]);

  const canReview = canAccess(["admin", "program_manager", "mentor"]);

  const tagOptions = ["Risk", "Strong Team", "Weak Traction", "Great Market", "Regulatory Concern", "Strong Revenue"];

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Left: Application responses */}
      <div className="flex-1 overflow-auto border-r">
        <div className="p-6 space-y-6 max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold">{applicationData.startupName}</h1>
                <Badge className={`text-xs capitalize ${stageColors[applicationData.status]}`}>{applicationData.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{applicationData.applicantName} · {applicationData.industry} · Applied {applicationData.dateApplied}</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Revenue", value: applicationData.revenue },
              { label: "Stage", value: applicationData.stage },
              { label: "Team", value: `${applicationData.teamSize} people` },
              { label: "Industry", value: applicationData.industry },
            ].map((stat) => (
              <Card key={stat.label} className="shadow-sm">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-sm font-semibold mt-0.5">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sections */}
          {applicationData.sections.map((section) => (
            <Card key={section.title} className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {section.answers.map((a) => (
                  <div key={a.question}>
                    <p className="text-xs font-medium text-muted-foreground">{a.question}</p>
                    <p className="text-sm mt-0.5">{a.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Stage change history */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" /> Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {applicationData.reviewHistory.map((entry, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{entry.reviewer}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{entry.date}</span>
                      </div>
                      <p className="text-sm font-medium">{entry.action}</p>
                      {entry.notes && <p className="text-xs text-muted-foreground mt-0.5">{entry.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right: Review panel */}
      <div className="w-96 overflow-auto bg-card shrink-0">
        <div className="p-5 space-y-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Review Panel</p>

          {/* AI Analysis */}
          <Card className="shadow-sm border-accent/20 bg-accent/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" /> AI Analysis
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="text-[10px] bg-success/10 text-success">{applicationData.ai.fitRating} fit</Badge>
                <span className="text-[10px] text-muted-foreground">{Math.round(applicationData.ai.confidence * 100)}% confidence</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Summary</p>
                <p className="text-xs leading-relaxed">{applicationData.ai.summary}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-success" /> Strengths
                </p>
                <ul className="space-y-1">
                  {applicationData.ai.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                      <span className="text-success mt-0.5">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-warning" /> Risks
                </p>
                <ul className="space-y-1">
                  {applicationData.ai.risks.map((r, i) => (
                    <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                      <span className="text-warning mt-0.5">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-2 rounded-md bg-accent/10 border border-accent/20">
                <p className="text-xs font-medium text-accent flex items-center gap-1">
                  <Brain className="h-3 w-3" /> Suggested Decision
                </p>
                <p className="text-xs mt-1">{applicationData.ai.suggestedDecision}</p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Reviewer controls */}
          {canReview ? (
            <>
              {/* Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium">Score</p>
                  <span className="text-lg font-bold">{score[0]}</span>
                </div>
                <Slider value={score} onValueChange={setScore} min={1} max={10} step={0.5} className="w-full" />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>1</span><span>5</span><span>10</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <Tag className="h-3 w-3" /> Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tagOptions.map((tag) => (
                    <Badge
                      key={tag}
                      variant={tags.includes(tag) ? "default" : "outline"}
                      className={`text-xs cursor-pointer ${tags.includes(tag) ? "bg-accent text-accent-foreground" : ""}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Red flags */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <XCircle className="h-3 w-3 text-destructive" /> Red Flags
                </p>
                <Textarea placeholder="Note any red flags..." className="text-sm min-h-[60px]" />
              </div>

              {/* Internal notes */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> Internal Notes
                </p>
                <Textarea
                  placeholder="Add review notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="text-sm min-h-[80px]"
                />
              </div>

              {/* Recommendation */}
              <div>
                <p className="text-xs font-medium mb-2">Recommendation</p>
                <Select value={recommendation} onValueChange={setRecommendation}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accept">Accept</SelectItem>
                    <SelectItem value="shortlist">Shortlist</SelectItem>
                    <SelectItem value="interview">Move to Interview</SelectItem>
                    <SelectItem value="reject">Reject</SelectItem>
                    <SelectItem value="hold">Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-1">
                  <CheckCircle className="h-4 w-4" /> Submit Review
                </Button>
                {(applicationData.status as string) === "accepted" && (
                  <Button variant="outline" className="w-full gap-1">
                    <ArrowUpRight className="h-4 w-4" /> Promote to Cohort
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Lock className="h-5 w-5 mb-2" />
              <p className="text-sm font-medium">Review restricted</p>
              <p className="text-xs mt-1">You don't have permission to review applications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
