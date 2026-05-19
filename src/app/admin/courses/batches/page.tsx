import Link from "next/link";
import { Plus, Layers, Users, CalendarClock, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/admin/Header";

export default function BatchesPage() {
  const dummyBatches = [
    {
      id: 1,
      name: "Batch 01 - Cloud Architect",
      course: "Professional Cloud Architect",
      timeline: "12 Jan - 15 Feb",
      participants: 85,
      capacity: 100,
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "Batch 05 - UX Designer",
      course: "User Experience Fundamentals",
      timeline: "01 Mar - 20 Mar",
      participants: 10,
      capacity: 50,
      status: "SCHEDULED",
    },
    {
      id: 3,
      name: "Batch 12 - Data Science",
      course: "Advanced Data Analytics",
      timeline: "15 Nov - 15 Dec",
      participants: 200,
      capacity: 200,
      status: "COMPLETED",
    },
  ];

  return (
    <div className="flex flex-col min-h-full pb-10">
      <Header />
      
      <div className="flex-1 px-8 pt-8 max-w-7xl mx-auto w-full">
        {/* Page Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Manajemen Batch</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Kelola daftar materi dan kurikulum asesmen Anda.
            </p>
          </div>
          
          <div className="flex items-center">
            <Link href="/admin/courses/batches/create" className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2351] text-white font-bold text-sm rounded-lg hover:bg-[#0f337a] transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Tambah Batch
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 flex flex-col justify-center items-center gap-2 text-center shadow-sm">
            <div className="w-12 h-12 bg-[#e0e7ff] rounded-lg flex items-center justify-center text-[#0a2351] mb-2">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">TOTAL BATCH AKTIF</h3>
            <p className="text-2xl font-extrabold text-[#0a2351]">24</p>
          </div>
          <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 flex flex-col justify-center items-center gap-2 text-center shadow-sm">
            <div className="w-12 h-12 bg-[#e0e7ff] rounded-lg flex items-center justify-center text-[#0a2351] mb-2">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">TOTAL PESERTA</h3>
            <p className="text-2xl font-extrabold text-[#0a2351]">1,240</p>
          </div>
          <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 flex flex-col justify-center items-center gap-2 text-center shadow-sm">
            <div className="w-12 h-12 bg-[#f1f5f9] rounded-lg flex items-center justify-center text-slate-600 mb-2">
              <CalendarClock className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">BATCH AKAN DATANG</h3>
            <p className="text-2xl font-extrabold text-[#0a2351]">8</p>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                placeholder="Search batch..."
              />
            </div>
            
            <div className="w-full md:w-auto">
              <select className="block w-full border border-slate-200 rounded-lg text-sm px-4 py-2 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                <option>Semua Status</option>
                <option>ACTIVE</option>
                <option>SCHEDULED</option>
                <option>COMPLETED</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="p-4 w-[20%]">BATCH NAME</th>
                  <th className="p-4 w-[20%]">COURSE</th>
                  <th className="p-4 w-[15%]">TIMELINE</th>
                  <th className="p-4 w-[20%]">PARTICIPANTS</th>
                  <th className="p-4 w-[15%]">STATUS</th>
                  <th className="p-4 w-[10%]">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {dummyBatches.map((batch) => {
                  const percent = Math.round((batch.participants / batch.capacity) * 100);
                  return (
                    <tr key={batch.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-sm text-[#0a2351]">{batch.name}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-600">{batch.course}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-xs font-medium text-slate-500 whitespace-nowrap">{batch.timeline}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-[#0a2351] h-1.5 rounded-full" 
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
                            {batch.participants}/{batch.capacity}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                          batch.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                          batch.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {batch.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/courses/batches/${batch.id}`} className="text-slate-400 hover:text-blue-600 transition-colors" title="Lihat">
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
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-[#f8fafc]">
            <span className="text-xs font-medium text-slate-500">
              Menampilkan 3 dari 24 Batch
            </span>
            <div className="flex items-center gap-1">
              <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
