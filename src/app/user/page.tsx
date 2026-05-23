"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlayCircle, AlertCircle, BookOpen } from "lucide-react";
import UserHeader from "@/components/user/UserHeader";
import { apiFetch } from "@/lib/api";

interface Course {
  id: number;
  course_title: string;
  description: string;
  is_active: boolean;
  _count?: {
    mst_batch: number;
  };
}

export default function UserHomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Semua Kategori");

  useEffect(() => {
    apiFetch("/courses?limit=100")
      .then((res: any) => {
        // Filter out inactive courses if needed, but the API might return them based on user
        setCourses(res.data || []);
      })
      .catch((err: any) => {
        setError(err.message || "Gagal memuat daftar course.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <UserHeader activeTab="Course" />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-10">
        
        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-[#1a365d] tracking-tight">
            Selamat Datang, Peserta
          </h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Kelola persiapan ujian Anda dan akses materi kursus yang tersedia.
          </p>
        </div>

        {/* Section Title & Filter Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl font-bold text-[#1a365d]">
            Daftar Course
          </h3>
          
          <div className="flex items-center gap-3">
            <button 
              className={`px-4 py-2 border text-xs font-bold rounded-lg transition-colors shadow-sm ${activeCategory === "Terbaru" ? "bg-[#1a365d] text-white border-[#1a365d]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
              onClick={() => setActiveCategory("Terbaru")}
            >
              Terbaru
            </button>
            <button 
              className={`px-4 py-2 border text-xs font-bold rounded-lg transition-colors shadow-sm ${activeCategory === "Semua Kategori" ? "bg-[#1a365d] text-white border-[#1a365d]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
              onClick={() => setActiveCategory("Semua Kategori")}
            >
              Semua Kategori
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="bg-white border border-slate-200 rounded-xl p-6 h-[320px] animate-pulse flex flex-col justify-between">
                <div>
                  <div className="w-3/4 h-6 bg-slate-200 rounded mb-4" />
                  <div className="w-full h-4 bg-slate-100 rounded mb-2" />
                  <div className="w-5/6 h-4 bg-slate-100 rounded mb-6" />
                </div>
                <div className="w-full h-10 bg-slate-200 rounded-lg mt-6" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-[#1a365d] mb-2">Belum ada course</h4>
            <p className="text-slate-500 text-sm">Course ujian belum ditambahkan oleh Admin.</p>
          </div>
        ) : (
          /* Card Grid Area */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:border-[#c7d2fe]">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-xl font-extrabold text-slate-800 leading-tight">
                      {course.course_title}
                    </h4>
                    {!course.is_active && (
                      <span className="shrink-0 text-[9px] font-extrabold px-2 py-0.5 rounded bg-red-50 text-red-500 tracking-wide uppercase">
                        TIDAK AKTIF
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 line-clamp-3">
                    {course.description || "Tidak ada deskripsi tersedia untuk course ini."}
                  </p>
                  
                  <hr className="border-slate-100 my-4" />
                  
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-[#5b61f4] uppercase tracking-wider block">
                      INFORMASI COURSE
                    </span>
                    
                    <div className="flex items-center justify-between text-slate-700">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="w-4 h-4 text-[#5b61f4]" />
                        <span className="text-xs font-semibold">Tersedia untuk diikuti</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Link href={`/user/courses/${course.id}`} className="w-full block mt-6">
                  <button 
                    className="w-full bg-[#1a365d] hover:bg-[#122644] text-white py-3 rounded-lg text-xs font-extrabold transition-colors shadow-sm"
                  >
                    Lihat Detail Course
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
