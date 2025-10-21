"use client";

import { useState } from "react";
import { Entitlements, Usage, Store, PlanTier } from "./types";
import { BC_STORES, PLANS } from "./mock-data";

// Mock hook for entitlements
export function useEntitlements(): Entitlements {
  // In production, fetch from API
  return {
    plan: "pro",
    maxStores: 25,
    maxSeats: 5,
    maxAlerts: 25,
    monthlySwaps: 5,
    hasAPI: true,
    hasWeeklyPDF: false,
    hasArchive: false,
  };
}

// Mock hook for usage
export function useUsage(): Usage {
  // In production, fetch from API
  return {
    stores: 12,
    seats: 3,
    alerts: 9,
    swapsUsed: 2,
  };
}

// Mock hook for tracked stores
export function useStores(): Store[] {
  // In production, fetch from API
  return BC_STORES.slice(0, 12);
}

// Mock hook for available stores (BC directory)
export function useAvailableStores(): Store[] {
  return BC_STORES;
}

// Mock hook for variants
export function useVariants() {
  // In production, use TanStack Query
  return {
    data: [],
    isLoading: false,
    error: null,
  };
}

// Plan selector hook
export function usePlanSelection(initialPlan?: PlanTier) {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(initialPlan || "lite");
  
  const plan = PLANS.find(p => p.id === selectedPlan);
  
  return {
    selectedPlan,
    setSelectedPlan,
    planDetails: plan,
  };
}


