import Link from "next/link";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react";

export default function CourseTable() {
  const dummyCourses = [
    {
      id: 1,
      title: "Data Structures & Algorithms",
      description: "Kurikulum mendalam tentang efisiensi...",
      date: "12 Agustus 2026",
      batch: "8 Batch",
      status: "Aktif",
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      description: "Prinsip desain berpusat pada pengguna.",
      date: "12 Agustus 2026",
      batch: "4 Batch",
      status: "Aktif",
    },
    {
      id: 3,
      title: "Leadership and Strategy",
      description: "Mengelola tim di era transformasi digital.",
      date: "12 Agustus 2026",
      batch: "0 Batch",
      status: "Draft",
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar / Filters */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Cari berdasarkan nama"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[120px]">
            <option>Filter Batch</option>
          </select>
          <select className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[120px]">
            <option>Status</option>
          </select>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider font-bold">
              <th className="p-4 border-b border-slate-200 w-[35%]">COURSE</th>
              <th className="p-4 border-b border-slate-200 w-[20%]">DIBUAT</th>
              <th className="p-4 border-b border-slate-200 w-[20%]">BATCH</th>
              <th className="p-4 border-b border-slate-200 w-[15%]">STATUS</th>
              <th className="p-4 border-b border-slate-200 w-[10%]">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {dummyCourses.map((course) => (
              <tr key={course.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors group">
                <td className="p-4">
                  <p className="font-bold text-sm text-slate-800">{course.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[300px]">{course.description}</p>
                </td>
                <td className="p-4 text-xs font-medium text-slate-600">{course.date}</td>
                <td className="p-4 text-xs font-medium text-slate-600">{course.batch}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                    course.status === 'Aktif' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200/50'
                  }`}>
                    {course.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Link href="/admin/courses/batches" className="text-slate-400 hover:text-blue-600 transition-colors" title="Lihat Batch">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
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
        <span className="text-xs font-medium text-slate-500">
          Menampilkan 1-10 dari 24 kursus
        </span>
        <div className="flex items-center gap-1 text-sm font-semibold text-slate-600">
          <button className="p-1 hover:text-blue-600 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
          <button className="w-6 h-6 rounded bg-[#0a2351] text-white flex items-center justify-center">1</button>
          <button className="w-6 h-6 rounded hover:bg-slate-200 flex items-center justify-center">2</button>
          <button className="w-6 h-6 rounded hover:bg-slate-200 flex items-center justify-center">3</button>
          <button className="p-1 hover:text-blue-600"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
