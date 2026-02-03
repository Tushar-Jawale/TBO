"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/lib/SidebarContext";

function EventLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGuestsPage = pathname?.includes("/guests");
  const { isCollapsed } = useSidebar();

  if (isGuestsPage) {
    return <>{children}</>;
  }

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

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <EventLayoutContent>{children}</EventLayoutContent>
    </SidebarProvider>
  );
}
