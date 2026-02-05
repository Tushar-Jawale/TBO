"use client";

import React from "react";
import Image from "next/image";

const roomTypes = [
  {
    name: "Royal Suite",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974&auto=format&fit=crop",
    capacity: "4 Persons",
    count: "15 Units",
    status: "Optimal",
    features: ["Private Terrace", "Jacuzzi", "Butler Service"],
  },
  {
    name: "Heritage Deluxe",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop",
    capacity: "2 Persons",
    count: "45 Units",
    status: "High Demand",
    features: ["Garden View", "Minibar", "King Bed"],
  },
];

export default function RoomIntelligence() {
  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {roomTypes.map((room) => (
          <div
            key={room.name}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative h-56 w-full">
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-full px-3 py-1 shadow-sm">
                <span
                  className={`w-2 h-2 rounded-full ${room.status === "Optimal" ? "bg-green-500" : "bg-amber-500"}`}
                />
                <span className="text-[10px] text-gray-900 font-bold uppercase tracking-wider">
                  {room.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 tracking-tight">
                    {room.name}
                  </h4>
                  <p className="text-xs text-amber-600 font-bold uppercase mt-1">
                    {room.count} Total Units
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-black block">
                    Capacity
                  </span>
                  <span className="text-gray-900 font-black text-base">
                    {room.capacity}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {room.features.map((f) => (
                  <span
                    key={f}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100 text-gray-600 font-semibold"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
