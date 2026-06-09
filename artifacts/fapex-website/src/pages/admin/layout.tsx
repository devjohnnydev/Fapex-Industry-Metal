import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { apiFetch } from "@/lib/api";
import {
  LayoutDashboard, FileText, Images, LogOut,
  Menu, ExternalLink, ChevronRight,
} from "lucide-react";

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
        <div className="flex items-center gap-3 text-white/40">
          <div className="h-5 w-5 border-2 border-white/20 border-t-green-500 rounded-full animate-spin" />
          Verificando acesso...
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/blog", label: "Blog", icon: FileText },
    { href: "/admin/gallery", label: "Galeria", icon: Images },
  ];

  const isActive = (href: string) =>
    href === "/admin" ? location === "/admin" : location.startsWith(href);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-[#111] z-30
          flex flex-col
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 shrink-0">
          <img src="/fapex-logo-nobg.png" alt="Fapex" className="h-12 w-auto" />
          <span className="mt-2 block text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
            Admin
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-all duration-150
                  ${active
                    ? "bg-green-600 text-white shadow-lg shadow-green-900/30"
                    : "text-white/55 hover:text-white hover:bg-white/6"
                  }
                `}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-white/8 shrink-0 space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/45 hover:text-white hover:bg-white/6 transition-all"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            Ver Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-300 hover:bg-red-900/20 transition-all"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sair
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile header */}
        <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-4 lg:hidden shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <img src="/fapex-logo-nobg.png" alt="Fapex" className="h-8 w-auto" style={{ filter: "invert(1)" }} />
          <span className="font-semibold text-gray-800 text-sm">Admin</span>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
