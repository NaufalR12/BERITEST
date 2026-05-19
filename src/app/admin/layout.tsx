import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
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
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
