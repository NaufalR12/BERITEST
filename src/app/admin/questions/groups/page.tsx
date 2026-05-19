import { FolderPlus, FileText } from "lucide-react";
import Link from "next/link";

const dummyGroups = [
  {
    id: 1,
    category: "Matematika Dasar",
    categoryColor: "bg-[#eef2ff] text-[#5b61f4]",
    title: "Logika Matematika",
    description: "Kumpulan soal logika, himpunan, dan penalaran matematika untuk seleksi...",
    questionCount: 120,
  },
  {
    id: 2,
    category: "Bahasa Inggris",
    categoryColor: "bg-blue-50 text-blue-600",
    title: "Reading Comprehension",
    description: "Latihan intensif pemahaman bacaan dengan teks akademik dan jurnal...",
    questionCount: 85,
  },
  {
    id: 3,
    category: "Psikotes",
    categoryColor: "bg-indigo-50 text-indigo-600",
    title: "Tes Intelegensia Umum",
    description: "Paket soal TIU lengkap mencakup verbal, numerik, dan figural untuk...",
    questionCount: 250,
  },
  {
    id: 4,
    category: "Wawasan Kebangsaan",
    categoryColor: "bg-purple-50 text-purple-600",
    title: "Sejarah Nasional",
    description: "Review menyeluruh sejarah perjuangan bangsa dan pembentukan",
    questionCount: 155,
  },
  {
    id: 5,
    category: "Wawasan Kebangsaan",
    categoryColor: "bg-purple-50 text-purple-600",
    title: "Sejarah Nasional",
    description: "Review menyeluruh sejarah perjuangan bangsa dan pembentukan",
    questionCount: 155,
  },
  {
    id: 6,
    category: "Wawasan Kebangsaan",
    categoryColor: "bg-purple-50 text-purple-600",
    title: "Sejarah Nasional",
    description: "Review menyeluruh sejarah perjuangan bangsa dan pembentukan",
    questionCount: 155,
  },
];

export default function QuestionGroupsPage() {
  return (
    <div className="flex flex-col min-h-full pb-10">
      <div className="flex-1 px-8 pt-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400 mb-2">
          <Link href="/admin/questions" className="hover:text-slate-600 transition-colors">Questions</Link>
          <span className="mx-2 font-normal text-slate-300">&gt;</span>
          <span className="text-[#5b61f4]">Grup Soal</span>
        </nav>

        {/* Page Header Area */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Manajemen Grup Soal</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Kelola pengelompokan soal berdasarkan kategori, tingkat kesulitan, atau topik tertentu.
            </p>
          </div>
          
          <div className="flex items-center">
            <Link href="/admin/questions/groups/create" className="flex items-center gap-2 px-5 py-2.5 bg-[#5b61f4] hover:bg-[#4f46e5] text-white font-bold text-sm rounded-lg transition-colors shadow-sm">
              <FolderPlus className="w-4 h-4" />
              Buat Grup Baru
            </Link>
          </div>
        </div>

        {/* Card Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {dummyGroups.map((group) => (
            <div 
              key={group.id} 
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
            >
              {/* Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${group.categoryColor}`}>
                  {group.category}
                </span>
              </div>
              
              {/* Title & Description */}
              <div className="mb-6 flex-1">
                <h3 className="text-lg font-bold text-[#0a2351] mb-2 leading-tight">
                  {group.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {group.description}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5b61f4]" />
                <span className="text-sm font-extrabold text-[#0a2351]">
                  {group.questionCount} Soal
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
