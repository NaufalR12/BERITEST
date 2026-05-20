"use client";

import { useState, useEffect } from "react";
import { Users, Download, ChevronDown, FileSpreadsheet, FileText } from "lucide-react";
import { apiFetch } from "@/lib/api";
import * as xlsx from "xlsx";

export default function UserStats() {
  const [stats, setStats] = useState({ total_users: 0, active_users: 0, inactive_users: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiFetch("/users/summary");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch user stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = async (format: 'csv' | 'xlsx') => {
    setShowExportMenu(false);
    setIsExporting(true);
    try {
      // Fetch all users (adjust limit as needed for your DB size)
      const response = await apiFetch("/users?limit=10000");
      const users = response.data;

      if (!users || users.length === 0) {
        alert("Tidak ada data user untuk di-export.");
        return;
      }

      // Format data for export
      const formattedData = users.map((user: any) => ({
        "ID User": user.id_user,
        "Nama Lengkap": user.nama_user,
        "Email": user.email,
        "Role": user.mst_role?.name_role || "User",
        "Status": user.is_active ? "Aktif" : "Nonaktif"
      }));

      const worksheet = xlsx.utils.json_to_sheet(formattedData);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Users");

      if (format === 'xlsx') {
        xlsx.writeFile(workbook, "Data_User_Beritest.xlsx");
      } else if (format === 'csv') {
        xlsx.writeFile(workbook, "Data_User_Beritest.csv", { bookType: 'csv' });
      }

    } catch (error: any) {
      alert("Gagal mengexport data: " + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Total Users Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Total Users
          </h3>
          <Users className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-4xl font-extrabold text-slate-800">
          {isLoading ? "..." : stats.total_users}
        </p>
        <p className="text-sm font-semibold text-slate-500 mt-2">
          {stats.active_users} Aktif &middot; {stats.inactive_users} Nonaktif
        </p>
      </div>

      {/* Download Data Excel Card with Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setShowExportMenu(!showExportMenu)}
          disabled={isExporting}
          className="w-full h-full min-h-[140px] bg-white border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col justify-center items-center cursor-pointer hover:bg-slate-50 transition-colors group disabled:opacity-50 disabled:cursor-wait"
        >
          <div className="flex flex-col items-center gap-2 text-slate-600 group-hover:text-blue-600 transition-colors">
            {isExporting ? (
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download className="w-6 h-6 mb-1" />
            )}
            <div className="flex items-center gap-1 font-semibold">
              {isExporting ? "Menyiapkan Data..." : "Download Data User"}
              {!isExporting && <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {showExportMenu && (
          <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <button 
              onClick={() => handleExport('xlsx')}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 border-b border-slate-100 text-sm font-bold text-slate-700 transition-colors text-left"
            >
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              Export ke Excel (.xlsx)
            </button>
            <button 
              onClick={() => handleExport('csv')}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors text-left"
            >
              <FileText className="w-5 h-5 text-blue-600" />
              Export ke CSV (.csv)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
