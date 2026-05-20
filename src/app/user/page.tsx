"use client";

import { useState } from "react";
import Link from "next/link";
import { PlayCircle, Lock, AlertCircle, CheckCircle } from "lucide-react";
import UserHeader from "@/components/user/UserHeader";

export default function UserHomePage() {
  const [activeCategory, setActiveCategory] = useState("Semua Kategori");

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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#1a365d]">
            Daftar Course
          </h3>
          
          <div className="flex items-center gap-3">
            <button 
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 bg-white text-slate-600 text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              Terbaru
            </button>
            <button 
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 bg-white text-slate-600 text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              Semua Kategori
            </button>
          </div>
        </div>

        {/* Card Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Fundamental Web Development */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-[420px]">
            <div>
              <h4 className="text-xl font-extrabold text-slate-800 leading-tight mb-3">
                Fundamental Web Development
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                Pelajari dasar-dasar pengembangan web modern menggunakan HTML5, CSS3, dan JavaScript ES6.
              </p>
              
              <hr className="border-slate-100 my-4" />
              
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-[#5b61f4] uppercase tracking-wider block">
                  SESI TERBARU
                </span>
                
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-[#5b61f4]" />
                    <span className="text-xs font-semibold">Pengenalan DOM</span>
                  </div>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-[#5b61f4] tracking-wide uppercase">
                    AKTIF
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-300" />
                    <span className="text-xs font-medium">Asynchronous JS</span>
                  </div>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-400 tracking-wide uppercase">
                    SELESAI
                  </span>
                </div>
              </div>
            </div>

            <Link href="/user/courses/1" className="w-full">
              <button 
                className="w-full bg-[#1a365d] hover:bg-[#122644] text-white py-3 rounded-lg text-xs font-extrabold transition-colors shadow-sm mt-6"
              >
                Lanjutkan Belajar
              </button>
            </Link>
          </div>

          {/* Card 2: Analisis Data Lanjutan */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-[420px]">
            <div>
              <h4 className="text-xl font-extrabold text-slate-800 leading-tight mb-3">
                Analisis Data Lanjutan
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                Teknik pengolahan data menggunakan Python dan R untuk kebutuhan bisnis enterprise.
              </p>
              
              <hr className="border-slate-100 my-4" />
              
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  SESI TERKUNCI
                </span>
                
                <div className="flex items-center gap-2 text-slate-400">
                  <Lock className="w-4 h-4 text-slate-300" />
                  <span className="text-xs font-medium">Regresi Linier</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Lock className="w-4 h-4 text-slate-300" />
                  <span className="text-xs font-medium">Time Series Analysis</span>
                </div>
              </div>
            </div>

            <Link href="/user/courses/1" className="w-full">
              <button 
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-[#1a365d] py-3 rounded-lg text-xs font-extrabold transition-colors mt-6"
              >
                Mulai Course
              </button>
            </Link>
          </div>

          {/* Card 3: Backend Architecture */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-[420px]">
            <div>
              <h4 className="text-xl font-extrabold text-slate-800 leading-tight mb-3">
                Backend Architecture
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                Membangun sistem yang scalable dengan Microservices dan Cloud Infrastructure.
              </p>
              
              <hr className="border-slate-100 my-4" />
              
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
                  STATUS SESI
                </span>
                
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-semibold text-red-600">Pre-Test Mandatori</span>
                  </div>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-red-50 text-red-500 tracking-wide uppercase">
                    BELUM
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#5b61f4]" />
                    <span className="text-xs font-semibold">Modul API Gateway</span>
                  </div>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-[#5b61f4] tracking-wide uppercase">
                    SELESAI
                  </span>
                </div>
              </div>
            </div>

            <Link href="/user/courses/1" className="w-full">
              <button 
                className="w-full bg-[#1a365d] hover:bg-[#122644] text-white py-3 rounded-lg text-xs font-extrabold transition-colors shadow-sm mt-6"
              >
                Lihat Sesi
              </button>
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}
