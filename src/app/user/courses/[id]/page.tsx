"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
import { apiFetch } from "@/lib/api";

interface TestSession {
  id_session: number;
  session_name: string;
  start_time: string | null;
  end_time: string | null;
  status: string;
  passing_score?: number;
}

interface Course {
  id: number;
  course_title: string;
  description: string;
  trn_test_session: TestSession[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch(`/courses/${courseId}`),
      apiFetch(`/attempts/my?limit=100`)
    ])
      .then(([courseRes, attemptRes]: any[]) => {
        setCourse(courseRes.data);
        setAttempts(attemptRes.data || []);
      })
      .catch((err: any) => setError(err.message || "Gagal memuat detail course"))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
        <UserHeader activeTab="Course" />
        <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-10 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-[#1a365d] border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
        <UserHeader activeTab="Course" />
        <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-10 text-center text-red-500">
          {error || "Course tidak ditemukan"}
        </main>
      </div>
    );
  }

  const sessions = course.trn_test_session || [];
  
  // Calculate completed sessions from attempts
  const completedSessions = sessions.filter(s => {
    const attempt = attempts.find(a => a.id_session === s.id_session);
    return attempt && (attempt.status === 'Submitted' || attempt.status === 'Completed' || attempt.status === 'Timed-Out');
  });
  const progressPercent = sessions.length > 0 ? Math.round((completedSessions.length / sessions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <UserHeader activeTab="Course" />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-10 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400">
          <Link href="/user" className="hover:text-slate-600 transition-colors">My Exams</Link>
          <span className="mx-2 font-normal text-slate-300">›</span>
          <span className="text-[#5b61f4]">{course.course_title}</span>
        </nav>

        {/* Course Header Title & Progress */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          {/* Left: Title & Description */}
          <div className="lg:max-w-2xl space-y-3">
            <h2 className="text-3xl font-extrabold text-[#1a365d] tracking-tight">
              {course.course_title}
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {course.description || "Tidak ada deskripsi."}
            </p>
          </div>

          {/* Right: Progress Card (Mocked for now) */}
          <div className="bg-[#f0f4ff] border border-[#c7d2fe]/60 rounded-xl p-5 w-full lg:w-80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                KESELURUHAN PROGRES
              </span>
              <span className="text-xl font-extrabold text-[#5b61f4]">{progressPercent}%</span>
            </div>
            
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-[#5b61f4] h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
            
            <p className="text-[11px] font-extrabold text-slate-500 tracking-wide">
              {completedSessions.length}/{sessions.length} Sesi Terselesaikan
            </p>
          </div>
        </div>

        {/* Sesi List Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <ListTodo className="w-5 h-5 text-[#1a365d]" />
            <h3 className="text-base font-bold text-[#1a365d]">
              Kurikulum Sesi
            </h3>
          </div>

          <div className="space-y-4">
            {sessions.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
                Belum ada sesi ujian yang ditugaskan untuk course ini.
              </div>
            ) : (
              sessions.map((session, idx) => {
                const formatDateTimeRange = (start: string | null, end: string | null) => {
                  if (!start && !end) return "Tersedia kapan saja";
                  const formatOpt: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
                  const s = start ? new Date(start).toLocaleDateString('id-ID', formatOpt) : 'Kapan saja';
                  const e = end ? new Date(end).toLocaleDateString('id-ID', formatOpt) : 'Kapan saja';
                  return `${s} — ${e}`;
                };

                const now = new Date().getTime();
                const startTime = session.start_time ? new Date(session.start_time).getTime() : 0;
                const endTime = session.end_time ? new Date(session.end_time).getTime() : 0;
                
                let computedStatus = session.status;
                if (computedStatus === 'Upcoming' && startTime > 0 && now >= startTime) computedStatus = 'Active';
                if (computedStatus === 'Active' && endTime > 0 && now >= endTime) computedStatus = 'Completed';

                const attempt = attempts.find(a => a.id_session === session.id_session);
                
                let badgeText = "BELUM DIMULAI";
                let badgeColor = "bg-slate-100 text-slate-500";
                
                if (computedStatus === 'Active') {
                  badgeText = "TERSEDIA";
                  badgeColor = "bg-[#1a365d] text-white";
                } else if (computedStatus === 'Completed') {
                  badgeText = "SELESAI";
                  badgeColor = "bg-slate-200 text-slate-600";
                } else if (computedStatus === 'Cancelled') {
                  badgeText = "DIBATALKAN";
                  badgeColor = "bg-red-100 text-red-600";
                }

                if (attempt) {
                  if (attempt.status === 'Ongoing') {
                    badgeText = "SEDANG BERJALAN";
                    badgeColor = "bg-yellow-100 text-yellow-700";
                    
                    if (computedStatus !== 'Active') {
                      badgeText = "WAKTU HABIS";
                      badgeColor = "bg-red-100 text-red-700";
                    }
                  } else {
                    badgeText = "DIKUMPULKAN";
                    badgeColor = "bg-green-100 text-green-700";
                  }
                }

                let actionText = "Lihat Detail Sesi";
                let actionHref = `/user/courses/${course.id}/sessions/${session.id_session}`;
                let disabled = false;

                if (attempt) {
                  if (attempt.status === 'Ongoing') {
                    if (computedStatus === 'Active') {
                      actionText = "Lanjutkan Ujian";
                      actionHref = `/user/courses/${course.id}/sessions/${session.id_session}/active`;
                    } else {
                      actionText = "Waktu Habis";
                      disabled = true;
                    }
                  } else {
                    actionText = "Lihat Hasil";
                    actionHref = `/user/courses/${course.id}/sessions/${session.id_session}/results?attemptId=${attempt.id_test_attempt}`;
                  }
                } else {
                  if (computedStatus === 'Upcoming') {
                    actionText = "Belum Tersedia";
                    disabled = true;
                  } else if (computedStatus === 'Completed') {
                    actionText = "Sesi Berakhir";
                    disabled = true;
                  } else if (computedStatus === 'Cancelled') {
                    actionText = "Sesi Dibatalkan";
                    disabled = true;
                  }
                }

                return (
                  <div key={session.id_session} className={`bg-white border-2 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md ${computedStatus === 'Active' ? 'border-[#1a365d]' : 'border-slate-200'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 md:mt-0 ${computedStatus === 'Active' ? 'bg-[#eef2ff] text-[#1a365d]' : 'bg-slate-100 text-slate-400'}`}>
                        {attempt && attempt.status !== 'Ongoing' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <PlayCircle className="w-5 h-5" />}
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded tracking-wide uppercase ${badgeColor}`}>
                            {badgeText}
                          </span>
                          <span className="text-xs text-slate-400 font-bold">
                            Sesi {idx + 1}
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-slate-800 leading-tight">
                          {session.session_name}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          {formatDateTimeRange(session.start_time, session.end_time)}
                        </p>
                      </div>
                    </div>

                    <div className="w-full md:w-auto">
                      {disabled ? (
                        <button disabled className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-400 text-xs font-extrabold rounded-lg shadow-sm w-full md:w-auto cursor-not-allowed">
                          {actionText}
                        </button>
                      ) : (
                        <Link href={actionHref}>
                          <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1a365d] hover:bg-[#122644] text-white text-xs font-extrabold rounded-lg transition-colors shadow-sm shrink-0 w-full md:w-auto">
                            {actionText}
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Info Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-lg bg-[#eef2ff] flex items-center justify-center text-[#5b61f4]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Jadwal Ujian Terdekat</p>
              <p className="text-sm font-extrabold text-[#1a365d] mt-0.5">Lihat Sesi</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-lg bg-[#eef2ff] flex items-center justify-center text-[#5b61f4]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Status Kelulusan</p>
              <p className="text-sm font-extrabold text-[#1a365d] mt-0.5">Selesaikan Ujian</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-lg bg-[#eef2ff] flex items-center justify-center text-[#5b61f4]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Butuh Bantuan?</p>
              <p className="text-sm font-extrabold text-[#1a365d] mt-0.5">Hubungi Admin</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
