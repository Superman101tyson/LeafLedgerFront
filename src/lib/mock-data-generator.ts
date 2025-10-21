/**
 * Comprehensive Mock Data Generator with 90-Day History
 * Generates realistic cannabis market data for LeafLedger
 */

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "Flower" | "Pre-Rolls" | "Vapes" | "Edibles" | "Concentrates";
  thc: number;
  cbd: number;
}

export interface Store {
  id: string;
  name: string;
  chain: string | null;
  city: string;
  address: string;
}

export interface PricePoint {
  storeId: string;
  variantId: string;
  price: number;
  isSale: boolean;
  inStock: boolean;
  lastSeen: Date;
}

export interface PriceHistory {
  date: Date;
  storeId: string;
  variantId: string;
  price: number;
  isSale: boolean;
  inStock: boolean;
}

// BC Stores
export const STORES: Store[] = [
  { id: "s1", name: "City Cannabis Co", chain: null, city: "Vancouver", address: "123 Main St" },
  { id: "s2", name: "Evergreen Cannabis Society", chain: null, city: "Vancouver", address: "456 Granville St" },
  { id: "s3", name: "Meta Cannabis Co", chain: "Meta", city: "Vancouver", address: "789 Broadway" },
  { id: "s4", name: "Spiritleaf Victoria", chain: "Spiritleaf", city: "Victoria", address: "321 Douglas St" },
  { id: "s5", name: "Tokyo Smoke - Robson", chain: "Tokyo Smoke", city: "Vancouver", address: "654 Robson St" },
  { id: "s6", name: "EGGS Cannabis", chain: null, city: "Vancouver", address: "987 Commercial Dr" },
  { id: "s7", name: "Kiaro Kelowna", chain: "Kiaro", city: "Kelowna", address: "147 Water St" },
  { id: "s8", name: "Burb Cannabis - Burnaby", chain: "Burb", city: "Burnaby", address: "258 Kingsway" },
  { id: "s9", name: "Nova Cannabis - Surrey", chain: "Nova", city: "Surrey", address: "369 Fraser Hwy" },
  { id: "s10", name: "Fire & Flower - Victoria", chain: "Fire & Flower", city: "Victoria", address: "741 Yates St" },
  { id: "s11", name: "Canna Cabana - Richmond", chain: "Canna Cabana", city: "Richmond", address: "852 No 3 Rd" },
  { id: "s12", name: "Value Buds - Vancouver", chain: "Value Buds", city: "Vancouver", address: "963 Hastings St" },
];

