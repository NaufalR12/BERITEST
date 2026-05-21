"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, X, Users, Eye, EyeOff, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function CreateBatchPage() {
  const router = useRouter();

  // Form State
  const [batchName, setBatchName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [description, setDescription] = useState(""); // UI element only, backend doesn't save it

  // Data State
  const [courses, setCourses] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Enroll State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, userRes] = await Promise.all([
          apiFetch("/courses?limit=100"),
          apiFetch("/users?limit=1000&search=")
        ]);
        setCourses(courseRes.data);
        setAllUsers(userRes.data);
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    };
    fetchData();
  }, []);

  // Filter users based on search (excluding already selected)
  const searchResults = allUsers.filter(
    (user) =>
      ((user.nama_user || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchQuery.toLowerCase())) &&
      !selectedUsers.some((selected) => selected.id_user === user.id_user)
  );

  const handleSelectUser = (user: any) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery(""); // clear search
    setShowDropdown(false);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id_user !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create the Batch
      // Backend expects strict ISO 8601 DateTime. Type 'date' gives 'YYYY-MM-DD'.
      const isoStartDate = new Date(startDate).toISOString();
      const isoEndDate = new Date(endDate).toISOString();

      const batchPayload = {
        id_course: parseInt(courseId, 10),
        nama_batch: batchName,
        start_date: isoStartDate,
        end_date: isoEndDate,
        is_active: visibility === "Public",
      };

      const batchResponse = await apiFetch("/batches", {
        method: "POST",
        body: JSON.stringify(batchPayload),
      });

      const newBatchId = batchResponse.data.id_batch;

      // 2. Assign Users (if any)
      if (selectedUsers.length > 0) {
        const userIds = selectedUsers.map(u => u.id_user);
        await apiFetch(`/batches/${newBatchId}/assign-users`, {
          method: "POST",
          body: JSON.stringify({ user_ids: userIds }),
        });
      }

      router.push("/admin/courses/batches");
    } catch (err: any) {
      setError(err.message || "Gagal membuat batch. Pastikan semua form terisi dengan benar.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      
      
      <div className="flex-1 px-8 pt-8 max-w-5xl mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400 mb-2">
          <Link href="/admin/courses" className="hover:text-slate-600 transition-colors">Courses</Link>
          <span className="mx-2 font-normal text-slate-300">&gt;</span>
          <Link href="/admin/courses/batches" className="hover:text-slate-600 transition-colors">Batches</Link>
          <span className="mx-2 font-normal text-slate-300">&gt;</span>
          <span className="text-[#5b61f4]">Tambah Batch Baru</span>
        </nav>

        {/* Page Header Area */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Tambah Batch Baru</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Set up a new assessment group for candidates.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
          
          {/* Top Row: Batch Name & Course */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <label htmlFor="batchName" className="block text-xs font-bold text-slate-700 mb-2">
                Batch Name
              </label>
              <input
                id="batchName"
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="e.g. Q4 2023 Intake - Senior Engineers"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                required
              />
              <p className="text-[10px] text-slate-400 mt-2 italic">The public name shown to candidates.</p>
            </div>

            <div>
              <label htmlFor="course" className="block text-xs font-bold text-slate-700 mb-2">
                Course Selection
              </label>
              <select
                id="course"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-slate-700"
                required
              >
                <option value="" disabled>Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.course_title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Middle Row: Dates & Visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-xs font-bold text-slate-700 mb-2">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-slate-700"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-xs font-bold text-slate-700 mb-2">
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-slate-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Batch Visibility
              </label>
              <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setVisibility("Public")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-bold transition-colors ${
                    visibility === "Public" 
                      ? "bg-[#5b61f4] text-white shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Public
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility("Private")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-bold transition-colors ${
                    visibility === "Private" 
                      ? "bg-white text-slate-700 shadow-sm border border-slate-200" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <EyeOff className="w-4 h-4" />
                  Private
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label htmlFor="description" className="block text-xs font-bold text-slate-700 mb-2">
              Deskripsi
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any specific requirements or notes for administrators regarding this batch..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors resize-none"
            />
          </div>

          <hr className="border-slate-100 my-8" />

          {/* Enroll Users Section (New Feature) */}
          <div className="mb-8 relative">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-[#0a2351]" />
              <h3 className="text-sm font-bold text-slate-800">Enroll Participants (Optional)</h3>
            </div>
            
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                placeholder="Klik di sini atau cari nama/email pengguna..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors shadow-sm cursor-pointer"
              />
              
              {/* Search Dropdown Results */}
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <button
                        key={user.id_user}
                        type="button"
                        onClick={() => handleSelectUser(user)}
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

            {/* Selected Users Chips */}
            {selectedUsers.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-xs font-bold text-slate-500 mb-3">PENGGUNA TERPILIH ({selectedUsers.length})</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div key={user.id_user} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                      <span className="text-xs font-semibold text-slate-700">{user.nama_user}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveUser(user.id_user)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <hr className="border-slate-100 my-8" />

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/admin/courses/batches"
              className="px-6 py-2.5 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 bg-[#0a2351] hover:bg-[#0f337a] disabled:bg-slate-300 text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {isLoading ? "Menyimpan..." : "Save Batch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


