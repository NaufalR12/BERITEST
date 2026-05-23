"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Download, Share2, CheckCircle, XCircle, MinusCircle, CheckCircle2, AlertCircle } from "lucide-react";
import UserHeader from "@/components/user/UserHeader";
import { getAttemptDetail } from "@/lib/attemptApi";
import type { Attempt, AttemptQuestion } from "@/lib/types";

export default function ExamResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = params.id as string;
  const sessionId = params.sessionId as string;
  const attemptId = parseInt(searchParams.get("attemptId") || "0", 10);
  const timedOut = searchParams.get("timed_out") === "1";

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!attemptId) { setError("ID attempt tidak ditemukan."); setLoading(false); return; }
    getAttemptDetail(attemptId)
      .then((res) => setAttempt(res.data))
      .catch((err) => setError(err.message || "Gagal memuat hasil ujian"))
      .finally(() => setLoading(false));
  }, [attemptId]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1a365d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md text-center shadow-sm space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <p className="text-sm text-slate-500">{error || "Data tidak ditemukan."}</p>
          <button onClick={() => router.push(`/user/courses/${courseId}`)} className="px-6 py-2.5 bg-[#1a365d] text-white rounded-lg text-sm font-bold">
            Kembali ke Course
          </button>
        </div>
      </div>
    );
  }

  const score = Number(attempt.score ?? 0);
  const passingScore = Number(attempt.trn_test_session?.passing_score ?? 70);
  const passed = score >= passingScore;
  const totalQuestions = attempt.trn_attempt_question?.length ?? 0;
  const unanswered = totalQuestions - (attempt.total_correct + attempt.total_wrong);
  const durationSecs = attempt.duration_seconds ?? 0;

  const scoreCircumference = 2 * Math.PI * 54;
  const scoreOffset = scoreCircumference * (1 - score / 100);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <UserHeader activeTab="Course" />
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-10 space-y-6">

        {/* Title */}
        <div>
          <h2 className="text-3xl font-extrabold text-[#1a365d] tracking-tight">Hasil Ujian Anda</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {attempt.trn_test_session?.session_name} {timedOut && "— Waktu Habis"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left Column */}
          <div className="flex-1 w-full space-y-6">

            {/* Score Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-8">
              {/* Circular Score */}
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="54" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                  <circle cx="64" cy="64" r="54" stroke={passed ? "#1a365d" : "#ef4444"} strokeWidth="10" fill="transparent"
                    strokeDasharray={scoreCircumference} strokeDashoffset={scoreOffset} strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-slate-800">{Math.round(score)}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">DARI 100</span>
                </div>
              </div>

              {/* Congratulatory */}
              <div className="space-y-3 flex-1 text-center md:text-left">
                <div>
                  <span className={`inline-block text-[9px] font-extrabold px-3 py-1 rounded-full tracking-wide border ${passed ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                    {passed ? "✓ LULUS AMBANG BATAS" : "✗ BELUM MENCAPAI AMBANG BATAS"}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-800 leading-tight">
                  {passed ? "Selamat!" : "Tetap Semangat!"} {attempt.mst_users?.nama_user}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {passed
                    ? `Anda telah menyelesaikan ujian dengan skor ${Math.round(score)}/100, melampaui ambang batas ${passingScore}.`
                    : `Skor Anda ${Math.round(score)}/100. Ambang batas minimal adalah ${passingScore}. Terus belajar dan coba lagi!`}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                  <button className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1a365d] hover:bg-[#122644] text-white text-xs font-extrabold rounded-lg transition-colors shadow-sm">
                    <Download className="w-4 h-4" /> UNDUH SERTIFIKAT
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-extrabold rounded-lg transition-colors shadow-sm">
                    <Share2 className="w-4 h-4" /> BAGIKAN HASIL
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50/30 border border-emerald-100/60 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-800">{attempt.total_correct}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jawaban Benar</p>
                </div>
              </div>
              <div className="bg-rose-50/30 border border-rose-100/60 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-800">{attempt.total_wrong}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jawaban Salah</p>
                </div>
              </div>
              <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100/50 flex items-center justify-center text-slate-400 shrink-0">
                  <MinusCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-800">{unanswered}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tidak Dijawab</p>
                </div>
              </div>
            </div>

            {/* Question Review */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2">
                <h4 className="text-base font-extrabold text-[#1a365d]">Review Soal</h4>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Benar</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" />Salah</div>
                </div>
              </div>
              <hr className="border-slate-100" />

              <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                {(attempt.trn_attempt_question ?? []).slice(0, 20).map((aq, idx) => {
                  const userAns = aq.trn_user_answer?.[0];
                  const isCorrect = userAns?.is_correct ?? false;
                  const isAnswered = !!userAns;

                  return (
                    <div key={aq.id_test_attempt_question}>
                      <div className="flex gap-4">
                        <span className={`w-6 h-6 rounded font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${!isAnswered ? "bg-slate-100 text-slate-400" : isCorrect ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                          {idx + 1}
                        </span>
                        <div className="space-y-2 flex-1">
                          <p className="text-xs font-bold text-slate-800 leading-relaxed line-clamp-3">
                            {aq.mst_question?.question_desc}
                          </p>
                          {isAnswered ? (
                            <div className={`rounded-lg p-3 flex justify-between items-center border ${isCorrect ? "bg-emerald-50/40 border-emerald-100/80" : "bg-rose-50/40 border-rose-100/80"}`}>
                              <span className={`text-xs font-bold ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                                {aq.mst_question?.mst_answer?.find((a: any) => a.id_answer === userAns?.id_answer_option)?.answer_desc ?? "Jawaban Anda"}
                              </span>
                              {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                            </div>
                          ) : (
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                              <span className="text-xs text-slate-400 font-medium">Tidak dijawab</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {idx < (attempt.trn_attempt_question?.length ?? 1) - 1 && <hr className="border-slate-100 mt-4" />}
                    </div>
                  );
                })}
              </div>

              {(attempt.trn_attempt_question?.length ?? 0) > 20 && (
                <div className="pt-4">
                  <button className="w-full text-center border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-extrabold py-3.5 rounded-lg transition-colors shadow-sm">
                    LIHAT SEMUA {attempt.trn_attempt_question?.length} SOAL
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right: Duration Card */}
          <div className="w-full lg:w-80 shrink-0 space-y-4">
            <div className="bg-[#151c55] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden h-48 flex flex-col justify-between">
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10 select-none pointer-events-none">
                <svg className="w-36 h-36" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div className="space-y-3 relative z-10">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">WAKTU PENGERJAAN</span>
                <div>
                  <span className="text-3xl font-extrabold tracking-tight">{formatDuration(durationSecs)}</span>
                  <span className="text-xs font-bold text-slate-300 ml-2">
                    dari {attempt.trn_test_session?.duration_minutes ?? "-"}:00 menit
                  </span>
                </div>
              </div>
              <p className="text-[11px] font-bold text-slate-300 relative z-10">
                {totalQuestions > 0 ? `Rata-rata: ${Math.round(durationSecs / totalQuestions)} detik per soal` : ""}
              </p>
            </div>

            <Link href={`/user/courses/${courseId}`}>
              <button className="w-full px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-[#1a365d] text-sm font-extrabold rounded-xl transition-colors shadow-sm">
                Kembali ke Course
              </button>
            </Link>
            <Link href="/user/schedule">
              <button className="w-full px-6 py-3 bg-[#1a365d] hover:bg-[#122644] text-white text-sm font-extrabold rounded-xl transition-colors shadow-sm">
                Lihat Jadwal Lainnya
              </button>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
