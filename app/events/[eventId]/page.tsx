'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rooms: number;
}

const HOTELS: Hotel[] = [
  { id: '1', name: 'Hotel Grand Palace', location: 'Downtown', rooms: 15 },
  { id: '2', name: 'Sunrise Residency', location: 'Beachside', rooms: 8 },
  { id: '3', name: 'City View Inn', location: 'City Center', rooms: 12 },
];

type Section = 'hotels' | 'guests' | 'payments';

export default function EventDashboardPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  const handleSectionClick = (section: Section) => {
    setActiveSection(activeSection === section ? null : section);
    // Reset internal states when switching sections if needed
    if (section !== 'hotels') {
        setSelectedHotelId(null);
    }
  };

  const handleHotelSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling to section click if needed
    setSelectedHotelId(id === selectedHotelId ? null : id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Event Dashboard</h1>
        <p className="text-neutral-600 mt-1">Manage all aspects of your event from one place.</p>
      </div>

      {/* Main Sections Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hotels Section Toggle */}
        <button
          onClick={() => handleSectionClick('hotels')}
          className={`p-6 rounded-xl border text-left transition-all duration-200 group ${
            activeSection === 'hotels'
              ? 'bg-blue-600 border-blue-600 shadow-md transform scale-[1.02]'
              : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className={`p-2 rounded-lg ${activeSection === 'hotels' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
            {activeSection === 'hotels' && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
          </div>
          <h3 className={`text-lg font-semibold ${activeSection === 'hotels' ? 'text-white' : 'text-neutral-900'}`}>Hotels</h3>
          <p className={`text-sm mt-1 ${activeSection === 'hotels' ? 'text-white/80' : 'text-neutral-500'}`}>
            Manage hotel allocations and room mappings.
          </p>
        </button>

        {/* Guests Section Toggle */}
        <button
          onClick={() => handleSectionClick('guests')}
          className={`p-6 rounded-xl border text-left transition-all duration-200 group ${
            activeSection === 'guests'
              ? 'bg-purple-600 border-purple-600 shadow-md transform scale-[1.02]'
              : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
             <span className={`p-2 rounded-lg ${activeSection === 'guests' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
             {activeSection === 'guests' && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
          </div>
          <h3 className={`text-lg font-semibold ${activeSection === 'guests' ? 'text-white' : 'text-neutral-900'}`}>Guests</h3>
          <p className={`text-sm mt-1 ${activeSection === 'guests' ? 'text-white/80' : 'text-neutral-500'}`}>
            View guest lists and RSVPs.
          </p>
        </button>

        {/* Payments Section Toggle */}
        <button
          onClick={() => handleSectionClick('payments')}
          className={`p-6 rounded-xl border text-left transition-all duration-200 group ${
            activeSection === 'payments'
              ? 'bg-emerald-600 border-emerald-600 shadow-md transform scale-[1.02]'
              : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className={`p-2 rounded-lg ${activeSection === 'payments' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
             {activeSection === 'payments' && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
          </div>
          <h3 className={`text-lg font-semibold ${activeSection === 'payments' ? 'text-white' : 'text-neutral-900'}`}>Payments</h3>
          <p className={`text-sm mt-1 ${activeSection === 'payments' ? 'text-white/80' : 'text-neutral-500'}`}>
            Track payments and invoices.
          </p>
        </button>
      </div>

      {/* Dynamic Content Section */}
      <div className="min-h-[300px] transition-all duration-500 ease-in-out">
        {activeSection === 'hotels' && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-neutral-900">Registered Hotels</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HOTELS.map((hotel) => {
                  const isSelected = selectedHotelId === hotel.id;
                  
                  return (
                    <div
                      key={hotel.id}
                      onClick={(e) => handleHotelSelect(hotel.id, e)}
                      className={`cursor-pointer rounded-xl border p-6 transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 shadow-xl ring-4 ring-blue-100'
                          : 'bg-white border-neutral-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-semibold text-lg ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                            {hotel.name}
                          </h3>
                          <p className={`text-sm mt-1 ${isSelected ? 'text-white/90' : 'text-neutral-500'}`}>
                            {hotel.location}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="bg-white/20 p-1.5 rounded-full text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className={`mt-6 flex items-center gap-2 text-sm ${isSelected ? 'text-white/90' : 'text-neutral-500'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>{hotel.rooms} Rooms Available</span>
                      </div>

                      {isSelected && (
                          <div className="mt-6 pt-6 border-t border-white/20 animate-in fade-in zoom-in-95 duration-200">
                             <Link
                                href={`/events/${eventId}/hotels/${hotel.id}/rooms`}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full block text-center bg-white text-blue-600 font-semibold py-2.5 rounded-lg hover:bg-neutral-50 transition-colors shadow-sm"
                             >
                                Map Rooms
                             </Link>
                          </div>
                      )}
                    </div>
                  );
                })}
              </div>
           </div>
        )}

        {activeSection === 'guests' && (
            <div className="flex flex-col items-center justify-center p-12 bg-neutral-50 rounded-xl border border-neutral-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-4 bg-purple-100 rounded-full text-purple-600 mb-4">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                     </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">Guest Management</h3>
                <p className="text-neutral-500 mt-2">Guest lists and features coming soon.</p>
            </div>
        )}

        {activeSection === 'payments' && (
             <div className="flex flex-col items-center justify-center p-12 bg-neutral-50 rounded-xl border border-neutral-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-4 bg-emerald-100 rounded-full text-emerald-600 mb-4">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                     </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">Payment Center</h3>
                <p className="text-neutral-500 mt-2">Invoicing and payment tracking coming soon.</p>
            </div>
        )}

        {!activeSection && (
             <div className="text-center py-24">
                 <p className="text-neutral-400">Select a category above to view details</p>
             </div>
        )}
      </div>
    </div>
  );
}
