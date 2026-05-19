import { Plus, Folder, Filter, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const dummyQuestions = [
  {
    id: 1,
    text: "Jika sebuah kereta api berangkat dari Jakarta pukul...",
    category: "Logika Numerik",
    categoryColor: "bg-[#eef2ff] text-[#5b61f4]", // Purple/Blue
    difficulty: "Sulit",
    difficultyColor: "bg-red-50 text-red-600",
    date: "12 Okt 2023",
  },
  {
    id: 2,
    text: "Antonim dari kata \"Efemeral\" dalam konteks sastra kl...",
    category: "Verbal",
    categoryColor: "bg-blue-50 text-blue-600",
    difficulty: "Mudah",
    difficultyColor: "bg-green-50 text-green-600",
    date: "10 Okt 2023",
  },
  {
    id: 3,
    text: "Manakah dari gambar berikut yang melengkapi pola r...",
    category: "Spasial",
    categoryColor: "bg-indigo-50 text-indigo-600",
    difficulty: "Sedang",
    difficultyColor: "bg-yellow-50 text-yellow-600",
    date: "08 Okt 2023",
  },
  {
    id: 4,
    text: "Analisis laporan keuangan kuartal IV menunjukkan ke...",
    category: "Studi Kasus",
    categoryColor: "bg-purple-50 text-purple-600",
    difficulty: "Sulit",
    difficultyColor: "bg-red-50 text-red-600",
    date: "05 Okt 2023",
  },
];

export default function QuestionsPage() {
  return (
    <div className="flex flex-col min-h-full pb-10">
      <div className="flex-1 px-8 pt-8 max-w-7xl mx-auto w-full">
        {/* Page Header Area */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Master Soal</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Kelola seluruh bank pertanyaan untuk asesmen aktif.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/admin/questions/groups" className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#0a2351] text-[#0a2351] font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors">
              <Folder className="w-4 h-4" />
              Grup Soal
            </Link>
            <Link href="/admin/questions/create" className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2351] text-white font-bold text-sm rounded-lg hover:bg-[#0f337a] transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Tambah Soal
            </Link>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Total Soal Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-w-[240px]">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">TOTAL SOAL</h3>
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-extrabold text-[#0a2351]">1,284</p>
              <span className="text-sm font-bold text-green-600">+12%</span>
            </div>
          </div>

          {/* Filter Area */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
            <Filter className="w-5 h-5 text-slate-400" />
            <div className="flex flex-wrap items-center gap-2">
              <button className="px-4 py-1.5 bg-[#eef2ff] text-[#5b61f4] rounded-full text-xs font-bold transition-colors">
                Semua Posisi
              </button>
              <button className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 rounded-full text-xs font-bold transition-colors">
                PL/SQL
              </button>
              <button className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 rounded-full text-xs font-bold transition-colors">
                QC
              </button>
              <button className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 rounded-full text-xs font-bold transition-colors">
                SA
              </button>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="p-5 w-[45%]">TEKS PERTANYAAN</th>
                  <th className="p-5 w-[15%]">KATEGORI</th>
                  <th className="p-5 w-[15%]">KESULITAN</th>
                  <th className="p-5 w-[15%]">TANGGAL DIBUAT</th>
                  <th className="p-5 w-[10%]">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {dummyQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors">
                    <td className="p-5">
                      <p className="font-semibold text-sm text-[#0a2351] truncate max-w-md">
                        {q.text}
                      </p>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${q.categoryColor}`}>
                        {q.category}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${q.difficultyColor}`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="text-xs font-medium text-slate-600">{q.date}</span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors" title="Lihat">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-slate-400 hover:text-[#0a2351] transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="text-slate-400 hover:text-red-600 transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-[#f8fafc]">
            <span className="text-xs font-bold text-slate-500">
              Menampilkan 1-10 dari 1,284 soal
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <button className="p-1 hover:text-[#0a2351] transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-7 h-7 rounded bg-[#0a2351] text-white flex items-center justify-center">1</button>
              <button className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center">2</button>
              <button className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center">3</button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center">128</button>
              <button className="p-1 hover:text-[#0a2351] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
