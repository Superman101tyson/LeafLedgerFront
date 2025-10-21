/**
 * Mock Market Events Generator
 * Creates realistic "Today's Moves" events for the dashboard
 */

import { PRODUCTS, STORES, CURRENT_PRICES } from "./mock-data-generator";

export interface MarketEvent {
  id: string;
  type: "price_change" | "new_sku" | "restock" | "out_of_stock" | "sale_started" | "sale_ended";
  timestamp: Date;
  storeId: string;
  storeName: string;
  productName: string;
  brandName: string;
  details: string;
  priceChange?: {
    oldPrice: number;
    newPrice: number;
    percentChange: number;
  };
  severity?: "high" | "medium" | "low";
}

/**
 * Generate realistic market events for "Today's Moves"
 */
export function generateTodaysMoves(count: number = 20): MarketEvent[] {
  const events: MarketEvent[] = [];
  const now = new Date();
  
  const eventTypes: MarketEvent["type"][] = [
    "price_change",
    "price_change",
    "price_change", // More price changes
    "new_sku",
    "restock",
    "restock",
    "out_of_stock",
    "sale_started",
    "sale_ended",
  ];
  
  for (let i = 0; i < count; i++) {
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const store = STORES[Math.floor(Math.random() * STORES.length)];
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    
    // Timestamp within last 24 hours
    const hoursAgo = Math.random() * 24;
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    
    let event: MarketEvent = {
      id: `event-${i}`,
      type,
      timestamp,
      storeId: store.id,
      storeName: store.name,
      productName: product.name,
      brandName: product.brand,
      details: "",
    };
    
    switch (type) {
      case "price_change": {
        const oldPrice = 30 + Math.random() * 20;
        const changePercent = (Math.random() - 0.6) * 12; // -7.2% to +4.8%
        const newPrice = oldPrice * (1 + changePercent / 100);
        
        event.priceChange = {
          oldPrice: Math.round(oldPrice * 100) / 100,
          newPrice: Math.round(newPrice * 100) / 100,
          percentChange: Math.round(changePercent * 10) / 10,
        };
        
        event.severity = Math.abs(changePercent) > 5 ? "high" : Math.abs(changePercent) > 2 ? "medium" : "low";
        
        event.details = `Price ${changePercent > 0 ? "increased" : "decreased"} from $${event.priceChange.oldPrice.toFixed(2)} to $${event.priceChange.newPrice.toFixed(2)} (${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}%)`;
        break;
      }
      
      case "new_sku": {
        const price = 30 + Math.random() * 25;
        event.details = `New product launched at $${price.toFixed(2)}`;
        event.severity = "medium";
        break;
      }
      
      case "restock": {
        const daysOut = Math.floor(Math.random() * 5) + 1;
        event.details = `Back in stock after ${daysOut} day${daysOut > 1 ? "s" : ""}`;
        event.severity = "low";
        break;
      }
      
      case "out_of_stock": {
        event.details = `Went out of stock`;
        event.severity = "low";
        break;
      }
      
      case "sale_started": {
        const discount = 10 + Math.random() * 15;
        event.details = `Sale started - ${discount.toFixed(0)}% off`;
        event.severity = "high";
        break;
      }
      
      case "sale_ended": {
        event.details = `Sale ended - returned to regular price`;
        event.severity = "low";
        break;
      }
    }
    
    events.push(event);
  }
  
  // Sort by timestamp (most recent first)
  events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  return events;
}

/**
 * Get events filtered by type
 */
export function filterEventsByType(events: MarketEvent[], type: MarketEvent["type"]) {
  return events.filter((e) => e.type === type);
}

/**
 * Get events filtered by store
 */
export function filterEventsByStore(events: MarketEvent[], storeId: string) {
  return events.filter((e) => e.storeId === storeId);
}

/**
 * Get high-severity events (significant price changes, new SKUs, sales)
 */
export function getHighSeverityEvents(events: MarketEvent[]) {
  return events.filter((e) => e.severity === "high");
}

// Export a default set of today's events
export const TODAYS_MOVES = generateTodaysMoves(25);


