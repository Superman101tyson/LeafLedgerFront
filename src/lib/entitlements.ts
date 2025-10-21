/**
 * Entitlements Service
 * 
 * Merges plan + add-ons into computed entitlements object
 * and provides helper functions for quota checks
 */

import { PlanTier, Entitlements } from "./types";
import { PLANS, ADDONS } from "./mock-data";

interface OrgSubscription {
  planId: PlanTier;
  addons: string[];
}

/**
 * Compute entitlements from plan and add-ons
 */
export function computeEntitlements(subscription: OrgSubscription): Entitlements {
  const plan = PLANS.find(p => p.id === subscription.planId);
  
  if (!plan) {
    throw new Error(`Invalid plan: ${subscription.planId}`);
  }

  let entitlements: Entitlements = {
    plan: plan.id,
    maxStores: plan.stores,
    maxSeats: plan.seats,
    maxAlerts: plan.alerts,
    monthlySwaps: plan.swaps,
    hasAPI: false,
    hasWeeklyPDF: false,
    hasArchive: false,
  };

  // Apply add-ons
  subscription.addons.forEach(addonId => {
    const addon = ADDONS.find(a => a.id === addonId);
    if (!addon) return;

    switch (addonId) {
      case "stores_5":
        entitlements.maxStores += 5;
        break;
      case "swaps_10":
        entitlements.monthlySwaps += 10;
        break;
      case "seat":
        entitlements.maxSeats += 1;
        break;
      case "pdf":
        entitlements.hasWeeklyPDF = true;
        break;
      case "archive":
        entitlements.hasArchive = true;
        break;
      case "api":
        entitlements.hasAPI = true;
        break;
    }
  });

  return entitlements;
}

/**
 * Check if org can select a new store
 */
export function canSelectStore(
  currentStoreCount: number,
  entitlements: Entitlements
): boolean {
  return currentStoreCount < entitlements.maxStores;
}

/**
 * Get remaining store slots
 */
export function remainingSlots(
  currentStoreCount: number,
  entitlements: Entitlements
): number {
  return Math.max(0, entitlements.maxStores - currentStoreCount);
}

/**
 * Check if org can perform a swap this month
 */
export function canSwap(
  swapsUsedThisMonth: number,
  entitlements: Entitlements
): boolean {
  return swapsUsedThisMonth < entitlements.monthlySwaps;
}

/**
 * Record a store swap (to be called when swap is requested)
 * In production, this would update the database
 */
export async function recordSwap(
  orgId: string,
  fromStoreId: string,
  toStoreId: string
): Promise<void> {
  // In production:
  // 1. Verify org has swap quota remaining
  // 2. Create swap record with pending status
  // 3. Schedule swap to activate at next refresh
  
  console.log(`Swap recorded for org ${orgId}: ${fromStoreId} -> ${toStoreId}`);
  
  // Mock implementation
  return Promise.resolve();
}

/**
 * Get entitlements for an organization
 * In production, this would query the database
 */
export async function getOrgEntitlements(orgId: string): Promise<Entitlements> {
  // Mock subscription
  const subscription: OrgSubscription = {
    planId: "pro",
    addons: ["api"],
  };
  
  return computeEntitlements(subscription);
}

/**
 * Example usage in API route:
 * 
 * // app/api/stores/route.ts
 * export async function POST(req: Request) {
 *   const session = await getServerSession();
 *   const orgId = session.user.orgId;
 *   
 *   const entitlements = await getOrgEntitlements(orgId);
 *   const currentStores = await getOrgStores(orgId);
 *   
 *   if (!canSelectStore(currentStores.length, entitlements)) {
 *     return NextResponse.json(
 *       { error: "Store limit reached" },
 *       { status: 403 }
 *     );
 *   }
 *   
 *   // ... proceed with adding store
 * }
 */


