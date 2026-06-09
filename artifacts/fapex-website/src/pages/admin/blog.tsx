import { useEffect, useState } from "react";
import AdminLayout from "./layout";
import { apiJson, apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, X, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  published: boolean;
  createdAt: string;
}

const emptyForm = { title: "", slug: "", excerpt: "", content: "", imageUrl: "", published: false };

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminBlog() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => apiJson<BlogPost[]>("/blog-posts/all").then(setPosts).catch(() => {});
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
    setSaving(true);
    try {
      if (editId !== null) {
        await apiJson(`/blog-posts/${editId}`, { method: "PUT", body: JSON.stringify(form) });
        toast({ title: "Post atualizado!" });
      } else {
        await apiJson("/blog-posts", { method: "POST", body: JSON.stringify(form) });
        toast({ title: "Post criado!" });
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditId(null);
      load();
    } catch (err: any) {
      toast({ title: err.message ?? "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, imageUrl: post.imageUrl, published: post.published });
    setEditId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deletar este post?")) return;
    await apiFetch(`/blog-posts/${id}`, { method: "DELETE" });
    load();
    toast({ title: "Post deletado" });
  };

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: editId ? f.slug : slugify(title) }));
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <Button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }} className="bg-green-600 hover:bg-green-500 text-white" data-testid="button-new-post">
            <Plus className="h-4 w-4 mr-2" /> Novo Post
          </Button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">{editId ? "Editar Post" : "Novo Post"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">Título *</Label>
                  <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required placeholder="Título do post" data-testid="input-title" />
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">Slug *</Label>
                  <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required placeholder="slug-do-post" data-testid="input-slug" />
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">Resumo</Label>
                <Textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} rows={2} placeholder="Breve descrição do post..." data-testid="input-excerpt" />
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">Conteúdo</Label>
                <Textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={8} placeholder="Conteúdo completo do post..." data-testid="input-content" />
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Imagem de Capa</Label>
                <div className="flex gap-3 items-start">
                  <div className="flex-1">
                    <Input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="URL da imagem ou faça upload" data-testid="input-image-url" />
                  </div>
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" data-testid="input-image-file" />
                    <Button type="button" variant="outline" disabled={uploading} className="shrink-0">
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                      {uploading ? "..." : "Upload"}
                    </Button>
                  </label>
                </div>
                {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 h-24 w-40 object-cover rounded-lg border" />}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="rounded" data-testid="checkbox-published" />
                <Label htmlFor="published" className="text-sm text-gray-600 cursor-pointer">Publicar agora</Label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-500 text-white" data-testid="button-save-post">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {saving ? "Salvando..." : "Salvar Post"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Nenhum post ainda. Crie o primeiro!</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Imagem</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Título</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Status</th>
                  <th className="text-right px-6 py-3 text-gray-600 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors" data-testid={`row-post-${post.id}`}>
                    <td className="px-6 py-3">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt="" className="h-12 w-16 object-cover rounded" />
                      ) : (
                        <div className="h-12 w-16 bg-gray-100 rounded flex items-center justify-center text-gray-300">
                          <FileText className="h-5 w-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-800">{post.title}</p>
                      <p className="text-gray-400 text-xs">{post.slug}</p>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {post.published ? "Publicado" : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(post)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" data-testid={`button-edit-${post.id}`}><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(post.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" data-testid={`button-delete-${post.id}`}><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function FileText({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
