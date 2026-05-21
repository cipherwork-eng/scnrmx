"use client";

import Sidebar from "@/components/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen lg:min-h-auto pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
