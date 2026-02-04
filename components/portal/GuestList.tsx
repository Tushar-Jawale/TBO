'use client';

import { useState, useMemo } from 'react';
import { SubGuest } from '@/lib/types';

interface GuestListProps {
    initialGuests: SubGuest[];
}

export default function GuestList({ initialGuests }: GuestListProps) {
    const [guests, setGuests] = useState<SubGuest[]>(initialGuests);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set());
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // --- Add/Edit State ---
    const [editingGuest, setEditingGuest] = useState<SubGuest | null>(null); // If null, we are adding

    // --- Derived State ---
    const filteredGuests = useMemo(() => {
        return guests.filter(guest => 
            guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [guests, searchQuery]);

    // --- Actions ---
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const toggleSelectAll = () => {
        if (selectedGuestIds.size === filteredGuests.length) {
            setSelectedGuestIds(new Set());
        } else {
            setSelectedGuestIds(new Set(filteredGuests.map(g => g.id)));
        }
    };

    const toggleSelectGuest = (id: string) => {
        const newSelected = new Set(selectedGuestIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedGuestIds(newSelected);
    };

    const handleExport = () => {
        // Convert guests to CSV
        const headers = ['Name', 'Email', 'Phone', 'Room Group'];
        const rows = filteredGuests.map(g => [
            g.name,
            g.email || '',
            g.phone || '',
            g.roomGroupId || 'Unassigned'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'guest_list.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDeleteSelected = () => {
        if (!confirm(`Are you sure you want to delete ${selectedGuestIds.size} guests?`)) return;
        setGuests(guests.filter(g => !selectedGuestIds.has(g.id)));
        setSelectedGuestIds(new Set());
    };

    const handleDeleteSingle = (id: string) => {
         if (!confirm('Are you sure you want to delete this guest?')) return;
         setGuests(guests.filter(g => g.id !== id));
    };

    // --- Modal Logic ---
    const openAddModal = () => {
        setEditingGuest(null);
        setIsAddModalOpen(true);
    };

    const openEditModal = (guest: SubGuest) => {
        setEditingGuest(guest);
        setIsAddModalOpen(true);
    };

    const handleSaveGuest = (guestData: Partial<SubGuest>) => {
        if (editingGuest) {
            // Edit Mode
            setGuests(guests.map(g => g.id === editingGuest.id ? { ...g, ...guestData } : g));
        } else {
            // Add Mode
            const newGuest: SubGuest = {
                id: `sg-${Date.now()}`,
                name: guestData.name!,
                email: guestData.email,
                phone: guestData.phone,
                headGuestId: 'hg-1', // Mock ID
                roomGroupId: undefined,
                ...guestData
            } as SubGuest;
            setGuests([...guests, newGuest]);
        }
        setIsAddModalOpen(false);
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search guests..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <div className="flex gap-2">
                     <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export
                    </button>
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Guest
                    </button>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedGuestIds.size > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center text-sm text-blue-900">
                    <span>{selectedGuestIds.size} guests selected</span>
                    <button 
                        onClick={handleDeleteSelected}
                        className="text-red-600 hover:text-red-700 font-medium"
                    >
                        Delete Selected
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={selectedGuestIds.size === filteredGuests.length && filteredGuests.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredGuests.map(guest => (
                                <tr key={guest.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedGuestIds.has(guest.id)}
                                            onChange={() => toggleSelectGuest(guest.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {guest.name}
                                            {(guest.guestCount || 1) > 1 && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                    +{ (guest.guestCount || 1) - 1 } Family
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">{guest.age ? `${guest.age} yrs` : ''}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{guest.email || '-'}</div>
                                        <div className="text-sm text-gray-500">{guest.phone || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                         {guest.roomGroupId ? (
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Assigned
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                Unassigned
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => openEditModal(guest)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteSingle(guest.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredGuests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No guests found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingGuest ? 'Edit Guest' : 'Add New Guest'}
                            </h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                        <GuestForm 
                            initialData={editingGuest} 
                            onSubmit={handleSaveGuest} 
                            onCancel={() => setIsAddModalOpen(false)} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple Internal Form Component
function GuestForm({ initialData, onSubmit, onCancel }: { 
    initialData: SubGuest | null, 
    onSubmit: (data: Partial<SubGuest>) => void,
    onCancel: () => void 
}) {
    const [formData, setFormData] = useState<Partial<SubGuest>>(initialData || {
        name: '',
        email: '',
        phone: '',
        age: undefined,
        guestCount: 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                    type="text" 
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formData.name || ''}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                    <input 
                        type="email" 
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={formData.email || ''}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
                    <input 
                        type="tel" 
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={formData.phone || ''}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Age (Optional)</label>
                    <input 
                        type="number" 
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={formData.age || ''}
                        onChange={e => setFormData({...formData, age: parseInt(e.target.value) || undefined})}
                    />
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700">Total Guests in Group</label>
                    <input 
                        type="number" 
                        min="1"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={formData.guestCount || 1}
                        onChange={e => setFormData({...formData, guestCount: parseInt(e.target.value) || 1})}
                    />
                    <p className="text-xs text-gray-500 mt-1">Includes the primary guest (e.g. 1 = Self)</p>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 font-semibold"
                >
                    {initialData ? 'Save Changes' : 'Add Guest'}
                </button>
            </div>
        </form>
    );
}
