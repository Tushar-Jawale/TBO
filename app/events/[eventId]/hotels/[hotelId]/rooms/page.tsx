'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

interface Guest {
  id: string;
  name: string;
  occupancy: number;
}

interface Room {
  id: string;
  hotel: string;
  type: string;
  capacity: number;
  assigned: Guest[];
}

export default function RoomMappingPage() {
  const params = useParams();
  const hotelId = params?.hotelId as string;
  
  // State for guests and rooms
  const [unassignedGuests, setUnassignedGuests] = useState<Guest[]>([
    { id: '1', name: 'Rajesh Kumar', occupancy: 2 },
    { id: '2', name: 'Priya Sharma', occupancy: 1 },
    { id: '3', name: 'Amit Patel', occupancy: 3 },
    { id: '4', name: 'Sneha Reddy', occupancy: 2 },
  ]);

  const [rooms, setRooms] = useState<Room[]>([
    { id: 'r1', hotel: 'The Grand Palace', type: 'Deluxe Room', capacity: 2, assigned: [] },
    { id: 'r2', hotel: 'The Grand Palace', type: 'Deluxe Room', capacity: 2, assigned: [] },
    { id: 'r3', hotel: 'The Grand Palace', type: 'Premium Suite', capacity: 3, assigned: [] },
    { id: 'r4', hotel: 'The Grand Palace', type: 'Executive Suite', capacity: 4, assigned: [] },
    { id: 'r5', hotel: 'The Grand Palace', type: 'Executive Suite', capacity: 4, assigned: [] },
  ]);

  const [draggedGuest, setDraggedGuest] = useState<{ guest: Guest, source: 'unassigned' | string } | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const handleDragStart = (guest: Guest, source: 'unassigned' | string) => {
    setDraggedGuest({ guest, source });
    setWarning(null);
  };

  const handleDropToRoom = (targetRoomId: string) => {
    if (!draggedGuest) return;

    const { guest, source } = draggedGuest;
    const targetRoomIndex = rooms.findIndex(r => r.id === targetRoomId);
    const targetRoom = rooms[targetRoomIndex];

    // Calculate current occupancy of the target room
    const currentOccupancy = targetRoom.assigned.reduce((sum, g) => sum + g.occupancy, 0);

    // Check capacity constraints
    if (currentOccupancy + guest.occupancy > targetRoom.capacity) {
      setWarning(`⚠️ Cannot assign ${guest.name} to ${targetRoom.type}. Room capacity (${targetRoom.capacity}) would be exceeded.`);
      setDraggedGuest(null);
      return;
    }

    // Prepare new state updates
    const newRooms = [...rooms];
    
    // Remove from source if it was in another room
    if (source !== 'unassigned') {
      const sourceRoomIndex = newRooms.findIndex(r => r.id === source);
      if (sourceRoomIndex !== -1) {
        newRooms[sourceRoomIndex] = {
          ...newRooms[sourceRoomIndex],
          assigned: newRooms[sourceRoomIndex].assigned.filter(g => g.id !== guest.id)
        };
      }
    } else {
      // Remove from unassigned list
      setUnassignedGuests(prev => prev.filter(g => g.id !== guest.id));
    }

    // Add to target room
    newRooms[targetRoomIndex] = {
      ...targetRoom,
      assigned: [...targetRoom.assigned, guest]
    };

    setRooms(newRooms);
    setDraggedGuest(null);
    setWarning(null);
  };

  const handleDropToUnassigned = () => {
    if (!draggedGuest) return;
    
    const { guest, source } = draggedGuest;
    
    // If already unassigned, do nothing
    if (source === 'unassigned') {
      setDraggedGuest(null);
      return;
    }

    // Remove from source room
    setRooms(prevRooms => prevRooms.map(room => {
      if (room.id === source) {
        return {
          ...room,
          assigned: room.assigned.filter(g => g.id !== guest.id)
        };
      }
      return room;
    }));

    // Add back to unassigned
    setUnassignedGuests(prev => [...prev, guest]);
    setDraggedGuest(null);
    setWarning(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-12">
      <div className="bg-white border-b border-neutral-200 px-8 py-6 mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Room Mapping</h1>
        <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-neutral-500">Hotel ID: {hotelId}</span>
            <span className="text-sm text-neutral-300">•</span>
            <p className="text-sm text-neutral-600">
            Drag-and-drop assignment with real-time constraint validation
            </p>
        </div>
      </div>

      {warning && (
        <div className="mx-8 mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex justify-between items-center animate-in fade-in slide-in-from-top-2">
          <p className="text-sm text-error font-medium">{warning}</p>
          <button onClick={() => setWarning(null)} className="text-error hover:text-error/80">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <div className="px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Unassigned Guests */}
          <div 
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={handleDropToUnassigned}
            className={`transition-colors rounded-xl p-4 -m-2 ${draggedGuest?.source !== 'unassigned' && draggedGuest ? 'bg-neutral-100/50 border-2 border-dashed border-neutral-200' : ''}`}
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Unassigned Guests</h2>
              <p className="text-sm text-neutral-600">Drag guests to assign them to rooms</p>
            </div>

            <div className="space-y-3 min-h-[100px]">
              {unassignedGuests.length === 0 && (
                 <div className="text-center py-12 bg-white rounded-lg border border-neutral-100 border-dashed">
                    <p className="text-sm text-neutral-400 italic">All guests have been assigned</p>
                 </div>
              )}
              {unassignedGuests.map((guest) => (
                <div
                  key={guest.id}
                  draggable
                  onDragStart={() => handleDragStart(guest, 'unassigned')}
                  className="card p-4 cursor-move hover:shadow-md transition-all duration-200 bg-white border border-neutral-200 hover:border-blue-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-neutral-900">{guest.name}</h3>
                      <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide font-medium">
                        Occupancy: {guest.occupancy}
                      </p>
                    </div>
                    <div className="bg-neutral-50 p-2 rounded-full text-neutral-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Assigned Rooms */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Available Rooms</h2>
              <p className="text-sm text-neutral-600">Drop zones with capacity indicators</p>
            </div>

            <div className="space-y-4">
              {rooms.map((room) => {
                const currentOccupancy = room.assigned.reduce((sum, g) => sum + g.occupancy, 0);
                const isFull = currentOccupancy >= room.capacity;
                const _availableSpace = room.capacity - currentOccupancy;
                
                return (
                  <div
                    key={room.id}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={() => handleDropToRoom(room.id)}
                    className={`card p-5 border-2 transition-all duration-200 ${
                      isFull 
                        ? 'border-neutral-100 bg-neutral-50/50' 
                        : 'border-neutral-200 border-dashed hover:border-blue-400 hover:bg-blue-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-neutral-900 text-lg">{room.type}</h3>
                        <p className="text-sm text-neutral-500">{room.hotel}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          isFull 
                            ? 'bg-neutral-100 text-neutral-500' 
                            : currentOccupancy > 0 
                              ? 'bg-warning/10 text-warning-700' 
                              : 'bg-success/10 text-success'
                        }`}>
                          {currentOccupancy}/{room.capacity} Full
                        </span>
                      </div>
                    </div>

                    {room.assigned.length === 0 ? (
                      <div className="text-center py-6 text-sm text-neutral-400 bg-neutral-50/50 rounded-lg border border-neutral-100 border-dashed">
                        Drop guest here to assign
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {room.assigned.map((guest) => (
                          <div 
                            key={guest.id} 
                            draggable
                            onDragStart={(e) => {
                              // e.stopPropagation(); // Optional: prevent bubbling if needed
                              handleDragStart(guest, room.id);
                            }}
                            className="px-4 py-3 bg-white border border-neutral-200 rounded-lg shadow-sm cursor-move hover:border-blue-300 hover:shadow-md transition-all flex justify-between items-center group"
                          >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                                    {guest.name.charAt(0)}
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-neutral-900 block">{guest.name}</span>
                                    <span className="text-xs text-neutral-500">Occupancy: {guest.occupancy}</span>
                                </div>
                            </div>
                            <svg className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
