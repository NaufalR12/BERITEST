"use client";

import { useState, useEffect, useCallback } from "react";
import { FolderPlus, FileText, Trash2, Eye, Search, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getQuestionGroups, deleteQuestionGroup } from "@/lib/questionGroupApi";
import type { QuestionGroup } from "@/lib/types";

// Assign a stable pastel color per group based on index
const CARD_COLORS = [
  "bg-[#eef2ff] text-[#5b61f4]",
  "bg-blue-50 text-blue-600",
  "bg-indigo-50 text-indigo-600",
  "bg-purple-50 text-purple-600",
  "bg-pink-50 text-pink-600",
  "bg-teal-50 text-teal-600",
];

export default function QuestionGroupsPage() {
  const [groups, setGroups] = useState<QuestionGroup[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const LIMIT = 12;

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getQuestionGroups({ search: search || undefined, page, limit: LIMIT });
      setGroups(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);
    } catch (err: any) {
      setError(err.message || "Gagal memuat grup soal");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const handleSearch = () => { setSearch(searchInput); setPage(1); };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus grup "${name}"?\n\nSemua soal dalam grup ini akan dilepaskan.`)) return;
    setDeletingId(id);
    try {
      await deleteQuestionGroup(id);
      fetchGroups();
    } catch (err: any) {
      alert("Gagal menghapus: " + (err.message || "Server error"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <div className="flex-1 px-8 pt-8 max-w-7xl mx-auto w-full">

        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400 mb-2">
          <Link href="/admin/questions" className="hover:text-slate-600 transition-colors">Questions</Link>
          <span className="mx-2 font-normal text-slate-300">&gt;</span>
          <span className="text-[#5b61f4]">Grup Soal</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Manajemen Grup Soal</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Kelola pengelompokan soal — {total} grup tersedia
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Cari nama grup..."
                className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-[#5b61f4] outline-none w-48"
              />
            </div>
            <button onClick={handleSearch} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors">
              Cari
            </button>
            <Link href="/admin/questions/groups/create" className="flex items-center gap-2 px-5 py-2.5 bg-[#5b61f4] hover:bg-[#4f46e5] text-white font-bold text-sm rounded-lg transition-colors shadow-sm">
              <FolderPlus className="w-4 h-4" />
              Buat Grup Baru
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Card Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 h-52 animate-pulse space-y-3">
                <div className="h-5 bg-slate-100 rounded w-1/3" />
                <div className="h-6 bg-slate-100 rounded w-2/3" />
                <div className="h-12 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <FolderPlus className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="font-semibold">Belum ada grup soal.</p>
            <p className="text-sm mt-1">Klik "Buat Grup Baru" untuk memulai.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {groups.map((group, idx) => {
              const colorClass = CARD_COLORS[idx % CARD_COLORS.length];
              const questionCount = group._count?.trn_question_group_item ?? 0;
              const createdDate = new Date(group.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

              return (
                <div key={group.id_group} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                  {/* Badge */}
                  <div className="mb-4 flex items-start justify-between">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${colorClass}`}>
                      {questionCount} Soal
                    </span>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/questions/groups/${group.id_group}`} title="Detail" className="text-slate-400 hover:text-[#5b61f4] transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(group.id_group, group.group_name)} disabled={deletingId === group.id_group} title="Hapus" className="text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mb-6 flex-1">
                    <h3 className="text-base font-bold text-[#0a2351] mb-2 leading-tight">{group.group_name}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                      {group.description || "Tidak ada deskripsi."}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#5b61f4]" />
                      <span className="text-sm font-extrabold text-[#0a2351]">{questionCount} Soal</span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">{createdDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 hover:text-[#0a2351] disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${page === p ? "bg-[#0a2351] text-white" : "hover:bg-slate-200"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 hover:text-[#0a2351] disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
