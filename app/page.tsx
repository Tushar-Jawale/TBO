import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Voyage Event Manager</h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Select your role to access the appropriate portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Agent Portal */}
          <Link 
            href="/dashboard"
            className="group block p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-all duration-200"
          >
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">👮‍♂️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Travel Agent</h3>
            <p className="text-gray-500">Manage all events, bookings, and inventory.</p>
          </Link>

          {/* Head Guest Portal (Mock Link) */}
          <Link 
            href="/events/1/portal/hg-123"
            className="group block p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-purple-500 transition-all duration-200"
          >
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">👑</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Head Guest</h3>
            <p className="text-gray-500">Manage your guest list and room assignments.</p>
          </Link>

          {/* Guest RSVP */}
          <Link 
            href="/events/1/guests"
            className="group block p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-emerald-500 transition-all duration-200"
          >
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">👋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Guest RSVP</h3>
            <p className="text-gray-500">Register yourself and your family for the event.</p>
          </Link>
        </div>
        
        <div className="text-center mt-12 text-sm text-gray-400">
          <p>Demo Mode: IDs are hardcoded for demonstration.</p>
        </div>
      </div>
    </main>
  );
}
