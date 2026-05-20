"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, FileDown, ChevronDown, FileSpreadsheet, FileText } from "lucide-react";
import { apiFetch } from "@/lib/api";
import * as xlsx from "xlsx";

export default function CreateUserPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("2"); // Default to User (id: 2)
  const [batch, setBatch] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ nama_user: string; email: string; temporary_password: string } | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessData(null);
    setShowExportMenu(false);

    try {
      // Role ID needs to be a number. 1 = Admin, 2 = User.
      const payload = {
        nama_user: fullName,
        email: email,
        id_role: parseInt(roleId, 10),
      };

      const response = await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSuccessData({
        nama_user: response.data.nama_user,
        email: response.data.email,
        temporary_password: response.data.temporary_password,
      });

      // Clear form
      setFullName("");
      setEmail("");
      // Intentionally not clearing batch/role so admin can create multiple similar users
    } catch (err: any) {
      setError(err.message || "Gagal membuat user baru.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format: 'csv' | 'xlsx') => {
    if (!successData) return;
    setShowExportMenu(false);

    const formattedData = [{
      "Nama User": successData.nama_user,
      "Email": successData.email,
      "Password Sementara": successData.temporary_password
    }];

    const worksheet = xlsx.utils.json_to_sheet(formattedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Kredensial");

    const fileName = `kredensial_${successData.nama_user.replace(/\s+/g, '_')}`;

    if (format === 'xlsx') {
      xlsx.writeFile(workbook, `${fileName}.xlsx`);
    } else if (format === 'csv') {
      xlsx.writeFile(workbook, `${fileName}.csv`, { bookType: 'csv' });
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <div className="flex-1 px-8 pt-8 max-w-5xl mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-2">
          <Link href="/admin/users" className="hover:text-slate-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            Kembali
          </Link>
          <span className="font-normal text-slate-300">|</span>
          <span className="text-[#5b61f4]">Tambah User Baru</span>
        </nav>

        {/* Page Header Area */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Tambah User Baru</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Sistem akan secara otomatis membuatkan password sementara untuk user baru.
          </p>
        </div>

        {/* Success Message */}
        {successData && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-green-800">User Berhasil Dibuat!</h3>
                <p className="text-sm text-green-700 mt-1">
                  Harap simpan dan berikan kredensial berikut kepada kandidat. Password ini tidak akan ditampilkan lagi.
                </p>
                <div className="mt-3 bg-white p-3 rounded-lg border border-green-100 shadow-sm font-mono text-sm">
                  <div><span className="text-slate-500">Email:</span> <span className="font-bold text-slate-800">{successData.email}</span></div>
                  <div className="mt-1"><span className="text-slate-500">Password:</span> <span className="font-bold text-slate-800">{successData.temporary_password}</span></div>
                </div>
              </div>
            </div>
            
            <div className="relative self-start mt-2 sm:mt-0">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <FileDown className="w-4 h-4" />
                Download Data
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <button 
                    onClick={() => handleExport('xlsx')}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 border-b border-slate-100 text-sm font-bold text-slate-700 transition-colors text-left"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    Format Excel
                  </button>
                  <button 
                    onClick={() => handleExport('csv')}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors text-left"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    Format CSV
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 mb-2">
                Nama Lengkap
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Budi Santoso"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-2">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@email.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-xs font-bold text-slate-700 mb-2">
                Role Akses
              </label>
              <select
                id="role"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-slate-700 appearance-none"
                required
              >
                <option value="2">Kandidat / User</option>
                <option value="1">Administrator</option>
              </select>
            </div>

            {/* Batch Selection (Dummy for now as per UI) */}
            <div>
              <label htmlFor="batch" className="block text-xs font-bold text-slate-700 mb-2">
                Assign Batch (Opsional)
              </label>
              <select
                id="batch"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-slate-700 appearance-none"
              >
                <option value="">Tidak ada batch</option>
                <option value="batch-1">Batch 01 - Cloud Architect</option>
                <option value="batch-2">Batch 05 - UX Designer</option>
                <option value="batch-3">Batch 12 - Data Science</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-end gap-4">
              <Link
                href="/admin/users"
                className="px-6 py-2.5 border border-slate-200 text-[#0a2351] text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Kembali
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-[#65d354] hover:bg-[#52ba43] text-white text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menyimpan...
                  </>
                ) : (
                  "Buat User Baru"
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}


