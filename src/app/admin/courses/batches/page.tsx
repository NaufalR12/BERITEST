"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Layers, Users, CalendarClock, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, X, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function BatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_active_batches: 0, total_participants: 0 });
  const [meta, setMeta] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]); // For course selection in edit

  // Edit Modal - Participant State
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [participantSearch, setParticipantSearch] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);
  const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await apiFetch("/batches/summary");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch batch stats", error);
    }
  };

  const fetchBatches = async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`/batches?page=${page}&limit=50&search=${search}`);
      setBatches(response.data);
      // We handle pagination meta differently since we might filter locally
      setMeta(response.meta); 
    } catch (error) {
      console.error("Failed to fetch batches", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCoursesAndUsers = async () => {
    try {
      const [courseRes, userRes] = await Promise.all([
        apiFetch("/courses?limit=100"),
        apiFetch("/users?limit=1000&search=")
      ]);
      setCourses(courseRes.data);
      setAllUsers(userRes.data);
    } catch (error) {
      console.error("Failed to fetch courses/users", error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCoursesAndUsers();
  }, []);

  useEffect(() => {
    fetchBatches(1, searchQuery); // reset to page 1 on search
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menonaktifkan batch ini?")) {
      try {
        await apiFetch(`/batches/${id}`, { method: "DELETE" });
        fetchBatches(1, searchQuery);
        fetchStats();
      } catch (error: any) {
        alert(error.message || "Gagal menghapus batch");
      }
    }
  };

  const getStatus = (batch: any) => {
    if (!batch.is_active) return "INACTIVE";
    const now = new Date();
    const start = new Date(batch.start_date);
    const end = new Date(batch.end_date);
    
    if (now < start) return "SCHEDULED";
    if (now > end) return "COMPLETED";
    return "ACTIVE";
  };

  // Local Filtering for Status
  const filteredBatches = batches.filter(batch => {
    if (statusFilter === "Semua Status") return true;
    return getStatus(batch) === statusFilter;
  });

  // Client-side pagination logic for filtered data
  const currentBatches = filteredBatches.slice((meta.page - 1) * meta.limit, meta.page * meta.limit);
  const totalFilteredPages = Math.ceil(filteredBatches.length / meta.limit) || 1;

  const openEditModal = async (batch: any) => {
    setEditingBatch({
      ...batch,
      start_date: batch.start_date ? batch.start_date.split('T')[0] : '',
      end_date: batch.end_date ? batch.end_date.split('T')[0] : '',
    });
    
    // Fetch detailed batch to get participants
    try {
      setEditLoading(true);
      setIsEditModalOpen(true);
      const res = await apiFetch(`/batches/${batch.id_batch}`);
      // Safely map participants, filtering out any nulls
      const participants = res.data.trn_batch_user
        ?.map((p: any) => p.mst_users)
        ?.filter((user: any) => user != null) || [];
      setSelectedParticipants(participants);
    } catch (e) {
      console.error("Failed to fetch batch details", e);
      setSelectedParticipants([]);
    } finally {
      setEditLoading(false);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingBatch(null);
    setSelectedParticipants([]);
    setParticipantSearch("");
    setShowParticipantDropdown(false);
  };

  // Participant Search Logic
  const participantSearchResults = allUsers.filter(
    (user) =>
      ((user.nama_user || "").toLowerCase().includes(participantSearch.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(participantSearch.toLowerCase())) &&
      !selectedParticipants.some((selected) => selected.id_user === user.id_user)
  );

  const handleSelectParticipant = (user: any) => {
    setSelectedParticipants([...selectedParticipants, user]);
    setParticipantSearch(""); 
    setShowParticipantDropdown(false);
  };

  const handleRemoveParticipant = async (userId: string) => {
    if (!editingBatch) return;

    if (confirm("Yakin ingin menghapus peserta ini dari batch?")) {
      try {
        setEditLoading(true); // Re-use the existing loading state to block actions
        await apiFetch(`/batches/${editingBatch.id_batch}/remove-users`, {
          method: "DELETE",
          body: JSON.stringify({ user_ids: [userId] })
        });
        
        // Remove locally
        setSelectedParticipants(selectedParticipants.filter((user) => user.id_user !== userId));
        
        // Background refresh to update participant count on the main table
        fetchBatches(meta.page, searchQuery);
      } catch (error: any) {
        alert(error.message || "Gagal menghapus peserta.");
      } finally {
        setEditLoading(false);
      }
    }
  };


  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;
    setEditLoading(true);

    try {
      const isoStartDate = new Date(editingBatch.start_date).toISOString();
      const isoEndDate = new Date(editingBatch.end_date).toISOString();

      await apiFetch(`/batches/${editingBatch.id_batch}`, {
        method: 'PUT',
        body: JSON.stringify({
          id_course: parseInt(editingBatch.id_course, 10),
          nama_batch: editingBatch.nama_batch,
          start_date: isoStartDate,
          end_date: isoEndDate,
          is_active: editingBatch.is_active,
        }),
      });

      // Assign Users
      if (selectedParticipants.length > 0) {
        const userIds = selectedParticipants.map(u => u.id_user);
        await apiFetch(`/batches/${editingBatch.id_batch}/assign-users`, {
          method: "POST",
          body: JSON.stringify({ user_ids: userIds }),
        });
      }

      fetchBatches(1, searchQuery);
      fetchStats();
      closeEditModal();
    } catch (error: any) {
      alert(error.message || "Gagal mengupdate batch");
    } finally {
      setEditLoading(false);
    }
  };

  const formatDateShort = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short' }).format(date);
  };

  return (
    <>
      <div className="flex flex-col min-h-full pb-10">
        <div className="flex-1 px-8 pt-8 max-w-7xl mx-auto w-full">
          {/* Page Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Manajemen Batch</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Kelola daftar materi dan kurikulum asesmen Anda.
              </p>
            </div>
            
            <div className="flex items-center">
              <Link href="/admin/courses/batches/create" className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2351] text-white font-bold text-sm rounded-lg hover:bg-[#0f337a] transition-colors shadow-sm">
                <Plus className="w-4 h-4" />
                Tambah Batch
              </Link>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 flex flex-col justify-center items-center gap-2 text-center shadow-sm">
              <div className="w-12 h-12 bg-[#e0e7ff] rounded-lg flex items-center justify-center text-[#0a2351] mb-2">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">TOTAL BATCH AKTIF</h3>
              <p className="text-2xl font-extrabold text-[#0a2351]">{stats.total_active_batches}</p>
            </div>
            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 flex flex-col justify-center items-center gap-2 text-center shadow-sm">
              <div className="w-12 h-12 bg-[#e0e7ff] rounded-lg flex items-center justify-center text-[#0a2351] mb-2">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">TOTAL PESERTA</h3>
              <p className="text-2xl font-extrabold text-[#0a2351]">{stats.total_participants}</p>
            </div>
            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 flex flex-col justify-center items-center gap-2 text-center shadow-sm">
              <div className="w-12 h-12 bg-[#f1f5f9] rounded-lg flex items-center justify-center text-slate-600 mb-2">
                <CalendarClock className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">BATASAN KAPASITAS</h3>
              <p className="text-2xl font-extrabold text-[#0a2351]">-</p>
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
              <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  placeholder="Cari berdasarkan nama batch (Enter)..."
                />
              </form>
              
              <div className="w-full md:w-auto">
                <select 
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setMeta((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="block w-full border border-slate-200 rounded-lg text-sm px-4 py-2 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option>Semua Status</option>
                  <option>ACTIVE</option>
                  <option>SCHEDULED</option>
                  <option>COMPLETED</option>
                  <option>INACTIVE</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                    <th className="p-4 w-[20%]">BATCH NAME</th>
                    <th className="p-4 w-[20%]">COURSE</th>
                    <th className="p-4 w-[15%]">TIMELINE</th>
                    <th className="p-4 w-[20%]">PARTICIPANTS</th>
                    <th className="p-4 w-[15%]">STATUS</th>
                    <th className="p-4 w-[10%]">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold text-sm">
                        <div className="flex justify-center items-center gap-2">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          Memuat data...
                        </div>
                      </td>
                    </tr>
                  ) : currentBatches.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold text-sm">
                        Tidak ada batch ditemukan.
                      </td>
                    </tr>
                  ) : (
                    currentBatches.map((batch) => {
                      const participants = batch._count?.trn_batch_user || 0;
                      const capacity = 100; // Default capacity as BE doesn't have it
                      const percent = Math.min(100, Math.round((participants / capacity) * 100));
                      const status = getStatus(batch);
                      
                      return (
                        <tr key={batch.id_batch} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-sm text-[#0a2351]">{batch.nama_batch}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-slate-600">{batch.mst_course?.course_title || "-"}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-xs font-medium text-slate-500 whitespace-nowrap">
                              {formatDateShort(batch.start_date)} - {formatDateShort(batch.end_date)}
                            </p>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-[#0a2351] h-1.5 rounded-full transition-all duration-500" 
                                  style={{ width: `${percent}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
                                {participants}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                              status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                              status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                              status === 'COMPLETED' ? 'bg-purple-100 text-purple-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {/* TODO: Detail Page later */}
                              <Link href={`/admin/courses/batches/${batch.id_batch}`} className="text-slate-400 hover:text-blue-600 transition-colors" title="Lihat">
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button 
                                onClick={() => openEditModal(batch)}
                                className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(batch.id_batch)}
                                className="text-slate-400 hover:text-red-600 transition-colors" title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between bg-[#f8fafc] gap-4">
              <span className="text-xs font-medium text-slate-500">
                Menampilkan {currentBatches.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0} - {Math.min(meta.page * meta.limit, filteredBatches.length)} dari {filteredBatches.length} Batch
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setMeta((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                  disabled={meta.page === 1}
                  className="p-1 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded shadow-sm disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 text-xs bg-slate-200 rounded-md py-1 font-semibold text-slate-600">
                  Halaman {meta.page} dari {totalFilteredPages}
                </span>
                <button 
                  onClick={() => setMeta((prev) => ({ ...prev, page: Math.min(prev.page + 1, totalFilteredPages) }))}
                  disabled={meta.page >= totalFilteredPages}
                  className="p-1 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded shadow-sm disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Batch Modal */}
      {isEditModalOpen && editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-extrabold text-[#0a2351]">Edit Batch</h3>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {editLoading && selectedParticipants.length === 0 ? (
               <div className="p-12 flex justify-center items-center">
                 <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               </div>
            ) : (
              <div className="p-6 overflow-y-auto">
                <form id="editBatchForm" onSubmit={handleEditSubmit} className="space-y-6">
                  
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Batch</label>
                      <input
                        type="text"
                        value={editingBatch.nama_batch}
                        onChange={(e) => setEditingBatch({ ...editingBatch, nama_batch: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Terkait Kursus</label>
                      <select
                        value={editingBatch.id_course || ""}
                        onChange={(e) => setEditingBatch({ ...editingBatch, id_course: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors appearance-none"
                        required
                      >
                        <option value="" disabled>Pilih Kursus</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>{c.course_title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Mulai</label>
                        <input
                          type="date"
                          value={editingBatch.start_date}
                          onChange={(e) => setEditingBatch({ ...editingBatch, start_date: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Selesai</label>
                        <input
                          type="date"
                          value={editingBatch.end_date}
                          onChange={(e) => setEditingBatch({ ...editingBatch, end_date: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Status Keaktifan</label>
                      <select
                        value={editingBatch.is_active ? "true" : "false"}
                        onChange={(e) => setEditingBatch({ ...editingBatch, is_active: e.target.value === "true" })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors appearance-none"
                      >
                        <option value="true">Aktif (Ditampilkan)</option>
                        <option value="false">Nonaktif (Disembunyikan)</option>
                      </select>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Enroll Users Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4 text-[#0a2351]" />
                      <h4 className="text-sm font-bold text-slate-800">Kelola Peserta</h4>
                    </div>
                    
                    <div className="relative mb-4">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={participantSearch}
                        onChange={(e) => setParticipantSearch(e.target.value)}
                        onFocus={() => setShowParticipantDropdown(true)}
                        placeholder="Cari pengguna untuk ditambahkan ke batch ini..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors shadow-sm cursor-pointer"
                      />
                      
                      {showParticipantDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {participantSearchResults.length > 0 ? (
                            participantSearchResults.map((user) => (
                              <button
                                key={user.id_user}
                                type="button"
                                onClick={() => handleSelectParticipant(user)}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0"
                              >
                                <p className="text-sm font-bold text-slate-800">{user.nama_user}</p>
                                <p className="text-xs text-slate-500">{user.email || "Tidak ada email"}</p>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-slate-500 text-center">
                              Semua pengguna sudah terpilih atau tidak ditemukan.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Selected Participants List */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-[200px] overflow-y-auto">
                      <p className="text-xs font-bold text-slate-500 mb-3">PESERTA BATCH ({selectedParticipants.length})</p>
                      
                      {selectedParticipants.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">Belum ada peserta.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedParticipants.map((user) => (
                            <div key={user.id_user} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                              <span className="text-xs font-semibold text-slate-700">{user.nama_user}</span>
                              <button 
                                type="button" 
                                onClick={() => handleRemoveParticipant(user.id_user)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                                title="Hapus dari daftar (Catatan: Ini tidak akan menghapus data di backend jika sudah tersimpan)"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 italic flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      Peserta yang dihapus akan langsung dikeluarkan dari batch ini (Perubahan disimpan secara otomatis).
                    </p>
                  </div>
                </form>
              </div>
            )}
            
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
              <button 
                type="button" 
                onClick={closeEditModal}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Tutup
              </button>
              <button 
                type="submit" 
                form="editBatchForm"
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

