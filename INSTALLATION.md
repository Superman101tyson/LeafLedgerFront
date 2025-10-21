# Installation Guide

This guide will help you set up and run the LeafLedger Complete application.

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **PostgreSQL**: Version 14.x or higher (optional for development, required for production)

## Quick Start (Development)

### 1. Install Dependencies

```bash
cd leafledger-complete
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

For development, you can use these minimal settings:

```env
# Minimal setup for development
DATABASE_URL="postgresql://postgres:password@localhost:5432/leafledger"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-change-in-production"
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Database Setup (Optional)

If you want to use the full database features:

### 1. Install PostgreSQL

- **macOS**: `brew install postgresql@14`
- **Ubuntu**: `sudo apt-get install postgresql-14`
- **Windows**: Download from postgresql.org

### 2. Create Database

```bash
createdb leafledger
```

### 3. Set Up Prisma

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

## Project Structure

```
leafledger-complete/
├── src/
│   ├── app/                    # Next.js pages (App Router)
│   │   ├── (app)/             # App routes (catalog, compare, alerts, billing)
│   │   ├── onboarding/        # Onboarding wizard
│   │   ├── pricing/           # Pricing page
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui base components
│   │   └── [feature]/        # Feature-specific components
│   └── lib/                   # Utilities, types, hooks
├── prisma/
│   └── schema.prisma         # Database schema
├── sql/                       # SQL examples
└── public/                    # Static assets
```

## Available Routes

### Public Routes
- `/` - Landing page
- `/pricing` - Pricing tiers and plans

### App Routes (Protected)
- `/onboarding` - New user onboarding flow
- `/app/catalog` - Product catalog with price analysis
- `/app/compare` - Price comparison matrix
- `/app/alerts` - Alert management system
- `/app/billing` - Billing and subscription management

## Features Implemented

### ✅ P0: Design System
- PageHeader, MetricCard, ScopeBar, DataFreshness components
- Consistent light theme with green accent
- Soft shadows and premium feel

### ✅ P1: Pricing Page
- 5 plan tiers: Lite, Starter, Pro, Provincial, Enterprise
- Add-ons display with pricing
- Free trial CTA

### ✅ P2: Onboarding Wizard
- 5-step flow with progress tracking
- Plan selection with comparison
- Store selection with search/filters
- Lock confirmation with quota display
- Alert configuration with presets
- Checkout with success state

### ✅ P3-P4: Reusable Components
- StorePicker with search, filters, and selection tray
- UsageMeters with progress indicators

### ✅ P5-P6: Advanced Features
- SwapStoreModal for store management
- DataScopeGuard HOC for access control

### ✅ P7-P8: Catalog & Analysis
- Product catalog with expandable rows
- Store price grid in expanded view
- 30-day price trend sparklines
- PriceLadderModal with competitive analysis

### ✅ P9: Price Comparison
- Multi-store comparison matrix
- Heatmap visualization
- Sticky header and column
- Category/brand filters

### ✅ P10: Alerts System
- Alert Library with templates
- My Rules management
- Alert Inbox with filtering
- Configuration drawer

### ✅ P11: Billing
- Current plan display
- Usage meters
- Upgrade drawer with plan comparison
- Add-ons management
- Payment method management
- Billing history

### ✅ P12-P13: Backend
- Entitlements service with quota management
- Prisma database schema
- RLS (Row-Level Security) examples
- SQL materialization examples

### ✅ P14: Reporting
- Weekly summary email template
- PDF-ready HTML layout
- Data aggregation service
- Automated scheduling example

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# View database with Prisma Studio
npx prisma studio
```

## Mock Data

The application includes comprehensive mock data for development:

- 15 BC cannabis stores
- 4 product variants with pricing
- 5 alert templates
- Usage and entitlement data

All mock data is defined in `src/lib/mock-data.ts`.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI primitives)
- **State**: React Hooks
- **Forms**: React Hook Form (ready to add)
- **Data Fetching**: TanStack Query (ready to use)
- **Tables**: TanStack Table
- **Charts**: Recharts
- **Database**: PostgreSQL + Prisma
- **Notifications**: Sonner

## Production Deployment

### Environment Variables

Set these in your production environment:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-secure-secret"
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="..."
SMTP_PASSWORD="..."
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
```

### Deployment Platforms

**Vercel** (Recommended):
```bash
npm install -g vercel
vercel
```

**Docker**:
```bash
docker build -t leafledger .
docker run -p 3000:3000 leafledger
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill
```

### Prisma Issues
```bash
# Reset Prisma client
rm -rf node_modules/.prisma
npx prisma generate
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Support

For issues or questions:
- Check the README.md for overview
- Review component documentation in code comments
- Check Prisma schema for database structure

## License

Proprietary - All rights reserved


