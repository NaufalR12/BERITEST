"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Info, Clock, CheckSquare, Users, Lock, X, UserPlus, Circle, CheckCircle2, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

// Mock data for question groups (Since Question Group API is not yet available)
const questionGroups = [
  {
    id: 1,
    name: "Standard Logic G1",
    details: "45 Questions • 60 Mins",
    badges: ["Logical", "Pattern"],
  },
  {
    id: 2,
    name: "Advanced Tech Stack B",
    details: "30 Questions • 90 Mins",
    badges: ["Architecture", "Coding"],
  },
  {
    id: 3,
    name: "Managerial Psychometric",
    details: "60 Questions • 45 Mins",
    badges: ["Behavioral"],
  },
];

export default function CreateSessionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const batchId = params.id as string;
  const courseIdParam = searchParams.get("courseId");

  const [sessionName, setSessionName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<number>(2); // Default mock group ID
  
  const [participants, setParticipants] = useState<any[]>([]);
  const [batchParticipants, setBatchParticipants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (batchId) {
          const batchRes = await apiFetch(`/batches/${batchId}`);
          
          // Get users who are in this batch to be used for search dropdown only
          const usersInBatch = batchRes.data.trn_batch_user?.map((p: any) => p.mst_users) || [];
          setBatchParticipants(usersInBatch);
          
          if (!sessionName) {
             setSessionName(`Sesi Ujian - ${batchRes.data.nama_batch}`);
          }
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, [batchId]);

  const searchResults = batchParticipants.filter(
    (user) =>
      ((user.nama_user || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchQuery.toLowerCase())) &&
      !participants.some((selected) => selected.id_user === user.id_user)
  );

  const handleSelectUser = (user: any) => {
    setParticipants([...participants, user]);
    setSearchQuery(""); 
    setShowDropdown(false);
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id_user !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!courseIdParam) {
        throw new Error("Course ID is missing. Cannot create a session without linking it to a course.");
      }

      const isoStartDate = new Date(startDate).toISOString();
      const isoEndDate = new Date(endDate).toISOString();

      // Duration logic (mock calculation)
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const durationMinutes = Math.round((end - start) / 60000);

      const participantIds = participants.map(p => p.id_user);

      const payload = {
        session_name: sessionName,
        description: description,
        id_course: parseInt(courseIdParam, 10),
        start_time: isoStartDate,
        end_time: isoEndDate,
        duration_minutes: durationMinutes > 0 ? durationMinutes : 60,
        passing_score: 70, // Default passing score
        status: "Upcoming",
        question_group_ids: [selectedGroup], // Map to selected mock group
        participant_user_ids: participantIds
      };

      await apiFetch("/test-sessions", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      router.push(`/admin/courses/batches/${batchId}`);
    } catch (err: any) {
      setError(err.message || "Gagal membuat sesi ujian.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
            
      <div className="flex-1 px-8 pt-8 max-w-6xl mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-2">
          <Link href="/admin/courses" className="hover:text-slate-600 transition-colors">Courses</Link>
          <span className="font-normal text-slate-300">&gt;</span>
          <Link href="/admin/courses/batches" className="hover:text-slate-600 transition-colors">Batches</Link>
          <span className="font-normal text-slate-300">&gt;</span>
          <Link href={`/admin/courses/batches/${batchId}`} className="hover:text-slate-600 transition-colors">Detail</Link>
          <span className="font-normal text-slate-300">&gt;</span>
          <span className="text-[#5b61f4]">Tambah Session Baru</span>
        </nav>

        {/* Page Header Area */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Tambah Session Baru</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Set up a new assessment session for this batch.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Top Row: General Info & Scheduling */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* GENERAL INFORMATION */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Info className="w-4 h-4 text-[#0a2351]" />
                <h3 className="text-xs font-bold text-[#0a2351] tracking-wider uppercase">GENERAL INFORMATION</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="sessionName" className="block text-xs font-bold text-slate-700 mb-2">
                    Session Name
                  </label>
                  <input
                    id="sessionName"
                    type="text"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="e.g. Senior Software Engineer Assessment - Q3"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-xs font-bold text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe the purpose of this session..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* SCHEDULING */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-[#0a2351]" />
                <h3 className="text-xs font-bold text-[#0a2351] tracking-wider uppercase">SCHEDULING</h3>
              </div>

              <div className="space-y-5 flex-1">
                <div>
                  <label htmlFor="startDate" className="block text-xs font-bold text-slate-700 mb-2">
                    Start Date & Time
                  </label>
                  <input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-slate-700"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-xs font-bold text-slate-700 mb-2">
                    End Date & Time
                  </label>
                  <input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="mt-5 p-4 bg-[#eef2ff] border border-[#c7d2fe] rounded-lg flex gap-3 items-start">
                <Lock className="w-4 h-4 text-[#5b61f4] shrink-0 mt-0.5" />
                <p className="text-xs text-[#4f46e5] font-medium leading-relaxed">
                  Session will automatically lock and submit all active attempts at the End Date.
                </p>
              </div>
            </div>

          </div>

          {/* Middle Row: QUESTION GROUP SELECTION */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <CheckSquare className="w-4 h-4 text-[#0a2351]" />
              <h3 className="text-xs font-bold text-[#0a2351] tracking-wider uppercase">QUESTION GROUP SELECTION (Mock Data)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {questionGroups.map((group) => {
                const isSelected = selectedGroup === group.id;
                return (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`relative cursor-pointer rounded-xl border p-5 transition-all ${
                      isSelected 
                        ? "border-[#0a2351] bg-[#f8fafc] ring-1 ring-[#0a2351]" 
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-bold text-sm ${isSelected ? "text-[#0a2351]" : "text-slate-800"}`}>
                        {group.name}
                      </h4>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-[#0a2351]" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    
                    <p className="text-xs font-medium text-slate-500 mb-4">{group.details}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {group.badges.map((badge, idx) => (
                        <span 
                          key={idx} 
                          className={`text-[10px] px-2 py-1 rounded font-bold ${
                            isSelected ? "bg-[#eef2ff] text-[#5b61f4]" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Row: PARTICIPANT ASSIGNMENT */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-[#0a2351]" />
                  <h3 className="text-xs font-bold text-[#0a2351] tracking-wider uppercase">PARTICIPANT ASSIGNMENT</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium">Secara default kosong. Silakan cari dan pilih peserta dari daftar anggota batch.</p>
              </div>
            </div>

            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-5 min-h-[120px] flex flex-col gap-4">
              {/* Selected Chips */}
              {participants.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {participants.map((p) => (
                    <div key={p.id_user} className="flex items-center gap-2 bg-[#eef2ff] border border-[#c7d2fe] px-2 py-1.5 rounded-full shadow-sm">
                      <div className="w-5 h-5 rounded-full bg-[#0a2351] flex items-center justify-center text-white text-[9px] font-bold">
                        {p.nama_user?.charAt(0) || "U"}
                      </div>
                      <span className="text-[11px] font-bold text-[#0a2351]">
                        {p.nama_user}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveParticipant(p.id_user)}
                        className="text-[#5b61f4] hover:text-red-500 transition-colors ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Search Input */}
              <div className="relative mt-auto pt-4 border-t border-slate-200">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  placeholder="Cari nama atau email pengguna dari batch ini..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                        Semua pengguna di batch ini sudah terpilih atau tidak ditemukan.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-4">
            <Link
              href={`/admin/courses/batches/${batchId}`}
              className="px-6 py-2.5 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-2.5 bg-[#0a2351] hover:bg-[#0f337a] disabled:bg-slate-300 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {isLoading ? "Menyimpan..." : "Save Session"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

