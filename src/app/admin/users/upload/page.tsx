"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, FileDown, UserPlus, CheckCircle2, AlertCircle, ChevronDown, FileSpreadsheet, FileText } from "lucide-react";
import { apiFetch } from "@/lib/api";
import * as xlsx from "xlsx";

export default function UploadUsersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any[] | null>(null);
  const [uploadStats, setUploadStats] = useState<{ total: number; success: number; failed: number } | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccessData(null);
      setUploadStats(null);
      setShowExportMenu(false);
    }
  };

  const downloadTemplate = (format: 'csv' | 'xlsx') => {
    setShowTemplateMenu(false);
    
    const templateData = [
      { nama_user: "Budi Santoso", email: "budi@example.com", id_role: 2 },
      { nama_user: "Admin Baru", email: "admin@example.com", id_role: 1 }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Template");

    if (format === 'xlsx') {
      xlsx.writeFile(workbook, "template_user_beritest.xlsx");
    } else if (format === 'csv') {
      xlsx.writeFile(workbook, "template_user_beritest.csv", { bookType: 'csv' });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Pilih file Excel/CSV terlebih dahulu.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setShowExportMenu(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/users/import`, {
        method: "POST",
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengupload file.");
      }

      setUploadStats({
        total: data.data.total_processed,
        success: data.data.total_success,
        failed: data.data.total_failed,
      });
      setSuccessData(data.data.success_data);

      if (data.data.total_failed > 0) {
        setError(`Terdapat ${data.data.total_failed} baris yang gagal diimport. Periksa console untuk detail.`);
        console.warn("Import Errors:", data.data.errors);
      }

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = (format: 'csv' | 'xlsx') => {
    if (!successData || successData.length === 0) return;
    setShowExportMenu(false);

    const formattedData = successData.map(user => ({
      "Nama User": user.nama_user,
      "Email": user.email,
      "Password Sementara": user.temporary_password
    }));

    const worksheet = xlsx.utils.json_to_sheet(formattedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Hasil Import");

    if (format === 'xlsx') {
      xlsx.writeFile(workbook, "hasil_import_user_password.xlsx");
    } else if (format === 'csv') {
      xlsx.writeFile(workbook, "hasil_import_user_password.csv", { bookType: 'csv' });
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <div className="flex-1 px-8 pt-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-2">
          <Link href="/admin/users" className="hover:text-slate-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            Kembali
          </Link>
          <span className="font-normal text-slate-300">|</span>
          <span className="text-[#5b61f4]">Upload User via Excel</span>
        </nav>

        {/* Page Header Area */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Upload User via Excel</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Upload file spreadsheet kandidat untuk pendaftaran massal. Pastikan kolom sesuai template.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {uploadStats && uploadStats.success > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-800">Import Berhasil!</h3>
                <p className="text-sm text-green-700 mt-1">
                  Berhasil menambahkan {uploadStats.success} user baru. Password sementara telah di-generate.
                </p>
              </div>
            </div>
            
            <div className="relative self-start mt-2 sm:mt-0 flex-shrink-0">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <FileDown className="w-4 h-4" />
                Download Hasil
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

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Upload Area */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="border-2 border-dashed border-slate-300 bg-[#f8fafc] rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 bg-[#0a2351] rounded-full flex items-center justify-center mb-6 shadow-md">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {file ? "File Terpilih" : "Pilih File Excel"}
              </h3>
              <p className="text-sm text-slate-500 mb-8 max-w-[200px] leading-relaxed break-all">
                {file ? file.name : "Drag and drop file anda disini, atau klik untuk memilih file."}
              </p>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".xlsx, .xls, .csv" 
                className="hidden" 
              />

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-[#0a2351] hover:bg-[#0f337a] text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm mb-4"
              >
                Pilih File
              </button>
              
              <div className="relative w-full">
                <button 
                  onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-[#0a2351] hover:text-blue-700 transition-colors py-2"
                >
                  <FileDown className="w-4 h-4" />
                  Download Template
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                
                {showTemplateMenu && (
                  <div className="absolute left-0 top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <button 
                      onClick={() => downloadTemplate('xlsx')}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 border-b border-slate-100 text-sm font-bold text-slate-700 transition-colors text-left"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-green-600" />
                      Format Excel (.xlsx)
                    </button>
                    <button 
                      onClick={() => downloadTemplate('csv')}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors text-left"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      Format CSV (.csv)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Batch Selection Form (Dummy placeholder based on original UI) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <label htmlFor="defaultBatch" className="block text-xs font-bold text-slate-700 mb-3">
                Pilih Batch Default
              </label>
              <select
                id="defaultBatch"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-slate-700 appearance-none mb-3 disabled:opacity-50"
                disabled
              >
                <option value="">Tidak tersedia (Gunakan kolom Excel)</option>
              </select>
              <p className="text-[10px] text-slate-400 italic leading-relaxed">
                Fitur set batch otomatis belum didukung di versi ini. Harap assign user ke batch melalui dashboard secara manual.
              </p>
            </div>
          </div>

          {/* Right Column: Preview Table (Shows imported data after success) */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
              
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#f8fafc]">
                <h3 className="font-bold text-slate-800 text-lg">Hasil Generate Password</h3>
                <span className="text-xs text-slate-500 font-semibold bg-slate-200 px-3 py-1 rounded-full">
                  Read Only
                </span>
              </div>

              <div className="overflow-x-auto flex-1 max-h-[500px]">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead className="sticky top-0 bg-[#eef2ff] z-10">
                    <tr className="text-slate-500 text-[10px] uppercase tracking-wider font-bold shadow-sm">
                      <th className="p-4 border-b border-slate-200 w-[30%]">NAMA USER</th>
                      <th className="p-4 border-b border-slate-200 w-[40%]">EMAIL</th>
                      <th className="p-4 border-b border-slate-200 w-[30%]">TEMP PASSWORD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {successData ? (
                      successData.map((data: any) => (
                        <tr key={data.id_user} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <span className="text-sm font-semibold text-slate-700">{data.nama_user}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-slate-600">{data.email}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded select-all border border-slate-200">
                              {data.temporary_password}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-10 text-center text-slate-400 font-medium">
                          {file ? "File siap diupload. Tekan 'Mulai Proses Upload'." : "Belum ada data. Silakan upload file terlebih dahulu."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-slate-200 bg-[#f8fafc]">
                <p className="text-xs font-semibold text-slate-500">
                  {successData 
                    ? `Menampilkan ${successData.length} baris data berhasil di-import.` 
                    : file ? "1 File siap diupload." : "Tidak ada file aktif."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <Link
            href="/admin/users"
            className="px-6 py-2.5 border border-slate-200 text-[#0a2351] text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm"
          >
            Batal
          </Link>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#65d354] hover:bg-[#52ba43] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
          >
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {isUploading ? "Memproses..." : "Mulai Proses Upload"}
          </button>
        </div>

      </div>
    </div>
  );
}
