"use client";

import { useState, useMemo } from "react";
import { 
  TrendingDown, TrendingUp, BarChart2, Search, Bell, 
  ChevronDown, FileText, ArrowRight, Activity, HelpCircle 
} from "lucide-react";

interface QuestionAnalysis {
  id: string;
  text: string;
  category: string;
  totalAttempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageTime: string;
  difficulty: "Sangat Mudah" | "Mudah" | "Sedang" | "Sulit" | "Sangat Sulit";
}

const dummyQuestionAnalysisList: QuestionAnalysis[] = [
  {
    id: "Q-9921-X",
    text: "Berapakah hasil dari 25% dari 2.500 dikalikan 4?",
    category: "Matematika",
    totalAttempts: 1204,
    correctAnswers: 1023,
    incorrectAnswers: 181,
    averageTime: "00:45",
    difficulty: "Mudah",
  },
  {
    id: "Q-8832-W",
    text: "Siapakah tokoh yang mengusulkan rumusan Pancasila pada tanggal 1 Juni 1945?",
    category: "Wawasan Kebangsaan",
    totalAttempts: 3450,
    correctAnswers: 3105,
    incorrectAnswers: 345,
    averageTime: "00:32",
    difficulty: "Sangat Mudah",
  },
  {
    id: "Q-4512-L",
    text: "Jika A > B dan B < C, manakah pernyataan berikut yang paling tepat menggambarkan hubungan A dan C?",
    category: "Logika Analitik",
    totalAttempts: 892,
    correctAnswers: 214,
    incorrectAnswers: 678,
    averageTime: "02:15",
    difficulty: "Sangat Sulit",
  },
  {
    id: "Q-7721-B",
    text: "Identify the correct grammatical structure for the sentence expressing a future condition.",
    category: "Bahasa Inggris",
    totalAttempts: 2110,
    correctAnswers: 1055,
    incorrectAnswers: 1055,
    averageTime: "01:10",
    difficulty: "Sedang",
  },
  {
    id: "Q-3321-M",
    text: "Diberikan kubus ABCD.EFGH dengan rusuk 6cm, tentukan jarak titik A ke garis HB.",
    category: "Geometri Dasar",
    totalAttempts: 540,
    correctAnswers: 162,
    incorrectAnswers: 378,
    averageTime: "01:58",
    difficulty: "Sulit",
  },
];

