/**
 * Price Coach Algorithm Service
 * Provides smart pricing recommendations based on market data
 */

export type LadderPoint = {
  storeId: string;
  storeName: string;
  price: number;
  lastSeen: string;
  isSale: boolean;
};

export type MarketStats = {
  min: number;
  median: number;
  p90: number;
  count: number;
};

export type Strategy = "median" | "win" | "hold" | "custom";

export type SuggestionInput = {
  yourPrice: number;
  market: MarketStats;
  ladder: LadderPoint[];
  strategy: Strategy;
  params?: {
    belowMinPct?: number;
    band?: [number, number];
    deltaPct?: number;
  };
};

export type Guardrail = "ok" | "low_sample" | "stale" | "low_confidence";

export type Suggestion = {
  suggested: number;
  reason: string;
  expectedRank: number;
  guardrail: Guardrail;
};

/**
 * Calculate rank of a given price in the ladder
 */
export function rankInLadder(price: number, ladder: LadderPoint[]): number {
  const sorted = [...ladder].sort((a, b) => a.price - b.price);
  const rank = sorted.findIndex((p) => p.price >= price);
  return rank === -1 ? sorted.length + 1 : rank + 1;
}

/**
 * Round price to nearest $0.10
 */
function roundToTenth(price: number): number {
  return Math.round(price * 10) / 10;
}

/**
 * Check if data is stale (more than 48 hours old)
 */
function isStale(lastSeen: string): boolean {
  const hoursSince = (Date.now() - new Date(lastSeen).getTime()) / (1000 * 60 * 60);
  return hoursSince > 48;
}

/**
 * Generate smart pricing suggestion based on strategy
 */
export function suggestPrice(input: SuggestionInput): Suggestion {
  const { yourPrice, market, ladder, strategy, params = {} } = input;

  // Guardrail checks
  if (market.count < 4) {
    return {
      suggested: yourPrice,
      reason: "Insufficient market data (need ≥4 stores)",
      expectedRank: rankInLadder(yourPrice, ladder),
      guardrail: "low_sample",
    };
  }

  const hasStale = ladder.some((p) => isStale(p.lastSeen));
  if (hasStale) {
    // Still provide suggestion but flag as stale
  }

  let suggested: number;
  let reason: string;

  switch (strategy) {
    case "median": {
      suggested = roundToTenth(market.median);
      reason = `Match market median of ${formatPrice(market.median)}`;
      break;
    }

    case "win": {
      const belowMinPct = params.belowMinPct || 0.01; // 1% below min
      const minPrice = Math.min(...ladder.map((p) => p.price));
      suggested = roundToTenth(minPrice * (1 - belowMinPct));
      reason = `Win the aisle: ${(belowMinPct * 100).toFixed(1)}% below market min`;
      break;
    }

    case "hold": {
      const [lowPct, highPct] = params.band || [0.4, 0.6]; // p40-p60 by default
      const sortedPrices = ladder.map((p) => p.price).sort((a, b) => a - b);
      const lowIdx = Math.floor(sortedPrices.length * lowPct);
      const highIdx = Math.floor(sortedPrices.length * highPct);
      const targetBand = [sortedPrices[lowIdx], sortedPrices[highIdx]];

      if (yourPrice < targetBand[0]) {
        suggested = roundToTenth(targetBand[0]);
        reason = `Increase to lower band (p${Math.round(lowPct * 100)})`;
      } else if (yourPrice > targetBand[1]) {
        suggested = roundToTenth(targetBand[1]);
        reason = `Decrease to upper band (p${Math.round(highPct * 100)})`;
      } else {
        suggested = yourPrice;
        reason = `Currently within target band (p${Math.round(lowPct * 100)}-p${Math.round(highPct * 100)})`;
      }
      break;
    }

    case "custom": {
      const deltaPct = params.deltaPct || 0;
      suggested = roundToTenth(market.median * (1 + deltaPct / 100));
      reason = `Custom delta: ${deltaPct > 0 ? "+" : ""}${deltaPct}% from median`;
      break;
    }

    default:
      suggested = market.median;
      reason = "Match market median";
  }

  // Ensure suggested price has minimum step size of $0.10
  if (Math.abs(suggested - yourPrice) < 0.10 && suggested !== yourPrice) {
    suggested = yourPrice;
    reason = "No change recommended (difference < $0.10)";
  }

  const expectedRank = rankInLadder(suggested, ladder);

  return {
    suggested,
    reason,
    expectedRank,
    guardrail: hasStale ? "stale" : "ok",
  };
}

/**
 * Calculate popularity score (0-100)
 */
export function popularityScore(
  coveragePct: number,
  promoRate: number,
  arrivals: number
): number {
  const coverageScore = coveragePct * 0.6;
  const promoScore = promoRate * 100 * 0.25;
  const churnScore = Math.min(arrivals / 10, 1) * 100 * 0.15;

  return Math.min(Math.round(coverageScore + promoScore + churnScore), 100);
}

/**
 * Calculate confidence score based on data quality
 */
export function confidenceScore(
  storeCount: number,
  recencyHours: number,
  mappingConfidence: number
): number {
  let score = 100;

  // Sample size penalty
  if (storeCount < 4) score -= 40;
  else if (storeCount < 8) score -= 20;
  else if (storeCount < 12) score -= 10;

  // Recency penalty
  if (recencyHours > 48) score -= 30;
  else if (recencyHours > 24) score -= 15;
  else if (recencyHours > 12) score -= 5;

  // Mapping confidence penalty
  if (mappingConfidence < 0.8) score -= 20;
  else if (mappingConfidence < 0.9) score -= 10;

  return Math.max(score, 0);
}

/**
 * Format price for display
 */
function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Calculate gap to median ($ and %)
 */
export function gapToMedian(yourPrice: number, median: number): { dollars: number; percent: number } {
  return {
    dollars: yourPrice - median,
    percent: ((yourPrice - median) / median) * 100,
  };
}


