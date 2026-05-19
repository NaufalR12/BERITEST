import Sidebar from "@/components/admin/Sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal - BERITEST",
  description: "Management Console for BERITEST",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
