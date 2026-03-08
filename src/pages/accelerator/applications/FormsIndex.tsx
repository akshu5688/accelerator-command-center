import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Copy, Archive, ExternalLink, FileText } from "lucide-react";

interface AppForm {
  id: string;
  name: string;
  status: "open" | "closed" | "draft" | "archived";
  responses: number;
  deadline: string;
  created: string;
  publishLink: string;
  version: number;
  publishedAt: string;
}

const statusStyles: Record<string, string> = {
  open: "bg-success/10 text-success",
  closed: "bg-muted text-muted-foreground",
  draft: "bg-warning/10 text-warning",
  archived: "bg-slate-200 text-slate-600",
};

export default function FormsIndex() {
  const [search, setSearch] = useState("");
  const { canAccess } = useRole();
  const { workspaceId } = useWorkspace();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: forms = [] } = useQuery({
    queryKey: ["forms", workspaceId],
    enabled: !!workspaceId && !!supabase,
    queryFn: async () => {
      if (!supabase || !workspaceId) return [];

      const [formsRes, appsRes] = await Promise.all([
        supabase.from("forms").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false }),
        supabase.from("applications").select("id, form_id").eq("workspace_id", workspaceId),
      ]);

      const appCounts = new Map<string, number>();
      for (const app of appsRes.data ?? []) {
        if (app.form_id) appCounts.set(app.form_id, (appCounts.get(app.form_id) ?? 0) + 1);
      }

      return (formsRes.data ?? []).map((f) => ({
        id: f.id,
        name: f.name,
        status: f.status as AppForm["status"],
        responses: appCounts.get(f.id) ?? 0,
        deadline: f.deadline ? new Date(f.deadline).toLocaleDateString() : "—",
        created: new Date(f.created_at).toLocaleDateString(),
        publishLink:
          f.publish_link ?? (f.publish_slug ? `${window.location.origin}/apply/${f.publish_slug}` : ""),
        version: f.version ?? 1,
        publishedAt: f.published_at ? new Date(f.published_at).toLocaleDateString() : "—",
      }));
    },
  });

  const setStatusMutation = useMutation({
    mutationFn: async ({ formId, status }: { formId: string; status: AppForm["status"] }) => {
      if (!supabase || !workspaceId) return;
      const { error } = await supabase
        .from("forms")
        .update({ status })
        .eq("workspace_id", workspaceId)
        .eq("id", formId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms", workspaceId] });
    },
  });

  const filtered = forms.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Application Forms</h1>
          <p className="text-sm text-muted-foreground">Manage application intake forms</p>
        </div>
        {canAccess(["admin", "program_manager"]) && (
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
            onClick={() => navigate("/accelerator/applications/forms/new/builder")}
          >
            <Plus className="h-4 w-4" />
            Create Form
          </Button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search forms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FileText className="h-8 w-8 mb-3 opacity-40" />
            <p className="text-sm font-medium">No forms found</p>
            <p className="text-xs mt-1">Create a new application form to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((form) => (
            <Card
              key={form.id}
              className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/accelerator/applications/forms/${form.id}/responses`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{form.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Created {form.created}</p>
                  </div>
                  <Badge className={`text-xs shrink-0 ml-2 ${statusStyles[form.status]}`}>
                    {form.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Responses</p>
                    <p className="text-lg font-bold">{form.responses}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="text-sm font-medium">{form.deadline}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  Version {form.version} • Published {form.publishedAt}
                </div>

                <div className="flex items-center gap-2 border-t pt-3" onClick={(e) => e.stopPropagation()}>
                  {form.publishLink && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 text-muted-foreground"
                      onClick={() => window.open(form.publishLink, "_blank", "noopener,noreferrer")}
                    >
                      <ExternalLink className="h-3 w-3" /> Link
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-muted-foreground"
                    onClick={async () => {
                      if (!form.publishLink) return;
                      await navigator.clipboard.writeText(form.publishLink);
                      toast({ title: "Link copied", description: "Publish link copied to clipboard." });
                    }}
                  >
                    <Copy className="h-3 w-3" /> Duplicate
                  </Button>
                  {form.status === "open" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 text-muted-foreground"
                      onClick={() => setStatusMutation.mutate({ formId: form.id, status: "closed" })}
                    >
                      Close
                    </Button>
                  ) : form.status === "closed" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 text-muted-foreground"
                      onClick={() => setStatusMutation.mutate({ formId: form.id, status: "open" })}
                    >
                      Reopen
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-muted-foreground"
                    onClick={() => setStatusMutation.mutate({ formId: form.id, status: "archived" })}
                  >
                    <Archive className="h-3 w-3" /> Archive
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
