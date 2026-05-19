import Link from "next/link";
import { FileUp, UserPlus } from "lucide-react";
import Header from "@/components/admin/Header";
import UserStats from "@/components/admin/users/UserStats";
import UserTable from "@/components/admin/users/UserTable";

export default function UsersPage() {
  return (
    <div className="flex flex-col min-h-full pb-10">
      <Header />
      
      <div className="flex-1 px-8 pt-8 max-w-7xl mx-auto w-full">
        {/* Page Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Manajemen User</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Kelola daftar kandidat dan administrator sistem.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/admin/users/upload" className="flex items-center gap-2 px-4 py-2 bg-[#e0e7ff] text-[#0a2351] font-bold text-sm rounded-lg hover:bg-blue-200 transition-colors">
              <FileUp className="w-4 h-4" />
              Multiple Upload Excel
            </Link>
            <Link href="/admin/users/create" className="flex items-center gap-2 px-4 py-2 bg-[#0a2351] text-white font-bold text-sm rounded-lg hover:bg-[#0f337a] transition-colors shadow-sm">
              <UserPlus className="w-4 h-4" />
              Single Form User
            </Link>
          </div>
        </div>

        {/* Content */}
        <UserStats />
        <UserTable />
      </div>
    </div>
  );
}
