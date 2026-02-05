"use client";

import React from "react";
import Image from "next/image";

export default function VirtualVenueModule() {
  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 h-full flex flex-col">
      <div className="relative flex-grow rounded-xl overflow-hidden border border-gray-200 group">
        {/* Viewport */}
        <Image
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2074&auto=format&fit=crop"
          alt="Grand Ballroom"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Info Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-lg px-4 py-2 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-gray-900 font-bold uppercase tracking-wider">
              High Availability
            </span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-lg px-4 py-2 shadow-sm flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            <span className="text-xs text-gray-900 font-bold uppercase tracking-wider">
              Layout: Theater Style
            </span>
          </div>
        </div>
      </div>

     
    </div>
  );
}
