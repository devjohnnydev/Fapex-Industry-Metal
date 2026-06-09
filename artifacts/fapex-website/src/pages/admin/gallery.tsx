import { useEffect, useState } from "react";
import AdminLayout from "./layout";
import { apiJson, apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload, Loader2, Images } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GalleryPhoto {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  createdAt: string;
}

export default function AdminGallery() {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [form, setForm] = useState({ title: "", imageUrl: "", description: "" });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => apiJson<GalleryPhoto[]>("/gallery").then(setPhotos).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/uploads-handler", { method: "POST", credentials: "include", body: fd });
      const data = await res.json();
      if (data.url) setForm((f) => ({ ...f, imageUrl: data.url }));
      else toast({ title: "Erro ao fazer upload", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl) { toast({ title: "Adicione uma imagem", variant: "destructive" }); return; }
    setSaving(true);
    try {
      await apiJson("/gallery", { method: "POST", body: JSON.stringify(form) });
      toast({ title: "Foto adicionada!" });
      setForm({ title: "", imageUrl: "", description: "" });
      setShowForm(false);
      load();
    } catch (err: any) {
      toast({ title: err.message ?? "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remover esta foto da galeria?")) return;
    await apiFetch(`/gallery/${id}`, { method: "DELETE" });
    load();
    toast({ title: "Foto removida" });
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Galeria de Fotos</h1>
          <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-500 text-white" data-testid="button-add-photo">
            <Plus className="h-4 w-4 mr-2" /> Adicionar Foto
          </Button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">Adicionar Foto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">Título (opcional)</Label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Ex: Galpão industrial" data-testid="input-photo-title" />
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Imagem *</Label>
                <div className="flex gap-3 items-start">
                  <Input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="URL da imagem ou faça upload" className="flex-1" data-testid="input-photo-url" />
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <Button type="button" variant="outline" disabled={uploading}>
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                      {uploading ? "..." : "Upload"}
                    </Button>
                  </label>
                </div>
                {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 h-32 w-48 object-cover rounded-lg border" />}
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">Descrição (opcional)</Label>
                <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} placeholder="Descrição da foto..." data-testid="input-photo-desc" />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-500 text-white" data-testid="button-save-photo">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {saving ? "Salvando..." : "Adicionar"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </div>
        )}

        {photos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-400">
            <Images className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nenhuma foto ainda. Adicione a primeira!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm" data-testid={`card-photo-${photo.id}`}>
                <img src={photo.imageUrl} alt={photo.title} className="w-full aspect-square object-cover" />
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-700 truncate">{photo.title || "Sem título"}</p>
                </div>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  data-testid={`button-delete-photo-${photo.id}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
