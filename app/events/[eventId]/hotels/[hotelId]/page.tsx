'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HOTELS, RoomType, Hotel } from '../data';
import Link from 'next/link';

export default function HotelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.hotelId as string;
  const eventId = params.eventId as string;

  const hotel: Hotel | undefined = HOTELS.find(h => h.id === hotelId);

  // requirements state (default zero, will load from storage)
  const [requirements, setRequirements] = useState({
    single: 0,
    double: 0,
    triple: 0,
    quad: 0
  });

  useEffect(() => {
    const savedDemand = localStorage.getItem(`demand_${eventId}`);
    if (savedDemand) {
        setRequirements(JSON.parse(savedDemand));
    } else {
        // Fallback defaults if accessed directly without listing page
        setRequirements({ single: 5, double: 10, triple: 2, quad: 0 });
    }
  }, [eventId]);

  // wrapper for compatible access
  const REQUIREMENTS = requirements;

  // State for selected rooms: { [roomId]: quantity }
  const [selectedRooms, setSelectedRooms] = useState<Record<number, number>>({});

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-500">
        Hotel not found.
      </div>
    );
  }

  // --- Helpers ---

  const handleUpdateRoom = (roomId: number, change: number) => {
    setSelectedRooms(prev => {
      const current = prev[roomId] || 0;
      const next = Math.max(0, current + change);
      return { ...prev, [roomId]: next };
    });
  };

  const getSubtotal = () => {
    let total = 0;
    Object.values(hotel.rooms).forEach((category: RoomType[]) => {
      category.forEach(room => {
        const qty = selectedRooms[room.id] || 0;
        total += qty * room.price;
      });
    });
    return total;
  };

  const getCategoryCount = (category: RoomType[]) => {
      return category.reduce((sum, room) => sum + (selectedRooms[room.id] || 0), 0);
  };

  const calculateTaxes = (amount: number) => amount * 0.18; // 18% Tax

  const subtotal = getSubtotal();
  const taxes = calculateTaxes(subtotal);
  const totalAmount = subtotal + taxes;

  const handleSaveMapping = () => {
    const mappingData = {
      hotelId,
      hotelName: hotel.name,
      selectedRooms,
      totalAmount,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`mapping_${eventId}`, JSON.stringify(mappingData));
    
    console.log("Saving Mapping:", mappingData);
    router.push(`/events/${eventId}/room-mapping`); 
  };

  // --- UI Components ---

  const RoomCounter = ({ room }: { room: RoomType }) => {
    const count = selectedRooms[room.id] || 0;
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleUpdateRoom(room.id, -1)}
          disabled={count === 0}
          className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors ${count === 0 ? 'border-neutral-200 text-neutral-300 cursor-not-allowed' : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100 hover:border-neutral-400'}`}
        >
          -
        </button>
        <span className="w-6 text-center font-medium text-neutral-900">{count}</span>
        <button
          onClick={() => handleUpdateRoom(room.id, 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-100 hover:border-neutral-400 transition-colors"
        >
          +
        </button>
      </div>
    );
  };

  const RoomRow = ({ room }: { room: RoomType }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
      <div className="mb-3 sm:mb-0">
        <h5 className="font-semibold text-neutral-800">{room.name}</h5>
        <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
           <span className="flex items-center gap-1">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
               Max {room.capacity}
           </span>
           {room.description && <span>• {room.description}</span>}
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-6">
        <div className="text-right">
             <span className="block font-bold text-neutral-900">₹{room.price.toLocaleString()}</span>
        </div>
        <RoomCounter room={room} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header / Breadcrumb */}
      <div className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Link href={`/events/${eventId}/hotels`} className="hover:text-blue-600">Hotels</Link>
                  <span>/</span>
                  <span className="font-medium text-neutral-900">{hotel.name}</span>
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Hotel Details & Rooms */}
          <div className="lg:col-span-2 space-y-8">
             
             {/* Hotel Info Card */}
             <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="h-64 relative bg-neutral-200">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                        <h1 className="text-3xl font-bold">{hotel.name}</h1>
                        <p className="flex items-center gap-1 text-white/90 mt-1">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                             {hotel.location}
                        </p>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex gap-4 mb-6 text-sm">
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-medium">{hotel.type}</div>
                        <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-lg font-medium flex items-center gap-1">
                            <span>{hotel.stars} ★</span>
                            <span>({hotel.rating}/10)</span>
                        </div>
                    </div>
                    <p className="text-neutral-600 leading-relaxed mb-6">
                        {hotel.description}
                    </p>
                    <div>
                        <h3 className="font-semibold text-neutral-900 mb-3">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                             {hotel.amenities.map(a => (
                                 <span key={a} className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm">{a}</span>
                             ))}
                        </div>
                    </div>
                </div>
             </div>

             {/* Room Selection */}
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                     <h2 className="text-xl font-bold text-neutral-900">Select Rooms</h2>
                     <span className="text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                         Event Needs: {REQUIREMENTS.single} Single, {REQUIREMENTS.double} Double
                     </span>
                </div>
                
                {/* Single Rooms */}
                {hotel.rooms.single.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                        <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-200 font-semibold text-neutral-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                                Single Rooms
                            </div>
                            {(() => {
                                const count = getCategoryCount(hotel.rooms.single);
                                const needed = REQUIREMENTS.single;
                                const remaining = Math.max(0, needed - count);
                                const isMet = count >= needed;
                                
                                return (
                                    <span className={`text-sm font-medium ${isMet ? 'text-green-600' : 'text-orange-600'}`}>
                                        {remaining} {remaining === 1 ? 'single room' : 'single rooms'} required
                                        {isMet && <span className="ml-1 text-green-600">✓</span>}
                                    </span>
                                );
                            })()}
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {hotel.rooms.single.map(room => <RoomRow key={room.id} room={room} />)}
                        </div>
                    </div>
                )}

                {/* Double Rooms */}
                {hotel.rooms.double.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                         <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-200 font-semibold text-neutral-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                                Double Rooms
                            </div>
                            {(() => {
                                const count = getCategoryCount(hotel.rooms.double);
                                const needed = REQUIREMENTS.double;
                                const remaining = Math.max(0, needed - count);
                                const isMet = count >= needed;
                                
                                return (
                                    <span className={`text-sm font-medium ${isMet ? 'text-green-600' : 'text-orange-600'}`}>
                                        {remaining} {remaining === 1 ? 'double room' : 'double rooms'} required
                                        {isMet && <span className="ml-1 text-green-600">✓</span>}
                                    </span>
                                );
                            })()}
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {hotel.rooms.double.map(room => <RoomRow key={room.id} room={room} />)}
                        </div>
                    </div>
                )}

                 {/* Triple Rooms */}
                 {hotel.rooms.triple.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                         <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-200 font-semibold text-neutral-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                                Triple Rooms
                            </div>
                             {(() => {
                                const count = getCategoryCount(hotel.rooms.triple);
                                const needed = REQUIREMENTS.triple;
                                const remaining = Math.max(0, needed - count);
                                const isMet = count >= needed;
                                
                                return (
                                    <span className={`text-sm font-medium ${isMet ? 'text-green-600' : 'text-neutral-500'}`}>
                                        {remaining} {remaining === 1 ? 'triple room' : 'triple rooms'} required
                                        {isMet && <span className="ml-1 text-green-600">✓</span>}
                                    </span>
                                );
                            })()}
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {hotel.rooms.triple.map(room => <RoomRow key={room.id} room={room} />)}
                        </div>
                    </div>
                )}
             </div>

          </div>

          {/* RIGHT: Booking Summary (Sticky) */}
          <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 overflow-hidden">
                  <div className="bg-neutral-900 text-white p-5">
                      <h3 className="font-bold text-lg">Booking Summary</h3>
                      <p className="text-white/70 text-sm mt-1">{hotel.name}</p>
                  </div>
                  
                  <div className="p-5">
                      {/* Selected Items List */}
                      <div className="space-y-3 mb-6 min-h-[100px]">
                           {Object.keys(selectedRooms).length === 0 || totalAmount === 0 ? (
                               <p className="text-neutral-400 text-center py-4 italic text-sm">No rooms selected yet.</p>
                           ) : (
                               <>
                                   {Object.keys(hotel.rooms).map(catKey => {
                                       // Helper to find selected rooms in this category
                                       const catRooms = (hotel.rooms[catKey as keyof typeof hotel.rooms] as RoomType[])
                                          .filter(r => selectedRooms[r.id] > 0);
                                       
                                       return catRooms.map(room => (
                                           <div key={room.id} className="flex justify-between text-sm">
                                               <span className="text-neutral-600">
                                                   {room.name} <span className="text-neutral-400">x{selectedRooms[room.id]}</span>
                                               </span>
                                               <span className="font-medium text-neutral-900">
                                                   ₹{(room.price * selectedRooms[room.id]).toLocaleString()}
                                               </span>
                                           </div>
                                       ));
                                   })}
                               </>
                           )}
                      </div>

                      {/* Totals */}
                      <div className="border-t border-dashed border-neutral-200 pt-4 space-y-2">
                           <div className="flex justify-between text-neutral-500 text-sm">
                               <span>Subtotal</span>
                               <span>₹{subtotal.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between text-neutral-500 text-sm">
                               <span>Tax (18%)</span>
                               <span>₹{taxes.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-center pt-2 mt-2 border-t border-neutral-100">
                               <span className="font-bold text-lg text-neutral-900">Total</span>
                               <span className="font-bold text-2xl text-blue-600">₹{totalAmount.toLocaleString()}</span>
                           </div>
                      </div>

                      <button
                          onClick={handleSaveMapping}
                          disabled={totalAmount === 0}
                          className={`w-full mt-6 py-3.5 rounded-lg font-bold text-white transition-all transform active:scale-95 ${
                              totalAmount === 0 
                                ? 'bg-neutral-300 cursor-not-allowed shadow-none' 
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200'
                          }`}
                      >
                          Save Mapping & Continue
                      </button>
                      <p className="text-xs text-center text-neutral-400 mt-3">
                          You can review the mapping in the next step.
                      </p>
                  </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}
