"use client";

import { useState } from "react";
import Link from "next/link";
import { Folder, Search, Calendar, Star, Compass, ExternalLink, ChevronDown, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";

// Define Question Type
interface Question {
  id: number;
  category: string;
  categoryColor: string;
  date: string;
  text: string;
  imageUrl?: string;
}

const dummyQuestions: Question[] = [
  {
    id: 1,
    category: "MATEMATIKA",
    categoryColor: "bg-indigo-50 text-indigo-600",
    date: "12 Okt 2023",
    text: "Sebuah toko memberikan diskon bertingkat 20% + 10%. Jika harga awal sebuah sepatu adalah Rp 500.000, berapakah harga akhirnya?",
  },
  {
    id: 2,
    category: "LOGIKA VERBAL",
    categoryColor: "bg-[#eef2ff] text-[#5b61f4]",
    date: "10 Okt 2023",
    text: "Manakah dari kata berikut yang tidak termasuk dalam kelompoknya: Mawar, Melati, Kamboja, Beringin, Anggrek?",
  },
  {
    id: 3,
    category: "KEWARGANEGARAAN",
    categoryColor: "bg-blue-50 text-blue-600",
    date: "08 Okt 2023",
    text: "Sila ke-4 Pancasila mengandung nilai kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan. Implementasi nyata dalam kehidupan...",
  },
  {
    id: 4,
    category: "MATEMATIKA",
    categoryColor: "bg-indigo-50 text-indigo-600",
    date: "05 Okt 2023",
    text: "Rata-rata nilai ujian dari 30 siswa adalah 75. Jika 5 siswa dengan rata-rata 90 dikeluarkan, maka rata-rata barunya adalah...",
  },
  {
    id: 5,
    category: "LOGIKA FIGURAL",
    categoryColor: "bg-purple-50 text-purple-600",
    date: "01 Okt 2023",
    text: "Perhatikan pola gambar di samping. Manakah yang paling tepat untuk mengisi kotak yang kosong...",
    imageUrl: "/dummy-pattern.png" // Placeholder or dummy path, we will render a nice CSS grid drawing or box
  },
];

export default function CreateQuestionGroupPage() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 3, 5]); // Default selected matches design
  const [selectAll, setSelectAll] = useState(false);

  const handleToggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAllToggle = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(dummyQuestions.map(q => q.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSave = () => {
    if (!groupName.trim()) {
      alert("Silakan isi nama grup soal terlebih dahulu!");
      return;
    }
    alert(`Grup Soal "${groupName}" berhasil disimpan dengan ${selectedIds.length} soal!`);
    router.push("/admin/questions/groups");
  };

  return (
    <div className="flex flex-col min-h-full pb-10 bg-slate-50/50">
      <div className="flex-1 px-8 pt-6 max-w-7xl mx-auto w-full">
        
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400 mb-2">
          <Link href="/admin/questions/groups" className="hover:text-slate-600 transition-colors">Group Soal</Link>
          <span className="mx-2 font-normal text-slate-300">&gt;</span>
          <span className="text-[#5b61f4]">Buat Grup Baru</span>
        </nav>

        {/* Page Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">
              Buat Grup Soal Baru
            </h2>
          </div>
          
          {/* Compound Button */}
          <div className="inline-flex items-center bg-[#0a2351] rounded-full overflow-hidden shadow-md text-white">
            <div className="flex items-center gap-2 px-5 py-3 bg-[#133060] font-bold text-xs">
              <Folder className="w-4 h-4 text-blue-300" />
              <span>{selectedIds.length} Soal Terpilih</span>
            </div>
            <button 
              onClick={handleSave}
              className="px-6 py-3 bg-[#0a2351] hover:bg-[#07193a] text-xs font-extrabold tracking-wider transition-colors border-l border-[#133060]"
            >
              SIMPAN GRUP
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Column - Sidebar (1/3 width or fixed width) */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-6">
            
            {/* Card 1: Nama Grup Soal */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                NAMA GRUP SOAL
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Contoh: Seleksi CPNS 2024 - Gelombang 1"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-[#5b61f4] focus:border-[#5b61f4] outline-none transition-all placeholder:text-slate-400"
              />
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Gunakan nama yang deskriptif agar mudah dikelola nanti.
              </p>
            </div>

            {/* Card 2: Filter Pencarian */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                FILTER PENCARIAN
              </h3>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari konten soal..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-[#5b61f4] outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Dari Tanggal</label>
                  <input
                    type="date"
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:ring-2 focus:ring-[#5b61f4] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Sampai Tanggal</label>
                  <input
                    type="date"
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:ring-2 focus:ring-[#5b61f4] transition-all"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eef2ff] text-[#5b61f4] rounded-full text-xs font-bold border border-indigo-100">
                  <Compass className="w-3 h-3" />
                  Matematika
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                  <Star className="w-3 h-3 fill-current" />
                  High Difficulty
                </span>
              </div>
            </div>

            {/* Card 3: AI Acak Soal */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                AI ACAK SOAL
              </h3>
              <textarea
                rows={4}
                placeholder="Pilih soal sebanyak 30 dengan susunan seperti ini......"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-[#5b61f4] outline-none transition-all placeholder:text-slate-400 resize-none font-medium leading-relaxed"
              />
              <div className="flex justify-end">
                <button 
                  type="button"
                  className="px-4 py-2 bg-[#4ade80] hover:bg-[#22c55e] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  Acak Soal
                </button>
              </div>
            </div>

          </div>

          {/* Right Column - Questions List */}
          <div className="flex-1 w-full space-y-4">
            
            {/* List Header Bar */}
            <div className="bg-[#eef2ff] border border-slate-200 rounded-xl px-5 py-3 flex items-center justify-between shadow-sm">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllToggle}
                  className="w-4 h-4 text-[#5b61f4] border-slate-300 rounded focus:ring-[#5b61f4] cursor-pointer"
                />
                <span className="text-[11px] font-bold text-[#0a2351] tracking-wider uppercase">
                  PILIH SEMUA DI HALAMAN INI
                </span>
              </label>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <span>Urutkan:</span>
                <div className="relative inline-flex items-center gap-1 text-[#0a2351] cursor-pointer">
                  <span>Terbaru</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Questions Cards */}
            <div className="space-y-4">
              {dummyQuestions.map((q) => {
                const isSelected = selectedIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-200 flex ${
                      isSelected 
                        ? "border-slate-300 border-l-[6px] border-l-[#0a2351]" 
                        : "border-slate-200 border-l-[6px] border-l-transparent"
                    }`}
                  >
                    {/* Checkbox Container */}
                    <div className="pl-5 py-5 flex items-start justify-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(q.id)}
                        className="w-4 h-4 text-[#0a2351] border-slate-300 rounded focus:ring-[#0a2351] cursor-pointer mt-0.5"
                      />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-5 pl-4 flex gap-4">
                      <div className="flex-1 space-y-3">
                        {/* Meta Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase ${q.categoryColor}`}>
                              {q.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              • Dibuat: {q.date}
                            </span>
                          </div>
                          <button className="text-slate-400 hover:text-[#5b61f4] transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Question Text */}
                        <p className="text-xs font-semibold text-slate-700 leading-relaxed max-w-2xl">
                          {q.text}
                        </p>
                      </div>

                      {/* Optional Image Panel (matches figural pattern) */}
                      {q.imageUrl && (
                        <div className="w-24 h-16 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center relative">
                          {/* We draw a nice geometric representation inside for figural */}
                          <div className="absolute inset-2 grid grid-cols-3 grid-rows-2 gap-1 opacity-80">
                            <div className="bg-slate-700 rounded-sm"></div>
                            <div className="bg-slate-700 rounded-sm"></div>
                            <div className="bg-slate-700 rounded-sm"></div>
                            <div className="bg-[#5b61f4] rounded-sm animate-pulse"></div>
                            <div className="bg-slate-700 rounded-sm"></div>
                            <div className="bg-slate-700 rounded-sm"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination footer */}
            <div className="pt-4 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Menampilkan 1-5 dari 250 pertanyaan</span>
              <div className="flex items-center gap-1.5">
                <button className="p-1 hover:text-[#0a2351] transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-7 h-7 rounded bg-[#0a2351] text-white flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center">2</button>
                <button className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center">3</button>
                <span className="px-1 text-slate-400">...</span>
                <button className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center">25</button>
                <button className="p-1 hover:text-[#0a2351] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
