// Realistic BC Cannabis Market Data for Market Advisor

export const bcCannabisProducts = {
  // Premium Flower (typically $35-50)
  premiumFlower: [
    { name: "Broken Coast Sonora 3.5g", brand: "Broken Coast", avgPrice: 43.99, range: [41.99, 46.99] },
    { name: "Broken Coast Sunset Sherbet 3.5g", brand: "Broken Coast", avgPrice: 42.99, range: [40.99, 44.99] },
    { name: "Simply Bare Creek Congo 3.5g", brand: "Simply Bare", avgPrice: 41.99, range: [39.99, 43.99] },
    { name: "7ACRES Sensi Star 3.5g", brand: "7ACRES", avgPrice: 38.99, range: [36.99, 40.99] },
    { name: "Tantalus Labs Blue Dream 3.5g", brand: "Tantalus", avgPrice: 37.99, range: [35.99, 39.99] },
  ],
  
  // Value Flower (typically $22-35)
  valueFlower: [
    { name: "Spinach Blue Dream 3.5g", brand: "Spinach", avgPrice: 27.99, range: [25.99, 29.99] },
    { name: "REDECAN Wappa 3.5g", brand: "REDECAN", avgPrice: 24.99, range: [22.99, 26.99] },
    { name: "Good Supply Jean Guy 3.5g", brand: "Good Supply", avgPrice: 23.99, range: [21.99, 25.99] },
    { name: "Pure Sunfarms White Rhino 3.5g", brand: "Pure Sunfarms", avgPrice: 22.99, range: [20.99, 24.99] },
    { name: "Aurora Drift Indica 3.5g", brand: "Aurora", avgPrice: 26.99, range: [24.99, 28.99] },
  ],
  
  // Ounces (typically $100-180)
  ounces: [
    { name: "Good Supply Grower's Choice 28g", brand: "Good Supply", avgPrice: 119.99, range: [109.99, 129.99] },
    { name: "TGOD Organic Sugar Bush 28g", brand: "TGOD", avgPrice: 159.99, range: [149.99, 169.99] },
    { name: "Simply Bare Organic Congo 28g", brand: "Simply Bare", avgPrice: 179.99, range: [169.99, 189.99] },
    { name: "Spinach Diesel 28g", brand: "Spinach", avgPrice: 129.99, range: [119.99, 139.99] },
  ],
  
  // Pre-Rolls (typically $6-15 per unit or $25-40 for packs)
  preRolls: [
    { name: "REDECAN Redees 10pk", brand: "REDECAN", avgPrice: 34.99, range: [31.99, 37.99] },
    { name: "Spinach Diesel Pre-Rolls 3pk", brand: "Spinach", avgPrice: 21.99, range: [19.99, 23.99] },
    { name: "FIGR No. 17 Pre-Rolls 10pk", brand: "FIGR", avgPrice: 38.99, range: [35.99, 41.99] },
    { name: "Good Supply Sativa Pre-Roll 1g", brand: "Good Supply", avgPrice: 6.99, range: [5.99, 7.99] },
    { name: "7ACRES Sensi Star Pre-Roll 3pk", brand: "7ACRES", avgPrice: 29.99, range: [27.99, 31.99] },
  ],
  
  // Concentrates & Extracts (typically $35-70)
  concentrates: [
    { name: "Simply Bare Live Rosin 1g", brand: "Simply Bare", avgPrice: 51.99, range: [47.99, 55.99] },
    { name: "Greybeard Live Resin 1g", brand: "Greybeard", avgPrice: 48.99, range: [45.99, 51.99] },
    { name: "7ACRES Craft Rosin 1g", brand: "7ACRES", avgPrice: 42.99, range: [39.99, 45.99] },
    { name: "Broken Coast Live Terp Sauce 1g", brand: "Broken Coast", avgPrice: 45.99, range: [42.99, 48.99] },
  ],
  
  // Vapes (typically $35-55)
  vapes: [
    { name: "Good Supply Sativa 510 Cart 1g", brand: "Good Supply", avgPrice: 32.99, range: [29.99, 35.99] },
    { name: "Kolab Project 232 Series Cart 1g", brand: "Kolab", avgPrice: 44.99, range: [41.99, 47.99] },
    { name: "FIGR King Kush Cart 0.5g", brand: "FIGR", avgPrice: 24.99, range: [22.99, 26.99] },
    { name: "Back Forty Strawberry Cream Cart 1g", brand: "Back Forty", avgPrice: 38.99, range: [35.99, 41.99] },
  ],
};

export const bcStores = [
  { name: "Evergreen Cannabis Society", city: "Vancouver", chain: false },
  { name: "Spiritleaf", city: "Victoria", chain: true },
  { name: "Meta Cannabis Co", city: "Vancouver", chain: false },
  { name: "City Cannabis Co", city: "Vancouver", chain: false },
  { name: "BC Cannabis Store", city: "Vancouver", chain: true },
  { name: "Burb Cannabis", city: "Surrey", chain: false },
  { name: "Canna Cabana", city: "Vancouver", chain: true },
  { name: "Fire & Flower", city: "Richmond", chain: true },
];

