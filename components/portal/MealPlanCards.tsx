"use client";

import React from "react";

interface MealPlan {
  type: string;
  icon: React.ReactNode;
}

const plans: MealPlan[] = [
  {
    type: "Breakfast",
    icon: (
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
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    type: "Lunch",
    icon: (
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    type: "Gala Dinner",
    icon: (
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
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
  },
];

export default function MealPlanCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {plans.map((plan) => (
        <div
          key={plan.type}
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 transition-transform">
              {plan.icon}
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Standard Plan
            </span>
          </div>

          <h4 className="text-gray-900 font-black text-lg mb-1 tracking-tight">
            {plan.type}
          </h4>

          <div className="flex items-center gap-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">
              Curated for All Guests
            </span>
          </div>

          <button
            onClick={() => alert(`Opening ${plan.type} details...`)}
            className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-black text-gray-900 transition-colors uppercase tracking-widest"
          >
            View Menu Details
          </button>
        </div>
      ))}
    </div>
  );
}
