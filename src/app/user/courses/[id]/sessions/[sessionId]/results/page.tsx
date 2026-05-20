"use client";

import Link from "next/link";
import { 
  Download, 
  Share2, 
  CheckCircle, 
  XCircle, 
  MinusCircle,
  CheckCircle2
} from "lucide-react";
import UserHeader from "@/components/user/UserHeader";

export default function ExamResultsPage() {

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <UserHeader activeTab="Course" />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-10 space-y-6">
        
        {/* Title and Subtitle */}
        <div>
          <h2 className="text-3xl font-extrabold text-[#1a365d] tracking-tight">
            Hasil Ujian Anda
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Sertifikasi Manajemen Proyek - Batch 24 (Februari 2024)
          </p>
        </div>

        {/* Two-Column Workspace Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Column (65% width) */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Score & Congratulatory Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-8">
              {/* Circular Gauge Score */}
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#f1f5f9"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#1a365d"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={(2 * Math.PI * 54) * (1 - 82 / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-slate-800">82</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">DARI 100</span>
                </div>
              </div>

              {/* Congratulatory Details */}
              <div className="space-y-3 flex-1 text-center md:text-left">
                <div>
                  <span className="inline-block text-[9px] font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 tracking-wide border border-emerald-100">
                    ✓ LULUS AMBANG BATAS
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-800 leading-tight">
                  Selamat, Budi Santoso!
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Anda telah berhasil menyelesaikan ujian dengan performa yang sangat baik. Skor Anda berada di atas rata-rata nasional (74%). Sertifikat digital Anda sekarang tersedia untuk diunduh.
                </p>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <button className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1a365d] hover:bg-[#122644] text-white text-xs font-extrabold rounded-lg transition-colors shadow-sm">
                    <Download className="w-4 h-4" />
                    UNDUH SERTIFIKAT
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-extrabold rounded-lg transition-colors shadow-sm">
                    <Share2 className="w-4 h-4" />
                    BAGIKAN HASIL
                  </button>
                </div>
              </div>
            </div>

            {/* Three Small Stats Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stat 1: Jawaban Benar */}
              <div className="bg-emerald-50/30 border border-emerald-100/60 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-800">41</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jawaban Benar</p>
                </div>
              </div>

              {/* Stat 2: Jawaban Salah */}
              <div className="bg-rose-50/30 border border-rose-100/60 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-800">7</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jawaban Salah</p>
                </div>
              </div>

              {/* Stat 3: Tidak Dijawab */}
              <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100/50 flex items-center justify-center text-slate-400 shrink-0">
                  <MinusCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-800">2</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tidak Dijawab</p>
                </div>
              </div>
            </div>

            {/* Question Review List */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Section Header with Legend */}
              <div className="flex items-center justify-between pb-2">
                <h4 className="text-base font-extrabold text-[#1a365d]">Review Soal</h4>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-bold text-slate-400">Benar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="text-[10px] font-bold text-slate-400">Salah</span>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Reviewed Question Cards Container */}
              <div className="space-y-6">
                
                {/* Question 1 (Correct) */}
                <div className="flex gap-4">
                  <span className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  
                  <div className="space-y-3 flex-1">
                    <p className="text-xs font-bold text-slate-800 leading-relaxed">
                      Dalam manajemen proyek, apa fungsi utama dari jalur kritis (Critical Path Method)?
                    </p>
                    
                    <div className="space-y-2">
                      <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-700">Mengidentifikasi durasi minimum pengerjaan proyek</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      </div>
                      <div className="bg-white border border-slate-100 rounded-lg p-3">
                        <span className="text-xs font-semibold text-slate-400">Menentukan anggaran total sumber daya manusia</span>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Question 2 (Incorrect) */}
                <div className="flex gap-4">
                  <span className="w-6 h-6 rounded bg-rose-50 text-rose-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  
                  <div className="space-y-3 flex-1">
                    <p className="text-xs font-bold text-slate-800 leading-relaxed">
                      Apa yang dimaksud dengan 'Scope Creep' dalam pengerjaan sebuah proyek IT?
                    </p>
                    
                    <div className="space-y-2">
                      <div className="bg-rose-50/40 border border-rose-100/80 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-xs font-bold text-rose-700">Penyusutan anggaran secara tiba-tiba di tengah proyek</span>
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      </div>
                      <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-700">Perubahan lingkup yang tidak terkendali tanpa penyesuaian waktu/biaya</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      </div>

                      {/* Explanation Callout */}
                      <div className="bg-[#f0f4ff]/50 border border-slate-100 rounded-xl p-4 mt-3">
                        <p className="text-[10px] font-extrabold text-[#5b61f4] tracking-wider uppercase">PENJELASAN:</p>
                        <p className="text-[11px] font-semibold text-slate-600 leading-relaxed mt-1">
                          Scope creep terjadi ketika fitur-fitur atau permintaan baru ditambahkan secara informal tanpa melalui proses kontrol perubahan (Change Management).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Question 3 (Correct) */}
                <div className="flex gap-4">
                  <span className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  
                  <div className="space-y-3 flex-1">
                    <p className="text-xs font-bold text-slate-800 leading-relaxed">
                      Manakah yang termasuk dalam artefak Scrum?
                    </p>
                    
                    <div className="space-y-2">
                      <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-700">Product Backlog</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      </div>
                      <div className="bg-white border border-slate-100 rounded-lg p-3">
                        <span className="text-xs font-semibold text-slate-400">Sprint Planning Meeting</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* View All Questions CTA */}
              <div className="pt-4">
                <button className="w-full text-center border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-extrabold py-3.5 rounded-lg transition-colors shadow-sm">
                  LIHAT SEMUA 50 SOAL
                </button>
              </div>

            </div>

          </div>

          {/* Right Column (35% width) */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-[#151c55] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden h-48 flex flex-col justify-between">
              
              {/* Background clock graphics matching design */}
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-white select-none pointer-events-none">
                <svg className="w-36 h-36" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>

              <div className="space-y-3 relative z-10">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                  WAKTU PENGERJAAN
                </span>
                <div>
                  <span className="text-3xl font-extrabold tracking-tight">01:12:45</span>
                  <span className="text-xs font-bold text-slate-300 ml-1">dari 01:30:00</span>
                </div>
              </div>

              <p className="text-[11px] font-bold text-slate-300 relative z-10">
                Rata-rata: 87 detik per soal
              </p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
