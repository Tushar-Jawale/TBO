export interface Event {
    id: string;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    organizer: string;
    guestCount: number;
    hotelCount: number;
    inventoryConsumed: number;
    status: 'active' | 'upcoming' | 'completed';
}

export interface Hotel {
    id: string;
    name: string;
    location: string;
    allotment: number;
    consumed: number;
    remaining: number;
}

export interface Guest {
    id: string;
    name: string;
    email: string;
    checkIn: string;
    checkOut: string;
    guestCount: number;
    foodPreference: string;
    allergies?: string;
    assigned: boolean;
}

export interface MetricData {
    label: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
}

export interface HeadGuest {
    id: string;
    name: string;
    email: string;
    phone: string;
    eventId: string;
    subGroupName: string; // e.g., "Bride's Family"
}

export interface SubGuest {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    age?: number;
    guestCount?: number; // Defaults to 1 if undefined
    headGuestId: string;
    roomGroupId?: string; // null if unassigned
}

export interface RoomAllocation {
    id: string;
    eventId: string;
    headGuestId: string;
    roomType: string; // e.g., "Deluxe Room", "Suite"
    maxCapacity: number;
    hotelName: string;
}

export interface RoomGroup {
    id: string;
    allocationId: string;
    guestIds: string[]; // SubGuest IDs assigned to this room
    customLabel?: string; // Optional custom name for the room
}

export interface CuratedVenue {
    id: string;
    name: string;
    location: string;
    description: string;
    images: string[];
    amenities: string[];
    eventId: string;
    // Note: No pricing information exposed to Head Guests
}

// Authentication Types
export type UserRole = 'agent' | 'guest';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    eventId?: string; // For guests, which event they belong to
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, password: string, role: UserRole) => Promise<boolean>;
    logout: () => void;
}

export interface AuthCredentials {
    email: string;
    password: string;
}