// Products
export const PRODUCTS: Product[] = [
  // Premium Flower
  { id: "p1", name: "Sunset Sherbet", brand: "Broken Coast", category: "Flower", thc: 22.5, cbd: 0.1 },
  { id: "p2", name: "Ruxton", brand: "Broken Coast", category: "Flower", thc: 20.8, cbd: 0.2 },
  { id: "p3", name: "Galiano", brand: "Broken Coast", category: "Flower", thc: 21.2, cbd: 0.1 },
  { id: "p4", name: "Blue Dream", brand: "Simply Bare", category: "Flower", thc: 24.3, cbd: 0.3 },
  { id: "p5", name: "Organic Creek Congo", brand: "Simply Bare", category: "Flower", thc: 23.1, cbd: 0.2 },
  { id: "p6", name: "Jack Haze", brand: "7ACRES", category: "Flower", thc: 19.7, cbd: 0.1 },
  { id: "p7", name: "Pink Bubba", brand: "San Rafael '71", category: "Flower", thc: 25.2, cbd: 0.2 },
  
  // Value Flower
  { id: "p8", name: "Blue Dream", brand: "Spinach", category: "Flower", thc: 21.0, cbd: 0.1 },
  { id: "p9", name: "Diesel", brand: "Spinach", category: "Flower", thc: 22.4, cbd: 0.1 },
  { id: "p10", name: "Wappa", brand: "REDECAN", category: "Flower", thc: 20.3, cbd: 0.5 },
  { id: "p11", name: "B.E.C", brand: "REDECAN", category: "Flower", thc: 18.9, cbd: 0.2 },
  { id: "p12", name: "Jean Guy", brand: "Good Supply", category: "Flower", thc: 19.2, cbd: 0.3 },
  { id: "p13", name: "Grower's Choice", brand: "Good Supply", category: "Flower", thc: 17.5, cbd: 0.2 },
  { id: "p14", name: "Pineapple Express", brand: "Good Supply", category: "Flower", thc: 20.1, cbd: 0.1 },
  { id: "p15", name: "Subway Scientist", brand: "RIFF", category: "Flower", thc: 19.8, cbd: 0.2 },
  
  // Pre-Rolls
  { id: "p16", name: "Redees Pre-Rolls", brand: "REDECAN", category: "Pre-Rolls", thc: 19.5, cbd: 0.3 },
  { id: "p17", name: "Pre-Roll Pack", brand: "Spinach", category: "Pre-Rolls", thc: 21.2, cbd: 0.1 },
  { id: "p18", name: "Island Honey", brand: "Edison", category: "Pre-Rolls", thc: 20.7, cbd: 0.2 },
  
  // Vapes
  { id: "p19", name: "Blueberry Kush 510", brand: "Good Supply", category: "Vapes", thc: 85.0, cbd: 0.5 },
  { id: "p20", name: "Tangerine Dream 510", brand: "San Rafael '71", category: "Vapes", thc: 87.3, cbd: 0.3 },
];

// Variants (size-specific products)
export interface Variant {
  id: string;
  productId: string;
  size: string;
  sizeGrams: number;
}

export const VARIANTS: Variant[] = [
  // 3.5g Flower
  ...PRODUCTS.filter((p) => p.category === "Flower").map((p, idx) => ({
    id: `v-${p.id}-3.5g`,
    productId: p.id,
    size: "3.5g",
    sizeGrams: 3.5,
  })),
  
  // 7g Flower (select products)
  { id: "v-p1-7g", productId: "p1", size: "7g", sizeGrams: 7.0 },
  { id: "v-p2-7g", productId: "p2", size: "7g", sizeGrams: 7.0 },
  { id: "v-p4-7g", productId: "p4", size: "7g", sizeGrams: 7.0 },
  { id: "v-p8-7g", productId: "p8", size: "7g", sizeGrams: 7.0 },
  
  // Pre-Rolls (10pk, 3pk)
  { id: "v-p16-10pk", productId: "p16", size: "10pk", sizeGrams: 5.0 },
  { id: "v-p17-10pk", productId: "p17", size: "10pk", sizeGrams: 5.0 },
  { id: "v-p18-3pk", productId: "p18", size: "3pk", sizeGrams: 1.5 },
  
  // Vapes (0.5g, 1g)
  { id: "v-p19-0.5g", productId: "p19", size: "0.5g", sizeGrams: 0.5 },
  { id: "v-p20-0.5g", productId: "p20", size: "0.5g", sizeGrams: 0.5 },
];

/**
 * Generate 90 days of price history for a variant at a store
 */
export function generate90DayPriceHistory(
  storeId: string,
  variantId: string,
  basePrice: number
): PriceHistory[] {
  const history: PriceHistory[] = [];
  const now = new Date();
  
  let currentPrice = basePrice;
  let isSale = false;
  let inStock = true;
  
  for (let daysAgo = 90; daysAgo >= 0; daysAgo--) {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0);
    
    // Price changes (5% chance per day)
    if (Math.random() < 0.05) {
      const change = (Math.random() - 0.4) * 4; // -1.6 to +2.4
      currentPrice = Math.max(15, currentPrice + change);
      currentPrice = Math.round(currentPrice * 100) / 100;
    }
    
    // Sales (2% chance to start, lasts 3-7 days)
    if (!isSale && Math.random() < 0.02) {
      isSale = true;
      currentPrice = currentPrice * 0.85; // 15% off
    } else if (isSale && Math.random() < 0.3) {
      isSale = false;
      currentPrice = currentPrice / 0.85; // back to regular
    }
    
    // Stock outs (1% chance, lasts 1-3 days)
    if (inStock && Math.random() < 0.01) {
      inStock = false;
    } else if (!inStock && Math.random() < 0.5) {
      inStock = true;
    }
    
    history.push({
      date,
      storeId,
      variantId,
      price: currentPrice,
      isSale,
      inStock,
    });
  }
  
  return history;
}

