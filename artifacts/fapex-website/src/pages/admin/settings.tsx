import AdminLayout from "./layout";
import { Settings, Mail, Phone, MapPin, Globe } from "lucide-react";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Settings className="h-6 w-6 text-green-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
          <div className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Informações de Contato</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700">contato@fapex.com.br</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700">(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700">São Paulo, SP – Brasil</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700">www.fapex.com.br</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Sobre o Sistema</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Versão</span>
                <span className="font-medium text-gray-800">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Plataforma</span>
                <span className="font-medium text-gray-800">FAPEX Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
