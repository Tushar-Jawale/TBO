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
    <aside
      className={`bg-gradient-corporate shadow-inner-highlight h-screen fixed left-0 top-16 overflow-y-auto transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <div className="p-4 border-b border-white/10">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="text-xl">{isCollapsed ? "→" : "←"}</span>
        </button>
      </div>

      <nav className="p-4 space-y-1">
        {navigationSections.map((section) => {
          const isActive =
            pathname === section.href ||
            (pathname?.startsWith(section.href + "/") ?? false);

          return (
            <Link
              key={section.name}
              href={section.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-colors
                ${
                  isActive
                    ? "bg-white/20 border-l-4 border-white"
                    : "hover:bg-white/10"
                }
                ${isCollapsed ? "justify-center" : ""}
              `}
              title={isCollapsed ? section.name : ""}
            >
              <span className="text-xl">{section.icon}</span>
              {!isCollapsed && (
                <span
                  className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}
                >
                  {section.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
