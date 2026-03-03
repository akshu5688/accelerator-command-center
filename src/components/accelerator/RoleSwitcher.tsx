import { useRole, UserRole } from "@/contexts/RoleContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roles: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "program_manager", label: "Program Manager" },
  { value: "mentor", label: "Mentor" },
  { value: "founder", label: "Founder" },
];

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  return (
    <div className="px-4 py-2 border-t border-sidebar-border">
      <p className="text-xs text-muted-foreground mb-1 font-medium">Viewing as</p>
      <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roles.map((r) => (
            <SelectItem key={r.value} value={r.value} className="text-xs">
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
