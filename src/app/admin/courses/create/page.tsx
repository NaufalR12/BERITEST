"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Info, BookOpen, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function CreateCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await apiFetch('/courses', {
        method: 'POST',
        body: JSON.stringify({
          course_title: title,
          description: description,
          is_active: isPublished,
        }),
      });

      router.push('/admin/courses');
    } catch (err: any) {
      setError(err.message || "Gagal membuat kursus baru.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      
      
      <div className="flex-1 px-8 pt-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-2">
          <Link href="/admin/courses" className="hover:text-slate-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            Kembali
          </Link>
          <span className="font-normal text-slate-300">|</span>
          <span className="text-[#5b61f4]">Tambah Course Baru</span>
        </nav>

        {/* Page Header Area */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Tambah Course Baru</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Buat kurikulum berkualitas tinggi untuk para kandidat.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: Form Utama */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#eef2ff] flex items-center justify-center text-[#0a2351]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Informasi Dasar</h3>
                </div>

                <div className="space-y-6">
                  {/* Judul Kursus */}
                  <div>
                    <label htmlFor="title" className="block text-xs font-bold text-slate-700 mb-2">
                      Judul Kursus
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Contoh: Dasar-dasar Manajemen Proyek"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Deskripsi Kursus */}
                  <div>
                    <label htmlFor="description" className="block text-xs font-bold text-slate-700 mb-2">
                      Deskripsi Kursus
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Berikan penjelasan mendetail tentang materi yang akan dipelajari..."
                      rows={6}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors resize-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar Settings */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              {/* Card Publikasi */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4">
                  PENGATURAN PUBLIKASI
                </h4>
                
                {/* Toggle Switch */}
                <div className="flex items-center justify-between p-4 bg-[#f8fafc] border border-slate-100 rounded-lg mb-4">
                  <div>
                    <p className="font-bold text-sm text-slate-800">Status Kursus</p>
                    <p className="text-xs text-slate-500 mt-0.5">Aktifkan untuk publikasi</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isPublished}
                    onClick={() => setIsPublished(!isPublished)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isPublished ? "bg-[#0a2351]" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isPublished ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Info Box */}
                <div className="flex gap-3 p-4 bg-white border border-slate-200 rounded-lg items-start">
                  <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Perubahan ini akan segera terlihat oleh semua pengguna setelah Anda menekan tombol simpan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-end gap-4">
            <Link
              href="/admin/courses"
              className="px-6 py-2.5 border border-slate-200 text-[#0a2351] text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm"
            >
              Batalkan
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0a2351] hover:bg-[#0f337a] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isLoading ? "Menyimpan..." : "Simpan Kursus"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

