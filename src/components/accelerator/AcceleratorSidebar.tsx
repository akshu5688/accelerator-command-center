import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import { WorkspaceSelector } from "./WorkspaceSelector";
import { RoleSwitcher } from "./RoleSwitcher";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Inbox,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/accelerator/dashboard", icon: LayoutDashboard, roles: ["admin", "program_manager", "mentor", "founder"] as const },
  { title: "Cohorts", url: "/accelerator/cohorts", icon: Users, roles: ["admin", "program_manager", "mentor"] as const },
  { title: "Applications", url: "/accelerator/applications", icon: Inbox, roles: ["admin", "program_manager", "mentor"] as const },
  { title: "Templates", url: "/accelerator/templates", icon: FileText, roles: ["admin", "program_manager"] as const },
  { title: "Settings", url: "/accelerator/settings", icon: Settings, roles: ["admin"] as const },
];

export function AcceleratorSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { role } = useRole();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {!collapsed && <WorkspaceSelector />}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Accelerator</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems
                .filter((item) => (item.roles as readonly string[]).includes(role))
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-sidebar-accent"
                        activeClassName="bg-sidebar-accent text-accent"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {!collapsed && <RoleSwitcher />}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-sidebar-border">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">EERA</p>
            <p className="text-[10px] text-muted-foreground">Founder OS · Accelerator</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
