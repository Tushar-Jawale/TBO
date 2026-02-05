"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { mockCuratedVenues } from "@/lib/mockData";
import RoomIntelligence from "@/components/portal/RoomIntelligence";
import VirtualVenueModule from "@/components/portal/VirtualVenueModule";
import MealPlanCards from "@/components/portal/MealPlanCards";

export default function VenueDetailPage({
  params,
}: {
  params: Promise<{ eventId: string; guestId: string; venueId: string }>;
}) {
  const { eventId, guestId, venueId } = use(params);
  const venue = mockCuratedVenues.find((v) => v.id === venueId);

  if (!venue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-gray-900">Venue Not Found</h1>
        <Link
          href={`/events/${eventId}/portal/${guestId}/venue`}
          className="mt-4 text-blue-600 hover:underline"
        >
          Back to Venues
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header / Breadcrumbs */}
      <nav className="flex mb-4 text-sm font-medium text-gray-500">
        <Link
          href={`/events/${eventId}/portal/${guestId}/venue`}
          className="hover:text-gray-900"
        >
          Venues
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{venue.name}</span>
      </nav>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <Image
            src={venue.images[0]}
            alt={venue.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {venue.name}
          </h1>
          <p className="flex items-center gap-2 text-gray-600 font-medium">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {venue.location}
          </p>
          <div className="prose prose-blue text-gray-600 max-w-none">
            <p className="leading-relaxed">{venue.description}</p>
          </div>
          <div className="pt-4 flex flex-wrap gap-2">
            {venue.amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Detail Sections */}
      <div className="space-y-16">
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Accommodation Options
            </h2>
            <p className="text-gray-500 mt-1 font-medium">
              Detailed room breakdown and features
            </p>
          </div>
          <RoomIntelligence />
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Venue Spaces & Capacities
            </h2>
            <p className="text-gray-500 mt-1 font-medium">
              Interactive spatial overview of event halls
            </p>
          </div>
          <div className="h-[500px]">
            <VirtualVenueModule />
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Curated Meal Plans
            </h2>
            <p className="text-gray-500 mt-1 font-medium">
              Dining options available at this location
            </p>
          </div>
          <MealPlanCards />
        </section>
      </div>

      {/* Action Footer */}
      <div className="sticky bottom-6 flex justify-center pt-8 pointer-events-none">
        <Link
          href={`/events/${eventId}/portal/${guestId}/rooms`}
          className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl shadow-xl shadow-blue-200 font-black uppercase tracking-widest text-sm flex items-center gap-3 active:scale-[0.98] transition-all"
        >
          <span>🏠</span> Proceed to Room Assignments
        </Link>
      </div>
    </div>
  );
}
