"use client";

import React from "react";
import DietaryDistributionEngine from "./DietaryDistributionEngine";
import MealPlanCards from "./MealPlanCards";
import VirtualVenueModule from "./VirtualVenueModule";
import RoomIntelligence from "./RoomIntelligence";

export default function EventLogistics() {
  return (
    <section className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center gap-4 mb-2">
        <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent" />
        <h2 className="text-sm font-black text-blue-400 uppercase tracking-[0.3em]">
          Operational Intelligence: Event Logistics
        </h2>
        <div className="flex-grow h-[1px] bg-white/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Center Panel - Smart Catering & Rooms (8 columns) */}
        <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6">
          <RoomIntelligence />
          <DietaryDistributionEngine />
          <div className="bg-black/20 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-cyan-500 rounded-full" />
                Meal Plan Intelligence
              </h4>
              <span className="text-[10px] text-gray-500 font-mono">
                3 SESSIONS MATCHED
              </span>
            </div>
            <MealPlanCards />
          </div>
        </div>

        {/* Right Panel - Virtual Venue (4 columns) */}
        <div className="lg:col-span-12 xl:col-span-4">
          <VirtualVenueModule />
        </div>
      </div>

      {/* Bottom System Status Bar */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
              System Ready
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 font-mono italic">
              Synchronizing spatial data...
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-cyan-500/50 font-mono uppercase">
            ANTIGRAVITY v.2.4.0
          </span>
        </div>
      </div>
    </section>
  );
}
