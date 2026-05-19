"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Info, Clock, CheckSquare, Users, Lock, X, UserPlus, Circle, CheckCircle2 } from "lucide-react";

// Mock data for question groups
const questionGroups = [
  {
    id: "qg1",
    name: "Standard Logic G1",
    details: "45 Questions • 60 Mins",
    badges: ["Logical", "Pattern"],
  },
  {
    id: "qg2",
    name: "Advanced Tech Stack B",
    details: "30 Questions • 90 Mins",
    badges: ["Architecture", "Coding"],
  },
  {
    id: "qg3",
    name: "Managerial Psychometric",
    details: "60 Questions • 45 Mins",
    badges: ["Behavioral"],
  },
];

// Mock data for participants
const initialParticipants = [
  { id: "p1", name: "Michael Chen", detail: "Engineering Batch" },
  { id: "p2", name: "Sarah Jenkins", detail: "Senior Ops" },
  { id: "p3", name: "David Miller", detail: "Tech Leads" },
];

export default function CreateSessionPage() {
  const [sessionName, setSessionName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("qg2"); // Pre-select the second one based on image
  const [participants, setParticipants] = useState(initialParticipants);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create Session:", { sessionName, description, startDate, endDate, selectedGroup, participants });
    // TODO: Submit to API
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
            
      <div className="flex-1 px-8 pt-8 max-w-6xl mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400 mb-2">
          <Link href="/admin/courses" className="hover:text-slate-600 transition-colors">Courses</Link>
          <span className="mx-2 font-normal text-slate-300">&gt;</span>
          <Link href="/admin/courses/batches" className="hover:text-slate-600 transition-colors">Batches</Link>
          <span className="mx-2 font-normal text-slate-300">&gt;</span>
          <span className="text-[#5b61f4]">Tambah Session Baru</span>
        </nav>

        {/* Page Header Area */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Tambah Session Baru</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Set up a new session for batch.
          </p>
        </div>

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
              <h3 className="text-xs font-bold text-[#0a2351] tracking-wider uppercase">QUESTION GROUP SELECTION</h3>
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
                <p className="text-xs text-slate-500 font-medium">Select users individually or import by batch tags.</p>
              </div>
              
              <button 
                type="button"
                className="flex items-center gap-2 bg-[#0a2351] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#0f337a] transition-colors shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Select Users
              </button>
            </div>

            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-5 min-h-[120px] flex flex-col gap-4">
              {/* Selected Chips */}
              {participants.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {participants.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 bg-[#eef2ff] border border-[#c7d2fe] px-2 py-1.5 rounded-full shadow-sm">
                      <div className="w-5 h-5 rounded-full bg-[#0a2351] flex items-center justify-center text-white text-[9px] font-bold">
                        {p.name.charAt(0)}
                      </div>
                      <span className="text-[11px] font-bold text-[#0a2351]">
                        {p.name} <span className="text-[#5b61f4] font-medium">({p.detail})</span>
                      </span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveParticipant(p.id)}
                        className="text-[#5b61f4] hover:text-red-500 transition-colors ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Search Input (Mock) */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type name to search..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 mt-auto"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-4">
            <Link
              href="../1"
              className="px-6 py-2.5 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-8 py-2.5 bg-[#0a2351] hover:bg-[#0f337a] text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
            >
              Save Session
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