// Generate realistic price recommendations
export function generatePriceRecommendations(strategy: "median" | "win" | "hold" | "custom" = "median") {
  const products = [
    ...bcCannabisProducts.premiumFlower.slice(0, 2),
    ...bcCannabisProducts.valueFlower.slice(0, 2),
    ...bcCannabisProducts.preRolls.slice(0, 1),
    ...bcCannabisProducts.concentrates.slice(0, 1),
  ];
  
  return products.map((product, idx) => {
    const [minPrice, maxPrice] = product.range;
    const marketMedian = product.avgPrice;
    
    // Your price is randomly positioned within or outside the range
    const yourPrice = idx % 3 === 0 
      ? marketMedian + (Math.random() * 3 + 1) // Above market
      : idx % 3 === 1
      ? marketMedian - (Math.random() * 2 + 0.5) // Below market
      : marketMedian + (Math.random() * 1 - 0.5); // Near market
    
    const gap = yourPrice - marketMedian;
    const gapPercent = (gap / marketMedian) * 100;
    
    let suggestedPrice = marketMedian;
    let reason = "Match market median to stay competitive";
    
    if (strategy === "win") {
      suggestedPrice = minPrice * 0.99;
      reason = "Beat lowest competitor price to win the aisle";
    } else if (strategy === "hold") {
      suggestedPrice = marketMedian;
      reason = "Hold position within p40-p60 margin band";
    }
    
    const currentRank = gap > 2 ? 7 : gap > 0 ? 5 : gap > -2 ? 3 : 2;
    const expectedRank = Math.max(1, Math.min(8, currentRank - Math.floor(Math.abs(gap) / 2)));
    
    return {
      id: idx + 1,
      product: product.name,
      brand: product.brand,
      category: product.name.includes("Pre-Roll") ? "Pre-Rolls" : 
                product.name.includes("Rosin") || product.name.includes("Resin") ? "Concentrates" :
                "Flower",
      yourPrice: Number(yourPrice.toFixed(2)),
      marketMin: minPrice,
      marketMedian,
      marketP90: maxPrice,
      suggestedPrice: Number(suggestedPrice.toFixed(2)),
      expectedRank,
      currentRank,
      gap: Number(gap.toFixed(2)),
      gapPercent: Number(gapPercent.toFixed(1)),
      confidence: Math.floor(85 + Math.random() * 12),
      reason,
      impact: gap > 0 
        ? `Potential +$${Math.floor(Math.abs(gap) * 200 * (1 + Math.random()))}/mo from increased volume`
        : `Potential +$${Math.floor(Math.abs(gap) * 100 * (1 + Math.random()))}/mo from improved margin`,
    };
  });
}

// Generate realistic sales opportunities
export function generateSalesOpportunities() {
  const saleProducts = [
    ...bcCannabisProducts.valueFlower.slice(0, 2),
    ...bcCannabisProducts.ounces.slice(0, 1),
    ...bcCannabisProducts.preRolls.slice(1, 2),
  ];
  
  return saleProducts.map((product, idx) => {
    const competitorsOnSale = Math.floor(Math.random() * 4) + 2;
    const avgDiscount = 10 + Math.random() * 15;
    const competitorSalePrice = product.avgPrice * (1 - avgDiscount / 100);
    
    return {
      id: idx + 1,
      product: product.name,
      brand: product.brand,
      category: product.name.includes("28g") ? "Flower" : 
                product.name.includes("Pre-Roll") ? "Pre-Rolls" : "Flower",
      yourPrice: product.avgPrice,
      competitorSalePrice: Number(competitorSalePrice.toFixed(2)),
      competitorsOnSale,
      totalCompetitors: 8,
      avgDiscount: Number(avgDiscount.toFixed(1)),
      recommendation: `Run ${Math.ceil(avgDiscount)}% off sale ($${(product.avgPrice * (1 - avgDiscount / 100)).toFixed(2)})`,
      reason: competitorsOnSale >= 4 
        ? "Half+ competitors running promotions - must match to stay visible"
        : competitorsOnSale >= 3
        ? "Multiple competitors on sale - price-sensitive segment"
        : "Opportunity for flash sale to drive traffic",
      urgency: competitorsOnSale >= 4 ? "high" : competitorsOnSale >= 3 ? "medium" : "low",
      estimatedImpact: `+${20 + Math.floor(Math.random() * 25)}% unit sales during promo period`,
    };
  });
}