/**
 * Generate current price points for all variants across all stores
 */
export function generateCurrentPrices(): PricePoint[] {
  const pricePoints: PricePoint[] = [];
  
  for (const variant of VARIANTS) {
    const product = PRODUCTS.find((p) => p.id === variant.productId)!;
    
    // Base price depends on brand tier and size
    let basePrice = 30;
    if (["Broken Coast", "Simply Bare", "7ACRES", "San Rafael '71"].includes(product.brand)) {
      basePrice = 42;
    } else if (["REDECAN", "Spinach", "Good Supply", "RIFF"].includes(product.brand)) {
      basePrice = 28;
    }
    
    // Adjust for size
    if (variant.size === "7g") basePrice = basePrice * 1.85;
    if (variant.size === "10pk") basePrice = 35;
    if (variant.size === "3pk") basePrice = 15;
    if (variant.size === "0.5g" && product.category === "Vapes") basePrice = 32;
    
    // Coverage: premium brands 80-95%, value brands 70-90%
    const isPremium = basePrice > 40;
    const coveragePercent = isPremium ? 0.8 + Math.random() * 0.15 : 0.7 + Math.random() * 0.2;
    const numStores = Math.floor(STORES.length * coveragePercent);
    
    // Select random stores
    const selectedStores = STORES.slice().sort(() => Math.random() - 0.5).slice(0, numStores);
    
    for (const store of selectedStores) {
      // Each store has slight price variation
      const storeVariation = (Math.random() - 0.5) * 6; // ±$3
      const price = Math.max(15, Math.round((basePrice + storeVariation) * 100) / 100);
      
      pricePoints.push({
        storeId: store.id,
        variantId: variant.id,
        price,
        isSale: Math.random() < 0.15, // 15% on sale
        inStock: Math.random() < 0.92, // 92% in stock
        lastSeen: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000), // last 6 hours
      });
    }
  }
  
  return pricePoints;
}

/**
 * Generate full 90-day history for all variants and stores
 */
export function generateFullHistory(): PriceHistory[] {
  const allHistory: PriceHistory[] = [];
  const currentPrices = generateCurrentPrices();
  
  for (const pricePoint of currentPrices) {
    const history = generate90DayPriceHistory(
      pricePoint.storeId,
      pricePoint.variantId,
      pricePoint.price
    );
    allHistory.push(...history);
  }
  
  return allHistory;
}

/**
 * Get market stats for a variant
 */
export function getMarketStats(variantId: string, prices: PricePoint[]) {
  const variantPrices = prices
    .filter((p) => p.variantId === variantId && p.inStock)
    .map((p) => p.price)
    .sort((a, b) => a - b);
  
  if (variantPrices.length === 0) {
    return null;
  }
  
  const min = variantPrices[0];
  const max = variantPrices[variantPrices.length - 1];
  const median = variantPrices[Math.floor(variantPrices.length / 2)];
  const p90Index = Math.floor(variantPrices.length * 0.9);
  const p90 = variantPrices[p90Index];
  
  return {
    min,
    max,
    median,
    p90,
    count: variantPrices.length,
  };
}

// Export for use in components
export const CURRENT_PRICES = generateCurrentPrices();
export const FULL_HISTORY = generateFullHistory();


