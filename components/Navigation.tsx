"use client";

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-gradient-premium shadow-inner-highlight fixed top-0 w-full h-16 z-50 shadow-sm">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <img
            src="/images/logo.jpg"
            alt="TBO Logo"
            className="h-12 w-12 object-contain rounded-lg shadow-sm"
          />
          <span className="text-white font-semibold text-lg">
            TBO Events Planner
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-white/80 hover:text-white font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
          >
            Events
          </Link>
          <Link
            href="/analytics"
            className="text-white/80 hover:text-white font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
          >
            Analytics
          </Link>

          {/* Notifications */}
          <button className="text-white/75 hover:text-white transition-colors p-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 ml-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <span className="text-white text-sm font-medium hidden md:block">
              Agent
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
