import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AcceleratorSidebar } from "./AcceleratorSidebar";
import { useRole } from "@/contexts/RoleContext";
import { Badge } from "@/components/ui/badge";

const roleLabels: Record<string, string> = {
  admin: "Admin",
  program_manager: "Program Manager",
  mentor: "Mentor",
};

export function AcceleratorLayout() {
  const { role } = useRole();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AcceleratorSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between border-b px-4 bg-card">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="text-sm font-semibold text-foreground">EERA Accelerator</span>
            </div>
            <Badge variant="outline" className="text-xs font-medium">
              {roleLabels[role]}
            </Badge>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
