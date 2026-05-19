import Link from "next/link";
import { Plus, PlayCircle, Users, Search, Filter, Download, Calendar, Eye, Pencil, Trash2 } from "lucide-react";

export default function SessionManagementPage() {
  const dummySessions = [
    {
      id: 1,
      name: "UI/UX Designer Selection Q3",
      batchInfo: "Batch #402 - Advanced Assessment",
      schedule: "Oct 24, 2023 | 09:00 AM",
      participants: 124,
      status: "Active",
    },
    {
      id: 2,
      name: "Senior Developer Tech Assessment",
      batchInfo: "Batch #405 - Backend Core",
      schedule: "Oct 26, 2023 | 14:00 PM",
      participants: 85,
      status: "Upcoming",
    },
    {
      id: 3,
      name: "Executive Leadership Screening",
      batchInfo: "Batch #398 - Psychological Profile",
      schedule: "Oct 22, 2023 | 08:30 AM",
      participants: 12,
      status: "Completed",
    },
    {
      id: 4,
      name: "Junior Accountant Aptitude",
      batchInfo: "Batch #395 - Numerical Reasoning",
      schedule: "Oct 20, 2023 | 10:00 AM",
      participants: 312,
      status: "Completed",
    },
  ];

  return (
    <div className="flex flex-col min-h-full pb-10">
            
      <div className="flex-1 px-8 pt-8 max-w-7xl mx-auto w-full">
        {/* Page Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Manajemen Session</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Monitor and manage all assessment cycles across the organization.
            </p>
          </div>
          
          <div className="flex items-center">
            <Link href="./1/create" className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2351] text-white font-bold text-sm rounded-lg hover:bg-[#0f337a] transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Tambah Sesi Baru
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Active Sessions */}
          <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 bg-[#e0e7ff] rounded-lg flex items-center justify-center text-[#5b61f4]">
                <PlayCircle className="w-5 h-5" />
              </div>
              <span className="bg-[#eef2ff] text-[#5b61f4] text-[10px] font-extrabold px-3 py-1 rounded-full tracking-wide uppercase">
                LIVE
              </span>
            </div>
            <div>
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">ACTIVE SESSIONS</h3>
              <p className="text-4xl font-extrabold text-[#0a2351]">12</p>
            </div>
          </div>

          {/* Total Participants */}
          <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="w-10 h-10 bg-[#eef2ff] rounded-lg flex items-center justify-center text-[#5b61f4] mb-6">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">TOTAL PARTICIPANTS</h3>
              <p className="text-4xl font-extrabold text-[#0a2351]">1,482</p>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-[400px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                placeholder="Search sessions..."
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center p-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors bg-white shadow-sm">
                <Filter className="w-4 h-4" />
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center p-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors bg-white shadow-sm">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#eef2ff] text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                  <th className="p-4 w-[35%]">SESSION NAME</th>
                  <th className="p-4 w-[25%]">SCHEDULE</th>
                  <th className="p-4 w-[20%]">PARTICIPANTS</th>
                  <th className="p-4 w-[10%]">STATUS</th>
                  <th className="p-4 w-[10%]">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {dummySessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-sm text-[#0a2351] mb-0.5">{session.name}</p>
                      <p className="text-xs text-slate-500">{session.batchInfo}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-xs font-medium">{session.schedule}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-bold text-slate-700">{session.participants}</span>
                      <span className="text-xs text-slate-500 ml-1">Candidates</span>
                    </td>
                    <td className="p-4">
                      {session.status === "Active" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef2ff] text-[#5b61f4] text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5b61f4]"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                          {session.status}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="text-[#0a2351] hover:text-blue-600 transition-colors p-1" title="Lihat">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-slate-400 hover:text-[#0a2351] transition-colors p-1" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-600 transition-colors p-1" title="Hapus">
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
              Showing 1 to 4 of 24 sessions
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1.5 text-xs font-bold text-white bg-[#0a2351] rounded hover:bg-[#0f337a] transition-colors shadow-sm">
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
