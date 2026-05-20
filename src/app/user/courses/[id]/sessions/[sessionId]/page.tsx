"use client";

import Link from "next/link";
import { 
  Timer, 
  FileSpreadsheet, 
  Info 
} from "lucide-react";
import UserHeader from "@/components/user/UserHeader";

export default function ExamPreparationPage() {

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <UserHeader activeTab="Course" />

      {/* Main Page Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-12 flex flex-col items-center space-y-8">
        
        {/* Centered Heading */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-[#1a365d] tracking-tight">
            Sesi Seleksi Kompetensi Dasar (SKD) 2024
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Pastikan koneksi internet Anda stabil sebelum memulai sesi ujian.
          </p>
        </div>

        {/* Two Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Card 1: Durasi Ujian */}
          <div className="bg-[#f0f4ff]/50 border border-slate-200 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#eef2ff] flex items-center justify-center text-[#1a365d]">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DURASI UJIAN</p>
              <p className="text-lg font-extrabold text-[#1a365d] mt-0.5">120 Menit</p>
            </div>
          </div>

          {/* Card 2: Jumlah Soal */}
          <div className="bg-[#f0f4ff]/50 border border-slate-200 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#eef2ff] flex items-center justify-center text-[#1a365d]">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">JUMLAH SOAL</p>
              <p className="text-lg font-extrabold text-[#1a365d] mt-0.5">110 Butir</p>
            </div>
          </div>
        </div>

        {/* Petunjuk Ujian Detail Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 w-full shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#1a365d]">
            Petunjuk Ujian Detail
          </h3>
          
          <hr className="border-slate-100" />

          {/* Instructions List */}
          <div className="space-y-4 text-xs font-semibold text-slate-500 leading-relaxed">
            <div className="flex gap-3">
              <span className="text-[#1a365d] font-extrabold">01.</span>
              <p>Gunakan browser versi terbaru (Chrome/Firefox/Safari) untuk pengalaman terbaik. Hindari penggunaan mode incognito.</p>
            </div>
            
            <div className="flex gap-3">
              <span className="text-[#1a365d] font-extrabold">02.</span>
              <p>Sistem akan secara otomatis melakukan auto-save setiap kali Anda memilih jawaban. Jangan khawatir jika terjadi putus koneksi sesaat.</p>
            </div>

            <div className="flex gap-3">
              <span className="text-[#1a365d] font-extrabold">03.</span>
              <p>Anda diperbolehkan melewati soal dan kembali lagi nanti menggunakan panel navigasi soal yang tersedia di sebelah kanan layar saat ujian berlangsung.</p>
            </div>

            <div className="flex gap-3">
              <span className="text-[#1a365d] font-extrabold">04.</span>
              <p>Pengerjaan akan berakhir secara otomatis ketika waktu hitung mundur mencapai 00:00:00.</p>
            </div>
          </div>

          {/* Callout Box */}
          <div className="bg-[#f0f4ff]/50 border-l-4 border-[#1a365d] p-4 rounded-r-lg flex gap-3 items-start">
            <Info className="w-5 h-5 text-[#1a365d] shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-[#1a365d] leading-relaxed">
              Perhatian: Dengan menekan tombol "Mulai Test", Anda dianggap telah menyetujui semua peraturan ujian dan waktu pengerjaan akan segera dimulai.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4 w-full pt-4">
          <Link href="/user/courses/1/sessions/3/active" className="w-full max-w-xs">
            <button 
              className="px-10 py-3.5 bg-[#1a365d] hover:bg-[#122644] text-white text-sm font-extrabold rounded-lg transition-colors shadow-md w-full text-center"
            >
              Mulai Test Sekarang
            </button>
          </Link>
          
          <Link 
            href="/user/courses/1" 
            className="text-xs text-slate-400 font-bold hover:text-slate-600 transition-colors hover:underline"
          >
            Batal dan Kembali ke Dashboard
          </Link>
        </div>

      </main>
    </div>
  );
}
