"use client";

import React, { useEffect, useState } from "react";

interface DietaryData {
  label: string;
  percentage: number;
  color: string;
  status?: string;
}

const dietaryData: DietaryData[] = [
  { label: "Standard (Veg)", percentage: 65, color: "#10b981" }, // Green
  { label: "Non-Veg", percentage: 30, color: "#ef4444" }, // Red
  {
    label: "Special / Allergies",
    percentage: 5,
    color: "#f59e0b",
    status: "Critical",
  }, // Amber
];

export default function DietaryDistributionEngine() {
  const [animatedPercentages, setAnimatedPercentages] = useState<number[]>(
    dietaryData.map(() => 0),
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedPercentages(dietaryData.map((d) => d.percentage));
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent uppercase tracking-wider">
          Dietary Distribution Engine
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[10px] text-cyan-500 font-mono uppercase">
            Live Telemetry
          </span>
        </div>
      </div>

      <div className="flex justify-around items-end h-64 gap-8">
        {dietaryData.map((data, index) => (
          <div
            key={data.label}
            className="flex flex-col items-center flex-1 group"
          >
            <div className="relative w-full h-full flex items-end justify-center">
              {/* Track */}
              <div className="absolute inset-0 w-3 mx-auto bg-white/5 rounded-full overflow-hidden" />

              {/* Progress Bar */}
              <div
                className="w-3 rounded-full transition-all duration-1000 ease-out relative"
                style={{
                  height: `${animatedPercentages[index]}%`,
                  backgroundColor: data.color,
                  boxShadow: `0 0 20px ${data.color}80, 0 0 40px ${data.color}30`,
                }}
              >
                {/* Particle effect simulation overlay */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/50 rounded-full blur-[1px] animate-pulse" />
              </div>

              {/* Tooltip/Label on hover */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 border border-white/20 rounded px-2 py-1 text-[10px] text-white whitespace-nowrap z-10 font-mono">
                {data.percentage}% ALLOCATED
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="block text-[10px] text-gray-400 uppercase tracking-tighter mb-1 font-medium">
                {data.label}
              </span>
              <span
                className={`text-sm font-bold font-mono`}
                style={{ color: data.color }}
              >
                {animatedPercentages[index]}%
              </span>
              {data.status && (
                <span className="block mt-1 text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30 uppercase font-black animate-pulse">
                  {data.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Grid background simulation */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  );
}
