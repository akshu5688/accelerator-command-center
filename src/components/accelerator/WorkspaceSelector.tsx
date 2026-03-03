import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";

const workspaces = [
  { id: "ws-1", name: "TechStars MENA" },
  { id: "ws-2", name: "Flat6Labs Cairo" },
  { id: "ws-3", name: "500 Global Batch 32" },
];

export function WorkspaceSelector() {
  return (
    <div className="px-4 py-4">
      <Select defaultValue="ws-1">
        <SelectTrigger className="h-9 text-sm font-semibold border-none bg-sidebar-accent shadow-none">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-accent" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {workspaces.map((ws) => (
            <SelectItem key={ws.id} value={ws.id}>
              {ws.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
