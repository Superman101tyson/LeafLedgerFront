// Plan Types
export type PlanTier = "lite" | "starter" | "pro" | "provincial" | "enterprise";

export interface PlanDetails {
  id: PlanTier;
  name: string;
  price: number;
  stores: number;
  seats: number;
  alerts: number;
  swaps: number;
  features: string[];
}

// Store Types
export interface Store {
  id: string;
  name: string;
  chain: string;
  city: string;
  address: string;
  distance?: number;
}

// Entitlements
export interface Entitlements {
  plan: PlanTier;
  maxStores: number;
  maxSeats: number;
  maxAlerts: number;
  monthlySwaps: number;
  hasAPI: boolean;
  hasWeeklyPDF: boolean;
  hasArchive: boolean;
}

export interface Usage {
  stores: number;
  seats: number;
  alerts: number;
  swapsUsed: number;
}

// Product & Variant Types
export interface Product {
  id: string;
  brand: string;
  name: string;
  category: string;
}

export interface Variant {
  id: string;
  productId: string;
  product: Product;
  size: string;
  thc?: string;
  cbd?: string;
  coverage: number;
  minPrice: number;
  medianPrice: number;
  p90Price: number;
  delta7d: number;
}

export interface VariantStorePrice {
  variantId: string;
  storeId: string;
  store: Store;
  price: number;
  onSale: boolean;
  lastSeen: string;
}

// Alert Types
export type AlertType = "undercut" | "new_sku" | "back_in_stock" | "median_move" | "rank_loss";

export interface AlertRule {
  id: string;
  type: AlertType;
  name: string;
  description: string;
  enabled: boolean;
  config: Record<string, any>;
}

export interface AlertInboxItem {
  id: string;
  ruleId: string;
  type: AlertType;
  message: string;
  timestamp: string;
  status: "unread" | "read" | "snoozed" | "muted";
  variantId?: string;
  storeId?: string;
}

// Add-on Types
export interface Addon {
  id: string;
  name: string;
  price: number;
  description: string;
}

// Swap Request
export interface SwapRequest {
  fromStoreId: string;
  toStoreId: string;
  requestedAt: string;
  activatesAt: string;
}


