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
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-neutral-900">Guest List</h2>
                    <div className="flex gap-2">
                         <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">127 Total</span>
                         <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">98 Checked In</span>
                    </div>
                </div>

                <GuestListTable eventId={eventId} />
            </div>
        )}

        {activeSection === 'payments' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PaymentSection />
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

// Payment Section Component
function PaymentSection() {
  const [markupType, setMarkupType] = useState<'percent' | 'fixed'>('percent');
  const [markupValue, setMarkupValue] = useState<number>(10);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');

  // CONSTANTS & MOCK DATA
  const BASE_COST = 12500; // Base cost of rooms/services
  const TAX_RATE = 0.18;   // 18% Tax

  // CALCULATIONS
  const markupAmount = markupType === 'percent' 
    ? (BASE_COST * (markupValue / 100)) 
    : markupValue;
  
  const subtotal = BASE_COST + markupAmount;
  const taxAmount = subtotal * TAX_RATE;
  const total = subtotal + taxAmount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT: Payment Methods & Configuration */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Markup Configuration */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Markup Configuration</h3>
             <span className="text-xs font-medium px-2 py-1 bg-neutral-100 rounded text-neutral-600">Admin Only</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Markup Type</label>
                <div className="flex bg-neutral-100 p-1 rounded-lg">
                   <button
                     onClick={() => setMarkupType('percent')}
                     className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${markupType === 'percent' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                   >
                     Percentage (%)
                   </button>
                   <button
                     onClick={() => setMarkupType('fixed')}
                     className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${markupType === 'fixed' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                   >
                     Fixed Amount ($)
                   </button>
                </div>
             </div>
             
             <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Markup Value 
                    {markupType === 'percent' ? ' (%)' : ' ($)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={markupValue}
                  onChange={(e) => setMarkupValue(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
             </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
           <h3 className="text-lg font-semibold text-neutral-900 mb-6">Payment Method</h3>
           
           <div className="space-y-4">
              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50/10' : 'border-neutral-200'}`}>
                 <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === 'card'} 
                    onChange={() => setPaymentMethod('card')}
                    className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                 />
                 <div className="flex-1">
                    <span className="block font-medium text-neutral-900">Credit / Debit Card</span>
                    <span className="text-sm text-neutral-500">Instant processing with small fee</span>
                 </div>
                 <div className="flex gap-2">
                    <div className="w-8 h-5 bg-neutral-200 rounded"></div>
                    <div className="w-8 h-5 bg-neutral-200 rounded"></div>
                 </div>
              </label>

              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-emerald-500 bg-emerald-50/10' : 'border-neutral-200'}`}>
                 <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === 'bank'} 
                    onChange={() => setPaymentMethod('bank')}
                    className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                 />
                 <div className="flex-1">
                    <span className="block font-medium text-neutral-900">Bank Transfer</span>
                    <span className="text-sm text-neutral-500">2-3 bussiess days</span>
                 </div>
              </label>
           </div>
        </div>

      </div>

      {/* RIGHT: Order Summary */}
      <div className="lg:col-span-1">
         <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Order Summary</h3>

            <div className="space-y-4 text-sm">
               <div className="flex justify-between text-neutral-600">
                  <span>Base Room Cost</span>
                  <span>${BASE_COST.toLocaleString()}</span>
               </div>
               
               <div className="flex justify-between text-emerald-600 font-medium bg-emerald-50 -mx-2 px-2 py-1 rounded">
                  <span>Markup ({markupType === 'percent' ? `${markupValue}%` : 'Fixed'})</span>
                  <span>+${markupAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
               </div>

               <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
               </div>

               <div className="flex justify-between text-neutral-600">
                  <span>Tax (18%)</span>
                  <span>${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
               </div>
               
               <div className="border-t border-neutral-200 my-4 pt-4 flex justify-between items-center">
                  <span className="font-bold text-lg text-neutral-900">Total</span>
                  <span className="font-bold text-2xl text-neutral-900">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
               </div>
            </div>

            <button className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-sm">
                Pay Now
            </button>
            <p className="text-xs text-center text-neutral-400 mt-4">
                Secure SSL 256-bit encryption
            </p>
         </div>
      </div>
    </div>
  );
}

// Guest List Component (Placed inline for now for modularity within this file, can be extracted later)
import { useEffect } from 'react';

interface GuestData {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  checkIn: string;
  checkOut: string;
  specialRequest?: string;
  status: 'Checked In' | 'Pending' | 'Checked Out';
  tag: 'VIP' | 'Regular' | 'Staff';
}

const MOCK_GUESTS: GuestData[] = [
  { id: 'g1', name: 'Rajesh Kumar', age: 34, gender: 'Male', checkIn: '2024-10-15', checkOut: '2024-10-18', specialRequest: 'Sea View', status: 'Checked In', tag: 'VIP' },
  { id: 'g2', name: 'Priya Sharma', age: 28, gender: 'Female', checkIn: '2024-10-15', checkOut: '2024-10-17', status: 'Checked In', tag: 'Regular' },
  { id: 'g3', name: 'Amit Patel', age: 45, gender: 'Male', checkIn: '2024-10-16', checkOut: '2024-10-19', specialRequest: 'Late Check-out', status: 'Pending', tag: 'VIP' },
  { id: 'g4', name: 'Sneha Reddy', age: 31, gender: 'Female', checkIn: '2024-10-15', checkOut: '2024-10-18', status: 'Checked In', tag: 'Regular' },
  { id: 'g5', name: 'John Doe', age: 29, gender: 'Male', checkIn: '2024-10-15', checkOut: '2024-10-18', status: 'Checked Out', tag: 'Staff' },
  { id: 'g6', name: 'Jane Smith', age: 25, gender: 'Female', checkIn: '2024-10-16', checkOut: '2024-10-20', specialRequest: 'Vegan Meal', status: 'Pending', tag: 'Regular' },
    // Add more mock data if needed for pagination test
];

function GuestListTable({ eventId }: { eventId: string }) {
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    const timer = setTimeout(() => {
      setGuests(MOCK_GUESTS);
      setLoading(false);
    }, 800); // 800ms simulated delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white rounded-xl border border-neutral-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-sm text-neutral-500">Loading guest list...</p>
        </div>
      </div>
    );
  }

  if (guests.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center bg-white rounded-xl border border-neutral-200">
        <p className="text-neutral-500">No guests found for this event.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-neutral-700">Name</th>
              <th className="px-6 py-4 font-semibold text-neutral-700">Age/Gender</th>
              <th className="px-6 py-4 font-semibold text-neutral-700">Check-In / Out</th>
              <th className="px-6 py-4 font-semibold text-neutral-700">Status</th>
              <th className="px-6 py-4 font-semibold text-neutral-700">Tag</th>
              <th className="px-6 py-4 font-semibold text-neutral-700">Special Request</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {guests.map((guest) => {
                const isSelected = selectedGuestId === guest.id;
                return (
                    <tr 
                        key={guest.id} 
                        onClick={() => setSelectedGuestId(guest.id)}
                        className={`transition-colors cursor-pointer ${isSelected ? 'bg-purple-50' : 'hover:bg-neutral-50'}`}
                    >
                        <td className="px-6 py-4 font-medium text-neutral-900">{guest.name}</td>
                        <td className="px-6 py-4 text-neutral-600">{guest.age} / {guest.gender}</td>
                        <td className="px-6 py-4 text-neutral-600">
                            <div className="flex flex-col">
                                <span>In: {guest.checkIn}</span>
                                <span className="text-xs text-neutral-400">Out: {guest.checkOut}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                guest.status === 'Checked In' ? 'bg-green-100 text-green-700' :
                                guest.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-neutral-100 text-neutral-600'
                            }`}>
                                {guest.status}
                            </span>
                        </td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                                guest.tag === 'VIP' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                guest.tag === 'Staff' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-white text-neutral-600 border-neutral-200'
                            }`}>
                                {guest.tag}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-neutral-500 italic">
                            {guest.specialRequest || '-'}
                        </td>
                    </tr>
                );
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-neutral-50 border-t border-neutral-200 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-neutral-500">Showing {guests.length} guests</span>
            <div className="flex gap-2">
                <button disabled className="px-3 py-1 border border-neutral-200 rounded text-sm text-neutral-400 cursor-not-allowed">Previous</button>
                <button disabled className="px-3 py-1 border border-neutral-200 rounded text-sm text-neutral-400 cursor-not-allowed">Next</button>
            </div>
      </div>
    </div>
  );
}
