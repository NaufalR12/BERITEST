"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Check, X, AlertCircle, Search, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { getPositions, createPosition, updatePosition, deletePosition } from "@/lib/positionApi";
import type { Position } from "@/lib/types";

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Create
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Edit
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Delete
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const LIMIT = 15;

  const fetchPositions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPositions({ search: search || undefined, page, limit: LIMIT });
      setPositions(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data posisi");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { fetchPositions(); }, [fetchPositions]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await createPosition({ position_name: newName.trim() });
      setNewName("");
      setShowCreateForm(false);
      fetchPositions();
      showSuccess("Posisi berhasil ditambahkan!");
    } catch (err: any) {
      setError(err.message || "Gagal menambah posisi");
    } finally {
      setCreating(false);
    }
  };

  const handleEditStart = (pos: Position) => {
    setEditingId(pos.id_position);
    setEditName(pos.position_name);
    setError(null);
  };

  const handleEditSave = async (id: number) => {
    if (!editName.trim()) return;
    setEditLoading(true);
    setError(null);
    try {
      await updatePosition(id, { position_name: editName.trim() });
      setEditingId(null);
      fetchPositions();
      showSuccess("Posisi berhasil diperbarui!");
    } catch (err: any) {
      setError(err.message || "Gagal mengupdate posisi");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus posisi "${name}"?\n\nPosisi yang masih dipakai soal tidak bisa dihapus.`)) return;
    setDeletingId(id);
    setError(null);
    try {
      await deletePosition(id);
      fetchPositions();
      showSuccess("Posisi berhasil dihapus!");
    } catch (err: any) {
      setError(err.message || "Gagal menghapus posisi");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <div className="flex-1 px-8 pt-8 max-w-5xl mx-auto w-full">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Manajemen Posisi</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Kelola daftar posisi jabatan — {total} posisi terdaftar
            </p>
          </div>
          <button
            onClick={() => { setShowCreateForm(!showCreateForm); setError(null); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2351] text-white font-bold text-sm rounded-lg hover:bg-[#0f337a] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Posisi
          </button>
        </div>

        {/* Feedback */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 text-sm">
            <Check className="w-4 h-4 shrink-0" /> {successMsg}
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-6 bg-white border-2 border-[#5b61f4] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#0a2351] mb-3">Tambah Posisi Baru</h3>
            <form onSubmit={handleCreate} className="flex gap-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Contoh: Software Engineer"
                autoFocus
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-[#5b61f4] outline-none placeholder:text-slate-400"
              />
              <button type="submit" disabled={creating || !newName.trim()}
                className="px-5 py-2.5 bg-[#5b61f4] hover:bg-[#4f46e5] text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2">
                {creating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Simpan
              </button>
              <button type="button" onClick={() => { setShowCreateForm(false); setNewName(""); }}
                className="px-4 py-2.5 border border-slate-200 text-slate-500 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors">
                Batal
              </button>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (setSearch(searchInput), setPage(1))}
              placeholder="Cari nama posisi..."
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#5b61f4]"
            />
          </div>
          <button onClick={() => { setSearch(searchInput); setPage(1); }}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-lg transition-colors">
            Cari
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="p-5 w-[55%]">NAMA POSISI</th>
                <th className="p-5 w-[20%]">JUMLAH SOAL</th>
                <th className="p-5 w-[15%]">DIBUAT</th>
                <th className="p-5 w-[10%]">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="p-5"><div className="h-4 bg-slate-100 animate-pulse rounded w-2/3" /></td>
                    <td className="p-5"><div className="h-5 bg-slate-100 animate-pulse rounded w-12" /></td>
                    <td className="p-5"><div className="h-4 bg-slate-100 animate-pulse rounded w-24" /></td>
                    <td className="p-5"><div className="h-4 bg-slate-100 animate-pulse rounded w-16" /></td>
                  </tr>
                ))
              ) : positions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <MapPin className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-400 text-sm font-medium">Belum ada posisi terdaftar.</p>
                  </td>
                </tr>
              ) : (
                positions.map((pos) => (
                  <tr key={pos.id_position} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors">
                    <td className="p-5">
                      {editingId === pos.id_position ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => { if (e.key === "Enter") handleEditSave(pos.id_position); if (e.key === "Escape") setEditingId(null); }}
                            className="flex-1 px-3 py-1.5 bg-slate-50 border border-[#5b61f4] rounded-lg text-sm outline-none"
                          />
                          <button onClick={() => handleEditSave(pos.id_position)} disabled={editLoading}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-40">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-semibold text-sm text-[#0a2351]">{pos.position_name}</span>
                      )}
                    </td>
                    <td className="p-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#eef2ff] text-[#5b61f4]">
                        {pos._count?.trn_question_position ?? 0} soal
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="text-xs font-medium text-slate-500">
                        {new Date(pos.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleEditStart(pos)} title="Edit" className="text-slate-400 hover:text-[#0a2351] transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(pos.id_position, pos.position_name)} disabled={deletingId === pos.id_position}
                          title="Hapus" className="text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-[#f8fafc]">
              <span className="text-xs font-bold text-slate-500">
                Menampilkan {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} dari {total} posisi
              </span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1 hover:text-[#0a2351] disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold transition-colors ${page === p ? "bg-[#0a2351] text-white" : "hover:bg-slate-200"}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 hover:text-[#0a2351] disabled:opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
