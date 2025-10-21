import { 
  PlanDetails, 
  Store, 
  Entitlements, 
  Usage, 
  Variant,
  Product,
  VariantStorePrice,
  AlertRule,
  AlertInboxItem,
  Addon
} from "./types";

// Plans
export const PLANS: PlanDetails[] = [
  {
    id: "lite",
    name: "Lite",
    price: 199,
    stores: 5,
    seats: 2,
    alerts: 5,
    swaps: 0,
    features: ["2× Daily Refresh", "Basic Analytics", "Email Alerts", "30-day History"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 299,
    stores: 10,
    seats: 3,
    alerts: 10,
    swaps: 0,
    features: ["2× Daily Refresh", "Advanced Analytics", "Email & SMS Alerts", "90-day History", "CSV Export"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 599,
    stores: 25,
    seats: 5,
    alerts: 25,
    swaps: 5,
    features: ["2× Daily Refresh", "Advanced Analytics", "Priority Alerts", "1-year History", "API Access", "Custom Reports"],
  },
  {
    id: "provincial",
    name: "Provincial",
    price: 1299,
    stores: 9999,
    seats: 10,
    alerts: 100,
    swaps: 20,
    features: ["All BC Stores", "2× Daily Refresh", "Enterprise Analytics", "Priority Support", "Unlimited History", "API Access", "White Label Reports"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 0,
    stores: 9999,
    seats: 9999,
    alerts: 9999,
    swaps: 9999,
    features: ["Custom Everything", "Contact Sales"],
  },
];

// Add-ons
export const ADDONS: Addon[] = [
  { id: "stores_5", name: "+5 Stores", price: 49, description: "Add 5 additional tracked stores" },
  { id: "swaps_monthly", name: "Monthly Swaps", price: 0, description: "Add monthly store swaps (pricing TBD)" },
  { id: "seat", name: "Extra Seat", price: 10, description: "Add one team member" },
  { id: "pdf", name: "Weekly PDF", price: 49, description: "Weekly market summary email" },
  { id: "archive", name: "12-mo Archive", price: 79, description: "Extended historical data" },
  { id: "api", name: "API Access", price: 199, description: "Full API access" },
];

// BC Stores (mock directory)
export const BC_STORES: Store[] = [
  { id: "s1", name: "City Cannabis Co", chain: "City Cannabis", city: "Vancouver", address: "123 Main St" },
  { id: "s2", name: "Evergreen Cannabis Society", chain: "Evergreen", city: "Vancouver", address: "456 Oak St" },
  { id: "s3", name: "Burb Cannabis", chain: "Burb", city: "Burnaby", address: "789 Central Blvd" },
  { id: "s4", name: "Tokyo Smoke - Robson", chain: "Tokyo Smoke", city: "Vancouver", address: "321 Robson St" },
  { id: "s5", name: "Spiritleaf Victoria", chain: "Spiritleaf", city: "Victoria", address: "555 Douglas St" },
  { id: "s6", name: "Meta Cannabis Co", chain: "Meta", city: "Vancouver", address: "111 Granville St" },
  { id: "s7", name: "Kiaro Kelowna", chain: "Kiaro", city: "Kelowna", address: "222 Water St" },
  { id: "s8", name: "Choom Kamloops", chain: "Choom", city: "Kamloops", address: "333 Victoria St" },
  { id: "s9", name: "Hobo Cannabis - Hastings", chain: "Hobo", city: "Vancouver", address: "444 Hastings St" },
  { id: "s10", name: "EGGS Cannabis", chain: "EGGS", city: "Vancouver", address: "777 Broadway" },
  { id: "s11", name: "Fire & Flower Surrey", chain: "Fire & Flower", city: "Surrey", address: "888 King George" },
  { id: "s12", name: "Budders Cannabis Abbotsford", chain: "Budders", city: "Abbotsford", address: "999 South Fraser Way" },
  { id: "s13", name: "The Hunny Pot Whistler", chain: "Hunny Pot", city: "Whistler", address: "121 Village Gate" },
  { id: "s14", name: "Canna Cabana Richmond", chain: "Canna Cabana", city: "Richmond", address: "131 Westminster Hwy" },
  { id: "s15", name: "Sessions Cannabis Victoria", chain: "Sessions", city: "Victoria", address: "141 Yates St" },
];

// Mock Products
const MOCK_PRODUCTS: Product[] = [
  { id: "p1", brand: "Broken Coast", name: "Sunset Sherbet", category: "Flower" },
  { id: "p2", brand: "Simply Bare", name: "Blue Dream", category: "Flower" },
  { id: "p3", brand: "REDECAN", name: "Redees Pre-Rolls", category: "Pre-Rolls" },
  { id: "p4", brand: "Spinach", name: "Blue Dream", category: "Flower" },
  { id: "p5", brand: "Good Supply", name: "Pineapple Express", category: "Flower" },
];

// Mock Variants
export const MOCK_VARIANTS: Variant[] = [
  {
    id: "v1",
    productId: "p1",
    product: MOCK_PRODUCTS[0],
    size: "3.5g",
    thc: "22%",
    cbd: "0.5%",
    coverage: 12,
    minPrice: 36.99,
    medianPrice: 39.99,
    p90Price: 44.99,
    delta7d: -2.3,
  },
  {
    id: "v2",
    productId: "p1",
    product: MOCK_PRODUCTS[0],
    size: "7g",
    thc: "22%",
    cbd: "0.5%",
    coverage: 10,
    minPrice: 69.99,
    medianPrice: 74.99,
    p90Price: 79.99,
    delta7d: 1.2,
  },
  {
    id: "v3",
    productId: "p2",
    product: MOCK_PRODUCTS[1],
    size: "3.5g",
    thc: "24%",
    cbd: "0.2%",
    coverage: 15,
    minPrice: 34.99,
    medianPrice: 37.99,
    p90Price: 42.99,
    delta7d: -0.5,
  },
  {
    id: "v4",
    productId: "p3",
    product: MOCK_PRODUCTS[2],
    size: "10pk",
    thc: "18%",
    cbd: "0%",
    coverage: 14,
    minPrice: 24.99,
    medianPrice: 27.99,
    p90Price: 29.99,
    delta7d: 0,
  },
];

// Alert Templates
export const ALERT_TEMPLATES: Omit<AlertRule, "id" | "enabled">[] = [
  {
    type: "undercut",
    name: "Price Undercut",
    description: "Alert when a competitor prices below you",
    config: { threshold: 10 },
  },
  {
    type: "new_sku",
    name: "New SKU",
    description: "Alert when watched brands add new products",
    config: { brands: ["Broken Coast", "Simply Bare"] },
  },
  {
    type: "back_in_stock",
    name: "Back in Stock",
    description: "Alert when previously out-of-stock items return",
    config: {},
  },
  {
    type: "median_move",
    name: "Market Median Shift",
    description: "Alert on significant market median changes",
    config: { threshold: 5 },
  },
  {
    type: "rank_loss",
    name: "Rank Loss",
    description: "Alert when your price rank drops",
    config: { threshold: 2 },
  },
];

