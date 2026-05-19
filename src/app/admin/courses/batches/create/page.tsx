"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, X, Users, Eye, EyeOff } from "lucide-react";
import Header from "@/components/admin/Header";

// Mock data for search
const allUsers = [
  { id: "u1", name: "Ahmad Faisal", email: "ahmad.faisal@email.com" },
  { id: "u2", name: "Budi Santoso", email: "budi.s@provider.net" },
  { id: "u3", name: "Citra Lestari", email: "citra.lestari@company.id" },
  { id: "u4", name: "Dian Rostia", email: "dian_rostia@beritest.com" },
];

export default function CreateBatchPage() {
  // Form State
  const [batchName, setBatchName] = useState("");
  const [course, setCourse] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [description, setDescription] = useState("");

  // Search & Enroll State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<typeof allUsers>([
    { id: "u1", name: "Ahmad Faisal", email: "ahmad.faisal@email.com" },
  ]); // Start with one selected for demo purposes

  // Filter users based on search (excluding already selected)
  const searchResults = allUsers.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !selectedUsers.some((selected) => selected.id === user.id)
  );

  const handleSelectUser = (user: typeof allUsers[0]) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery(""); // clear search
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create Batch:", { batchName, course, startDate, endDate, visibility, description, enrolledUsers: selectedUsers });
    // TODO: integrate with API
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <Header />
      
      <div className="flex-1 px-8 pt-8 max-w-5xl mx-auto w-full">
        {/* Page Header Area */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Tambah Batch Baru</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Set up a new assessment group for candidates.
            </p>
          </div>
          
          <Link 
            href="/admin/courses/batches" 
            className="flex items-center gap-2 text-[#0a2351] font-bold text-sm hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

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
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-slate-700"
                required
              >
                <option value="" disabled>Select a course</option>
                <option value="course-1">Professional Cloud Architect</option>
                <option value="course-2">User Experience Fundamentals</option>
                <option value="course-3">Advanced Data Analytics</option>
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
          <div className="mb-8">
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
                placeholder="Cari nama atau email pengguna untuk ditambahkan..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors shadow-sm"
              />
              
              {/* Search Dropdown Results */}
              {searchQuery && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleSelectUser(user)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0"
                    >
                      <p className="text-sm font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Users Chips */}
            {selectedUsers.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-xs font-bold text-slate-500 mb-3">PENGGUNA TERPILIH ({selectedUsers.length})</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                      <span className="text-xs font-semibold text-slate-700">{user.name}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveUser(user.id)}
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
              className="px-8 py-2.5 bg-[#0a2351] hover:bg-[#0f337a] text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
            >
              Save Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
