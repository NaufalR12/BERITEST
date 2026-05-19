"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Search, Bell, User, Briefcase, Target, Calendar, 
  HelpCircle, CheckCircle, XCircle, Clock, Download, ChevronDown, Check, CheckSquare
} from "lucide-react";

// Mock database mapping IDs to participants
const participantsData: Record<string, {
  name: string;
  email: string;
  role: string;
  batch: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: string;
  status: "Lulus" | "Gagal";
}> = {
  "1": {
    name: "Budi Darmawan",
    email: "budi.darmawan@email.com",
    role: "Senior Software Engineer",
    batch: "Batch Q3 - 2024",
    date: "15 Oktober 2023",
    score: 92,
    totalQuestions: 50,
    correctAnswers: 46,
    incorrectAnswers: 4,
    timeSpent: "01:12:45",
    status: "Lulus"
  },
  "2": {
    name: "Siti Aminah",
    email: "siti.a@gmail.com",
    role: "UI/UX Designer",
    batch: "Batch Q3 - 2024",
    date: "15 Oktober 2023",
    score: 88,
    totalQuestions: 50,
    correctAnswers: 44,
    incorrectAnswers: 6,
    timeSpent: "01:05:20",
    status: "Lulus"
  },
  "3": {
    name: "Andi Wijaya",
    email: "andi_w@outlook.com",
    role: "Frontend Developer",
    batch: "Batch Q3 - 2024",
    date: "15 Oktober 2023",
    score: 58,
    totalQuestions: 50,
    correctAnswers: 29,
    incorrectAnswers: 21,
    timeSpent: "01:22:10",
    status: "Gagal"
  },
  "4": {
    name: "Lestari Putri",
    email: "putri.l@university.ac.id",
    role: "QA Engineer",
    batch: "Batch Q3 - 2024",
    date: "14 Oktober 2023",
    score: 76,
    totalQuestions: 50,
    correctAnswers: 38,
    incorrectAnswers: 12,
    timeSpent: "00:58:30",
    status: "Lulus"
  }
};

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "1";
  
  // Fetch participant or fall back to Budi
  const p = participantsData[id] || participantsData["1"];

  const handleDownloadPDF = () => {
    alert(`Mengunduh hasil tes ${p.name} dalam format PDF...`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAdvancedAnalysis = () => {
    alert("Membuka dashboard analisis lanjutan AI untuk peserta ini...");
  };

  return (
    <div className="flex flex-col min-h-full pb-10 bg-slate-50/50">
      <div className="flex-1 px-8 pt-6 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400 mb-2">
          <Link href="/admin/reports" className="hover:text-slate-600 transition-colors">Reports</Link>
          <span className="mx-2 font-normal text-slate-300">&gt;</span>
          <span className="text-[#5b61f4]">Detail Hasil Tes Peserta</span>
        </nav>

        {/* Page Title */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">
            Detail Hasil Tes Peserta
          </h2>
        </div>

        {/* Profile Card & Score Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-stretch justify-between gap-6">
          
          {/* Left Side: Avatar & Details */}
          <div className="flex items-start gap-5 flex-1">
            <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-extrabold text-[#0a2351] leading-tight">{p.name}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">{p.email}</p>
              </div>

              {/* Badges Info Row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {p.role}
                </span>
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-slate-400" />
                  {p.batch}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {p.date}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Score Card Container */}
          <div className="flex items-center justify-center shrink-0">
            <div className="bg-[#0a2351] text-white px-8 py-5 rounded-xl text-center space-y-2 min-w-[180px] shadow-sm relative overflow-hidden">
              <p className="text-[10px] font-bold tracking-wider text-blue-200 uppercase">NILAI AKHIR</p>
              <p className="text-3xl font-black">{p.score}<span className="text-sm font-bold text-blue-200">/100</span></p>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold ${
                p.status === "Lulus" 
                  ? "bg-green-500/10 text-green-400" 
                  : "bg-red-500/10 text-red-400"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                Status: {p.status}
              </div>
            </div>
          </div>

        </div>

        {/* Metrik Summary Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Card 1: Total Soal */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Soal</p>
              <p className="text-2xl font-black text-[#0a2351]">{p.totalQuestions}</p>
            </div>
            <HelpCircle className="w-6 h-6 text-slate-400" />
          </div>

          {/* Card 2: Jawaban Benar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Jawaban Benar</p>
              <p className="text-2xl font-black text-green-500">{p.correctAnswers}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>

          {/* Card 3: Jawaban Salah */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Jawaban Salah</p>
              <p className="text-2xl font-black text-red-500">{p.incorrectAnswers}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-500" />
          </div>

          {/* Card 4: Waktu Pengerjaan */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Waktu Pengerjaan</p>
              <p className="text-xl font-black text-[#0a2351] tracking-tight">{p.timeSpent}</p>
            </div>
            <Clock className="w-6 h-6 text-slate-400" />
          </div>

        </div>

        {/* Section: Analisis Jawaban */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0a2351]">Analisis Jawaban</h3>
            
            <div className="flex items-center gap-3">
              {/* Dropdown filter */}
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  Semua Soal
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Download PDF button */}
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-[#0a2351] hover:bg-[#07193a] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>

          {/* List of Questions Analysed */}
          <div className="space-y-5">
            
            {/* Question 01: Correct Answer */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 relative">
              {/* Title & Badge Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">
                    01
                  </div>
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed pt-0.5">
                    Manakah dari pilihan berikut yang merupakan keuntungan utama menggunakan arsitektur microservices dibandingkan dengan monolitik?
                  </p>
                </div>
                <span className="inline-flex px-3 py-1 bg-green-50 text-green-600 rounded text-[10px] font-extrabold tracking-wide uppercase shrink-0">
                  ✓ Benar
                </span>
              </div>

              {/* Participant's Answer Box */}
              <div className="pl-10 space-y-1.5">
                <div className="border border-[#5b61f4] bg-[#eef2ff]/30 rounded-lg p-4 flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-[#0a2351] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    B
                  </div>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    Skalabilitas independen untuk setiap komponen layanan.
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold pl-2">Jawaban Peserta</p>
              </div>
            </div>

            {/* Question 02: Incorrect Answer */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              {/* Title & Badge Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">
                    02
                  </div>
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed pt-0.5">
                    Dalam konteks Database Transaction, apa yang dimaksud dengan 'Durability' dalam prinsip ACID?
                  </p>
                </div>
                <span className="inline-flex px-3 py-1 bg-red-50 text-red-600 rounded text-[10px] font-extrabold tracking-wide uppercase shrink-0">
                  × Salah
                </span>
              </div>

              {/* Two columns: Participant Answer vs Correct Answer */}
              <div className="pl-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1: Jawaban Peserta */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-extrabold text-red-500 uppercase tracking-wide">Jawaban Peserta</span>
                  <div className="border border-red-200 bg-red-50/10 rounded-lg p-4 flex items-start gap-3">
                    <div className="w-5 h-5 rounded bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      A
                    </div>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      Data harus valid sesuai dengan semua aturan skema yang ditentukan.
                    </p>
                  </div>
                </div>

                {/* Column 2: Jawaban Benar */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-extrabold text-green-500 uppercase tracking-wide">Jawaban Benar</span>
                  <div className="border border-green-200 bg-green-50/10 rounded-lg p-4 flex items-start gap-3">
                    <div className="w-5 h-5 rounded bg-green-100 text-green-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      D
                    </div>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      Sekali transaksi dikomit, data akan tetap tersimpan meskipun terjadi kegagalan sistem.
                    </p>
                  </div>
                </div>
              </div>

              {/* Explanation Box */}
              <div className="pl-10">
                <div className="bg-[#eef2ff]/30 border border-slate-100 rounded-lg p-4 text-xs text-slate-600 leading-relaxed">
                  <span className="font-extrabold text-[#0a2351]">Penjelasan:</span> Durability menjamin bahwa setelah transaksi selesai dan berhasil, perubahan data tersebut bersifat permanen dan tidak akan hilang meskipun sistem mengalami crash atau mati mendadak.
                </div>
              </div>
            </div>

            {/* Question 03: Correct Answer showing all option items */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              {/* Title & Badge Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">
                    03
                  </div>
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed pt-0.5">
                    Manakah dari protokol berikut yang bekerja di Layer 4 (Transport Layer) pada model OSI?
                  </p>
                </div>
                <span className="inline-flex px-3 py-1 bg-green-50 text-green-600 rounded text-[10px] font-extrabold tracking-wide uppercase shrink-0">
                  ✓ Benar
                </span>
              </div>

              {/* Options list */}
              <div className="pl-10 space-y-3">
                {/* Option A */}
                <div className="border border-slate-200 rounded-lg p-3.5 flex items-center gap-3 text-xs text-slate-500">
                  <div className="w-5 h-5 rounded border border-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                    A
                  </div>
                  <span>HTTP</span>
                </div>
                {/* Option B */}
                <div className="border border-slate-200 rounded-lg p-3.5 flex items-center gap-3 text-xs text-slate-500">
                  <div className="w-5 h-5 rounded border border-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                    B
                  </div>
                  <span>IP</span>
                </div>
                {/* Option C (Correct Highlighted) */}
                <div className="border border-[#5b61f4] bg-[#eef2ff]/30 rounded-lg p-3.5 flex items-center justify-between text-xs text-[#0a2351] font-bold">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded bg-[#0a2351] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      C
                    </div>
                    <span>TCP</span>
                  </div>
                  {/* double checkmark mock */}
                  <div className="flex text-[#5b61f4]">
                    <Check className="w-3.5 h-3.5 -mr-1.5" />
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
                {/* Option D */}
                <div className="border border-slate-200 rounded-lg p-3.5 flex items-center gap-3 text-xs text-slate-500">
                  <div className="w-5 h-5 rounded border border-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                    D
                  </div>
                  <span>Ethernet</span>
                </div>
                {/* Option E */}
                <div className="border border-slate-200 rounded-lg p-3.5 flex items-center gap-3 text-xs text-slate-500">
                  <div className="w-5 h-5 rounded border border-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                    E
                  </div>
                  <span>SSH</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions Area */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/admin/reports"
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-500 font-extrabold text-xs tracking-wider rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Laporan
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-extrabold text-xs tracking-wider rounded-lg transition-colors text-center"
            >
              Print Detail
            </button>
            <button
              onClick={handleAdvancedAnalysis}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#0a2351] hover:bg-[#07193a] text-white font-extrabold text-xs tracking-wider rounded-lg transition-colors text-center shadow-sm"
            >
              Analisis Lanjutan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
