"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Folder, Filter, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Search, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getQuestions, deleteQuestion, getQuestionSummary } from "@/lib/questionApi";
import { getPositions } from "@/lib/positionApi";
import type { Question, Position, QuestionSummary } from "@/lib/types";

const DIFFICULTY_MAP: Record<string, { label: string; color: string }> = {
  Easy: { label: "Mudah", color: "bg-green-50 text-green-600" },
  Medium: { label: "Sedang", color: "bg-yellow-50 text-yellow-600" },
  Hard: { label: "Sulit", color: "bg-red-50 text-red-600" },
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [summary, setSummary] = useState<QuestionSummary | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filterPosition, setFilterPosition] = useState<number | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const LIMIT = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [qRes, sumRes] = await Promise.all([
        getQuestions({
          search: search || undefined,
          id_position: filterPosition || undefined,
          difficulty_flag: filterDifficulty as any || undefined,
          page,
          limit: LIMIT,
        }),
        getQuestionSummary(),
      ]);
      setQuestions(qRes.data);
      setTotal(qRes.meta.total);
      setTotalPages(qRes.meta.totalPages);
      setSummary(sumRes.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data soal");
    } finally {
      setLoading(false);
    }
  }, [search, filterPosition, filterDifficulty, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    getPositions({ limit: 100 })
      .then((res) => setPositions(res.data))
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleDelete = async (id: number, desc: string) => {
    if (!confirm(`Hapus soal "${desc.slice(0, 50)}..."?\n\nTindakan ini tidak dapat dibatalkan.`)) return;
    setDeletingId(id);
    try {
      await deleteQuestion(id);
      fetchData();
    } catch (err: any) {
      alert("Gagal menghapus: " + (err.message || "Server error"));
    } finally {
      setDeletingId(null);
    }
  };

  const renderPageButtons = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <div className="flex-1 px-8 pt-8 max-w-7xl mx-auto w-full">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Master Soal</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Kelola seluruh bank pertanyaan untuk asesmen aktif.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/questions/groups" className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#0a2351] text-[#0a2351] font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors">
              <Folder className="w-4 h-4" />
              Grup Soal
            </Link>
            <Link href="/admin/questions/create" className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2351] text-white font-bold text-sm rounded-lg hover:bg-[#0f337a] transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Tambah Soal
            </Link>
          </div>
        </div>

        {/* Stats & Filter Row */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Summary Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-w-[280px]">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">RINGKASAN SOAL</h3>
            {summary ? (
              <div className="space-y-1.5">
                <div className="flex items-baseline gap-3">
                  <p className="text-4xl font-extrabold text-[#0a2351]">{summary.total.toLocaleString()}</p>
                  <span className="text-xs font-bold text-slate-400">total soal</span>
                </div>
                <div className="flex gap-3 pt-1 text-[11px] font-bold">
                  <span className="text-green-600">{summary.easy} Mudah</span>
                  <span className="text-yellow-600">{summary.medium} Sedang</span>
                  <span className="text-red-600">{summary.hard} Sulit</span>
                </div>
              </div>
            ) : (
              <div className="h-12 bg-slate-100 animate-pulse rounded" />
            )}
          </div>

          {/* Filter Area */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            {/* Search */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Cari teks soal..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-[#5b61f4] outline-none"
                />
              </div>
              <button onClick={handleSearch} className="px-4 py-2 bg-[#0a2351] text-white text-xs font-bold rounded-lg hover:bg-[#0f337a] transition-colors">
                Cari
              </button>
            </div>

            {/* Position Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <button
                onClick={() => { setFilterPosition(null); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${!filterPosition ? "bg-[#eef2ff] text-[#5b61f4]" : "text-slate-500 hover:bg-slate-100"}`}
              >
                Semua Posisi
              </button>
              {positions.map((p) => (
                <button
                  key={p.id_position}
                  onClick={() => { setFilterPosition(p.id_position); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${filterPosition === p.id_position ? "bg-[#eef2ff] text-[#5b61f4]" : "text-slate-500 hover:bg-slate-100"}`}
                >
                  {p.position_name}
                </button>
              ))}

              {/* Difficulty Filter */}
              <span className="w-px h-4 bg-slate-200" />
              {["", "Easy", "Medium", "Hard"].map((d) => (
                <button
                  key={d || "all-diff"}
                  onClick={() => { setFilterDifficulty(d); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${filterDifficulty === d ? "bg-[#0a2351] text-white" : "text-slate-500 hover:bg-slate-100"}`}
                >
                  {d === "" ? "Semua" : DIFFICULTY_MAP[d].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="p-5 w-[45%]">TEKS PERTANYAAN</th>
                  <th className="p-5 w-[15%]">POSISI</th>
                  <th className="p-5 w-[12%]">KESULITAN</th>
                  <th className="p-5 w-[13%]">TANGGAL DIBUAT</th>
                  <th className="p-5 w-[10%]">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="p-5"><div className="h-4 bg-slate-100 animate-pulse rounded w-3/4" /></td>
                      <td className="p-5"><div className="h-5 bg-slate-100 animate-pulse rounded w-20" /></td>
                      <td className="p-5"><div className="h-5 bg-slate-100 animate-pulse rounded w-16" /></td>
                      <td className="p-5"><div className="h-4 bg-slate-100 animate-pulse rounded w-24" /></td>
                      <td className="p-5"><div className="h-4 bg-slate-100 animate-pulse rounded w-16" /></td>
                    </tr>
                  ))
                ) : questions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 text-sm font-medium">
                      Tidak ada soal ditemukan.
                    </td>
                  </tr>
                ) : (
                  questions.map((q) => {
                    const diff = DIFFICULTY_MAP[q.difficulty_flag] || DIFFICULTY_MAP.Medium;
                    const posNames = q.trn_question_position?.map((p) => p.mst_position.position_name).join(", ") || "-";
                    const createdDate = new Date(q.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit", month: "short", year: "numeric"
                    });
                    return (
                      <tr key={q.id_question} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors">
                        <td className="p-5">
                          <p className="font-semibold text-sm text-[#0a2351] truncate max-w-md">{q.question_desc}</p>
                          <span className="text-[10px] text-slate-400">{q._count?.mst_answer ?? 0} jawaban</span>
                        </td>
                        <td className="p-5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#eef2ff] text-[#5b61f4] max-w-[140px] truncate block">
                            {posNames}
                          </span>
                        </td>
                        <td className="p-5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${diff.color}`}>
                            {diff.label}
                          </span>
                        </td>
                        <td className="p-5">
                          <span className="text-xs font-medium text-slate-600">{createdDate}</span>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <Link href={`/admin/questions/${q.id_question}/edit`} title="Edit" className="text-slate-400 hover:text-[#0a2351] transition-colors">
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(q.id_question, q.question_desc)}
                              disabled={deletingId === q.id_question}
                              title="Hapus"
                              className="text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-[#f8fafc]">
            <span className="text-xs font-bold text-slate-500">
              Menampilkan {questions.length > 0 ? (page - 1) * LIMIT + 1 : 0}–{Math.min(page * LIMIT, total)} dari {total} soal
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1 hover:text-[#0a2351] disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {renderPageButtons().map((p, i) =>
                p === "..." ? (
                  <span key={`e${i}`} className="px-1 text-slate-400">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${page === p ? "bg-[#0a2351] text-white" : "hover:bg-slate-200"}`}
                  >
                    {p}
                  </button>
                )
              )}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 hover:text-[#0a2351] disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
