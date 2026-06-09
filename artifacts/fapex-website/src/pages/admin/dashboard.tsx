import { useEffect, useState } from "react";
import AdminLayout from "./layout";
import { apiJson } from "@/lib/api";
import { FileText, Images, Eye } from "lucide-react";
import { Link } from "wouter";

interface BlogPost { id: number; title: string; published: boolean; createdAt: string; }
interface GalleryPhoto { id: number; title: string; imageUrl: string; createdAt: string; }

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    apiJson<BlogPost[]>("/blog-posts/all").then(setPosts).catch(() => {});
    apiJson<GalleryPhoto[]>("/gallery").then(setPhotos).catch(() => {});
  }, []);

  const publishedCount = posts.filter((p) => p.published).length;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg"><FileText className="h-5 w-5 text-green-700" /></div>
              <span className="text-sm text-gray-500">Total de Posts</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg"><Eye className="h-5 w-5 text-blue-700" /></div>
              <span className="text-sm text-gray-500">Publicados</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{publishedCount}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg"><Images className="h-5 w-5 text-purple-700" /></div>
              <span className="text-sm text-gray-500">Fotos na Galeria</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{photos.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Últimos Posts</h2>
              <Link href="/admin/blog" className="text-sm text-green-600 hover:text-green-700">Ver todos</Link>
            </div>
            {posts.length === 0 ? (
              <p className="text-gray-400 text-sm">Nenhum post ainda.</p>
            ) : (
              <div className="space-y-3">
                {posts.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700 truncate max-w-[200px]">{p.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.published ? "Publicado" : "Rascunho"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Galeria Recente</h2>
              <Link href="/admin/gallery" className="text-sm text-green-600 hover:text-green-700">Ver todas</Link>
            </div>
            {photos.length === 0 ? (
              <p className="text-gray-400 text-sm">Nenhuma foto ainda.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {photos.slice(0, 6).map((p) => (
                  <img key={p.id} src={p.imageUrl} alt={p.title} className="w-full aspect-square object-cover rounded-lg" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
