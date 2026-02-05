"use client";

import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/lib/SidebarContext";

function AnalyticsLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main className="mt-16">{children}</main>
    </>
  );
}

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AnalyticsLayoutContent>{children}</AnalyticsLayoutContent>;
}
