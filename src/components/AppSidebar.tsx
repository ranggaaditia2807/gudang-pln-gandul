import { 
  Home, 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  FileText,
  Building2
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Beranda", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Manajemen Gudang", url: "/warehouse", icon: Package },
  { title: "Transaksi", url: "/transactions", icon: ArrowLeftRight },
  { title: "Laporan", url: "/reports", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-gradient-primary">
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-white font-bold text-lg">PLN</h2>
                <p className="text-white/80 text-xs">UPT Gandul</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="text-white/80 text-xs font-medium px-4 mb-2">
            {!collapsed && "MENU NAVIGASI"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={`mx-2 rounded-lg transition-all duration-200 ${
                      isActive(item.url) 
                        ? "bg-white/20 text-white font-medium shadow-medium" 
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}