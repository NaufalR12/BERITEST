"use client";

import Link from "next/link";
import { Calendar, Clock, Lock, CheckCircle2, PlayCircle, ArrowRight } from "lucide-react";
import UserHeader from "@/components/user/UserHeader";

interface SessionSchedule {
  id: number;
  courseId: number;
  sessionId: number;
  title: string;
  courseTitle: string;
  status: "AKTIF" | "SELESAI" | "BELUM DIBUKA";
  timeText: string;
  description: string;
  scoreText?: string;
  targetUrl: string;
}

export default function UserSchedulePage() {
  const schedules: SessionSchedule[] = [
    {
      id: 1,
      courseId: 1,
      sessionId: 3,
      title: "Sesi Seleksi Kompetensi Dasar (SKD) 2024",
      courseTitle: "Sertifikasi Cloud Architect",
      status: "AKTIF",
      timeText: "Hari ini (19 Mei 2026), 08:00 - 23:59 WIB",
      description: "Sesi ujian utama untuk mengukur pemahaman arsitektur cloud, skalabilitas sistem, dan wawasan infrastruktur modern.",
      targetUrl: "/user/courses/1/sessions/3"
    },
    {
      id: 2,
      courseId: 1,
      sessionId: 1,
      title: "Pre-test: Dasar Infrastruktur",
      courseTitle: "Sertifikasi Cloud Architect",
      status: "SELESAI",
      timeText: "Kemarin (18 Mei 2026), 09:00 WIB",
      description: "Sesi pre-test mandatori untuk mengevaluasi pemahaman konsep dasar Linux, jaringan, dan komputasi awan.",
      scoreText: "82/100",
      targetUrl: "/user/courses/1/sessions/1/results"
    },
    {
      id: 3,
      courseId: 1,
      sessionId: 12,
      title: "Advanced Cloud Networking",
      courseTitle: "Sertifikasi Cloud Architect",
      status: "BELUM DIBUKA",
      timeText: "Tersedia setelah Sesi 3 diselesaikan",
      description: "Sesi lanjutan tentang VPC Peering, Transit Gateway, dan load balancing berskala global.",
      targetUrl: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Interactive Global User Header */}
      <UserHeader activeTab="Schedule" />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-8 py-10 space-y-8">
        
        {/* Page Title Section */}
        <div>
          <h2 className="text-3xl font-extrabold text-[#1a365d] tracking-tight">
            Jadwal Sesi Anda
          </h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Kelola, jadwalkan, dan akses langsung sesi ujian yang aktif di bawah ini.
          </p>
        </div>

        {/* Schedule Sesi Cards Container */}
        <div className="space-y-5">
          {schedules.map((schedule) => {
            const isActive = schedule.status === "AKTIF";
            const isCompleted = schedule.status === "SELESAI";
            const isLocked = schedule.status === "BELUM DIBUKA";

            return (
              <div 
                key={schedule.id}
                className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md ${
                  isActive ? "border-[#5b61f4] ring-1 ring-[#5b61f4]/30" : "border-slate-200"
                }`}
              >
                {/* Left Side: Meta & Info */}
                <div className="space-y-3 flex-1">
                  
                  {/* Category, Sesi & Badge Status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {schedule.courseTitle}
                    </span>
                    <span className="text-slate-300 font-normal text-xs">•</span>
                    
                    {isActive && (
                      <span className="flex items-center gap-1.5 text-[9px] font-extrabold px-2.5 py-0.5 rounded bg-blue-50 text-[#5b61f4] tracking-wide uppercase">
                        <span className="w-1.5 h-1.5 bg-[#5b61f4] rounded-full animate-pulse"></span>
                        AKTIF
                      </span>
                    )}

                    {isCompleted && (
                      <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded bg-slate-100 text-slate-500 tracking-wide uppercase">
                        SELESAI
                      </span>
                    )}

                    {isLocked && (
                      <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded bg-slate-100 text-slate-400 tracking-wide uppercase">
                        BELUM DIBUKA
                      </span>
                    )}

                    {schedule.scoreText && (
                      <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-600 tracking-wide border border-emerald-100">
                        Skor: {schedule.scoreText}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-slate-800 leading-tight">
                      {schedule.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-3xl">
                      {schedule.description}
                    </p>
                  </div>

                  {/* Time & Clock widgets */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-300" />
                      <span>{schedule.timeText.split(",")[0]}</span>
                    </div>
                    {isActive && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-300" />
                        <span>Sisa waktu hari ini</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Right Side: Aksi Mulai / Hasil */}
                <div className="shrink-0 w-full md:w-auto">
                  {isActive && (
                    <Link href={schedule.targetUrl} className="w-full md:w-auto">
                      <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1a365d] hover:bg-[#122644] text-white text-xs font-extrabold rounded-xl transition-colors shadow-md w-full md:w-auto">
                        Mulai Sesi Ujian
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  )}

                  {isCompleted && (
                    <Link href={schedule.targetUrl} className="w-full md:w-auto">
                      <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-extrabold rounded-xl transition-colors shadow-sm w-full md:w-auto">
                        Lihat Hasil Ujian
                      </button>
                    </Link>
                  )}

                  {isLocked && (
                    <button 
                      disabled
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-400 text-xs font-extrabold rounded-xl w-full md:w-auto cursor-not-allowed border border-slate-100"
                    >
                      <Lock className="w-4 h-4" />
                      Belum Dibuka
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
