"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, Pencil, Trash2, X, RefreshCw, CheckCircle2, FileDown } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function UserTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState<{ password: string } | null>(null);

  const fetchUsers = async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`/users?page=${page}&limit=10&search=${search}`);
      setUsers(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(meta.page, searchQuery);
  }, [meta.page, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMeta((prev) => ({ ...prev, page: 1 })); // reset to page 1
    setSearchQuery(searchInput);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menonaktifkan/menghapus user ini?")) {
      try {
        await apiFetch(`/users/${id}`, { method: "DELETE" });
        fetchUsers(meta.page, searchQuery);
        // Dispatch an event so UserStats can re-fetch (optional, simple reload is fine)
        window.location.reload(); 
      } catch (error: any) {
        alert(error.message || "Gagal menghapus user");
      }
    }
  };

  const openEditModal = async (user: any) => {
    setResetPasswordData(null);
    setEditingUser({
      ...user,
      id_role: user.mst_role?.name_role === "Admin" ? "1" : "2"
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setResetPasswordData(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditLoading(true);

    try {
      await apiFetch(`/users/${editingUser.id_user}`, {
        method: 'PUT',
        body: JSON.stringify({
          nama_user: editingUser.nama_user,
          email: editingUser.email,
          id_role: parseInt(editingUser.id_role, 10),
          is_active: editingUser.is_active,
        }),
      });
      fetchUsers(meta.page, searchQuery);
      closeEditModal();
    } catch (error: any) {
      alert(error.message || "Gagal mengupdate user");
    } finally {
      setEditLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!editingUser) return;
    if (confirm("Apakah Anda yakin ingin mereset password user ini? Password lama tidak akan bisa digunakan lagi.")) {
      setEditLoading(true);
      try {
        const response = await apiFetch(`/users/${editingUser.id_user}/reset-password`, {
          method: 'PUT'
        });
        setResetPasswordData({ password: response.data.temporary_password });
      } catch (error: any) {
        alert(error.message || "Gagal mereset password");
      } finally {
        setEditLoading(false);
      }
    }
  };

  const downloadResetPasswordCsv = () => {
    if (!editingUser || !resetPasswordData) return;
    const csvContent = `Nama User,Email,Password Sementara\n"${editingUser.nama_user}","${editingUser.email}","${resetPasswordData.password}"`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `reset_password_${editingUser.nama_user.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {/* Toolbar / Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Cari nama atau email (Tekan Enter)..."
            />
          </form>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                <th className="p-4 border-b border-slate-200 w-[30%]">NAMA USER</th>
                <th className="p-4 border-b border-slate-200 w-[25%]">EMAIL</th>
                <th className="p-4 border-b border-slate-200 w-[20%]">ROLE</th>
                <th className="p-4 border-b border-slate-200 w-[15%]">STATUS</th>
                <th className="p-4 border-b border-slate-200 w-[10%]">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-semibold text-sm">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-semibold text-sm">
                    Tidak ada data user ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id_user} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-sm text-slate-800">{user.nama_user}</p>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{user.email}</td>
                    <td className="p-4 text-sm font-semibold text-slate-600">
                      {user.mst_role?.name_role || "User"}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        user.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 flex items-center gap-3">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id_user)}
                        className="text-slate-400 hover:text-red-600 transition-colors" title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between bg-[#f8fafc] gap-4">
          <span className="text-xs font-semibold text-slate-500">
            Menampilkan {users.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} user
          </span>
          <div className="flex items-center gap-1 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => setMeta((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
              disabled={meta.page === 1}
              className="p-1 hover:text-blue-600 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="px-3 text-xs bg-slate-200 rounded-md py-1">
              Halaman {meta.page} dari {meta.totalPages || 1}
            </span>
            
            <button 
              onClick={() => setMeta((prev) => ({ ...prev, page: Math.min(prev.page + 1, prev.totalPages) }))}
              disabled={meta.page >= meta.totalPages}
              className="p-1 hover:text-blue-600 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-extrabold text-[#0a2351]">Edit User</h3>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {resetPasswordData ? (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex flex-col items-start gap-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-green-800">Password Berhasil Direset!</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Berikut adalah password sementara yang baru. Password ini tidak akan ditampilkan lagi.
                      </p>
                      <div className="mt-3 bg-white p-3 rounded-lg border border-green-100 shadow-sm font-mono text-sm">
                        <span className="font-bold text-slate-800">{resetPasswordData.password}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={downloadResetPasswordCsv}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm self-end"
                  >
                    <FileDown className="w-4 h-4" />
                    Download CSV
                  </button>
                </div>
              ) : (
                <div className="mb-6 pb-6 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Keamanan</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Reset password user dengan password acak baru.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={handleResetPassword}
                    disabled={editLoading}
                    className="px-4 py-2 bg-amber-100 text-amber-800 hover:bg-amber-200 text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Password
                  </button>
                </div>
              )}

              <form id="editForm" onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={editingUser.nama_user}
                    onChange={(e) => setEditingUser({ ...editingUser, nama_user: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Role Akses</label>
                    <select
                      value={editingUser.id_role}
                      onChange={(e) => setEditingUser({ ...editingUser, id_role: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors appearance-none"
                    >
                      <option value="2">Kandidat / User</option>
                      <option value="1">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Status Akun</label>
                    <select
                      value={editingUser.is_active ? "true" : "false"}
                      onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.value === "true" })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors appearance-none"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
              <button 
                type="button" 
                onClick={closeEditModal}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                form="editForm"
                disabled={editLoading}
                className="px-4 py-2 bg-[#0a2351] hover:bg-[#0f337a] text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                {editLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

