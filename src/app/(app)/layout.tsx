"use client";

import Sidebar from "@/components/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
