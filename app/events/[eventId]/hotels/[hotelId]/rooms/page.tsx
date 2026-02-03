"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { HOTELS, Hotel, RoomType } from '../../data';

export default function RoomMappingPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const hotelId = params.hotelId as string;

  const [mappingData, setMappingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Find hotel data for name lookup
  const hotel = HOTELS.find(h => h.id === hotelId);

  useEffect(() => {
    const savedData = localStorage.getItem(`mapping_${eventId}`);
    if (savedData) {
      setMappingData(JSON.parse(savedData));
    }
    setLoading(false);
  }, [eventId]);

  const handleConfirm = () => {
      // Logic to finalize mapping (e.g., API call)
      alert("Mapping Confirmed! (This is a demo)");
      router.push(`/events/${eventId}`);
  };

  if (loading) return <div className="p-8 text-center text-neutral-500">Loading booking details...</div>;

  if (!mappingData || !hotel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4">
        <h2 className="text-xl font-semibold text-neutral-800 mb-2">No Room Selection Found</h2>
        <p className="text-neutral-500 mb-6">Please select rooms from the hotel details page first.</p>
        <Link 
            href={`/events/${eventId}/hotels/${hotelId}`}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
            Go to Hotel Details
        </Link>
      </div>
    );
  }

  // Flatten the selected rooms for display
  const selectedRoomsList = Object.entries(mappingData.selectedRooms)
    .filter(([_, qty]) => (qty as number) > 0)
    .map(([roomId, qty]) => {
        // Find room details across all categories
        let roomDetails: RoomType | undefined;
        if (hotel && hotel.rooms) {
            Object.values(hotel.rooms).forEach((category: RoomType[]) => {
                const found = category.find((r: RoomType) => r.id === Number(roomId));
                if (found) roomDetails = found;
            });
        }
        return { id: Number(roomId), qty: qty as number, details: roomDetails };
    });

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
       {/* Header */}
       <div className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <h1 className="text-xl font-bold text-neutral-900">Room Mapping Overview</h1>
          </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden mb-6">
            <div className="p-6 border-b border-neutral-100 bg-blue-50/50">
                <h2 className="text-lg font-bold text-neutral-900">{hotel.name}</h2>
                <p className="text-sm text-neutral-500 mt-1">Review your room selection before standardizing.</p>
                <div className="mt-2 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {hotel.location}
                    </span>
                </div>
            </div>
            
            <div className="p-6">
                <h3 className="font-semibold text-neutral-800 mb-4">Selected Rooms</h3>
                <div className="space-y-3">
                    {selectedRoomsList.map(({ id, qty, details }) => (
                        <div key={id} className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                             <div>
                                 <h4 className="font-medium text-neutral-900">{details?.name || `Room #${id}`}</h4>
                                 <p className="text-sm text-neutral-500 mt-0.5">
                                    {details?.description || `Max Capacity: ${details?.capacity}`}
                                 </p>
                             </div>
                             <div className="flex flex-col items-end">
                                 <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full text-sm">
                                     x{qty}
                                 </span>
                                 <span className="text-xs text-neutral-400 mt-1">
                                     ₹{details ? (details.price * qty).toLocaleString() : '-'}
                                 </span>
                             </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-between items-center">
                    <div>
                        <span className="block text-sm text-neutral-500">Total Amount</span>
                        <span className="text-2xl font-bold text-neutral-900">₹{mappingData.totalAmount.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex gap-4">
             <Link 
                href={`/events/${eventId}/hotels/${hotelId}`}
                className="flex-1 py-3 text-center border border-neutral-300 bg-white text-neutral-700 rounded-lg hover:bg-neutral-50 font-semibold"
             >
                Back to Details
             </Link>
             <button 
                onClick={handleConfirm}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md"
             >
                Confirm Mapping
             </button>
        </div>

      </div>
    </div>
  );
}
