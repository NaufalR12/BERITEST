import { Search, Filter, ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";

export default function UserTable() {
  const dummyUsers = [
    { id: 1, name: "Aditya Saputra", role: "Kandidat", email: "aditya.s@beritest.com", batch: "Batch 2024-A", status: "Active" },
    { id: 2, name: "Bambang Pamungkas", role: "Admin", email: "b.pamungkas@beritest.com", batch: "Main Admin", status: "Active" },
    { id: 3, name: "Citra Kirana", role: "Kandidat", email: "citra.kirana@beritest.com", batch: "Batch 2024-A", status: "Inactive" },
    { id: 4, name: "Dian Rostia", role: "Kandidat", email: "dian_rostia@beritest.com", batch: "Batch 2024-B", status: "Active" },
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
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cari berdasarkan nama atau email..."
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
            <option>Filter Batch</option>
          </select>
          <select className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
            <option>Status</option>
          </select>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider font-bold">
              <th className="p-4 border-b border-slate-200 w-[30%]">NAMA USER</th>
              <th className="p-4 border-b border-slate-200 w-[25%]">EMAIL</th>
              <th className="p-4 border-b border-slate-200 w-[20%]">BATCH</th>
              <th className="p-4 border-b border-slate-200 w-[15%]">STATUS</th>
              <th className="p-4 border-b border-slate-200 w-[10%]">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {dummyUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-sm text-slate-800">{user.name}</p>
                </td>
                <td className="p-4 text-sm text-slate-600">{user.email}</td>
                <td className="p-4 text-sm text-slate-600">{user.batch}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 flex items-center gap-3">
                  <button className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="text-slate-400 hover:text-red-600 transition-colors" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-[#f8fafc]">
        <span className="text-xs font-semibold text-slate-500">
          Menampilkan 1 - 4 dari 1,248 user
        </span>
        <div className="flex items-center gap-1 text-sm font-semibold text-slate-600">
          <button className="p-1 hover:text-blue-600 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
          <button className="w-6 h-6 rounded bg-[#0a2351] text-white flex items-center justify-center">1</button>
          <button className="w-6 h-6 rounded hover:bg-slate-200 flex items-center justify-center">2</button>
          <button className="w-6 h-6 rounded hover:bg-slate-200 flex items-center justify-center">3</button>
          <span className="px-1 text-slate-400">...</span>
          <button className="w-6 h-6 rounded hover:bg-slate-200 flex items-center justify-center">312</button>
          <button className="p-1 hover:text-blue-600"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
