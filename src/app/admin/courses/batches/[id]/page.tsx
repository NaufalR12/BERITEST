"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, PlayCircle, Users, Search, Filter, Download, Calendar, Eye, Pencil, Trash2, FolderPlus, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { getQuestionGroups } from "@/lib/questionGroupApi";

export default function SessionManagementPage() {
  const params = useParams();
  const batchId = params.id as string;

  const [batchDetail, setBatchDetail] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ active_sessions: 0, total_participants: 0 });

  // Modal State
  const [isAssignGroupOpen, setIsAssignGroupOpen] = useState(false);
  const [selectedSessionForGroup, setSelectedSessionForGroup] = useState<any>(null);
  const [questionGroups, setQuestionGroups] = useState<any[]>([]);
  const [assignedGroupIds, setAssignedGroupIds] = useState<number[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  // Edit Modal State
  const [isEditSessionOpen, setIsEditSessionOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchBatchAndSessions = async () => {
      setIsLoading(true);
      try {
        // Fetch batch details to get participants and course ID
        const batchRes = await apiFetch(`/batches/${batchId}`);
        setBatchDetail(batchRes.data);
        
        const participantsCount = batchRes.data.trn_batch_user?.length || 0;
        const courseId = batchRes.data.id_course;

        // Fetch sessions tied to the same course. 
        // Note: In this system, sessions are linked to courses, and users (from a batch) are assigned to sessions.
        // We fetch sessions for the course associated with this batch.
        if (courseId) {
           const sessionRes = await apiFetch(`/test-sessions?id_course=${courseId}&page=${meta.page}&limit=10&search=${searchQuery}`);
           setSessions(sessionRes.data);
           setMeta(sessionRes.meta);

           // Calculate local stats based on fetched data
           const activeSessions = sessionRes.data.filter((s: any) => s.status === 'Active' || s.status === 'Ongoing').length;
           setStats({ active_sessions: activeSessions, total_participants: participantsCount });
        }

      } catch (error) {
        console.error("Failed to fetch batch/sessions", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (batchId) {
      fetchBatchAndSessions();
    }
  }, [batchId, meta.page, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMeta((prev) => ({ ...prev, page: 1 }));
    setSearchQuery(searchInput);
  };

  const handleDeleteSession = async (sessionId: number) => {
    if (confirm("Apakah Anda yakin ingin membatalkan/menghapus sesi ujian ini?")) {
      try {
        await apiFetch(`/test-sessions/${sessionId}`, { method: "DELETE" });
        // Refresh sessions
        const courseId = batchDetail?.id_course;
        if (courseId) {
           const sessionRes = await apiFetch(`/test-sessions?id_course=${courseId}&page=${meta.page}&limit=10&search=${searchQuery}`);
           setSessions(sessionRes.data);
           setMeta(sessionRes.meta);
        }
      } catch (error: any) {
        alert(error.message || "Gagal menghapus sesi");
      }
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const openAssignGroupModal = async (session: any) => {
    setSelectedSessionForGroup(session);
    setIsAssignGroupOpen(true);
    setAssignedGroupIds([]);
    try {
      const groupsRes = await getQuestionGroups({ limit: 100 });
      setQuestionGroups(groupsRes.data || []);

      const sessionRes = await apiFetch(`/test-sessions/${session.id_session}`);
      const sessionDetail = sessionRes.data;
      const assigned = sessionDetail.trn_session_question_group?.map((g: any) => g.id_question_group) || [];
      setAssignedGroupIds(assigned);
    } catch (error: any) {
      alert("Gagal memuat data: " + error.message);
    }
  };

  const closeAssignGroupModal = () => {
    setIsAssignGroupOpen(false);
    setSelectedSessionForGroup(null);
  };

  const handleToggleGroup = (groupId: number) => {
    setAssignedGroupIds((prev) => 
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const handleSaveAssignedGroups = async () => {
    if (!selectedSessionForGroup) return;
    setIsAssigning(true);
    try {
      await apiFetch(`/test-sessions/${selectedSessionForGroup.id_session}/assign-groups`, {
        method: 'POST',
        body: JSON.stringify({ question_group_ids: assignedGroupIds })
      });
      alert("Berhasil menyimpan pengaturan soal untuk sesi ini!");
      closeAssignGroupModal();
    } catch (error: any) {
      alert(error.message || "Gagal menyimpan pengaturan soal");
    } finally {
      setIsAssigning(false);
    }
  };

  const formatForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  };

  const openEditSessionModal = (session: any) => {
    setEditingSession({
      ...session,
      start_time: formatForInput(session.start_time),
      end_time: formatForInput(session.end_time),
    });
    setIsEditSessionOpen(true);
  };

  const closeEditSessionModal = () => {
    setIsEditSessionOpen(false);
    setEditingSession(null);
  };

  const handleEditSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    setIsEditing(true);
    try {
      const payload = {
        session_name: editingSession.session_name,
        description: editingSession.description,
        start_time: new Date(editingSession.start_time).toISOString(),
        end_time: new Date(editingSession.end_time).toISOString(),
        status: editingSession.status,
      };
      await apiFetch(`/test-sessions/${editingSession.id_session}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      alert("Berhasil menyimpan perubahan sesi!");
      closeEditSessionModal();
      
      const courseId = batchDetail?.id_course;
      if (courseId) {
        const sessionRes = await apiFetch(`/test-sessions?id_course=${courseId}&page=${meta.page}&limit=10&search=${searchQuery}`);
        setSessions(sessionRes.data);
      }
    } catch (error: any) {
      alert(error.message || "Gagal mengupdate sesi");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
            
      <div className="flex-1 px-8 pt-8 max-w-7xl mx-auto w-full">
        {/* Page Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">
              Manajemen Session {batchDetail ? `- ${batchDetail.nama_batch}` : ''}
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Monitor and manage all assessment cycles across the organization.
            </p>
          </div>
          
          <div className="flex items-center">
            {/* Link to create session, passing the courseId and batchId as query params to pre-fill the form */}
            <Link 
              href={`/admin/courses/batches/${batchId}/create${batchDetail ? `?courseId=${batchDetail.id_course}` : ''}`} 
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2351] text-white font-bold text-sm rounded-lg hover:bg-[#0f337a] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah Sesi Baru
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Active Sessions */}
          <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 bg-[#e0e7ff] rounded-lg flex items-center justify-center text-[#5b61f4]">
                <PlayCircle className="w-5 h-5" />
              </div>
              <span className="bg-[#eef2ff] text-[#5b61f4] text-[10px] font-extrabold px-3 py-1 rounded-full tracking-wide uppercase">
                LIVE
              </span>
            </div>
            <div>
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">ACTIVE SESSIONS</h3>
              <p className="text-4xl font-extrabold text-[#0a2351]">{stats.active_sessions}</p>
            </div>
          </div>

          {/* Total Participants */}
          <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="w-10 h-10 bg-[#eef2ff] rounded-lg flex items-center justify-center text-[#5b61f4] mb-6">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">BATCH PARTICIPANTS</h3>
              <p className="text-4xl font-extrabold text-[#0a2351]">{stats.total_participants}</p>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-[400px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                placeholder="Search sessions (Enter)..."
              />
            </form>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* Optional UI elements kept for consistency */}
              <button className="flex-1 md:flex-none flex items-center justify-center p-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors bg-white shadow-sm">
                <Filter className="w-4 h-4" />
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center p-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors bg-white shadow-sm">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#eef2ff] text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                  <th className="p-4 w-[35%]">SESSION NAME</th>
                  <th className="p-4 w-[25%]">SCHEDULE</th>
                  <th className="p-4 w-[20%]">ASSIGNED CANDIDATES</th>
                  <th className="p-4 w-[10%]">STATUS</th>
                  <th className="p-4 w-[10%]">ACTIONS</th>
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
                ) : sessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-semibold text-sm">
                      Tidak ada sesi ujian untuk kursus ini.
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => (
                    <tr key={session.id_session} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-sm text-[#0a2351] mb-0.5">{session.session_name}</p>
                        <p className="text-xs text-slate-500">{batchDetail?.nama_batch || 'Batch'}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="text-xs font-medium">{formatDateTime(session.start_time)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-bold text-slate-700">{session._count?.trn_user_session_mapping || 0}</span>
                        <span className="text-xs text-slate-500 ml-1">Candidates</span>
                      </td>
                      <td className="p-4">
                        {session.status === "Active" || session.status === "Ongoing" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef2ff] text-[#5b61f4] text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5b61f4]"></span>
                            {session.status}
                          </span>
                        ) : session.status === "Cancelled" ? (
                           <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                            {session.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                            {session.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openAssignGroupModal(session)}
                            className="text-[#5b61f4] hover:text-blue-700 transition-colors p-1" title="Assign Question Groups"
                          >
                            <FolderPlus className="w-4 h-4" />
                          </button>
                          <button className="text-[#0a2351] hover:text-blue-600 transition-colors p-1" title="Lihat">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openEditSessionModal(session)}
                            className="text-slate-400 hover:text-[#0a2351] transition-colors p-1" title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteSession(session.id_session)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1" title="Batalkan/Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-[#f8fafc]">
            <span className="text-xs font-medium text-slate-500">
               Menampilkan {sessions.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} sessions
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setMeta((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                disabled={meta.page === 1}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                onClick={() => setMeta((prev) => ({ ...prev, page: Math.min(prev.page + 1, prev.totalPages) }))}
                disabled={meta.page >= meta.totalPages}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#0a2351] rounded hover:bg-[#0f337a] transition-colors shadow-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Assign Question Groups Modal */}
      {isAssignGroupOpen && selectedSessionForGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-extrabold text-[#0a2351]">Assign Question Groups</h3>
                <p className="text-xs text-slate-500 font-medium">Session: {selectedSessionForGroup.session_name}</p>
              </div>
              <button onClick={closeAssignGroupModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {questionGroups.length === 0 ? (
                <div className="text-center text-slate-500 text-sm py-4">Belum ada grup soal yang tersedia.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questionGroups.map((group) => (
                    <label 
                      key={group.id_group}
                      className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                        assignedGroupIds.includes(group.id_group) 
                          ? 'border-[#5b61f4] bg-blue-50/30' 
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        className="mt-1 w-4 h-4 text-[#5b61f4] rounded border-slate-300 focus:ring-[#5b61f4]"
                        checked={assignedGroupIds.includes(group.id_group)}
                        onChange={() => handleToggleGroup(group.id_group)}
                      />
                      <div>
                        <p className="text-sm font-extrabold text-[#0a2351]">{group.group_name}</p>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate max-w-[200px]">
                          {group.description || "Tanpa deskripsi"}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={closeAssignGroupModal}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={handleSaveAssignedGroups}
                disabled={isAssigning}
                className="px-6 py-2 bg-[#0a2351] hover:bg-[#0f337a] text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-60"
              >
                {isAssigning && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {isAssigning ? "Menyimpan..." : "Simpan Pilihan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {isEditSessionOpen && editingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-extrabold text-[#0a2351]">Edit Sesi Ujian</h3>
              <button onClick={closeEditSessionModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <form id="editSessionForm" onSubmit={handleEditSessionSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Sesi</label>
                  <input
                    type="text"
                    value={editingSession.session_name || ""}
                    onChange={(e) => setEditingSession({ ...editingSession, session_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi</label>
                  <textarea
                    value={editingSession.description || ""}
                    onChange={(e) => setEditingSession({ ...editingSession, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Mulai</label>
                    <input
                      type="datetime-local"
                      value={editingSession.start_time}
                      onChange={(e) => setEditingSession({ ...editingSession, start_time: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Selesai</label>
                    <input
                      type="datetime-local"
                      value={editingSession.end_time}
                      onChange={(e) => setEditingSession({ ...editingSession, end_time: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Override (Opsional)</label>
                  <select
                    value={editingSession.status}
                    onChange={(e) => setEditingSession({ ...editingSession, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Active">Active</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">Status akan diubah otomatis berdasarkan waktu, namun Anda bisa menimpanya di sini.</p>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
              <button 
                type="button" 
                onClick={closeEditSessionModal}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                form="editSessionForm"
                disabled={isEditing}
                className="px-6 py-2 bg-[#0a2351] hover:bg-[#0f337a] text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-60"
              >
                {isEditing && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {isEditing ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

