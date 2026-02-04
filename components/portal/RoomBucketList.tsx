'use client';

import { useState, useMemo } from 'react';
import { RoomAllocation, RoomGroup, SubGuest } from '@/lib/types';

interface RoomBucketListProps {
    allocations: RoomAllocation[];
    groups: RoomGroup[];
    guests: SubGuest[];
    onUpdateGroups: (groups: RoomGroup[]) => void;
}

export default function RoomBucketList({ allocations, groups, guests, onUpdateGroups }: RoomBucketListProps) {
    const [draggedGuest, setDraggedGuest] = useState<SubGuest | null>(null);
    const [filterType, setFilterType] = useState<string>('All');

    const unassignedGuests = guests.filter(g => !g.roomGroupId);

    // --- Helpers ---
    const getGuestsInGroup = (groupId: string) => {
        const group = groups.find(g => g.id === groupId);
        if (!group) return [];
        return guests.filter(g => group.guestIds.includes(g.id));
    };

    const getOccupancy = (groupId: string) => {
         const guestsInRoom = getGuestsInGroup(groupId);
         // Sum of all guestCounts (default to 1 if undefined)
         return guestsInRoom.reduce((sum, guest) => sum + (guest.guestCount || 1), 0);
    };

    const getGroupForAllocation = (allocationId: string) => {
        return groups.find(g => g.allocationId === allocationId);
    };

    // --- Derived State for Filters & Sections ---
    const roomTypes = useMemo(() => {
        const types = new Set(allocations.map(a => a.roomType));
        return ['All', ...Array.from(types)];
    }, [allocations]);

    const filteredAllocations = useMemo(() => {
        if (filterType === 'All') return allocations;
        return allocations.filter(a => a.roomType === filterType);
    }, [allocations, filterType]);

    // Split into Available ("Unoccupied" or "Partially Filled") vs Filled ("Occupied")
    const { availableRooms, filledRooms } = useMemo(() => {
        const available: RoomAllocation[] = [];
        const filled: RoomAllocation[] = [];

        filteredAllocations.forEach(allocation => {
            const group = getGroupForAllocation(allocation.id);
            const occupancy = group ? getOccupancy(group.id) : 0;
            
            if (occupancy >= allocation.maxCapacity) {
                filled.push(allocation);
            } else {
                available.push(allocation);
            }
        });

        return { availableRooms: available, filledRooms: filled };
    }, [filteredAllocations, groups, guests]); // guests dep needed for occupancy calc

    // --- Drag & Drop Logic ---
    const handleDragStart = (guest: SubGuest) => {
        setDraggedGuest(guest);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (allocationId: string) => {
        if (!draggedGuest) return;

        const allocation = allocations.find(a => a.id === allocationId);
        if (!allocation) return;

        let existingGroup = getGroupForAllocation(allocationId);
        
        // Calculate current occupancy using guestCount
        const currentOccupancy = existingGroup ? getOccupancy(existingGroup.id) : 0;
        const guestSize = draggedGuest.guestCount || 1;

        if (currentOccupancy + guestSize > allocation.maxCapacity) {
            alert(`Cannot assign guest! Room capacity: ${allocation.maxCapacity}. Guest size: ${guestSize}. Remaining: ${allocation.maxCapacity - currentOccupancy}`);
            setDraggedGuest(null);
            return;
        }

        const updatedGroups = [...groups];

        // Remove from old group if exists
        if (draggedGuest.roomGroupId) {
            const oldGroup = updatedGroups.find(g => g.id === draggedGuest.roomGroupId);
            if (oldGroup) {
                oldGroup.guestIds = oldGroup.guestIds.filter(id => id !== draggedGuest.id);
            }
        }

        // Add to new group or create new group
        if (existingGroup) {
            existingGroup.guestIds.push(draggedGuest.id);
        } else {
            const newGroup: RoomGroup = {
                id: `rg-${Date.now()}`,
                allocationId,
                guestIds: [draggedGuest.id],
            };
            updatedGroups.push(newGroup);
        }

        onUpdateGroups(updatedGroups);
        setDraggedGuest(null);
    };

    const handleRemoveFromRoom = (guestId: string, groupId: string) => {
        const updatedGroups = groups.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    guestIds: g.guestIds.filter(id => id !== guestId),
                };
            }
            return g;
        });
        onUpdateGroups(updatedGroups);
    };

    // --- Render Component ---
    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
                <span className="text-gray-700 font-medium">Filter Rooms:</span>
                <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    {roomTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Unassigned Guests */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 sticky top-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Unassigned Guests ({unassignedGuests.length})
                        </h3>
                        <div className="space-y-3">
                            {unassignedGuests.map(guest => (
                                <div
                                    key={guest.id}
                                    draggable
                                    onDragStart={() => handleDragStart(guest)}
                                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-gray-900">{guest.name}</p>
                                            {guest.email && <p className="text-xs text-gray-500 mt-1">{guest.email}</p>}
                                        </div>
                                        {(guest.guestCount || 1) > 1 && (
                                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                Family of {guest.guestCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {unassignedGuests.length === 0 && (
                                <p className="text-sm text-gray-500">All guests assigned!</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Rooms */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Available / Unoccupied Section */}
                    <div>
                         <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            Available / Partially Filled
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableRooms.map(allocation => (
                                <RoomCard 
                                    key={allocation.id}
                                    allocation={allocation}
                                    group={getGroupForAllocation(allocation.id)}
                                    guests={guests} // Pass all guests to helper
                                    occupancy={getGroupForAllocation(allocation.id) ? getOccupancy(getGroupForAllocation(allocation.id)!.id) : 0}
                                    onDrop={handleDrop}
                                    onRemove={handleRemoveFromRoom}
                                    onDragOver={handleDragOver}
                                />
                            ))}
                            {availableRooms.length === 0 && (
                                <p className="col-span-full text-gray-500 italic">No available rooms matching filter.</p>
                            )}
                        </div>
                    </div>

                    {/* Filled / Occupied Section */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                             <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                            Filled / Confirmed
                        </h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
                            {filledRooms.map(allocation => (
                                <RoomCard 
                                    key={allocation.id}
                                    allocation={allocation}
                                    group={getGroupForAllocation(allocation.id)}
                                    guests={guests}
                                    occupancy={getGroupForAllocation(allocation.id) ? getOccupancy(getGroupForAllocation(allocation.id)!.id) : 0}
                                    onDrop={handleDrop}
                                    onRemove={handleRemoveFromRoom}
                                    onDragOver={handleDragOver}
                                    isFilled={true}
                                />
                            ))}
                             {filledRooms.length === 0 && (
                                <p className="col-span-full text-gray-500 italic">No filled rooms yet.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Sub-component for Room Card to reduce clutter
function RoomCard({ allocation, group, guests, occupancy, onDrop, onRemove, onDragOver, isFilled = false }: any) {
    // Helper inside component to get guests for this specific group
    const guestsInRoom = group ? guests.filter((g: SubGuest) => group.guestIds.includes(g.id)) : [];
    
    return (
        <div
            onDragOver={isFilled ? undefined : onDragOver} // Disable drop if filled
            onDrop={() => !isFilled && onDrop(allocation.id)}
            className={`bg-white rounded-lg shadow-md p-6 border-2 transition-colors ${
                isFilled 
                ? 'border-gray-200 bg-gray-50' 
                : 'border-blue-100 hover:border-blue-400'
            }`}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                        {group?.customLabel || `${allocation.roomType} ${allocation.id.split('-')[1]}`}
                    </h4>
                    <p className="text-sm text-gray-600">{allocation.hotelName}</p>
                </div>
                <div className="text-right">
                    <span className={`text-sm font-medium ${isFilled ? 'text-green-700' : 'text-blue-600'}`}>
                        {occupancy}/{allocation.maxCapacity} spots
                    </span>
                </div>
            </div>

            <div className="space-y-2 min-h-[60px]">
                {guestsInRoom.map((guest: SubGuest) => (
                    <div
                        key={guest.id}
                        className="flex justify-between items-center bg-gray-100 p-2 rounded text-sm"
                    >
                        <div>
                             <span className="font-medium text-gray-900">{guest.name}</span>
                             {(guest.guestCount || 1) > 1 && (
                                <span className="ml-2 text-xs text-gray-500">
                                    (Family of {guest.guestCount})
                                </span>
                             )}
                        </div>
                        <button
                            onClick={() => onRemove(guest.id, group.id)}
                            className="text-red-500 hover:text-red-700 ml-2"
                        >
                            &times;
                        </button>
                    </div>
                ))}
                
                {!isFilled && guestsInRoom.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2 border border-dashed border-gray-200 rounded">
                        Drop guests here
                    </p>
                )}
            </div>
        </div>
    );
}
