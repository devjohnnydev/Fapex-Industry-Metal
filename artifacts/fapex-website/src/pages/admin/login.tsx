import { useState } from "react";
import { useLocation, Link } from "wouter";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/admin/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setLocation("/admin");
      } else {
        const data = await res.json();
        setError(data.error ?? "Senha incorreta");
      }
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <img src="/fapex-logo-nobg.png" alt="Fapex" className="h-28 mb-4" />
          <h1 className="text-white text-xl font-bold">Área Administrativa</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password" className="text-white/70 text-sm mb-1 block">
              Senha de Acesso
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              data-testid="input-password"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 text-white"
            data-testid="button-login"
          >
            <Lock className="h-4 w-4 mr-2" />
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          
          <div className="mt-6 pt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Voltar para o site
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
