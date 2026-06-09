import { useEffect, useState } from "react";
import AdminLayout from "./layout";
import { apiFetch } from "@/lib/api";
import { Trash2, Mail, Phone, Building2, User, Calendar, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactMessage {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  const fetchMessages = () => {
    apiFetch("/contact")
      .then((r) => r.json())
      .then((data) => { setMessages(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Deletar esta mensagem?")) return;
    await apiFetch(`/contact/${id}`, { method: "DELETE" });
    toast({ title: "Mensagem deletada" });
    if (selected?.id === id) setSelected(null);
    fetchMessages();
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mensagens de Contato</h1>
            <p className="text-gray-500 text-sm mt-1">{messages.length} mensagem{messages.length !== 1 ? "s" : ""} recebida{messages.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 gap-3">
            <div className="h-5 w-5 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin" />
            Carregando...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
            <MessageSquare className="h-12 w-12 opacity-30" />
            <p className="text-lg">Nenhuma mensagem ainda</p>
            <p className="text-sm">As mensagens enviadas pelo site aparecerão aqui.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelected(msg)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selected?.id === msg.id
                      ? "border-green-500 bg-green-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-green-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{msg.name}</p>
                      {msg.company && <p className="text-xs text-gray-400 truncate">{msg.company}</p>}
                      <p className="text-xs text-gray-500 truncate mt-1">{msg.email}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">
                      {new Date(msg.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{msg.message}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selected ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Detalhes da Mensagem</h2>
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Deletar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="h-4 w-4 text-green-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 mb-0.5">Nome</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{selected.name}</p>
                      </div>
                    </div>
                    {selected.company && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Building2 className="h-4 w-4 text-green-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400 mb-0.5">Empresa</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{selected.company}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-4 w-4 text-green-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 mb-0.5">E-mail</p>
                        <a href={`mailto:${selected.email}`} className="text-sm font-medium text-green-600 hover:underline truncate block">{selected.email}</a>
                      </div>
                    </div>
                    {selected.phone && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="h-4 w-4 text-green-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400 mb-0.5">Telefone</p>
                          <a href={`tel:${selected.phone}`} className="text-sm font-medium text-green-600 hover:underline">{selected.phone}</a>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg sm:col-span-2">
                      <Calendar className="h-4 w-4 text-green-500 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Recebida em</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(selected.createdAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">Mensagem</p>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {selected.message}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <a
                      href={`mailto:${selected.email}?subject=Re: Contato Fapex&body=Olá ${selected.name},%0A%0A`}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      Responder por E-mail
                    </a>
                    {selected.phone && (
                      <a
                        href={`https://wa.me/55${selected.phone.replace(/\D/g, "")}?text=Olá ${selected.name}, recebemos sua mensagem na Fapex!`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2 bg-white border border-dashed border-gray-200 rounded-lg">
                  <MessageSquare className="h-8 w-8 opacity-30" />
                  <p className="text-sm">Selecione uma mensagem para ver os detalhes</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
