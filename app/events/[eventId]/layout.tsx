"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/lib/SidebarContext";

function EventLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGuestsPage = pathname?.includes("/guests");
  const isPortalRoute = pathname?.includes("/portal");

  // Portal routes have their own layout, so don't apply agent layout
  if (isPortalRoute || isGuestsPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      <main className="mt-16 p-8">{children}</main>
    </>
  );
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EventLayoutContent>{children}</EventLayoutContent>;
}
