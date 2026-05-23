"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { CheckSquare, Flag, ChevronLeft, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { apiFetch, getImageUrl } from "@/lib/api";
import { startAttempt, saveAnswer, updateTimeSpent, submitAttempt, timeoutAttempt } from "@/lib/attemptApi";
import type { Attempt, AttemptQuestion } from "@/lib/types";

export default function ActiveExamPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const sessionId = parseInt(params.sessionId as string, 10);

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [questions, setQuestions] = useState<AttemptQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // attemptQuestionId → answerId
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const questionStartTime = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load attempt: check localStorage for existing attempt, otherwise start new
  useEffect(() => {
    const init = async () => {
      try {
        // Get session & group info from localStorage (set by schedule page)
        const storedAttempt = localStorage.getItem(`attempt_session_${sessionId}`);
        let attemptData: Attempt;

        if (storedAttempt) {
          const parsed = JSON.parse(storedAttempt) as Attempt;
          if (parsed.status === "Ongoing") {
            attemptData = parsed;
          } else {
            localStorage.removeItem(`attempt_session_${sessionId}`);
            router.push(`/user/courses/${courseId}/sessions/${sessionId}/results?attemptId=${parsed.id_test_attempt}`);
            return;
          }
        } else {
          // Get group from URL or localStorage
          const groupId = parseInt(localStorage.getItem(`group_session_${sessionId}`) || "0", 10);
          if (!groupId) {
            setError("Tidak ada grup soal yang dipilih. Kembali ke halaman sesi.");
            setLoading(false);
            return;
          }
          const res = await startAttempt({ id_session: sessionId, id_question_group: groupId });
          attemptData = res.data;
          localStorage.setItem(`attempt_session_${sessionId}`, JSON.stringify(attemptData));
        }

        setAttempt(attemptData);
        const qs = attemptData.trn_attempt_question ?? [];
        setQuestions(qs);

        // Check if session has ended globally
        const sessionEndTime = attemptData.trn_test_session?.end_time ? new Date(attemptData.trn_test_session.end_time).getTime() : 0;
        if (sessionEndTime > 0 && Date.now() >= sessionEndTime) {
          try {
            await timeoutAttempt(attemptData.id_test_attempt);
          } catch {}
          localStorage.removeItem(`attempt_session_${sessionId}`);
          router.push(`/user/courses/${courseId}/sessions/${sessionId}/results?attemptId=${attemptData.id_test_attempt}&timed_out=1`);
          return;
        }

        // Set countdown from session duration
        const duration = attemptData.trn_test_session?.duration_minutes ?? 90;
        const elapsed = attemptData.started_at
          ? Math.floor((Date.now() - new Date(attemptData.started_at).getTime()) / 1000)
          : 0;
          
        let maxTimeLeft = duration * 60 - elapsed;
        if (sessionEndTime > 0) {
          const secondsUntilSessionEnd = Math.floor((sessionEndTime - Date.now()) / 1000);
          if (secondsUntilSessionEnd < maxTimeLeft) {
            maxTimeLeft = secondsUntilSessionEnd;
          }
        }
        
        setTimeLeft(Math.max(0, maxTimeLeft));
      } catch (err: any) {
        // If already has ongoing attempt, try to recover
        if (err.message?.includes("ongoing")) {
          const match = err.message.match(/id_test_attempt.*?(\d+)/);
          if (match) {
            setError("Anda sudah memiliki sesi aktif. Memuat ulang...");
          }
        }
        setError(err.message || "Gagal memulai sesi ujian.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [sessionId, courseId, router]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || !attempt) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [timeLeft, attempt]);

  const handleTimeout = async () => {
    if (!attempt) return;
    try {
      await timeoutAttempt(attempt.id_test_attempt);
      localStorage.removeItem(`attempt_session_${sessionId}`);
      router.push(`/user/courses/${courseId}/sessions/${sessionId}/results?attemptId=${attempt.id_test_attempt}&timed_out=1`);
    } catch { }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSelectOption = async (answerId: number) => {
    const q = questions[currentIdx];
    if (!attempt || !q) return;
    const timeSpent = Math.floor((Date.now() - questionStartTime.current) / 1000);

    // Optimistic update
    setAnswers((prev) => ({ ...prev, [q.id_test_attempt_question]: answerId }));

    try {
      await saveAnswer(attempt.id_test_attempt, q.id_test_attempt_question, {
        id_answer_option: answerId,
        time_spent_seconds: timeSpent,
      });
    } catch (err: any) {
      console.error("Save answer failed:", err.message);
    }
  };

  const handleNavTo = (idx: number) => {
    // Track time spent on current question before navigating
    if (attempt && questions[currentIdx]) {
      const timeSpent = Math.floor((Date.now() - questionStartTime.current) / 1000);
      const q = questions[currentIdx];
      updateTimeSpent(attempt.id_test_attempt, q.id_test_attempt_question, timeSpent).catch(() => {});
    }
    questionStartTime.current = Date.now();
    setCurrentIdx(idx);
  };

  const handleToggleFlag = () => {
    const q = questions[currentIdx];
    if (!q) return;
    setFlagged((prev) => ({ ...prev, [q.id_test_attempt_question]: !prev[q.id_test_attempt_question] }));
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(answers).length;
    const unanswered = questions.length - answeredCount;
    if (unanswered > 0) {
      if (!confirm(`Masih ada ${unanswered} soal belum dijawab. Yakin ingin mengakhiri test?`)) return;
    } else {
      if (!confirm("Yakin ingin mengakhiri dan mengumpulkan jawaban?")) return;
    }

    if (!attempt) return;
    setSubmitting(true);
    try {
      const result = await submitAttempt(attempt.id_test_attempt);
      localStorage.removeItem(`attempt_session_${sessionId}`);
      router.push(`/user/courses/${courseId}/sessions/${sessionId}/results?attemptId=${attempt.id_test_attempt}`);
    } catch (err: any) {
      alert("Gagal mengumpulkan: " + err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#1a365d] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-semibold text-sm">Memuat sesi ujian...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Gagal Memuat Ujian</h2>
          <p className="text-sm text-slate-500">{error}</p>
          <button onClick={() => router.back()} className="px-6 py-2.5 bg-[#1a365d] text-white rounded-lg text-sm font-bold hover:bg-[#122644] transition-colors">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const currentAnswers = currentQ?.mst_question?.mst_answer ?? [];
  const selectedAnswerId = currentQ ? answers[currentQ.id_test_attempt_question] : undefined;
  const isFlagged = currentQ ? !!flagged[currentQ.id_test_attempt_question] : false;
  const totalAnswered = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans relative">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#5b61f4] z-50" style={{ width: `${(totalAnswered / questions.length) * 100}%`, transition: "width 0.3s ease" }} />

      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between z-10 sticky top-1">
        <div className="flex items-center gap-4">
          <span className="text-xl font-extrabold text-[#1a365d] tracking-wide">BERITEST</span>
          <div className="h-5 w-px bg-slate-200" />
          <span className="text-xs font-bold text-slate-500 truncate max-w-xs md:max-w-md">
            {attempt?.trn_test_session?.session_name ?? "Sesi Ujian"}
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {/* Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm font-bold border ${timeLeft < 300 ? "bg-red-50 text-red-500 border-red-200 animate-pulse" : "bg-red-50 text-red-500 border-red-100"}`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>
          {/* End Test */}
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1a365d] hover:bg-[#122644] text-white text-xs font-extrabold rounded-lg transition-colors shadow-sm disabled:opacity-60">
            {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckSquare className="w-4 h-4" />}
            Akhiri Test
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 flex-col md:flex-row">

        {/* Left: Navigation Sidebar */}
        <aside className="w-full md:w-72 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 tracking-wider">NAVIGASI SOAL</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-[#5b61f4] tracking-wide">
                {totalAnswered}/{questions.length}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isSelected = currentIdx === idx;
                const isAnswered = !!answers[q.id_test_attempt_question];
                const isFlaggedQ = !!flagged[q.id_test_attempt_question];
                let cls = "bg-white border-slate-200 text-slate-400";
                if (isSelected) cls = "bg-white border-2 border-[#5b61f4] text-[#5b61f4] font-extrabold";
                else if (isFlaggedQ) cls = "bg-red-500 border-red-500 text-white font-bold";
                else if (isAnswered) cls = "bg-[#1a365d] border-[#1a365d] text-white font-bold";
                return (
                  <button key={q.id_test_attempt_question} onClick={() => handleNavTo(idx)}
                    className={`h-10 rounded-lg border text-xs flex items-center justify-center transition-all hover:scale-105 shadow-sm ${cls}`}>
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Legend */}
          <div className="space-y-2 pt-6 border-t border-slate-200 mt-4">
            {[
              { color: "bg-[#1a365d]", label: "Terjawab" },
              { color: "bg-red-500", label: "Ragu-ragu" },
              { color: "bg-white border border-slate-200", label: "Belum Dijawab" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                <span className={`w-4 h-4 rounded ${l.color}`} />
                <span>{l.label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Right: Question Content */}
        <main className="flex-1 bg-white p-8 md:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Question header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-[#5b61f4] uppercase tracking-wider">
                PERTANYAAN {currentIdx + 1} DARI {questions.length}
              </span>
              <button onClick={handleToggleFlag}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${isFlagged ? "bg-red-50/50 border-red-200 text-red-500" : "border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600"}`}
                title="Tandai Ragu-ragu">
                <Flag className="w-4 h-4" />
                <span className="text-[8px] font-extrabold uppercase tracking-wide">RAGU</span>
              </button>
            </div>

            {/* Question text */}
            {currentQ && (
              <div>
                {currentQ.mst_question?.question_content_html ? (
                  <div
                    className="text-base font-semibold text-slate-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentQ.mst_question.question_content_html }}
                  />
                ) : (
                  <h3 className="text-base font-bold text-slate-800 leading-relaxed">
                    {currentQ.mst_question?.question_desc}
                  </h3>
                )}

                {currentQ.mst_question?.img_path && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 max-w-lg">
                    <img src={getImageUrl(currentQ.mst_question.img_path)} alt="Gambar soal" className="w-full object-cover" />
                  </div>
                )}
              </div>
            )}

            {/* Answer options */}
            <div className="space-y-3 w-full">
              {currentAnswers.map((opt, optIdx) => {
                const isSelected = selectedAnswerId === opt.id_answer;
                const label = String.fromCharCode(65 + optIdx);
                return (
                  <div key={opt.id_answer} onClick={() => handleSelectOption(opt.id_answer)}
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-slate-50/80 shadow-sm ${isSelected ? "border-[#5b61f4] bg-blue-50/20" : "border-slate-200"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isSelected ? "bg-[#5b61f4] text-white" : "bg-[#f0f4ff] text-[#5b61f4]"}`}>
                      {label}
                    </div>
                    <span className={`text-sm font-semibold transition-colors ${isSelected ? "text-[#5b61f4]" : "text-slate-700"}`}>
                      {opt.answer_desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-10">
            <button onClick={() => handleNavTo(currentIdx - 1)} disabled={currentIdx === 0}
              className={`flex items-center gap-2 px-6 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 transition-colors shadow-sm ${currentIdx === 0 ? "opacity-40 cursor-not-allowed" : ""}`}>
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </button>
            <button onClick={() => handleNavTo(currentIdx + 1)} disabled={currentIdx === questions.length - 1}
              className={`flex items-center gap-2 px-6 py-2.5 bg-[#5b61f4] hover:bg-[#474de0] text-white rounded-lg text-xs font-bold transition-colors shadow-sm ${currentIdx === questions.length - 1 ? "opacity-40 cursor-not-allowed" : ""}`}>
              Selanjutnya <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
