"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/lib/SidebarContext";

const navigationSections = [
  { name: "Events", href: "/dashboard", icon: "📅" },
  { name: "Analytics", href: "/analytics", icon: "📊" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
   <> </>
  );
}
