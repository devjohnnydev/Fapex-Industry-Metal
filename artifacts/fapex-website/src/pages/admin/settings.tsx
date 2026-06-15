import { useState, useEffect, useCallback } from "react";
import AdminLayout from "./layout";
import { apiFetch, apiJson } from "@/lib/api";
import {
  Settings, Mail, Phone, MapPin, Globe, Save, Check,
  Instagram, Facebook, Linkedin, MessageCircle,
  Building2, FileText, Pencil, X, Loader2, AlertCircle,
  Shield, Info,
} from "lucide-react";

interface SiteSettings {
  contact: {
    email: string;
    phone: string;
    address: string;
    website: string;
  };
  social: {
    instagram: string;
    facebook: string;
    linkedin: string;
    whatsapp: string;
  };
  company: {
    name: string;
    cnpj: string;
    description: string;
  };
}

const defaultSettings: SiteSettings = {
  contact: { email: "", phone: "", address: "", website: "" },
  social: { instagram: "", facebook: "", linkedin: "", whatsapp: "" },
  company: { name: "", cnpj: "", description: "" },
};

type SectionKey = "contact" | "social" | "company";

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [original, setOriginal] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<SectionKey | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await apiJson<SiteSettings>("/settings");
      setSettings(data);
      setOriginal(data);
    } catch {
      // Use defaults if API not available
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (section: SectionKey, field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await apiFetch("/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      setOriginal(settings);
      setSaved(true);
      setEditing(null);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (section: SectionKey) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...original[section] },
    }));
    setEditing(null);
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(original);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-green-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/20">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
              <p className="text-sm text-gray-500">Gerencie as informações do site</p>
            </div>
          </div>

          {/* Save button — floating */}
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          )}
        </div>

        {/* Toast feedback */}
        {saved && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium animate-[fadeIn_0.3s_ease]">
            <Check className="h-4 w-4" />
            Configurações salvas com sucesso!
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* ── CONTACT INFO ── */}
          <SettingsCard
            title="Informações de Contato"
            description="Dados exibidos no rodapé e na página de contato do site."
            icon={<Mail className="h-5 w-5" />}
            iconBg="bg-blue-500"
            isEditing={editing === "contact"}
            onEdit={() => setEditing("contact")}
            onCancel={() => handleCancel("contact")}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SettingsField
                icon={<Mail className="h-4 w-4" />}
                label="E-mail"
                value={settings.contact.email}
                placeholder="contato@fapex.com.br"
                editing={editing === "contact"}
                onChange={(v) => handleChange("contact", "email", v)}
              />
              <SettingsField
                icon={<Phone className="h-4 w-4" />}
                label="Telefone"
                value={settings.contact.phone}
                placeholder="(11) 99999-9999"
                editing={editing === "contact"}
                onChange={(v) => handleChange("contact", "phone", v)}
              />
              <SettingsField
                icon={<MapPin className="h-4 w-4" />}
                label="Endereço"
                value={settings.contact.address}
                placeholder="São Paulo, SP – Brasil"
                editing={editing === "contact"}
                onChange={(v) => handleChange("contact", "address", v)}
              />
              <SettingsField
                icon={<Globe className="h-4 w-4" />}
                label="Website"
                value={settings.contact.website}
                placeholder="www.fapex.com.br"
                editing={editing === "contact"}
                onChange={(v) => handleChange("contact", "website", v)}
              />
            </div>
          </SettingsCard>

          {/* ── SOCIAL MEDIA ── */}
          <SettingsCard
            title="Redes Sociais"
            description="Links para os perfis da empresa nas redes sociais."
            icon={<Instagram className="h-5 w-5" />}
            iconBg="bg-pink-500"
            isEditing={editing === "social"}
            onEdit={() => setEditing("social")}
            onCancel={() => handleCancel("social")}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SettingsField
                icon={<Instagram className="h-4 w-4" />}
                label="Instagram"
                value={settings.social.instagram}
                placeholder="https://instagram.com/fapex"
                editing={editing === "social"}
                onChange={(v) => handleChange("social", "instagram", v)}
              />
              <SettingsField
                icon={<Facebook className="h-4 w-4" />}
                label="Facebook"
                value={settings.social.facebook}
                placeholder="https://facebook.com/fapex"
                editing={editing === "social"}
                onChange={(v) => handleChange("social", "facebook", v)}
              />
              <SettingsField
                icon={<Linkedin className="h-4 w-4" />}
                label="LinkedIn"
                value={settings.social.linkedin}
                placeholder="https://linkedin.com/company/fapex"
                editing={editing === "social"}
                onChange={(v) => handleChange("social", "linkedin", v)}
              />
              <SettingsField
                icon={<MessageCircle className="h-4 w-4" />}
                label="WhatsApp"
                value={settings.social.whatsapp}
                placeholder="https://wa.me/5511999999999"
                editing={editing === "social"}
                onChange={(v) => handleChange("social", "whatsapp", v)}
              />
            </div>
          </SettingsCard>

          {/* ── COMPANY INFO ── */}
          <SettingsCard
            title="Dados da Empresa"
            description="Informações gerais e branding da empresa."
            icon={<Building2 className="h-5 w-5" />}
            iconBg="bg-amber-500"
            isEditing={editing === "company"}
            onEdit={() => setEditing("company")}
            onCancel={() => handleCancel("company")}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SettingsField
                icon={<Building2 className="h-4 w-4" />}
                label="Nome da Empresa"
                value={settings.company.name}
                placeholder="FAPEX Industry Metal"
                editing={editing === "company"}
                onChange={(v) => handleChange("company", "name", v)}
              />
              <SettingsField
                icon={<FileText className="h-4 w-4" />}
                label="CNPJ"
                value={settings.company.cnpj}
                placeholder="00.000.000/0001-00"
                editing={editing === "company"}
                onChange={(v) => handleChange("company", "cnpj", v)}
              />
            </div>
            <div className="mt-4">
              {editing === "company" ? (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Descrição</label>
                  <textarea
                    value={settings.company.description}
                    onChange={(e) => handleChange("company", "description", e.target.value)}
                    placeholder="Breve descrição da empresa..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all resize-none"
                  />
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-gray-100 rounded-lg shrink-0 mt-0.5">
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-400 mb-0.5">Descrição</span>
                    <span className="text-sm text-gray-700">
                      {settings.company.description || <span className="text-gray-400 italic">Não informado</span>}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </SettingsCard>

          {/* ── SYSTEM INFO ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <Shield className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-800">Sobre o Sistema</h2>
                  <p className="text-xs text-gray-400">Informações da plataforma</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Versão</span>
                  <p className="text-lg font-bold text-gray-800 mt-1">1.0.0</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Plataforma</span>
                  <p className="text-lg font-bold text-gray-800 mt-1">FAPEX Admin</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-lg font-bold text-green-600">Online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ─── Reusable Card Component ──────────────────────────────────────────────── */

interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

function SettingsCard({ title, description, icon, iconBg, isEditing, onEdit, onCancel, children }: SettingsCardProps) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${
      isEditing ? "border-green-300 shadow-md shadow-green-100/50 ring-1 ring-green-200/50" : "border-gray-200"
    }`}>
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${iconBg} rounded-xl text-white shadow-sm`}>
            {icon}
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-800">{title}</h2>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
        </div>
        {isEditing ? (
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Cancelar
          </button>
        ) : (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </button>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

/* ─── Reusable Field Component ─────────────────────────────────────────────── */

interface SettingsFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  placeholder: string;
  editing: boolean;
  onChange: (value: string) => void;
}

function SettingsField({ icon, label, value, placeholder, editing, onChange }: SettingsFieldProps) {
  if (editing) {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-gray-100 rounded-lg shrink-0">
        <span className="text-gray-400">{icon}</span>
      </div>
      <div className="min-w-0">
        <span className="block text-xs font-medium text-gray-400 mb-0.5">{label}</span>
        <span className="text-sm text-gray-700 truncate block">
          {value || <span className="text-gray-400 italic">Não informado</span>}
        </span>
      </div>
    </div>
  );
}