// Generate realistic inventory insights
export function generateInventoryInsights() {
  const insights = [
    {
      id: 1,
      product: "Pure Sunfarms White Rhino 3.5g",
      brand: "Pure Sunfarms",
      category: "Flower",
      insight: "Fast Mover - Stock More",
      avgDaysInStock: 2.3,
      restockFrequency: "Every 2-3 days across market",
      coverage: 95,
      recommendation: "Increase order quantity by 30-40%",
      reason: "Consistently sells out within 2-3 days at most stores. Popular value strain.",
      icon: "fast" as const,
      color: "green" as const,
    },
    {
      id: 2,
      product: "Tantalus Labs Blue Dream 3.5g",
      brand: "Tantalus",
      category: "Flower",
      insight: "High Coverage - Consider Stocking",
      avgDaysInStock: 6.5,
      restockFrequency: "Weekly",
      coverage: 88,
      recommendation: "Add to core inventory",
      reason: "88% of tracked stores carry this SKU. Customer expectations high for this strain.",
      icon: "add" as const,
      color: "blue" as const,
    },
    {
      id: 3,
      product: "Aurora Drift Indica 3.5g",
      brand: "Aurora",
      category: "Flower",
      insight: "Slow Mover - Reduce Stock",
      avgDaysInStock: 18.5,
      restockFrequency: "Monthly or less",
      coverage: 42,
      recommendation: "Reduce reorder by 50% or discontinue",
      reason: "Low turnover and declining market coverage suggest waning demand.",
      icon: "slow" as const,
      color: "orange" as const,
    },
    {
      id: 4,
      product: "FIGR No. 17 Pre-Rolls 10pk",
      brand: "FIGR",
      category: "Pre-Rolls",
      insight: "Trending Up - Stock Now",
      avgDaysInStock: 3.8,
      restockFrequency: "Twice weekly",
      coverage: 78,
      recommendation: "Add to inventory immediately",
      reason: "New product gaining rapid market adoption (0% to 78% coverage in 6 weeks). Fast mover.",
      icon: "trending" as const,
      color: "purple" as const,
    },
    {
      id: 5,
      product: "Simply Bare Live Rosin 1g",
      brand: "Simply Bare",
      category: "Concentrates",
      insight: "Premium Fast Mover",
      avgDaysInStock: 4.2,
      restockFrequency: "Weekly",
      coverage: 85,
      recommendation: "Maintain steady stock levels",
      reason: "Premium concentrate with consistent demand. High margin and reliable velocity.",
      icon: "fast" as const,
      color: "green" as const,
    },
  ];
  
  return insights;
}

// Generate realistic market alerts
export function generateMarketAlerts() {
  return [
    {
      id: 1,
      type: "removal_trend" as const,
      product: "Tweed Penelope 3.5g",
      brand: "Tweed",
      category: "Flower",
      severity: "high" as const,
      details: "Removed from 5 of 8 tracked stores in past 10 days",
      storesAffected: ["City Cannabis Co", "Fire & Flower", "Canna Cabana", "Burb Cannabis", "Spiritleaf"],
      recommendation: "Likely discontinued by LP - consider clearance pricing if you have stock",
      action: "Check with distributor for product status. Clear inventory at 20-30% off.",
    },
    {
      id: 2,
      type: "oos_trend" as const,
      product: "Broken Coast Sonora 3.5g",
      brand: "Broken Coast",
      category: "Flower",
      severity: "medium" as const,
      details: "Out of stock at 6 of 8 stores for 4+ days",
      storesAffected: ["Evergreen Cannabis", "Meta Cannabis", "BC Cannabis Store", "City Cannabis", "Fire & Flower", "Spiritleaf"],
      recommendation: "Supply constraint or batch delay - premium pricing opportunity if you have stock",
      action: "If in stock, consider $2-3 premium. Monitor Broken Coast's other SKUs.",
    },
    {
      id: 3,
      type: "restock_pattern" as const,
      product: "Spinach Diesel Pre-Rolls 3pk",
      brand: "Spinach",
      category: "Pre-Rolls",
      severity: "low" as const,
      details: "Mass restock at 7 stores within 48 hours",
      storesAffected: ["All major competitors"],
      recommendation: "Fresh shipment arrived - expect competitive pricing and potential promotions",
      action: "Monitor competitor pricing for next 3-5 days. May see 10-15% off sales.",
    },
    {
      id: 4,
      type: "market_exit" as const,
      product: "Edison Limelight 3.5g",
      brand: "Edison",
      category: "Flower",
      severity: "high" as const,
      details: "Removed from all 8 tracked stores over 14 days",
      storesAffected: ["All tracked stores"],
      recommendation: "Product discontinued by Organigram - immediate clearance sale needed",
      action: "Clear remaining stock at 30-40% off. Replace with similar strain (Edison Ice Cream Cake or Slurricane).",
    },
    {
      id: 5,
      type: "removal_trend" as const,
      product: "7ACRES Craft Collective 3.5g",
      brand: "7ACRES",
      category: "Flower",
      severity: "medium" as const,
      details: "Removed from 3 stores in past 7 days",
      storesAffected: ["Meta Cannabis", "Burb Cannabis", "City Cannabis"],
      recommendation: "Possible rebranding or batch issue - monitor situation",
      action: "Check with distributor. May be temporary shortage or packaging change.",
    },
  ];
}


