"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Folder, Search, ExternalLink, ChevronDown, ChevronLeft, ChevronRight, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createQuestionGroup, randomizeGroup } from "@/lib/questionGroupApi";
import { getQuestions } from "@/lib/questionApi";
import { getPositions } from "@/lib/positionApi";
import type { Question, Position } from "@/lib/types";

const DIFFICULTY_LABEL: Record<string, string> = { Easy: "Mudah", Medium: "Sedang", Hard: "Sulit" };
const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "bg-green-50 text-green-600",
  Medium: "bg-yellow-50 text-yellow-600",
  Hard: "bg-red-50 text-red-600",
};

export default function CreateQuestionGroupPage() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [filterPosition, setFilterPosition] = useState<number | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingQ, setLoadingQ] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // Randomize
  const [randomCount, setRandomCount] = useState(30);
  const [randomizing, setRandomizing] = useState(false);

  const LIMIT = 5;

  const fetchQuestions = useCallback(async () => {
    setLoadingQ(true);
    try {
      const res = await getQuestions({
        search: search || undefined,
        id_position: filterPosition || undefined,
        difficulty_flag: filterDifficulty as any || undefined,
        page,
        limit: LIMIT,
      });
      setQuestions(res.data);
      setTotalPages(res.meta.totalPages);
      setTotal(res.meta.total);
    } catch (err: any) {
      setError(err.message || "Gagal memuat soal");
    } finally {
      setLoadingQ(false);
    }
  }, [search, filterPosition, filterDifficulty, page]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  useEffect(() => {
    getPositions({ limit: 100 }).then((r) => setPositions(r.data)).catch(() => {});
  }, []);

  const handleToggle = (id: number) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleSelectAllPage = () => {
    const pageIds = questions.map((q) => q.id_question);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds([...new Set([...selectedIds, ...pageIds])]);
    }
  };

  const allPageSelected = questions.length > 0 && questions.every((q) => selectedIds.includes(q.id_question));

  const handleSave = async () => {
    setError(null);
    if (!groupName.trim()) { setError("Silakan isi nama grup soal!"); return; }
    if (selectedIds.length === 0) { setError("Pilih minimal 1 soal untuk grup ini!"); return; }

    setSaving(true);
    try {
      await createQuestionGroup({ group_name: groupName, description: description || undefined, question_ids: selectedIds });
      setSuccess(true);
      setTimeout(() => router.push("/admin/questions/groups"), 1500);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan grup.");
    } finally {
      setSaving(false);
    }
  };

  const handleRandomize = async () => {
    setError(null);
    if (!groupName.trim()) { setError("Isi nama grup dahulu sebelum mengacak soal!"); return; }

    // First create the group, then randomize
    setRandomizing(true);
    try {
      const res = await createQuestionGroup({ group_name: groupName, description: description || undefined });
      const groupId = res.data.id_group;
      const result = await randomizeGroup(groupId, randomCount);
      alert(`✅ ${result.message}`);
      router.push("/admin/questions/groups");
    } catch (err: any) {
      setError(err.message || "Gagal mengacak soal.");
    } finally {
      setRandomizing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-10 bg-slate-50/50">
      <div className="flex-1 px-8 pt-6 max-w-7xl mx-auto w-full">

        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400 mb-2">
          <Link href="/admin/questions/groups" className="hover:text-slate-600 transition-colors">Group Soal</Link>
          <span className="mx-2 font-normal text-slate-300">&gt;</span>
          <span className="text-[#5b61f4]">Buat Grup Baru</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Buat Grup Soal Baru</h2>
          <div className="inline-flex items-center bg-[#0a2351] rounded-full overflow-hidden shadow-md text-white">
            <div className="flex items-center gap-2 px-5 py-3 bg-[#133060] font-bold text-xs">
              <Folder className="w-4 h-4 text-blue-300" />
              <span>{selectedIds.length} Soal Terpilih</span>
            </div>
            <button onClick={handleSave} disabled={saving || success} className="px-6 py-3 bg-[#0a2351] hover:bg-[#07193a] text-xs font-extrabold tracking-wider transition-colors border-l border-[#133060] disabled:opacity-60 flex items-center gap-2">
              {saving && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              SIMPAN GRUP
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 text-sm">
            <CheckCircle className="w-4 h-4 shrink-0" /> Grup berhasil disimpan! Mengalihkan...
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-5">

            {/* Group Name */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">NAMA GRUP SOAL *</label>
              <input
                type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)}
                placeholder="Contoh: Seleksi CPNS 2024 - Gelombang 1"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-[#5b61f4] outline-none placeholder:text-slate-400"
              />
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-2">DESKRIPSI (opsional)</label>
              <textarea
                value={description} onChange={(e) => setDescription(e.target.value)}
                rows={2} placeholder="Deskripsi singkat grup soal..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-[#5b61f4] outline-none resize-none"
              />
            </div>

            {/* Filter */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">FILTER PENCARIAN</h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (setSearch(searchInput), setPage(1))}
                  placeholder="Cari konten soal..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#5b61f4] placeholder:text-slate-400"
                />
              </div>

              {/* Difficulty filter */}
              <div className="flex flex-wrap gap-1.5">
                {[{ v: "", l: "Semua" }, { v: "Easy", l: "Mudah" }, { v: "Medium", l: "Sedang" }, { v: "Hard", l: "Sulit" }].map((d) => (
                  <button key={d.v} type="button"
                    onClick={() => { setFilterDifficulty(d.v); setPage(1); }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${filterDifficulty === d.v ? "bg-[#0a2351] text-white border-[#0a2351]" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}>
                    {d.l}
                  </button>
                ))}
              </div>

              {/* Position filter */}
              {positions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <button type="button" onClick={() => { setFilterPosition(null); setPage(1); }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${!filterPosition ? "bg-[#5b61f4] text-white border-[#5b61f4]" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}>
                    Semua
                  </button>
                  {positions.map((p) => (
                    <button key={p.id_position} type="button"
                      onClick={() => { setFilterPosition(p.id_position); setPage(1); }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${filterPosition === p.id_position ? "bg-[#5b61f4] text-white border-[#5b61f4]" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}>
                      {p.position_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Randomize Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ACAK SOAL OTOMATIS</h3>
              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-500 font-medium shrink-0">Jumlah soal:</label>
                <input type="number" value={randomCount} onChange={(e) => setRandomCount(parseInt(e.target.value) || 1)} min={1} max={500}
                  className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#5b61f4]"
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Grup akan dibuat dahulu, lalu soal dipilih secara acak dari pool. Soal yang sudah dipilih manual akan diabaikan.
              </p>
              <button type="button" onClick={handleRandomize} disabled={randomizing || saving}
                className="w-full px-4 py-2.5 bg-[#4ade80] hover:bg-[#22c55e] text-white text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2">
                {randomizing && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Acak Soal
              </button>
            </div>

          </div>

          {/* Right: Questions List */}
          <div className="flex-1 w-full space-y-4">

            {/* Header Bar */}
            <div className="bg-[#eef2ff] border border-slate-200 rounded-xl px-5 py-3 flex items-center justify-between shadow-sm">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={allPageSelected} onChange={handleSelectAllPage}
                  className="w-4 h-4 text-[#5b61f4] border-slate-300 rounded focus:ring-[#5b61f4]" />
                <span className="text-[11px] font-bold text-[#0a2351] tracking-wider uppercase">
                  PILIH SEMUA DI HALAMAN INI
                </span>
              </label>
              <span className="text-xs text-slate-500 font-bold">
                Menampilkan {questions.length > 0 ? (page - 1) * LIMIT + 1 : 0}–{Math.min(page * LIMIT, total)} dari {total}
              </span>
            </div>

            {/* Question Cards */}
            <div className="space-y-3">
              {loadingQ ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse h-24" />
                ))
              ) : questions.length === 0 ? (
                <div className="text-center py-16 text-slate-400 bg-white border border-slate-200 rounded-xl">
                  Tidak ada soal ditemukan.
                </div>
              ) : (
                questions.map((q) => {
                  const isSelected = selectedIds.includes(q.id_question);
                  const posNames = q.trn_question_position?.map((p) => p.mst_position.position_name).join(", ") || "";
                  const diff = q.difficulty_flag;
                  return (
                    <div key={q.id_question}
                      className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-200 flex ${isSelected ? "border-slate-300 border-l-[6px] border-l-[#0a2351]" : "border-slate-200 border-l-[6px] border-l-transparent"}`}>
                      <div className="pl-5 py-5 flex items-start">
                        <input type="checkbox" checked={isSelected} onChange={() => handleToggle(q.id_question)}
                          className="w-4 h-4 text-[#0a2351] border-slate-300 rounded focus:ring-[#0a2351] cursor-pointer mt-0.5" />
                      </div>
                      <div className="flex-1 p-5 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {posNames && (
                              <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase bg-[#eef2ff] text-[#5b61f4]">
                                {posNames}
                              </span>
                            )}
                            {diff && (
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${DIFFICULTY_COLOR[diff]}`}>
                                {DIFFICULTY_LABEL[diff]}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-bold">
                              • {new Date(q.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <Link href={`/admin/questions/${q.id_question}/edit`} target="_blank" className="text-slate-400 hover:text-[#5b61f4] transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 leading-relaxed line-clamp-2">{q.question_desc}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Menampilkan {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} dari {total} soal</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1 hover:text-[#0a2351] disabled:opacity-30">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p = totalPages <= 5 ? i + 1 : Math.max(1, page - 2) + i;
                    if (p > totalPages) return null;
                    return (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-7 h-7 rounded flex items-center justify-center ${page === p ? "bg-[#0a2351] text-white" : "hover:bg-slate-200"}`}>
                        {p}
                      </button>
                    );
                  })}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 hover:text-[#0a2351] disabled:opacity-30">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
