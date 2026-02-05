"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

interface GuestData {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  checkIn: string;
  checkOut: string;
  specialRequest?: string;
  status: "Checked In" | "Pending" | "Checked Out";
  tag: "VIP" | "Regular" | "Staff";
}

const MOCK_GUESTS: GuestData[] = [
  {
    id: "g1",
    name: "Rajesh Kumar",
    age: 34,
    gender: "Male",
    checkIn: "2024-10-15",
    checkOut: "2024-10-18",
    specialRequest: "Sea View",
    status: "Checked In",
    tag: "VIP",
  },
  {
    id: "g2",
    name: "Priya Sharma",
    age: 28,
    gender: "Female",
    checkIn: "2024-10-15",
    checkOut: "2024-10-17",
    status: "Checked In",
    tag: "Regular",
  },
  {
    id: "g3",
    name: "Amit Patel",
    age: 45,
    gender: "Male",
    checkIn: "2024-10-16",
    checkOut: "2024-10-19",
    specialRequest: "Late Check-out",
    status: "Pending",
    tag: "VIP",
  },
  {
    id: "g4",
    name: "Sneha Reddy",
    age: 31,
    gender: "Female",
    checkIn: "2024-10-15",
    checkOut: "2024-10-18",
    status: "Checked In",
    tag: "Regular",
  },
  {
    id: "g5",
    name: "John Doe",
    age: 29,
    gender: "Male",
    checkIn: "2024-10-15",
    checkOut: "2024-10-18",
    status: "Checked Out",
    tag: "Staff",
  },
  {
    id: "g6",
    name: "Jane Smith",
    age: 25,
    gender: "Female",
    checkIn: "2024-10-16",
    checkOut: "2024-10-20",
    specialRequest: "Vegan Meal",
    status: "Pending",
    tag: "Regular",
  },
];

export default function ManageGuestsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGuests(MOCK_GUESTS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/events/${eventId}`}
            className="p-2 hover:bg-neutral-200 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-neutral-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Guest Management
            </h1>
            <p className="text-sm text-neutral-600">
              Manage RSVPs and guest details for Event ID: {eventId}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="w-full h-64 flex items-center justify-center bg-white rounded-xl border border-neutral-200">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-sm text-neutral-500">Loading guest list...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-neutral-700">
                      {" "}
                      Name{" "}
                    </th>
                    <th className="px-6 py-4 font-semibold text-neutral-700">
                      {" "}
                      Age/Gender{" "}
                    </th>
                    <th className="px-6 py-4 font-semibold text-neutral-700">
                      {" "}
                      Check-In / Out{" "}
                    </th>
                    <th className="px-6 py-4 font-semibold text-neutral-700">
                      {" "}
                      Status{" "}
                    </th>
                    <th className="px-6 py-4 font-semibold text-neutral-700">
                      {" "}
                      Tag{" "}
                    </th>
                    <th className="px-6 py-4 font-semibold text-neutral-700">
                      {" "}
                      Special Request{" "}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {guests.map((guest) => (
                    <tr
                      key={guest.id}
                      onClick={() => setSelectedGuestId(guest.id)}
                      className={`transition-colors cursor-pointer ${selectedGuestId === guest.id ? "bg-purple-50" : "hover:bg-neutral-50"}`}
                    >
                      <td className="px-6 py-4 font-medium text-neutral-900">
                        {" "}
                        {guest.name}{" "}
                      </td>
                      <td className="px-6 py-4 text-neutral-600">
                        {" "}
                        {guest.age} / {guest.gender}{" "}
                      </td>
                      <td className="px-6 py-4 text-neutral-600">
                        <div className="flex flex-col">
                          <span>In: {guest.checkIn}</span>
                          <span className="text-xs text-neutral-400">
                            {" "}
                            Out: {guest.checkOut}{" "}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            guest.status === "Checked In"
                              ? "bg-green-100 text-green-700"
                              : guest.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {guest.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${
                            guest.tag === "VIP"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : guest.tag === "Staff"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-white text-neutral-600 border-neutral-200"
                          }`}
                        >
                          {guest.tag}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-500 italic">
                        {" "}
                        {guest.specialRequest || "-"}{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
