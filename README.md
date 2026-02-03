# Group Inventory Management Platform

> Enterprise-grade SaaS platform for MICE events and destination weddings

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

## 🎯 Overview

A production-ready platform that digitizes offline coordination workflows for group travel events. Built with operational clarity and financial-grade reliability in mind, this platform feels like "Shopify for Group Travel" or "Notion meets Booking Engine."

**Design Philosophy**: Minimal but powerful, operational clarity over decoration, enterprise maturity (Stripe × Linear × Notion inspiration).

## ✨ Features

### 🎛️ Agent Dashboard
- **Real-time Metrics**: Active Events, Total Guests, Rooms Blocked, Rooms Sold, Inventory Risk, Revenue Locked
- **Event Grid**: Dynamic event cards with status badges and inventory consumption indicators
- **Smart Filtering**: Quick access to event details and management

### 📝 Event Creation Flow
- **Multi-Step Wizard**: Guided event creation process
- **Hotel Negotiation Mapping**: Add multiple hotels with room allotments and negotiated rates
- **Inventory Locking**: Dedicated inventory vault for each event

### 👥 CSV-less Guest Collection
- **Smart Link Generator**: Shareable event-specific registration URLs
- **Occupancy Intelligence**: Automatic singles/doubles/triples calculation
- **WhatsApp Integration**: One-click sharing to guest groups

### 🏨 Hotel Inventory Management
- **Normalized Room Types**: Algorithmic organization of room categories
- **Smart Filters**: Meal inclusion, price range, bed type
- **Availability Tracking**: Color-coded inventory status

### 🗺️ Drag-and-Drop Room Mapping
- **Split-Screen Interface**: Unassigned guests ↔ Available rooms
- **Real-Time Validation**: Occupancy constraint checking
- **Inline Warnings**: Instant feedback on capacity violations

### ⚙️ Booking Execution Engine
- **Visual Pipeline**: Batch → Validate → Execute → Handle Errors → Reconcile
- **Status Dashboard**: Live tracking of success/processing/failure states
- **Error Handling**: Intelligent retry and reconciliation

### 🧠 Post-Booking Intelligence (AI-Powered)
- **Policy Arbitrage**: Auto-swap refundable/non-refundable rooms
- **Cost Recovery**: Downgrade rate plans during cancellations
- **Asset Conversion**: Transform lost revenue into banquet credit
- **Shadow Folio**: Automated bill auditing and dispute flagging

### 🌐 Guest Microsite
- **Luxury Aesthetic**: Premium event presentation
- **Hotel Showcase**: Interactive package selection
- **Event Itinerary**: Timeline with day-by-day breakdown

### 📊 Analytics
- **Performance Metrics**: Revenue, booking success rate, group size trends
- **Chart Visualizations**: Booking trends and revenue analysis

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tushar330/TBO.git
   cd TBO
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
tbo/
├── app/
│   ├── dashboard/              # Main command center
│   ├── events/[eventId]/       # Event-specific pages
│   │   ├── guests/            # Guest collection
│   │   ├── inventory/         # Hotel inventory
│   │   ├── room-mapping/      # Room assignment
│   │   └── booking/           # Booking pipeline
│   ├── post-booking-intelligence/  # AI modules
│   ├── analytics/             # Performance insights
│   ├── m/[eventSlug]/         # Guest microsite
│   ├── globals.css            # Global styles
│   └── layout.tsx             # Root layout
├── components/
│   ├── Navigation.tsx         # Top navigation bar
│   ├── Sidebar.tsx           # Vertical navigation
│   ├── EventModal.tsx        # Event creation wizard
│   ├── EventCard.tsx         # Event display card
│   ├── MetricCard.tsx        # Dashboard metrics
│   └── StatusChip.tsx        # Status indicators
├── lib/
│   ├── EventContext.tsx      # Global state management
│   ├── types.ts              # TypeScript definitions
│   └── mockData.ts           # Demo data
└── package.json
```

## 🎨 Design System

### Color Palette
- **Corporate Blue Gradient**: `#1f5f99 → #1a4f84 → #153e6a`
- **Premium Gradient**: `#1e5c96 → #194c7f → #143a63`
- **Success**: `#10b981`
- **Warning**: `#f59e0b`
- **Error**: `#ef4444`
- **Processing**: `#3b82f6`

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: text-xs to text-3xl
- **Weights**: normal, medium, semibold, bold

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: React Context API
- **Routing**: File-based dynamic routing

## 📱 Key Routes

- `/dashboard` - Main command center
- `/events/[eventId]/inventory` - Hotel inventory management
- `/events/[eventId]/guests` - Guest collection system
- `/events/[eventId]/room-mapping` - Drag-and-drop room assignment
- `/events/[eventId]/booking` - Booking execution pipeline
- `/post-booking-intelligence` - AI-powered loss mitigation
- `/analytics` - Performance metrics and insights
- `/m/[eventSlug]` - Guest-facing microsite

## 🎯 Use Cases

- **MICE Events**: Corporate conferences, annual sales meetings, team offsites
- **Destination Weddings**: Multi-day celebrations with guest accommodation
- **Group Travel**: Family reunions, religious pilgrimages, educational tours
- **Festival Bookings**: Music festivals, cultural events with lodging needs

## 🔐 Features in Development

- [ ] User authentication and authorization
- [ ] Real-time collaboration features
- [ ] Payment gateway integration
- [ ] Email notification system
- [ ] Advanced analytics and reporting
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations

## 📄 License

This project is proprietary software. All rights reserved.

## 👨‍💻 Author

**Tushar**
- GitHub: [@tushar330](https://github.com/tushar330)

## 🙏 Acknowledgments

Built with inspiration from:
- **Stripe** - Financial-grade reliability
- **Linear** - Operational clarity
- **Notion** - Powerful yet minimal design

---

**Built for travel companies ready to digitize their group inventory management workflows.**
