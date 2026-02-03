"use client";

import { use, useState } from "react";

type RequestStatus = "pending" | "processing" | "approved" | "rejected";

interface Cancellation {
  id: string;
  guestName: string;
  roomType: string;
  roomNumber: string;
  bookingId: string;
  reason: string;
  requestDate: string;
  status: RequestStatus;
  policyType: "non-refundable" | "flexible";
  financialImpact: {
    penaltyAmount: number;
    recoveryPotential: number;
    netLoss: number;
  };
  familyMembers: number;
  checkIn: string;
  checkOut: string;
  approvedAction?: string;
  approvedDate?: string;
}

export default function PostBookingPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const [activeTab, setActiveTab] = useState<
    "cancellations" | "requests" | "shadowfolio"
  >("cancellations");
  const [selectedCancellation, setSelectedCancellation] = useState<
    string | null
  >(null);
  const [showArbitrageModal, setShowArbitrageModal] = useState(false);
  const [showAssetConversion, setShowAssetConversion] = useState(false);
  const [assetConverted, setAssetConverted] = useState(false);
  const [costStrippingSaved, setCostStrippingSaved] = useState<string[]>([]);

  // Drag and drop state
  const [draggedGuest, setDraggedGuest] = useState<string | null>(null);
  const [droppedGuest, setDroppedGuest] = useState<{
    id: string;
    name: string;
    room: string;
  } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Request management state
  const [cancellations, setCancellations] = useState<Cancellation[]>([
    {
      id: "1",
      guestName: "Rajesh Kumar",
      roomType: "Deluxe King",
      roomNumber: "302",
      bookingId: "BK-2026-001",
      reason: "Family emergency - unable to attend",
      requestDate: "2026-02-01",
      status: "pending",
      policyType: "non-refundable",
      financialImpact: {
        penaltyAmount: 12500,
        recoveryPotential: 9800,
        netLoss: 2700,
      },
      familyMembers: 4,
      checkIn: "2026-02-12",
      checkOut: "2026-02-14",
    },
    {
      id: "2",
      guestName: "Priya Sharma",
      roomType: "Premium Suite",
      roomNumber: "405",
      bookingId: "BK-2026-002",
      reason: "Work commitment conflict",
      requestDate: "2026-02-02",
      status: "processing",
      policyType: "flexible",
      financialImpact: {
        penaltyAmount: 0,
        recoveryPotential: 8500,
        netLoss: 0,
      },
      familyMembers: 2,
      checkIn: "2026-02-12",
      checkOut: "2026-02-14",
    },
    {
      id: "3",
      guestName: "Amit Patel",
      roomType: "Executive Suite",
      roomNumber: "501",
      bookingId: "BK-2026-003",
      reason: "Health issues",
      requestDate: "2026-02-03",
      status: "pending",
      policyType: "non-refundable",
      financialImpact: {
        penaltyAmount: 15000,
        recoveryPotential: 12000,
        netLoss: 3000,
      },
      familyMembers: 3,
      checkIn: "2026-02-12",
      checkOut: "2026-02-14",
    },
    {
      id: "4",
      guestName: "Sneha Reddy",
      roomType: "Deluxe Suite",
      roomNumber: "104",
      bookingId: "BK-2026-004",
      reason: "Travel plans changed",
      requestDate: "2026-01-28",
      status: "approved",
      policyType: "flexible",
      financialImpact: {
        penaltyAmount: 0,
        recoveryPotential: 7500,
        netLoss: 0,
      },
      familyMembers: 2,
      checkIn: "2026-02-12",
      checkOut: "2026-02-14",
      approvedAction: "Full refund processed",
      approvedDate: "2026-01-29",
    },
  ]);

  // Rescue candidates (guests with flexible/refundable rooms)
  const rescueCandidates = [
    {
      id: "rc1",
      name: "Rahul S.",
      currentRoom: "Premium Suite 405",
      policyType: "Free Cancellation",
    },
    {
      id: "rc2",
      name: "Sneha Reddy",
      currentRoom: "Deluxe Suite 104",
      policyType: "Flexible",
    },
    {
      id: "rc3",
      name: "Vikram Singh",
      currentRoom: "Premium Suite 205",
      policyType: "Free Cancellation",
    },
    {
      id: "rc4",
      name: "Ananya Gupta",
      currentRoom: "Standard Room 108",
      policyType: "Refundable",
    },
  ];

  // Shadow folio unauthorized charges
  const unauthorizedCharges = [
    { room: "101", guest: "Rajesh Kumar", item: "Minibar", amount: 45 },
    { room: "205", guest: "Vikram Singh", item: "Laundry", amount: 20 },
  ];

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning";
      case "processing":
        return "bg-processing/10 text-processing";
      case "approved":
        return "bg-success/10 text-success";
      case "rejected":
        return "bg-error/10 text-error";
      default:
        return "bg-neutral-100 text-neutral-600";
    }
  };

  // Drag handlers
  const handleDragStart = (guestId: string) => {
    setDraggedGuest(guestId);
  };

  const handleDragEnd = () => {
    setDraggedGuest(null);
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (draggedGuest) {
      const guest = rescueCandidates.find((g) => g.id === draggedGuest);
      if (guest) {
        setDroppedGuest({
          id: guest.id,
          name: guest.name,
          room: guest.currentRoom,
        });
      }
    }
    setDraggedGuest(null);
  };

  // Action handlers
  const handleCostStripping = (cancellationId: string) => {
    setCostStrippingSaved([...costStrippingSaved, cancellationId]);
    // Update status to processing
    setCancellations(
      cancellations.map((c) =>
        c.id === cancellationId
          ? { ...c, status: "processing" as RequestStatus }
          : c,
      ),
    );
  };

  const handleSwapConfirm = (cancellationId: string) => {
    if (droppedGuest) {
      setCancellations(
        cancellations.map((c) =>
          c.id === cancellationId
            ? {
                ...c,
                status: "approved" as RequestStatus,
                approvedAction: `Room swap: ${droppedGuest.name} moved to Room ${c.roomNumber}`,
                approvedDate: new Date().toISOString().split("T")[0],
              }
            : c,
        ),
      );
      setDroppedGuest(null);
      setSelectedCancellation(null);
    }
  };

  const handleAssetConversionConfirm = (cancellationId: string) => {
    setCancellations(
      cancellations.map((c) =>
        c.id === cancellationId
          ? {
              ...c,
              status: "approved" as RequestStatus,
              approvedAction: "Converted ₹12,500 to F&B Credit",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : c,
      ),
    );
    setAssetConverted(false);
    setShowAssetConversion(false);
    setSelectedCancellation(null);
  };

  const selectedCancellationData = cancellations.find(
    (c) => c.id === selectedCancellation,
  );

  // Filter cancellations by status
  const pendingCancellations = cancellations.filter(
    (c) => c.status === "pending" || c.status === "processing",
  );
  const approvedCancellations = cancellations.filter(
    (c) => c.status === "approved",
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-neutral-900">
          Post-Booking Intelligence
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Algorithmic Loss Mitigation & Cancellation Management
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-neutral-200 px-8">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("cancellations")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "cancellations"
                ? "border-corporate-blue-100 text-corporate-blue-100"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Cancellations ({cancellations.length})
          </button>
          <button
            onClick={() => setActiveTab("shadowfolio")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "shadowfolio"
                ? "border-corporate-blue-100 text-corporate-blue-100"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Shadow Folio
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "requests"
                ? "border-corporate-blue-100 text-corporate-blue-100"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Other Requests (0)
          </button>
        </div>
      </div>

      <div className="px-8 py-8">
        {activeTab === "cancellations" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="text-sm font-medium text-neutral-600 mb-2">
                  Total Penalty Exposure
                </div>
                <div className="text-3xl font-bold text-error">
                  ₹
                  {cancellations
                    .reduce(
                      (sum, c) => sum + c.financialImpact.penaltyAmount,
                      0,
                    )
                    .toLocaleString()}
                </div>
              </div>
              <div className="card p-6">
                <div className="text-sm font-medium text-neutral-600 mb-2">
                  Recovery Potential
                </div>
                <div className="text-3xl font-bold text-success">
                  ₹
                  {cancellations
                    .reduce(
                      (sum, c) => sum + c.financialImpact.recoveryPotential,
                      0,
                    )
                    .toLocaleString()}
                </div>
              </div>
              <div className="card p-6">
                <div className="text-sm font-medium text-neutral-600 mb-2">
                  Net Loss (After Mitigation)
                </div>
                <div className="text-3xl font-bold text-neutral-900">
                  ₹
                  {cancellations
                    .reduce((sum, c) => sum + c.financialImpact.netLoss, 0)
                    .toLocaleString()}
                </div>
              </div>
            </div>

            {/* Pending Requests */}
            {pendingCancellations.length > 0 && (
              <div className="card">
                <div className="p-6 border-b border-neutral-200">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Pending Cancellation Requests ({pendingCancellations.length}
                    )
                  </h2>
                </div>
                <div className="divide-y divide-neutral-200">
                  {pendingCancellations.map((cancellation) => (
                    <div
                      key={cancellation.id}
                      className="p-6 hover:bg-neutral-50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-neutral-900">
                              {cancellation.guestName}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cancellation.status)}`}
                            >
                              {cancellation.status.charAt(0).toUpperCase() +
                                cancellation.status.slice(1)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-neutral-600">Room:</span>
                              <div className="font-medium text-neutral-900">
                                {cancellation.roomNumber} -{" "}
                                {cancellation.roomType}
                              </div>
                            </div>
                            <div>
                              <span className="text-neutral-600">
                                Booking ID:
                              </span>
                              <div className="font-medium text-neutral-900">
                                {cancellation.bookingId}
                              </div>
                            </div>
                            <div>
                              <span className="text-neutral-600">
                                Family Members:
                              </span>
                              <div className="font-medium text-neutral-900">
                                {cancellation.familyMembers}
                              </div>
                            </div>
                            <div>
                              <span className="text-neutral-600">
                                Check-in:
                              </span>
                              <div className="font-medium text-neutral-900">
                                {new Date(
                                  cancellation.checkIn,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-neutral-600 mb-1">
                          Cancellation Reason:
                        </div>
                        <div className="text-sm text-neutral-900 bg-neutral-100 p-3 rounded-lg">
                          {cancellation.reason}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="text-neutral-600">Penalty: </span>
                            <span className="font-semibold text-error">
                              ₹
                              {cancellation.financialImpact.penaltyAmount.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-600">
                              Recovery Potential:{" "}
                            </span>
                            <span className="font-semibold text-success">
                              ₹
                              {cancellation.financialImpact.recoveryPotential.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-600">Net Loss: </span>
                            <span className="font-semibold text-neutral-900">
                              ₹
                              {cancellation.financialImpact.netLoss.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (cancellation.policyType === "non-refundable") {
                              setShowArbitrageModal(true);
                              setSelectedCancellation(cancellation.id);
                            } else {
                              setSelectedCancellation(cancellation.id);
                            }
                          }}
                          className="px-6 py-2 bg-corporate-blue-100 hover:bg-corporate-blue-200 text-white font-medium rounded-lg transition-colors"
                        >
                          Manage Cancellation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approved Requests */}
            {approvedCancellations.length > 0 && (
              <div className="card">
                <div className="p-6 border-b border-neutral-200">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Approved Requests ({approvedCancellations.length})
                  </h2>
                </div>
                <div className="divide-y divide-neutral-200">
                  {approvedCancellations.map((cancellation) => (
                    <div key={cancellation.id} className="p-6 bg-success/5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-neutral-900">
                              {cancellation.guestName}
                            </h3>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                              ✓ Approved
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-neutral-600">Room:</span>
                              <div className="font-medium text-neutral-900">
                                {cancellation.roomNumber} -{" "}
                                {cancellation.roomType}
                              </div>
                            </div>
                            <div>
                              <span className="text-neutral-600">
                                Booking ID:
                              </span>
                              <div className="font-medium text-neutral-900">
                                {cancellation.bookingId}
                              </div>
                            </div>
                            <div>
                              <span className="text-neutral-600">
                                Approved:
                              </span>
                              <div className="font-medium text-neutral-900">
                                {cancellation.approvedDate &&
                                  new Date(
                                    cancellation.approvedDate,
                                  ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-success/20">
                            <div className="text-sm font-medium text-success mb-1">
                              Action Taken:
                            </div>
                            <div className="text-sm text-neutral-900">
                              {cancellation.approvedAction}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "shadowfolio" && (
          <div className="space-y-6">
            {/* Shadow Folio content remains the same */}
            <div className="card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-processing/10 rounded-lg">
                  <svg
                    className="w-8 h-8 text-processing"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Financial Reconciliation Dashboard
                  </h2>
                  <p className="text-sm text-neutral-600">
                    Shadow Folio - Authorized vs. Actual Charges
                  </p>
                </div>
              </div>

              {/* Split Screen Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel - Authorized Budget */}
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="bg-success/10 border-b border-success/20 px-4 py-3">
                    <h3 className="font-semibold text-success flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Authorized Budget
                    </h3>
                  </div>
                  <div className="divide-y divide-neutral-200">
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-neutral-900">
                          Room Charges
                        </div>
                        <div className="text-sm text-neutral-600">
                          All rooms - Base rate
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">
                          ₹10,000
                        </span>
                        <svg
                          className="w-5 h-5 text-success"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-neutral-900">
                          Meal Plan
                        </div>
                        <div className="text-sm text-neutral-600">
                          Breakfast included
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">
                          ₹2,500
                        </span>
                        <svg
                          className="w-5 h-5 text-success"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-neutral-700">
                        Total Authorized:
                      </span>
                      <span className="text-success">₹12,500</span>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Hotel Invoice */}
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="bg-warning/10 border-b border-warning/20 px-4 py-3">
                    <h3 className="font-semibold text-warning flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Hotel Invoice
                    </h3>
                  </div>
                  <div className="divide-y divide-neutral-200">
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-neutral-900">
                          Room Charges
                        </div>
                        <div className="text-sm text-neutral-600">
                          All rooms - Base rate
                        </div>
                      </div>
                      <span className="font-semibold text-neutral-900">
                        ₹10,000
                      </span>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-neutral-900">
                          Meal Plan
                        </div>
                        <div className="text-sm text-neutral-600">
                          Breakfast included
                        </div>
                      </div>
                      <span className="font-semibold text-neutral-900">
                        ₹2,500
                      </span>
                    </div>
                    {/* Unauthorized Charges */}
                    <div className="p-4 flex items-center justify-between bg-warning/5">
                      <div>
                        <div className="font-medium text-neutral-900 flex items-center gap-2">
                          Room 101 - Minibar
                          <span className="px-2 py-0.5 bg-warning text-white text-xs font-bold rounded-full">
                            UNAUTHORIZED EXTRA
                          </span>
                        </div>
                        <div className="text-sm text-neutral-600">
                          Guest incidental
                        </div>
                      </div>
                      <span className="font-semibold text-warning">₹45</span>
                    </div>
                    <div className="p-4 flex items-center justify-between bg-warning/5">
                      <div>
                        <div className="font-medium text-neutral-900 flex items-center gap-2">
                          Room 205 - Laundry
                          <span className="px-2 py-0.5 bg-warning text-white text-xs font-bold rounded-full">
                            UNAUTHORIZED EXTRA
                          </span>
                        </div>
                        <div className="text-sm text-neutral-600">
                          Guest incidental
                        </div>
                      </div>
                      <span className="font-semibold text-warning">₹20</span>
                    </div>
                  </div>
                  <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-neutral-700">Total Invoice:</span>
                      <span className="text-error">₹12,565</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Incidentals to Collect */}
            <div className="card">
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Guest Incidentals to Collect
                </h3>
                <p className="text-sm text-neutral-600 mt-1">
                  These charges were not authorized and must be collected from
                  guests
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                        Guest Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                        Room No
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                        Item Type
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {unauthorizedCharges.map((charge, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                          {charge.guest}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600">
                          {charge.room}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600">
                          {charge.item}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-warning">
                          ₹{charge.amount}
                        </td>
                        <td className="px-6 py-4">
                          <button className="px-4 py-1.5 bg-success hover:bg-success/90 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                              />
                            </svg>
                            Send Payment Link
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700">
                  Total to Collect from Guests:
                </span>
                <span className="text-lg font-bold text-warning">
                  ₹{unauthorizedCharges.reduce((sum, c) => sum + c.amount, 0)}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "requests" && (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No Other Requests
            </h3>
            <p className="text-sm text-neutral-600">
              Other modification requests will appear here
            </p>
          </div>
        )}
      </div>

      {/* Cancellation Arbitrage Modal */}
      {showArbitrageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            {/* Warning Banner */}
            <div className="bg-error/10 border-l-4 border-error px-6 py-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-error flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-error text-lg">
                    Warning: 100% Non-Refundable Room
                  </h3>
                  <p className="text-sm text-error/80 mt-1">
                    Room 302 is Non-Refundable. Cancelling will result in{" "}
                    <strong>₹12,500 Loss</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendation Card */}
            <div className="p-6">
              <div className="bg-gradient-to-br from-success/10 to-success/5 border-2 border-success rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-success rounded-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                      💡 Optimization Found
                    </h3>
                    <p className="text-neutral-700 mb-4">
                      Guest <strong>Rahul</strong> (Room 405) is in a{" "}
                      <span className="text-success font-semibold">
                        Flexible Room
                      </span>
                      . Swap him into this slot to save 100% of cancellation
                      fees.
                    </p>

                    {/* Visual Flow */}
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-center">
                          <div className="px-4 py-2 bg-success/10 border border-success rounded-lg">
                            <div className="text-sm font-medium text-success">
                              Rahul
                            </div>
                            <div className="text-xs text-neutral-600">
                              Room 405 (Flex)
                            </div>
                          </div>
                        </div>
                        <svg
                          className="w-8 h-8 text-success"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                        <div className="text-center">
                          <div className="px-4 py-2 bg-error/10 border border-error rounded-lg">
                            <div className="text-sm font-medium text-error">
                              Room 302
                            </div>
                            <div className="text-xs text-neutral-600">
                              (Non-Ref)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-success/10 rounded-lg p-3">
                      <div className="text-sm font-semibold text-success">
                        💰 Savings: ₹12,500 (100% penalty elimination)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowArbitrageModal(false)}
                  className="flex-1 py-3 border border-neutral-300 text-neutral-600 font-medium rounded-lg hover:bg-neutral-50 transition-colors text-sm"
                >
                  Ignore and Cancel (Accept Loss)
                </button>
                <button
                  onClick={() => {
                    setShowArbitrageModal(false);
                    setSelectedCancellation(selectedCancellation);
                  }}
                  className="flex-1 py-3 bg-success hover:bg-success/90 text-white font-bold rounded-lg transition-colors text-lg shadow-lg"
                >
                  ✓ Continue to Manual Swap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Manage Cancellation Modal */}
      {selectedCancellation &&
        !showArbitrageModal &&
        selectedCancellationData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-white border-b border-neutral-200 p-6 flex items-center justify-between flex-shrink-0">
                <h2 className="text-2xl font-bold text-neutral-900">
                  Manage Cancellation - {selectedCancellationData.guestName}
                </h2>
                <button
                  onClick={() => {
                    setSelectedCancellation(null);
                    setShowAssetConversion(false);
                    setAssetConverted(false);
                    setDroppedGuest(null);
                  }}
                  className="text-neutral-600 hover:text-neutral-900 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Manual Room Swap Section */}
                <div className="space-y-6">
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-neutral-900 mb-2">
                      Manual Room Rescue
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Drag a guest from the rescue candidates to save this room
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - The Problem */}
                    <div>
                      <h3 className="text-lg font-bold text-error mb-4">
                        Room to be Cancelled
                      </h3>
                      <div
                        className={`bg-red-50 border-2 rounded-xl p-6 transition-all ${
                          isDragOver
                            ? "border-success border-dashed bg-success/5"
                            : "border-error"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="text-center mb-4">
                          <div className="text-2xl font-bold text-neutral-900 mb-2">
                            Room {selectedCancellationData.roomNumber} (
                            {selectedCancellationData.roomType})
                          </div>
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <svg
                              className="w-5 h-5 text-warning"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            <span className="px-3 py-1 bg-warning text-white text-sm font-bold rounded-full">
                              Non-Refundable Policy
                            </span>
                          </div>
                        </div>

                        {/* Drop Zone */}
                        {!droppedGuest ? (
                          <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                              isDragOver
                                ? "border-success bg-success/10"
                                : "border-neutral-300 bg-white"
                            }`}
                          >
                            <div className="w-24 h-24 mx-auto mb-4 border-2 border-dashed border-neutral-300 rounded-full flex items-center justify-center">
                              <svg
                                className="w-12 h-12 text-neutral-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <div className="text-lg font-semibold text-neutral-700 mb-2">
                              Drop Guest Here to Save ₹
                              {selectedCancellationData.financialImpact.penaltyAmount.toLocaleString()}
                            </div>
                            <div className="text-sm text-neutral-500">
                              Drag a rescue candidate from the right panel
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white border-2 border-success rounded-lg p-6 animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-success"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="text-xl font-bold text-neutral-900">
                                  {droppedGuest.name}
                                </div>
                                <div className="text-sm text-neutral-600">
                                  From: {droppedGuest.room}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setDroppedGuest(null)}
                              className="w-full py-2 border border-neutral-300 text-neutral-600 rounded-lg hover:bg-neutral-50 transition-colors text-sm"
                            >
                              Remove & Try Another
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column - The Solution */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-neutral-900">
                          Available Rescue Candidates
                        </h3>
                      </div>
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success text-sm font-medium rounded-full">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            />
                          </svg>
                          Showing Guests with Flexible/Refundable Rooms Only
                        </span>
                      </div>

                      {/* Scrollable List */}
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {rescueCandidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            draggable
                            onDragStart={() => handleDragStart(candidate.id)}
                            onDragEnd={handleDragEnd}
                            className={`bg-white border-2 border-neutral-200 rounded-lg p-4 cursor-move hover:border-success hover:shadow-md transition-all ${
                              draggedGuest === candidate.id ? "opacity-50" : ""
                            } ${
                              droppedGuest?.id === candidate.id
                                ? "opacity-30"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Drag Handle */}
                              <div className="text-neutral-400">
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                                </svg>
                              </div>

                              {/* Guest Info */}
                              <div className="flex-1">
                                <div className="font-semibold text-neutral-900 mb-1">
                                  {candidate.name}
                                </div>
                                <div className="text-sm text-neutral-600">
                                  {candidate.currentRoom}
                                </div>
                              </div>

                              {/* Badge */}
                              <span className="px-3 py-1 bg-success text-white text-xs font-bold rounded-full whitespace-nowrap">
                                {candidate.policyType}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Swap Action Footer */}
                  {droppedGuest && (
                    <div className="bg-neutral-900 text-white px-8 py-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                          <div>
                            <div className="text-sm text-neutral-400 mb-1">
                              Potential Loss
                            </div>
                            <div className="text-2xl font-bold line-through text-error">
                              ₹
                              {selectedCancellationData.financialImpact.penaltyAmount.toLocaleString()}
                            </div>
                          </div>
                          <svg
                            className="w-8 h-8 text-success"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                          <div>
                            <div className="text-sm text-neutral-400 mb-1">
                              Net Savings
                            </div>
                            <div className="text-3xl font-bold text-success">
                              ₹
                              {selectedCancellationData.financialImpact.penaltyAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleSwapConfirm(selectedCancellationData.id)
                          }
                          className="px-8 py-4 bg-success hover:bg-success/90 text-white font-bold text-lg rounded-lg transition-all shadow-lg"
                        >
                          ✓ Confirm Swap & Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-200 my-8"></div>

                {/* Other Strategies */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Other Mitigation Strategies
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Asset Conversion Card */}
                    {!showAssetConversion && !assetConverted && (
                      <div className="card p-6 border-2 border-neutral-200">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="text-4xl">💸</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-neutral-900 mb-1 text-lg">
                              Asset Conversion
                            </h3>
                            <div className="bg-error/10 p-4 rounded-lg mb-4">
                              <div className="text-sm text-neutral-700 mb-1">
                                Cancellation Fee (Sunk Cost):
                              </div>
                              <div className="text-2xl font-bold text-error">
                                ₹
                                {selectedCancellationData.financialImpact.penaltyAmount.toLocaleString()}
                              </div>
                            </div>
                            <button
                              onClick={() => setShowAssetConversion(true)}
                              className="w-full py-3 bg-warning hover:bg-warning/90 text-white font-bold rounded-lg transition-colors text-lg"
                            >
                              🔄 Convert to Banquet Credit
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Asset Conversion Processing */}
                    {showAssetConversion && !assetConverted && (
                      <div className="card p-6 border-2 border-warning animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="text-4xl animate-bounce">🔄</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-neutral-900 mb-2 text-lg">
                              Asset Conversion Workflow
                            </h3>
                            <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                              <div className="flex items-center justify-center gap-4 mb-3">
                                <div className="text-center">
                                  <div className="text-3xl mb-1">🗑️</div>
                                  <div className="text-sm text-error font-semibold">
                                    ₹
                                    {selectedCancellationData.financialImpact.penaltyAmount.toLocaleString()}{" "}
                                    Loss
                                  </div>
                                </div>
                                <svg
                                  className="w-8 h-8 text-warning animate-pulse"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                  />
                                </svg>
                                <div className="text-center">
                                  <div className="text-3xl mb-1">🍽️</div>
                                  <div className="text-sm text-success font-semibold">
                                    F&B Credit
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-neutral-600 text-center">
                                Converting sunk cost to banquet credit...
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setAssetConverted(true);
                                setTimeout(() => {
                                  handleAssetConversionConfirm(
                                    selectedCancellationData.id,
                                  );
                                }, 2000);
                              }}
                              className="w-full py-3 bg-success hover:bg-success/90 text-white font-bold rounded-lg transition-colors"
                            >
                              ✓ Confirm Conversion
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Asset Conversion Complete */}
                    {assetConverted && (
                      <div className="card p-6 border-2 border-success bg-success/5 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-start gap-3">
                          <div className="text-4xl">✅</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-success mb-2 text-xl">
                              Success! Asset Converted
                            </h3>
                            <div className="bg-white p-4 rounded-lg mb-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-neutral-600">
                                  Previous Status:
                                </span>
                                <span className="text-error font-semibold line-through">
                                  -₹
                                  {selectedCancellationData.financialImpact.penaltyAmount.toLocaleString()}{" "}
                                  Loss
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-neutral-600">
                                  New Status:
                                </span>
                                <span className="text-success font-bold text-xl">
                                  +₹
                                  {selectedCancellationData.financialImpact.penaltyAmount.toLocaleString()}{" "}
                                  F&B Credit
                                </span>
                              </div>
                            </div>
                            <div className="bg-success/10 p-4 rounded-lg">
                              <p className="text-sm text-neutral-700">
                                <strong>Success!</strong> The hotel has agreed
                                to apply this amount to your
                                <strong> Final Wedding Dinner Bill</strong>.
                                Request will be moved to approved.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Variable Cost Stripping */}
                    <div className="card p-6 border-2 border-success">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">₹</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-900 mb-1">
                            Variable Cost Stripping
                          </h3>
                          <p className="text-sm text-neutral-600 mb-4">
                            Downgrade rate plan to recover variable costs
                          </p>
                        </div>
                      </div>
                      <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                        <div className="text-sm text-neutral-700 mb-2">
                          <strong>Strategy:</strong> Strip meal plans, extra
                          beds, and other variable costs via API modification.
                        </div>
                        <div className="text-sm font-semibold text-success">
                          Recovery: ₹4,500 (36% of total cost)
                        </div>
                      </div>
                      {costStrippingSaved.includes(
                        selectedCancellationData.id,
                      ) ? (
                        <div className="w-full py-2 bg-success/10 text-success font-medium rounded-lg text-center">
                          ✓ Saved - Processing
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            handleCostStripping(selectedCancellationData.id)
                          }
                          className="w-full py-2 bg-success hover:bg-success/90 text-white font-medium rounded-lg transition-colors"
                        >
                          Execute & Save
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
