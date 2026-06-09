import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { apiFetch } from "@/lib/api";
import { LayoutDashboard, FileText, Images, LogOut, Menu, X, ExternalLink } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    apiFetch("/admin/me")
      .then((r) => r.json())
      .then((data: any) => {
        if (!data.isAdmin) setLocation("/admin/login");
        else setChecking(false);
      })
      .catch(() => setLocation("/admin/login"));
  }, [setLocation]);

  const handleLogout = async () => {
    await apiFetch("/admin/logout", { method: "POST" });
    setLocation("/admin/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-white/50">Verificando acesso...</div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/blog", label: "Blog", icon: FileText },
    { href: "/admin/gallery", label: "Galeria", icon: Images },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#111] z-30 transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="p-6 border-b border-white/10">
          <img src="/fapex-logo-nobg.png" alt="Fapex" className="h-14" />
          <p className="text-white/40 text-xs mt-2 uppercase tracking-wider">Admin</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location === href
                  ? "bg-green-600 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Ver Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold text-gray-800">Fapex Admin</span>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
