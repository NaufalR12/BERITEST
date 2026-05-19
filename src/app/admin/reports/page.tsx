"use client";

import { useState, useMemo } from "react";
import { Users, BarChart2, CheckCircle2, Search, Calendar, ChevronDown, Download, Eye } from "lucide-react";
import Link from "next/link";

interface ParticipantReport {
  id: number;
  name: string;
  email: string;
  session: string;
  batch: string;
  course: string;
  score: number;
  status: "LULUS" | "GAGAL";
  date: string;
}

const dummyReports: ParticipantReport[] = [
  {
    id: 1,
    name: "Budi Darmawan",
    email: "budi.d@example.com",
    session: "Pagi (08:00)",
    batch: "Batch 1",
    course: "Data Science",
    score: 92,
    status: "LULUS",
    date: "2023-10-12",
  },
  {
    id: 2,
    name: "Siti Aminah",
    email: "siti.a@gmail.com",
    session: "Pagi (08:00)",
    batch: "Batch 1",
    course: "UI/UX Design",
    score: 88,
    status: "LULUS",
    date: "2023-10-12",
  },
  {
    id: 3,
    name: "Andi Wijaya",
    email: "andi_w@outlook.com",
    session: "Siang (13:00)",
    batch: "Batch 1",
    course: "Web Dev",
    score: 58,
    status: "GAGAL",
    date: "2023-10-12",
  },
  {
    id: 4,
    name: "Lestari Putri",
    email: "putri.l@university.ac.id",
    session: "Siang (13:00)",
    batch: "Batch 1",
    course: "Data Science",
    score: 76,
    status: "LULUS",
    date: "2023-10-11",
  },
];

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("Semua Sesi");
  const [selectedBatch, setSelectedBatch] = useState("Semua Batch");
  const [selectedCourse, setSelectedCourse] = useState("Semua Kursus");
  const [dateFilter, setDateFilter] = useState("");

  const filteredReports = useMemo(() => {
    return dummyReports.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSession =
        selectedSession === "Semua Sesi" || item.session.includes(selectedSession);
      
      const matchesBatch =
        selectedBatch === "Semua Batch" || item.batch === selectedBatch;
      
      const matchesCourse =
        selectedCourse === "Semua Kursus" || item.course === selectedCourse;

      const matchesDate =
        !dateFilter || item.date === dateFilter;

      return matchesSearch && matchesSession && matchesBatch && matchesCourse && matchesDate;
    });
  }, [searchTerm, selectedSession, selectedBatch, selectedCourse, dateFilter]);

  const handleExportCSV = () => {
    alert("Mengekspor laporan hasil tes ke format CSV...");
  };

  return (
    <div className="flex flex-col min-h-full pb-10 bg-slate-50/50">
      <div className="flex-1 px-8 pt-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Page Title Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Hasil Tes</h2>
        </div>

        {/* Stats Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Total Peserta */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">TOTAL PESERTA</h3>
              <p className="text-3xl font-extrabold text-[#0a2351]">1,284</p>
              <p className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                <span className="text-sm">↗</span> +12% dari bulan lalu
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#eef2ff] text-[#5b61f4] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Nilai Rata-Rata */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">NILAI RATA-RATA</h3>
              <p className="text-3xl font-extrabold text-[#0a2351]">78.5</p>
              <p className="text-xs font-semibold text-slate-400">
                Target institusi: 75.0
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#eef2ff] text-[#5b61f4] flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Tingkat Kelulusan */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">TINGKAT KELULUSAN</h3>
              <p className="text-3xl font-extrabold text-[#0a2351]">92.4%</p>
              
              {/* Progress Bar Container */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2 max-w-[200px]">
                <div className="bg-[#0a2351] h-full rounded-full" style={{ width: "92.4%" }}></div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Filter Bar Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Nama / Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-[#5b61f4] outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Date Input */}
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-[#5b61f4] outline-none transition-all cursor-pointer font-medium"
              />
            </div>

            {/* Sesi Dropdown */}
            <div className="relative">
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-[#5b61f4] outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="Semua Sesi">Semua Sesi</option>
                <option value="Pagi">Pagi (08:00)</option>
                <option value="Siang">Siang (13:00)</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Batch Dropdown */}
            <div className="relative">
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-[#5b61f4] outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="Semua Batch">Semua Batch</option>
                <option value="Batch 1">Batch 1</option>
                <option value="Batch 2">Batch 2</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Kursus Dropdown */}
            <div className="relative">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-[#5b61f4] outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="Semua Kursus">Semua Kursus</option>
                <option value="Data Science">Data Science</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Web Dev">Web Dev</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Export CSV Button at Top Right of Table */}
        <div className="flex justify-end">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2351] hover:bg-[#07193a] text-white font-extrabold text-xs tracking-wider rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Results Table Area */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider font-extrabold border-b border-slate-200">
                  <th className="p-5 w-[25%]">PESERTA</th>
                  <th className="p-5 w-[20%]">SESI & BATCH</th>
                  <th className="p-5 w-[15%]">KURSUS</th>
                  <th className="p-5 w-[10%] text-center">NILAI</th>
                  <th className="p-5 w-[12%] text-center">STATUS</th>
                  <th className="p-5 w-[13%]">TANGGAL</th>
                  <th className="p-5 w-[10%] text-center">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors">
                    
                    {/* Peserta */}
                    <td className="p-5">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-sm text-[#0a2351]">{report.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{report.email}</p>
                      </div>
                    </td>

                    {/* Sesi & Batch */}
                    <td className="p-5">
                      <div className="space-y-0.5 text-xs text-slate-600 font-semibold">
                        <p>{report.session}</p>
                        <p className="text-slate-400">{report.batch}</p>
                      </div>
                    </td>

                    {/* Kursus */}
                    <td className="p-5">
                      <span className="text-xs font-semibold text-slate-600">{report.course}</span>
                    </td>

                    {/* Nilai */}
                    <td className="p-5 text-center">
                      <span className={`text-base font-extrabold ${report.status === "GAGAL" ? "text-red-500" : "text-[#0a2351]"}`}>
                        {report.score}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-5 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded text-[10px] font-extrabold tracking-wide uppercase ${
                        report.status === "GAGAL" 
                          ? "bg-red-50 text-red-600" 
                          : "bg-green-50 text-green-600"
                      }`}>
                        {report.status}
                      </span>
                    </td>

                    {/* Tanggal */}
                    <td className="p-5">
                      <span className="text-xs font-semibold text-slate-600">
                        {new Date(report.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="p-5 text-center">
                      <Link 
                        href={`/admin/reports/${report.id}`}
                        className="text-xs font-extrabold text-[#0a2351] hover:text-[#5b61f4] tracking-wider transition-colors inline-block"
                      >
                        VIEW DETAIL
                      </Link>
                    </td>

                  </tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm font-semibold text-slate-400">
                      Tidak ada data laporan hasil tes yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-[#f8fafc]">
            <span className="text-xs font-bold text-slate-500">
              Menampilkan {filteredReports.length} dari 1,284 peserta
            </span>
            <div className="flex items-center gap-1 text-xs font-bold">
              <button className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded-md hover:bg-slate-50 transition-colors">
                Sebelumnya
              </button>
              <button className="w-7 h-7 rounded bg-[#0a2351] text-white flex items-center justify-center">1</button>
              <button className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-slate-600">2</button>
              <button className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-slate-600">3</button>
              <button className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded-md hover:bg-slate-50 transition-colors">
                Berikutnya
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
