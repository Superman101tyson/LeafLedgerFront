# LeafLedger Complete

A comprehensive B2B cannabis market intelligence platform built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

### Core Features
- **P0: Design System** - Light theme with reusable components (PageHeader, MetricCard, ScopeBar, DataFreshness)
- **P1: Pricing Page** - 5 plan tiers (Lite, Starter, Pro, Provincial, Enterprise) with add-ons
- **P2: Onboarding Wizard** - 5-step flow (Plan → Stores → Lock → Alerts → Checkout)
- **P3-P4: Store Management** - StorePicker component and UsageMeters
- **P5-P6: Store Swaps** - SwapStoreModal and DataScopeGuard HOC
- **P7-P8: Product Catalog** - Expandable table with price ladder modal
- **P9: Compare Matrix** - Multi-store price comparison with heatmap
- **P10: Alerts System** - Library, My Rules, and Inbox tabs
- **P11: Billing** - Subscription management with upgrade drawer
- **P12-P13: Entitlements** - Server-side quota management and database schemas
- **P14: PDF Reports** - Weekly market summary email template

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: React Hooks
- **Data Fetching**: TanStack Query
- **Tables**: TanStack Table
- **Charts**: Recharts
- **Database**: PostgreSQL + Prisma ORM
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (for production)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and other configs

# Run database migrations (if using Prisma)
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
leafledger-complete/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (app)/             # App layout group
│   │   │   ├── catalog/       # Product catalog
│   │   │   ├── compare/       # Price comparison
│   │   │   ├── alerts/        # Alerts system
│   │   │   └── billing/       # Billing & subscription
│   │   ├── onboarding/        # Onboarding wizard
│   │   ├── pricing/           # Public pricing page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── alerts/           # Alert-specific components
│   │   ├── billing/          # Billing components
│   │   ├── catalog/          # Catalog components
│   │   └── onboarding/       # Onboarding steps
│   └── lib/                   # Utilities and services
│       ├── types.ts          # TypeScript types
│       ├── utils.ts          # Utility functions
│       ├── hooks.ts          # Custom React hooks
│       ├── mock-data.ts      # Mock data
│       └── entitlements.ts   # Entitlements service
├── prisma/
│   └── schema.prisma         # Database schema
├── sql/
│   └── materializer-example.sql  # SQL materialization example
└── public/                    # Static assets
```

## Key Routes

- `/` - Landing page
- `/pricing` - Public pricing page
- `/onboarding` - New user onboarding flow
- `/app/catalog` - Product catalog with price ladder
- `/app/compare` - Price comparison matrix
- `/app/alerts` - Alert management (Library, Rules, Inbox)
- `/app/billing` - Billing and subscription management

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key tables include:

- `organizations` - Customer organizations
- `users` - User accounts
- `org_store_allowlist` - Tracked stores per organization
- `master_stores` - Master store directory
- `master_products` - Product catalog
- `product_variants` - Product variants (SKUs)
- `menu_observations` - Raw price observations
- `daily_variant_store` - Materialized daily store prices
- `daily_variant_market` - Materialized market metrics
- `alert_rules` - Alert configurations
- `alert_inbox` - Alert notifications

## Entitlements System

The platform implements a sophisticated entitlements system that:

1. Computes quotas from plan + add-ons
2. Enforces store allowlist with Row-Level Security (RLS)
3. Tracks monthly swap quotas
4. Provides helper functions for quota checks

See `src/lib/entitlements.ts` for implementation details.

## Development

### Mock Data

The application includes comprehensive mock data for development:
- BC cannabis stores directory
- Product catalog (variants)
- Alert templates
- Usage metrics

### Adding New Features

1. Create components in `src/components/`
2. Add pages in `src/app/`
3. Update types in `src/lib/types.ts`
4. Add database models in `prisma/schema.prisma`

## Production Deployment

### Environment Variables

Required environment variables:

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="..."
```

### Build

```bash
npm run build
npm start
```

## License

Proprietary - All rights reserved

---

Built with ❤️ using Next.js 15 and shadcn/ui


