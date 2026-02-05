"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import LogoutButton from "@/components/auth/LogoutButton";

interface PortalHeaderProps {
  eventName: string;
  headGuestName: string;
}

export default function PortalHeader({
  eventName,
  headGuestName,
}: PortalHeaderProps) {
  const params = useParams();
  const eventId = params.eventId as string;
  const guestId = params.guestId as string;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            {/* Logo and Branding */}
            <Link
              href={`/events/${eventId}/portal/${guestId}`}
              className="flex items-center gap-3"
            >
              <div className="relative h-20 w-20 shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt="TBO Logo"
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
              <span className="text-xl font-bold text-gray-900">
                TBO Event Planner
              </span>
            </Link>
            <span className="text-sm text-gray-400">|</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {eventName}
              </span>
              <span className="text-xs text-gray-600">
                Welcome, {headGuestName}
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href={`/events/${eventId}/portal/${guestId}`}
              className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href={`/events/${eventId}/portal/${guestId}/venue`}
              className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
            >
              Venues
            </Link>
            <Link
              href={`/events/${eventId}/portal/${guestId}/guests`}
              className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
            >
              Guests
            </Link>
            {/* Other Facilities Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors py-2">
                Other
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute right-0 top-full hidden group-hover:block w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
                <Link
                  href={`/events/${eventId}/portal/${guestId}/flights`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Flights & Travel
                </Link>
                <Link
                  href={`/events/${eventId}/portal/${guestId}/catering`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Catering & Meals
                </Link>
                <Link
                  href={`/events/${eventId}/portal/${guestId}/transfer`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Local Transfers
                </Link>
                <Link
                  href={`/events/${eventId}/portal/${guestId}/rooms`}
                  className="block px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors font-bold border-t border-gray-50 mt-1"
                >
                  Room Assignments
                </Link>
              </div>
            </div>

            <LogoutButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
