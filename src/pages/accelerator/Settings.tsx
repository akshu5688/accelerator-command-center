import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRole } from "@/contexts/RoleContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Lock, Mail, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type SyncFrequency = "realtime" | "hourly" | "daily" | "weekly";
type AssignableRole = "program_manager" | "mentor";

export default function Settings() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workspaceId } = useWorkspace();
  const { role } = useRole();
  const [workspaceName, setWorkspaceName] = useState("");
  const [organization, setOrganization] = useState("");
  const [settings, setSettings] = useState({
    ai_risk_alerts: true,
    cohort_benchmarking: false,
    automated_review_reminders: true,
    document_auto_tagging: false,
    founder_financial_sync: true,
    sync_frequency: "daily" as SyncFrequency,
  });
  const isAdmin = role === "admin";
  const { data: workspace } = useQuery({
    queryKey: ["workspace", workspaceId],
    enabled: !!workspaceId && !!supabase,
    queryFn: async () => {
      if (!supabase || !workspaceId) return null;
      const { data } = await supabase.from("workspaces").select("*").eq("id", workspaceId).maybeSingle();
      return data;
    },
  });
  const { data: workspaceSettings } = useQuery({
    queryKey: ["workspace-settings", workspaceId],
    enabled: !!workspaceId && !!supabase,
    queryFn: async () => {
      if (!supabase || !workspaceId) return null;
      const { data } = await supabase
        .from("workspace_settings")
        .select("*")
        .eq("workspace_id", workspaceId)
        .maybeSingle();
      return data;
    },
  });
  useEffect(() => {
    if (workspace) {
      setWorkspaceName(workspace.name ?? "");
      setOrganization(workspace.organization ?? "");
    }
  }, [workspace]);
  useEffect(() => {
    if (workspaceSettings) {
      setSettings({
        ai_risk_alerts: workspaceSettings.ai_risk_alerts,
        cohort_benchmarking: workspaceSettings.cohort_benchmarking,
        automated_review_reminders: workspaceSettings.automated_review_reminders,
        document_auto_tagging: workspaceSettings.document_auto_tagging,
        founder_financial_sync: workspaceSettings.founder_financial_sync,
        sync_frequency: workspaceSettings.sync_frequency as SyncFrequency,
      });
    }
  }, [workspaceSettings]);
  const { data: teamMembers = [] } = useQuery({
    queryKey: ["team-members", workspaceId],
    enabled: !!workspaceId && !!supabase,
    queryFn: async () => {
      if (!supabase || !workspaceId) return [];
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: true });
      return data ?? [];
    },
  });
  const updateMemberRole = useMutation({
    mutationFn: async ({ email, nextRole }: { email: string; nextRole: AssignableRole }) => {
      if (!supabase || !workspaceId) return;
      const { data: profile } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
      await supabase
        .from("team_members")
        .update({ role: nextRole })
        .eq("workspace_id", workspaceId)
        .eq("email", email);
      if (profile?.id) {
        await supabase.from("user_roles").upsert(
          {
            workspace_id: workspaceId,
            user_id: profile.id,
            role: nextRole,
          },
          { onConflict: "user_id,workspace_id" },
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", workspaceId] });
      toast({ title: "Role updated", description: "Team role has been saved." });
    },
    onError: () => toast({ title: "Update failed", description: "Could not update role.", variant: "destructive" }),
  });
  const updateWorkspace = useMutation({
    mutationFn: async () => {
      if (!supabase || !workspaceId) return;
      await supabase
        .from("workspaces")
        .update({ name: workspaceName.trim(), organization: organization.trim() || null })
        .eq("id", workspaceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
      toast({ title: "Saved", description: "Workspace details updated." });
    },
    onError: () => toast({ title: "Save failed", description: "Could not save workspace details.", variant: "destructive" }),
  });
  const saveWorkspaceSettings = useMutation({
    mutationFn: async () => {
      if (!supabase || !workspaceId) return;
      await supabase.from("workspace_settings").upsert(
        {
          workspace_id: workspaceId,
          ...settings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "workspace_id" },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-settings", workspaceId] });
      toast({ title: "Settings saved", description: "Feature and sync settings updated." });
    },
    onError: () =>
      toast({
        title: "Save failed",
        description: "Could not save feature and sync settings.",
        variant: "destructive",
      }),
  });

  if (!isAdmin) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
        <Lock className="h-8 w-8 mb-3" />
        <p className="text-sm font-medium">Admin access required</p>
        <p className="text-xs mt-1">Contact your workspace admin for access.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Workspace configuration and team management</p>
      </div>

      {/* Workspace Info */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Workspace Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Workspace Name</Label>
              <Input
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Organization</Label>
              <Input
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs"
            onClick={() => updateWorkspace.mutate()}
            disabled={updateWorkspace.isPending || !workspaceName.trim()}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Roles & Permissions */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" /> Team & Roles
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1"
              onClick={() => navigate("/accelerator/settings/invite")}
            >
              <Mail className="h-3 w-3" /> Invite User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold">Name</TableHead>
                <TableHead className="text-xs font-semibold">Email</TableHead>
                <TableHead className="text-xs font-semibold">Role</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((m) => (
                <TableRow key={m.email}>
                  <TableCell className="text-sm font-medium">{m.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.email}</TableCell>
                  <TableCell>
                    {m.role === "admin" ? (
                      <Badge variant="outline" className="text-xs">Admin</Badge>
                    ) : (
                      <Select
                        value={m.role}
                        onValueChange={(v) => updateMemberRole.mutate({ email: m.email, nextRole: v as AssignableRole })}
                      >
                        <SelectTrigger className="h-7 text-xs w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="program_manager">Program Manager</SelectItem>
                          <SelectItem value="mentor">Mentor</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={m.status === "active" ? "outline" : "secondary"} className="text-xs">
                      {m.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {teamMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-xs text-muted-foreground py-4">
                    No team members yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Feature Toggles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              key: "ai_risk_alerts" as const,
              label: "AI Risk Alerts",
              description: "Automatically flag startups based on financial signals",
            },
            {
              key: "cohort_benchmarking" as const,
              label: "Cohort Benchmarking",
              description: "Compare startup performance across cohorts",
            },
            {
              key: "automated_review_reminders" as const,
              label: "Automated Review Reminders",
              description: "Send reminders for scheduled reviews",
            },
            {
              key: "document_auto_tagging" as const,
              label: "Document Auto-tagging",
              description: "Automatically tag uploaded documents by type",
            },
          ].map((toggle) => (
            <div key={toggle.key} className="flex items-center justify-between py-2">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{toggle.label}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{toggle.description}</p>
              </div>
              <Switch
                checked={settings[toggle.key]}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, [toggle.key]: checked }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Sync */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Data Sync Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Founder Financial Sync</p>
              <p className="text-xs text-muted-foreground">Automatically sync structured financial data from founder workspaces</p>
            </div>
            <Switch
              checked={settings.founder_financial_sync}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, founder_financial_sync: checked }))}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Sync Frequency</p>
              <p className="text-xs text-muted-foreground">How often to pull latest data</p>
            </div>
            <Select
              value={settings.sync_frequency}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, sync_frequency: value as SyncFrequency }))}
            >
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="pt-2">
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs"
              onClick={() => saveWorkspaceSettings.mutate()}
              disabled={saveWorkspaceSettings.isPending}
            >
              Save Platform Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
