import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useRole } from "@/contexts/RoleContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type InviteRole = "program_manager" | "mentor";

export default function InviteUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { workspaceId, isLoading: isWorkspaceLoading } = useWorkspace();
  const { role: currentRole } = useRole();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<InviteRole>("mentor");

  const inviteMutation = useMutation({
    mutationFn: async () => {
      if (!supabase) throw new Error("Supabase is not configured.");
      if (!workspaceId) throw new Error("No active workspace selected.");
      if (!name.trim() || !email.trim()) throw new Error("Name and email are required.");

      const invitedEmail = email.trim().toLowerCase();

      const { error: memberError } = await supabase.from("team_members").upsert(
        {
          workspace_id: workspaceId,
          name: name.trim(),
          email: invitedEmail,
          role: inviteRole,
          status: "invited",
        },
        { onConflict: "workspace_id,email" },
      );
      if (memberError) throw memberError;

      // If this email already has an account, activate access immediately.
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", invitedEmail)
        .maybeSingle();
      if (profileError) throw profileError;

      if (profile?.id) {
        const { error: roleError } = await supabase.from("user_roles").upsert(
          {
            user_id: profile.id,
            workspace_id: workspaceId,
            role: inviteRole,
          },
          { onConflict: "user_id,workspace_id" },
        );
        if (roleError) throw roleError;

        const { error: activateError } = await supabase
          .from("team_members")
          .update({ status: "active", role: inviteRole })
          .eq("workspace_id", workspaceId)
          .eq("email", invitedEmail);
        if (activateError) throw activateError;
      }

      return { invitedEmail, existingUser: !!profile?.id };
    },
    onSuccess: ({ invitedEmail, existingUser }) => {
      queryClient.invalidateQueries({ queryKey: ["team-members", workspaceId] });
      toast({
        title: existingUser ? "User access granted" : "Invite created",
        description: existingUser
          ? `${invitedEmail} was added to this workspace.`
          : `${invitedEmail} is now listed as invited in team members.`,
      });
      setName("");
      setEmail("");
      setInviteRole("mentor");
      navigate("/accelerator/settings");
    },
    onError: (error) => {
      toast({
        title: "Invite failed",
        description: error instanceof Error ? error.message : "Could not send invite.",
        variant: "destructive",
      });
    },
  });

  if (currentRole !== "admin") {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Only admins can invite users.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/accelerator/settings")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Invite User</h1>
          <p className="text-sm text-muted-foreground">Add a team member and assign role access.</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Invitation Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs">Name</Label>
            <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Email</Label>
            <Input className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>
          <div>
            <Label className="text-xs">Role</Label>
            <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as InviteRole)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="program_manager">Program Manager</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
            onClick={() => inviteMutation.mutate()}
            disabled={inviteMutation.isPending || isWorkspaceLoading || !workspaceId || !name.trim() || !email.trim()}
          >
            <Send className="h-4 w-4" />
            Send Invite
          </Button>
          {!workspaceId && (
            <p className="text-xs text-destructive">No active workspace selected. Refresh and try again.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
