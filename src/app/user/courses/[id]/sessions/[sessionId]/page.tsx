"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Timer, FileSpreadsheet, Info, AlertCircle, ChevronDown } from "lucide-react";
import UserHeader from "@/components/user/UserHeader";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface SessionInfo {
  id_session: number;
  session_name: string;
  duration_minutes: number;
  passing_score: number;
  status: string;
  trn_session_question_group?: { id_question_group: number; mst_group_question: { group_name: string; _count?: { trn_question_group_item: number } } }[];
}

export default function ExamPreparationPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const sessionId = parseInt(params.sessionId as string, 10);

  const [session, setSession] = useState<SessionInfo | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch(`/test-sessions/${sessionId}`)
      .then((res: any) => {
        setSession(res.data);
        // Auto-select first group if only one
        const groups = res.data?.trn_session_question_group ?? [];
        if (groups.length === 1) setSelectedGroup(groups[0].id_question_group);
      })
      .catch((err: any) => setError(err.message || "Gagal memuat info sesi"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleStartTest = () => {
    if (!selectedGroup) {
      alert("Pilih grup soal terlebih dahulu!");
      return;
    }
    // Save group selection to localStorage so active page can pick it up
    localStorage.setItem(`group_session_${sessionId}`, String(selectedGroup));
    router.push(`/user/courses/${courseId}/sessions/${sessionId}/active`);
  };

  const groups = session?.trn_session_question_group ?? [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1a365d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <UserHeader activeTab="Course" />
      <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-12 flex flex-col items-center space-y-8">

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-[#1a365d] tracking-tight">
            {session?.session_name ?? "Sesi Ujian"}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Pastikan koneksi internet Anda stabil sebelum memulai sesi ujian.
          </p>
        </div>

        {error && (
          <div className="w-full max-w-2xl p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <div className="bg-[#f0f4ff]/50 border border-slate-200 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#eef2ff] flex items-center justify-center text-[#1a365d]">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DURASI UJIAN</p>
              <p className="text-lg font-extrabold text-[#1a365d] mt-0.5">
                {session?.duration_minutes ?? "—"} Menit
              </p>
            </div>
          </div>
          <div className="bg-[#f0f4ff]/50 border border-slate-200 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#eef2ff] flex items-center justify-center text-[#1a365d]">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AMBANG LULUS</p>
              <p className="text-lg font-extrabold text-[#1a365d] mt-0.5">
                {session?.passing_score ?? "—"} / 100
              </p>
            </div>
          </div>
        </div>

        {/* Group Selection (if multiple groups) */}
        {groups.length > 1 && (
          <div className="w-full max-w-2xl space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Paket Soal</label>
            <div className="grid gap-3">
              {groups.map((g) => (
                <button key={g.id_question_group} type="button"
                  onClick={() => setSelectedGroup(g.id_question_group)}
                  className={`w-full text-left px-4 py-3 border-2 rounded-xl text-sm font-semibold transition-all ${selectedGroup === g.id_question_group ? "border-[#1a365d] bg-[#f0f4ff]" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                  <span className="font-bold text-[#1a365d]">{g.mst_group_question.group_name}</span>
                  <span className="text-slate-400 text-xs ml-2">— {g.mst_group_question._count?.trn_question_group_item ?? 0} soal</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-2xl shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#1a365d]">Petunjuk Ujian Detail</h3>
          <hr className="border-slate-100" />
          <div className="space-y-4 text-xs font-semibold text-slate-500 leading-relaxed">
            {[
              "Gunakan browser versi terbaru (Chrome/Firefox/Safari) untuk pengalaman terbaik. Hindari penggunaan mode incognito.",
              "Sistem akan secara otomatis menyimpan jawaban setiap kali Anda memilih opsi. Tidak perlu khawatir jika koneksi terputus sesaat.",
              "Anda dapat melewati soal dan kembali lagi menggunakan panel navigasi di sebelah kiri layar.",
              "Pengerjaan akan berakhir otomatis ketika waktu hitung mundur mencapai 00:00:00.",
            ].map((instruction, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-[#1a365d] font-extrabold shrink-0">{String(i + 1).padStart(2, "0")}.</span>
                <p>{instruction}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#f0f4ff]/50 border-l-4 border-[#1a365d] p-4 rounded-r-lg flex gap-3 items-start">
            <Info className="w-5 h-5 text-[#1a365d] shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-[#1a365d] leading-relaxed">
              Dengan menekan tombol "Mulai Test", Anda menyetujui semua peraturan ujian dan waktu pengerjaan akan segera dimulai.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 w-full pt-2">
          <button onClick={handleStartTest} disabled={groups.length > 1 && !selectedGroup}
            className="px-10 py-3.5 bg-[#1a365d] hover:bg-[#122644] text-white text-sm font-extrabold rounded-lg transition-colors shadow-md w-full max-w-xs disabled:opacity-50">
            Mulai Test Sekarang
          </button>
          <Link href={`/user/courses/${courseId}`} className="text-xs text-slate-400 font-bold hover:text-slate-600 transition-colors hover:underline">
            Batal dan Kembali ke Dashboard
          </Link>
        </div>

      </main>
    </div>
  );
}
