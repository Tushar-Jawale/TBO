import GuestLinkGenerator from '@/components/portal/GuestLinkGenerator';
import GuestList from '@/components/portal/GuestList';
import { mockSubGuests } from '@/lib/mockData';

export default async function GuestsPage({ params }: { params: Promise<{ eventId: string; guestId: string }> }) {
    const { eventId, guestId } = await params;
    
    // In a real app, we would fetch this from DB.
    // Filtering mock data for this Head Guest.
    const initialGuests = mockSubGuests.filter(sg => sg.headGuestId === guestId);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Guest Management</h1>
                <p className="text-gray-600 mt-2">
                    Manage your guest list, add details, and track RSVP status.
                </p>
            </div>

            <GuestLinkGenerator eventId={eventId} guestId={guestId} />

            <div className="pt-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Guest List</h2>
                <GuestList initialGuests={initialGuests} />
            </div>
        </div>
    );
}
