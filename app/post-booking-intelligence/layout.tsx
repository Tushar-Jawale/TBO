"use client";

import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/lib/SidebarContext";

function PostBookingLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <>
      <Navigation />
      <Sidebar />
      <main
        className={`mt-16 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}
      >
        {children}
      </main>
    </>
  );
}

export default function PostBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <PostBookingLayoutContent>{children}</PostBookingLayoutContent>
    </SidebarProvider>
  );
}
