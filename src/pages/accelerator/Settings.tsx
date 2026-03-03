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
import { Lock, Mail, Shield } from "lucide-react";

const teamMembers = [
  { name: "Sarah Khan", email: "sarah@eera.io", role: "Admin", status: "active" },
  { name: "Ahmed Mohamed", email: "ahmed@eera.io", role: "Program Manager", status: "active" },
  { name: "David Lee", email: "david@eera.io", role: "Mentor", status: "active" },
  { name: "Lisa Wang", email: "lisa@eera.io", role: "Mentor", status: "active" },
  { name: "Omar Hassan", email: "omar@eera.io", role: "Program Manager", status: "invited" },
];

export default function Settings() {
  const { role } = useRole();
  const isAdmin = role === "admin";

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
              <Input defaultValue="TechStars MENA" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Organization</Label>
              <Input defaultValue="TechStars International" className="mt-1" />
            </div>
          </div>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Roles & Permissions */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" /> Team & Roles
            </CardTitle>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
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
                    <Select defaultValue={m.role.toLowerCase().replace(" ", "_")}>
                      <SelectTrigger className="h-7 text-xs w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="program_manager">Program Manager</SelectItem>
                        <SelectItem value="mentor">Mentor</SelectItem>
                        <SelectItem value="founder">Founder</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={m.status === "active" ? "outline" : "secondary"} className="text-xs">
                      {m.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
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
            { label: "AI Risk Alerts", description: "Automatically flag startups based on financial signals", enabled: true, comingSoon: true },
            { label: "Cohort Benchmarking", description: "Compare startup performance across cohorts", enabled: false, comingSoon: true },
            { label: "Automated Review Reminders", description: "Send reminders for scheduled reviews", enabled: true, comingSoon: false },
            { label: "Document Auto-tagging", description: "Automatically tag uploaded documents by type", enabled: false, comingSoon: false },
          ].map((toggle) => (
            <div key={toggle.label} className="flex items-center justify-between py-2">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{toggle.label}</p>
                  {toggle.comingSoon && <Badge variant="outline" className="text-[10px]">Coming Soon</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{toggle.description}</p>
              </div>
              <Switch checked={toggle.enabled} disabled={toggle.comingSoon} />
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
            <Switch checked={true} />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Sync Frequency</p>
              <p className="text-xs text-muted-foreground">How often to pull latest data</p>
            </div>
            <Select defaultValue="daily">
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
        </CardContent>
      </Card>
    </div>
  );
}
