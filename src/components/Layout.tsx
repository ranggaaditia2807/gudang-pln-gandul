import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useUser } from "@/contexts/UserContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useUser();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between border-b bg-card px-6 shadow-soft">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-xl font-semibold text-foreground">PLN UPT Gandul</h1>
                <p className="text-sm text-muted-foreground">Sistem Manajemen Gudang</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              ) : (
                <div className="text-right">
                  <p className="text-sm font-medium">Tamu</p>
                  <p className="text-xs text-muted-foreground">Silakan login</p>
                </div>
              )}
            </div>
          </header>
          <main className="flex-1 p-6 bg-secondary/20">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
