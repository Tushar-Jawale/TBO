"use client";

import { use, useState } from "react";

interface FamilyMember {
  id: string;
  name: string;
  age: string;
  gender: string;
}

export default function GuestsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  // Form state
  const [userName, setUserName] = useState("");
  const [familyMemberCount, setFamilyMemberCount] = useState("1");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: "1", name: "", age: "", gender: "male" },
  ]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");

  // Mock event data
  const eventData = {
    name: "Ananya & Rahul Wedding",
    location: "Jaipur, Rajasthan",
    dates: "February 12-14, 2026",
    bannerImage: "🎊",
  };

  const itinerary = [
    { day: "Day 1", event: "Welcome Dinner", time: "7:00 PM", date: "Feb 12" },
    {
      day: "Day 2",
      event: "Wedding Ceremony",
      time: "6:00 PM",
      date: "Feb 13",
    },
    { day: "Day 3", event: "Reception", time: "8:00 PM", date: "Feb 14" },
  ];

  const bookingStatus = "pending"; // Can be 'pending' or 'confirmed'

  // Mock cancellation requests
  const cancellationRequests = [
    {
      id: "1",
      guestName: "Rajesh Kumar",
      roomType: "Deluxe Suite",
      reason: "Family emergency",
      status: "pending" as const,
      requestDate: "2026-02-01",
    },
    {
      id: "2",
      guestName: "Amit Patel",
      roomType: "Executive Suite",
      reason: "Health issues",
      status: "pending" as const,
      requestDate: "2026-02-03",
    },
  ];

  // Handle family member count change
  const handleFamilyCountChange = (count: string) => {
    const num = parseInt(count) || 1;
    setFamilyMemberCount(count);

    const currentMembers = [...familyMembers];
    if (num > currentMembers.length) {
      // Add new members
      for (let i = currentMembers.length; i < num; i++) {
        currentMembers.push({
          id: `${i + 1}`,
          name: "",
          age: "",
          gender: "male",
        });
      }
    } else if (num < currentMembers.length) {
      // Remove excess members
      currentMembers.splice(num);
    }
    setFamilyMembers(currentMembers);
  };

  // Update family member
  const updateFamilyMember = (
    id: string,
    field: keyof FamilyMember,
    value: string,
  ) => {
    setFamilyMembers((members) =>
      members.map((member) =>
        member.id === id ? { ...member, [field]: value } : member,
      ),
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      userName,
      familyMemberCount,
      familyMembers,
      checkIn,
      checkOut,
      specialRequest,
    });
    alert("Guest registration submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Event Banner */}
      <div className="bg-gradient-premium text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-6xl">{eventData.bannerImage}</span>
          </div>
          <h1 className="text-4xl font-bold text-center mb-2">
            {eventData.name}
          </h1>
          <p className="text-center text-white/90">
            {eventData.location} • {eventData.dates}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Event Overview */}
          <section className="card p-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Event Overview
            </h2>
            <div className="prose prose-sm max-w-none text-neutral-700">
              <p>
                Join us for a spectacular celebration of love and togetherness.
                This three-day event promises unforgettable moments, exquisite
                dining, and world-class hospitality in the heart of Jaipur.
              </p>
              <p className="mt-3">
                We have secured exclusive group rates at premium hotels with
                specially curated packages for our guests. Please complete your
                registration to reserve your accommodation.
              </p>
            </div>
          </section>

          {/* Itinerary */}
          <section className="card p-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Event Itinerary
            </h2>
            <div className="space-y-4">
              {itinerary.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-corporate-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-neutral-900">
                        {item.event}
                      </h3>
                      <span className="text-sm text-neutral-600">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {item.day} • {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Guest Registration Form */}
          <section className="card p-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Guest Registration
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-corporate-blue-100 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Number of Family Members */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Number of Family Members (Including You) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={familyMemberCount}
                  onChange={(e) => handleFamilyCountChange(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-corporate-blue-100 focus:border-transparent"
                />
              </div>

              {/* Family Members Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Family Members Details
                </h3>
                {familyMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                  >
                    <h4 className="text-sm font-semibold text-neutral-700 mb-3">
                      Member {index + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-600 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            updateFamilyMember(
                              member.id,
                              "name",
                              e.target.value,
                            )
                          }
                          required
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-corporate-blue-100 focus:border-transparent"
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-600 mb-1">
                          Age *
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="120"
                          value={member.age}
                          onChange={(e) =>
                            updateFamilyMember(member.id, "age", e.target.value)
                          }
                          required
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-corporate-blue-100 focus:border-transparent"
                          placeholder="Age"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-600 mb-1">
                          Gender *
                        </label>
                        <select
                          value={member.gender}
                          onChange={(e) =>
                            updateFamilyMember(
                              member.id,
                              "gender",
                              e.target.value,
                            )
                          }
                          required
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-corporate-blue-100 focus:border-transparent"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Check-in and Check-out */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-corporate-blue-100 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-corporate-blue-100 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Special Request */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Special Request (Optional)
                </label>
                <textarea
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-corporate-blue-100 focus:border-transparent resize-none"
                  placeholder="Any special requirements or requests (e.g., dietary preferences, accessibility needs, room preferences)"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-corporate-blue-100 hover:bg-corporate-blue-200 text-white font-semibold rounded-lg transition-colors"
                >
                  Submit Registration
                </button>
              </div>
            </form>
          </section>

          {/* Cancellation Requests */}
          {cancellationRequests.length > 0 && (
            <section className="card p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Cancellation Requests
              </h2>

              <div className="space-y-3">
                {cancellationRequests.map((request) => (
                  <details
                    key={request.id}
                    className="bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden"
                  >
                    <summary className="p-4 cursor-pointer hover:bg-neutral-100 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">👤</span>
                        <div>
                          <div className="font-semibold text-neutral-900">
                            {request.guestName}
                          </div>
                          <div className="text-sm text-neutral-600">
                            {request.roomType}
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                    </summary>
                    <div className="p-4 border-t border-neutral-200 bg-white">
                      <div className="mb-3">
                        <div className="text-sm font-medium text-neutral-700 mb-1">
                          Cancellation Reason:
                        </div>
                        <div className="text-sm text-neutral-900 bg-neutral-50 p-3 rounded-lg">
                          {request.reason}
                        </div>
                      </div>
                      <div className="text-xs text-neutral-500">
                        Requested on{" "}
                        {new Date(request.requestDate).toLocaleDateString()}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Booking Details */}
          <section className="card p-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Booking Details
            </h2>

            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                Booking Status
              </h3>
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-warning/10 text-warning">
                  ⏳ Pending
                </span>
              </div>
              <p className="text-sm text-neutral-600 mt-3">
                Your booking details will be displayed here once your
                registration is confirmed.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
