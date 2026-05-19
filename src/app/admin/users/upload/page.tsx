"use client";

import Link from "next/link";
import { ArrowLeft, Upload, FileDown, UserPlus } from "lucide-react";


export default function UploadUsersPage() {
  const dummyPreviewData = [
    { id: 1, name: "Ahmad Faisal", email: "ahmad.faisal@email.com", batch: "Batch 01", password: "sdfasfsafsf" },
    { id: 2, name: "Budi Santoso", email: "budi.s@provider.net", batch: "Batch 01", password: "343fesgdsg" },
    { id: 3, name: "Citra Lestari", email: "citra.lestari@company.id", batch: "Batch 02", password: "343fesgdsg" },
  ];

  return (
    <div className="flex flex-col min-h-full pb-10">
      
      
      <div className="flex-1 px-8 pt-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400 mb-2">
          <Link href="/admin/users" className="hover:text-slate-600 transition-colors">Users</Link>
          <span className="mx-2 font-normal text-slate-300">&gt;</span>
          <span className="text-[#5b61f4]">Upload User via Excel</span>
        </nav>

        {/* Page Header Area */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Upload User via Excel</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Upload file spreadsheet kandidat untuk pendaftaran massal.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Upload Area */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="border-2 border-dashed border-slate-300 bg-[#f8fafc] rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 bg-[#0a2351] rounded-full flex items-center justify-center mb-6 shadow-md">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Pilih File Excel</h3>
              <p className="text-sm text-slate-500 mb-8 max-w-[200px] leading-relaxed">
                Drag and drop file anda disini, atau klik untuk memilih file dari komputer.
              </p>
              
              <button className="w-full bg-[#0a2351] hover:bg-[#0f337a] text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm mb-4">
                Pilih File
              </button>
              
              <button className="flex items-center gap-2 text-sm font-bold text-[#0a2351] hover:text-blue-700 transition-colors">
                <FileDown className="w-4 h-4" />
                Download Template Excel
              </button>
            </div>

            {/* Batch Selection Form */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <label htmlFor="defaultBatch" className="block text-xs font-bold text-slate-700 mb-3">
                Pilih Batch Default
              </label>
              <select
                id="defaultBatch"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-slate-700 appearance-none mb-3"
              >
                <option value="">Pilih Batch...</option>
                <option value="batch-1">Batch 01 - Cloud Architect</option>
                <option value="batch-2">Batch 05 - UX Designer</option>
                <option value="batch-3">Batch 12 - Data Science</option>
              </select>
              <p className="text-[10px] text-slate-400 italic leading-relaxed">
                Batch ini akan diterapkan jika kolom 'Batch' di Excel kosong.
              </p>
            </div>
          </div>

          {/* Right Column: Preview Table */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
              
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#f8fafc]">
                <h3 className="font-bold text-slate-800 text-lg">Preview Data</h3>
                <button className="bg-[#0a2351] hover:bg-[#0f337a] text-white text-xs font-bold py-2 px-4 rounded-full transition-colors shadow-sm">
                  Generate Password
                </button>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-[#eef2ff] text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                      <th className="p-4 border-b border-slate-200 w-[25%]">NAMA USER</th>
                      <th className="p-4 border-b border-slate-200 w-[35%]">EMAIL</th>
                      <th className="p-4 border-b border-slate-200 w-[20%]">BATCH</th>
                      <th className="p-4 border-b border-slate-200 w-[20%]">PASSWORD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyPreviewData.map((data) => (
                      <tr key={data.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <span className="text-sm font-semibold text-slate-700">{data.name}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-600">{data.email}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-600">{data.batch}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded">{data.password}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-slate-200 bg-[#f8fafc]">
                <p className="text-xs font-semibold text-slate-500">
                  Menampilkan 3 dari total 3 data yang ditemukan dalam file.
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
            Batalkan
          </Link>
          <button
            className="flex items-center gap-2 px-6 py-2.5 bg-[#65d354] hover:bg-[#52ba43] text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Tambah User
          </button>
        </div>

      </div>
    </div>
  );
}