export default function QuestionAnalysisPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua Kategori");
  const [difficultyFilter, setDifficultyFilter] = useState("Semua Kesulitan");

  const filteredQuestions = useMemo(() => {
    return dummyQuestionAnalysisList.filter((q) => {
      const matchesSearch = 
        q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory =
        categoryFilter === "Semua Kategori" || q.category === categoryFilter;

      const matchesDifficulty =
        difficultyFilter === "Semua Kesulitan" || q.difficulty === difficultyFilter;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, categoryFilter, difficultyFilter]);

  const handleExportPDF = () => {
    alert("Mengekspor laporan analisis soal ke format PDF...");
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Sangat Mudah":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "Mudah":
        return "bg-green-50 text-green-600 border border-green-100";
      case "Sedang":
        return "bg-slate-100 text-slate-600 border border-slate-200";
      case "Sulit":
        return "bg-orange-50 text-orange-600 border border-orange-100";
      case "Sangat Sulit":
        return "bg-red-50 text-red-600 border border-red-100";
      default:
        return "bg-slate-50 text-slate-500";
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-10 bg-slate-50/50">
      <div className="flex-1 px-8 pt-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header Title Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">
            Analisis Soal
          </h2>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Soal Paling Sulit */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-red-50 text-red-500 uppercase tracking-wide">
                Sangat Sulit
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Soal Paling Sulit</p>
              <h4 className="text-xs font-bold text-[#0a2351] truncate">Logika Matematika Dasar IV...</h4>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500">Tingkat Kesalahan</span>
              <span className="text-sm font-extrabold text-red-500">84%</span>
            </div>
          </div>

          {/* Card 2: Soal Paling Mudah */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-600 uppercase tracking-wide">
                Sangat Mudah
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Soal Paling Mudah</p>
              <h4 className="text-xs font-bold text-[#0a2351] truncate">Pengenalan Antarmuka I...</h4>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500">Tingkat Benar</span>
              <span className="text-sm font-extrabold text-indigo-600">92%</span>
            </div>
          </div>

          {/* Card 3: Total Percobaan Soal */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Percobaan Soal</p>
            </div>
            <p className="text-3xl font-black text-[#0a2351]">12,482</p>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              Bulan Ini
            </div>
          </div>

          {/* Card 4: Rata-rata Akurasi */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata Akurasi</p>
            </div>
            <p className="text-3xl font-black text-indigo-600">68.5%</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: "68.5%" }}></div>
            </div>
          </div>

        </div>

        {/* Filter Bar Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-[#0a2351] tracking-wider uppercase pr-2">FILTER:</span>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari konten soal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-slate-300 transition-all w-48 placeholder:text-slate-400"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <option value="Semua Kategori">Semua Kategori</option>
                <option value="Matematika">Matematika</option>
                <option value="Wawasan Kebangsaan">Wawasan Kebangsaan</option>
                <option value="Logika Analitik">Logika Analitik</option>
                <option value="Bahasa Inggris">Bahasa Inggris</option>
                <option value="Geometri Dasar">Geometri Dasar</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <select 
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <option value="Semua Kesulitan">Semua Kesulitan</option>
                <option value="Sangat Mudah">Sangat Mudah</option>
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="Sulit">Sulit</option>
                <option value="Sangat Sulit">Sangat Sulit</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              Export PDF
            </button>
            <button
              className="px-4 py-2 bg-[#0a2351] hover:bg-[#07193a] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              Terapkan Filter
            </button>
          </div>
        </div>

        {/* Results Table Area */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider font-extrabold border-b border-slate-200">
                  <th className="p-5 w-[38%]">PERTANYAAN</th>
                  <th className="p-5 w-[15%]">KATEGORI</th>
                  <th className="p-5 w-[10%] text-center">TOTAL PERCOBAAN</th>
                  <th className="p-5 w-[10%] text-center">JAWABAN BENAR</th>
                  <th className="p-5 w-[10%] text-center">JAWABAN SALAH</th>
                  <th className="p-5 w-[10%] text-center">RATA-RATA WAKTU</th>
                  <th className="p-5 w-[12%] text-center">TINGKAT KESULITAN</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors">
                    
                    {/* Pertanyaan */}
                    <td className="p-5">
                      <div className="space-y-1">
                        <p className="font-extrabold text-xs text-[#0a2351] leading-relaxed max-w-lg">
                          {q.text}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold">ID: {q.id}</p>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="p-5">
                      <span className="text-xs font-semibold text-slate-600">{q.category}</span>
                    </td>

                    {/* Total Percobaan */}
                    <td className="p-5 text-center">
                      <span className="text-xs font-bold text-slate-700">
                        {q.totalAttempts.toLocaleString("id-ID")}
                      </span>
                    </td>

                    {/* Jawaban Benar */}
                    <td className="p-5 text-center">
                      <span className="text-xs font-extrabold text-indigo-600">
                        {q.correctAnswers.toLocaleString("id-ID")}
                      </span>
                    </td>

                    {/* Jawaban Salah */}
                    <td className="p-5 text-center">
                      <span className="text-xs font-extrabold text-red-500">
                        {q.incorrectAnswers.toLocaleString("id-ID")}
                      </span>
                    </td>

                    {/* Rata-rata Waktu */}
                    <td className="p-5 text-center">
                      <span className="text-xs font-semibold text-slate-600">{q.averageTime}</span>
                    </td>

                    {/* Tingkat Kesulitan */}
                    <td className="p-5 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-extrabold ${getDifficultyColor(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                    </td>

                  </tr>
                ))}
                {filteredQuestions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm font-semibold text-slate-400">
                      Tidak ada data analisis soal yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-[#f8fafc]">
            <span className="text-xs font-bold text-slate-500">
              Menampilkan {filteredQuestions.length} dari 124 soal
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
              <button className="p-1 hover:text-[#0a2351] transition-colors">
                &lt;
              </button>
              <button className="w-7 h-7 rounded bg-[#0a2351] text-white flex items-center justify-center">1</button>
              <button className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center">2</button>
              <button className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center">3</button>
              <button className="p-1 hover:text-[#0a2351] transition-colors">
                &gt;
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
