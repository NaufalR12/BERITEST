"use client";

import Link from "next/link";
import { 
  PlayCircle, 
  Lock, 
  CheckCircle2, 
  Calendar, 
  Award, 
  UserCheck, 
  ListTodo,
  ArrowRight
} from "lucide-react";
import UserHeader from "@/components/user/UserHeader";

export default function CourseDetailPage() {

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <UserHeader activeTab="Course" />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-10 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400">
          <Link href="/user" className="hover:text-slate-600 transition-colors">My Exams</Link>
          <span className="mx-2 font-normal text-slate-300">›</span>
          <span className="text-[#5b61f4]">Cloud Architect</span>
        </nav>

        {/* Course Header Title & Progress */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          {/* Left: Title & Description */}
          <div className="lg:max-w-2xl space-y-3">
            <h2 className="text-3xl font-extrabold text-[#1a365d] tracking-tight">
              Sertifikasi Cloud Architect
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Program sertifikasi intensif yang dirancang untuk membekali kandidat dengan pengetahuan mendalam mengenai arsitektur infrastruktur awan, skalabilitas sistem, dan manajemen keamanan di lingkungan enterprise.
            </p>
          </div>

          {/* Right: Progress Card */}
          <div className="bg-[#f0f4ff] border border-[#c7d2fe]/60 rounded-xl p-5 w-full lg:w-80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                KESELURUHAN PROGRES
              </span>
              <span className="text-xl font-extrabold text-[#5b61f4]">
                16%
              </span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-[#5b61f4] h-full rounded-full" style={{ width: "16%" }}></div>
            </div>
            
            <p className="text-[11px] font-extrabold text-slate-500 tracking-wide">
              2/12 Sesi Terselesaikan
            </p>
          </div>
        </div>

        {/* Sesi List Section */}
        <div className="space-y-4">
          {/* Section Subtitle */}
          <div className="flex items-center gap-2 pb-2">
            <ListTodo className="w-5 h-5 text-[#1a365d]" />
            <h3 className="text-base font-bold text-[#1a365d]">
              Kurikulum Sesi
            </h3>
          </div>

          {/* Sesi List Cards */}
          <div className="space-y-4">
            
            {/* Session 3: Sedang Berlangsung */}
            <div className="bg-white border-2 border-[#1a365d] rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                {/* Play Button Icon */}
                <div className="w-10 h-10 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#1a365d] shrink-0 mt-1 md:mt-0">
                  <PlayCircle className="w-5 h-5" />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded bg-[#1a365d] text-white tracking-wide uppercase">
                      SEDANG BERLANGSUNG
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      Sesi 3
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-800 leading-tight">
                    Ujian Tengah Semester - Cloud Fundamental
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    Tersedia hingga 24 Okt, 23:59 WIB
                  </p>
                </div>
              </div>

              <Link href="/user/courses/1/sessions/3" className="w-full md:w-auto">
                <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1a365d] hover:bg-[#122644] text-white text-xs font-extrabold rounded-lg transition-colors shadow-sm shrink-0 w-full md:w-auto">
                  Mulai Sesi
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Session 1: Selesai */}
            <div className="bg-[#f0f4ff]/50 border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                {/* Check Button Icon */}
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#5b61f4] shrink-0 mt-1 md:mt-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded bg-blue-50 text-[#5b61f4] tracking-wide uppercase">
                      SELESAI
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      Sesi 1
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-800 leading-tight">
                    Pre-test: Dasar Infrastruktur
                  </h4>
                  <p className="text-xs text-slate-500 font-bold">
                    Skor Akhir: <span className="text-[#5b61f4]">85/100</span>
                  </p>
                </div>
              </div>

              <Link href="/user/courses/1/sessions/1/results" className="w-full md:w-auto">
                <button className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-[#1a365d] text-xs font-extrabold rounded-lg transition-colors shrink-0 w-full md:w-auto shadow-sm">
                  Lihat Hasil
                </button>
              </Link>
            </div>

            {/* Session 12: Terkunci */}
            <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4 opacity-60">
                {/* Lock Button Icon */}
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 mt-1 md:mt-0">
                  <Lock className="w-5 h-5" />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded bg-slate-100 text-slate-400 tracking-wide uppercase">
                      TERKUNCI
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      Sesi 12
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-500 leading-tight">
                    Ujian Akhir: Cloud Architect
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    Prasyarat: Selesaikan semua modul pembelajaran sebelumnya.
                  </p>
                </div>
              </div>

              <button className="px-6 py-2.5 bg-slate-200 text-slate-400 text-xs font-extrabold rounded-lg cursor-not-allowed shrink-0 w-full md:w-auto select-none">
                Belum Dibuka
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Info Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Card 1: Jadwal Ujian Akhir */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-lg bg-[#eef2ff] flex items-center justify-center text-[#5b61f4]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Jadwal Ujian Akhir</p>
              <p className="text-sm font-extrabold text-[#1a365d] mt-0.5">12 November 2024</p>
            </div>
          </div>

          {/* Card 2: Passing Grade */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-lg bg-[#eef2ff] flex items-center justify-center text-[#5b61f4]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Passing Grade</p>
              <p className="text-sm font-extrabold text-[#1a365d] mt-0.5">75/100 Poin</p>
            </div>
          </div>

          {/* Card 3: Butuh Bantuan */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-lg bg-[#eef2ff] flex items-center justify-center text-[#5b61f4]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Butuh Bantuan?</p>
              <p className="text-sm font-extrabold text-[#1a365d] mt-0.5">Hubungi Proktor</p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
