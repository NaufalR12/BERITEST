"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, X } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function CourseTable() {
  const [courses, setCourses] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const fetchCourses = async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`/courses?page=${page}&limit=10&search=${search}`);
      setCourses(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(meta.page, searchQuery);
  }, [meta.page, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMeta((prev) => ({ ...prev, page: 1 })); // reset to page 1
    setSearchQuery(searchInput);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menonaktifkan kursus ini?")) {
      try {
        await apiFetch(`/courses/${id}`, { method: "DELETE" });
        fetchCourses(meta.page, searchQuery);
      } catch (error: any) {
        alert(error.message || "Gagal menghapus kursus");
      }
    }
  };

  const openEditModal = (course: any) => {
    setEditingCourse({
      ...course,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCourse(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    setEditLoading(true);

    try {
      await apiFetch(`/courses/${editingCourse.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          course_title: editingCourse.course_title,
          description: editingCourse.description,
          is_active: editingCourse.is_active,
        }),
      });
      fetchCourses(meta.page, searchQuery);
      closeEditModal();
    } catch (error: any) {
      alert(error.message || "Gagal mengupdate kursus");
    } finally {
      setEditLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
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
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Cari berdasarkan nama (Tekan Enter)..."
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
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                <th className="p-4 border-b border-slate-200 w-[35%]">COURSE</th>
                <th className="p-4 border-b border-slate-200 w-[20%]">DIBUAT</th>
                <th className="p-4 border-b border-slate-200 w-[20%]">BATCH</th>
                <th className="p-4 border-b border-slate-200 w-[15%]">STATUS</th>
                <th className="p-4 border-b border-slate-200 w-[10%]">AKSI</th>
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
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-semibold text-sm">
                    Tidak ada kursus ditemukan.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-sm text-slate-800">{course.course_title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[300px]">{course.description || "-"}</p>
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-600">{formatDate(course.created_at)}</td>
                    <td className="p-4 text-xs font-medium text-slate-600">{course._count?.mst_batch || 0} Batch</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                        course.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200/50'
                      }`}>
                        {course.is_active ? 'Aktif' : 'Draft / Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {/* Note: In future we can link to a specific course's batch list: `/admin/courses/${course.id}/batches` */}
                        <Link href="/admin/courses/batches" className="text-slate-400 hover:text-blue-600 transition-colors" title="Lihat Batch">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => openEditModal(course)}
                          className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(course.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors" title="Hapus"
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
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between bg-[#f8fafc] gap-4">
          <span className="text-xs font-medium text-slate-500">
            Menampilkan {courses.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} kursus
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

      {/* Edit Course Modal */}
      {isEditModalOpen && editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-extrabold text-[#0a2351]">Edit Kursus</h3>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form id="editCourseForm" onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kursus</label>
                  <input
                    type="text"
                    value={editingCourse.course_title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, course_title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi</label>
                  <textarea
                    value={editingCourse.description || ""}
                    onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors min-h-[100px]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Kursus</label>
                  <select
                    value={editingCourse.is_active ? "true" : "false"}
                    onChange={(e) => setEditingCourse({ ...editingCourse, is_active: e.target.value === "true" })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors appearance-none"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Draft / Nonaktif</option>
                  </select>
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
                form="editCourseForm"
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

