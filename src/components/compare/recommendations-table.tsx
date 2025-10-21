"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronRight, Check, Clock, ExternalLink, AlertCircle } from "lucide-react";
import { suggestPrice, type Strategy, type LadderPoint, type MarketStats } from "@/lib/services/coach";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { MiniSparkline } from "@/components/catalog/mini-sparkline";

interface RecommendationsTableProps {
  strategy: string;
}

export function RecommendationsTable({ strategy }: RecommendationsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Set<string>>(new Set());

  // Mock recommendations data
  const recommendations = generateMockRecommendations(strategy as Strategy);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const toggleAccept = (id: string) => {
    const newAccepted = new Set(acceptedSuggestions);
    if (newAccepted.has(id)) {
      newAccepted.delete(id);
    } else {
      newAccepted.add(id);
    }
    setAcceptedSuggestions(newAccepted);
  };

  const filteredRecs = recommendations.filter((rec) => {
    if (search && !rec.product.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "overpriced" && rec.gapPercent <= 0) return false;
    if (filter === "underpriced" && rec.gapPercent >= 0) return false;
    if (filter === "low_confidence" && rec.confidence >= 70) return false;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Price Recommendations</CardTitle>
            <CardDescription>
              Smart pricing suggestions based on your selected strategy
            </CardDescription>
          </div>
          <Badge variant="secondary">{acceptedSuggestions.size} accepted</Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="overpriced">Only Overpriced</SelectItem>
              <SelectItem value="underpriced">Only Underpriced</SelectItem>
              <SelectItem value="low_confidence">Low Confidence</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {filteredRecs.map((rec) => {
            const isExpanded = expandedRows.has(rec.id);
            const isAccepted = acceptedSuggestions.has(rec.id);

            return (
              <div key={rec.id} className="border rounded-lg overflow-hidden">
                {/* Main Row */}
                <div
                  className={`p-4 hover:bg-accent/50 transition-colors ${isAccepted ? "bg-green-50" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => toggleRow(rec.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-7 gap-4 items-start">
                      {/* Product */}
                      <div className="md:col-span-2">
                        <div className="font-medium">{rec.product}</div>
                        <div className="text-sm text-muted-foreground">{rec.size}</div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {rec.category}
                        </Badge>
                      </div>

                      {/* Your Price */}
                      <div>
                        <div className="text-xs text-muted-foreground">Your Price</div>
                        <div className="font-semibold">{formatCurrency(rec.yourPrice)}</div>
                      </div>

                      {/* Market */}
                      <div>
                        <div className="text-xs text-muted-foreground">Market Median</div>
                        <div className="font-semibold">{formatCurrency(rec.market.median)}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {rec.market.count} stores
                        </div>
                      </div>

                      {/* Rank / Gap */}
                      <div>
                        <div className="text-xs text-muted-foreground">Rank / Gap</div>
                        <div className="font-semibold">#{rec.currentRank}</div>
                        <div className={`text-xs font-medium ${rec.gapPercent > 0 ? "text-red-600" : "text-green-600"}`}>
                          {rec.gapPercent > 0 ? "+" : ""}{rec.gapPercent.toFixed(1)}%
                        </div>
                      </div>

                      {/* Suggested */}
                      <div>
                        <div className="text-xs text-muted-foreground">Suggested</div>
                        <div className="font-bold text-primary">{formatCurrency(rec.suggested)}</div>
                        <div className="text-xs text-muted-foreground">
                          Rank #{rec.expectedRank}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={isAccepted ? "default" : "outline"}
                          onClick={() => toggleAccept(rec.id)}
                        >
                          {isAccepted ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Accepted
                            </>
                          ) : (
                            "Accept"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Confidence Badge */}
                  {rec.confidence < 70 && (
                    <div className="mt-2 ml-12">
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Low Confidence ({rec.confidence}%)
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 bg-accent/20 border-t">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left: Ladder Snippet */}
                      <div>
                        <h4 className="font-semibold text-sm mb-3">Price Ladder (Top 6)</h4>
                        <div className="space-y-2">
                          {rec.ladder.slice(0, 6).map((point, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 border rounded bg-background"
                            >
                              <div>
                                <div className="text-sm font-medium">{point.storeName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {point.isSale && <Badge variant="destructive" className="text-xs mr-1">Sale</Badge>}
                                  2h ago
                                </div>
                              </div>
                              <div className="font-semibold">{formatCurrency(point.price)}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Trend & Events */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-3">30-Day Price Trend</h4>
                          <div className="h-24 bg-background border rounded p-2">
                            <MiniSparkline data={rec.priceHistory} />
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm mb-3">Recent Events</h4>
                          <div className="space-y-2">
                            {rec.recentEvents.map((event, idx) => (
                              <div key={idx} className="text-sm p-2 border rounded bg-background">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">{event.timestamp}</span>
                                </div>
                                <div className="mt-1">{event.description}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredRecs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No recommendations match your filters
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper to generate mock recommendations
function generateMockRecommendations(strategy: Strategy) {
  const products = [
    { id: "1", product: "Broken Coast Sunset Sherbet", size: "3.5g", category: "Flower" },
    { id: "2", product: "Simply Bare Blue Dream", size: "3.5g", category: "Flower" },
    { id: "3", product: "REDECAN Redees Pre-Rolls", size: "10pk", category: "Pre-Rolls" },
    { id: "4", product: "Spinach Blue Dream", size: "3.5g", category: "Flower" },
    { id: "5", product: "Good Supply Pineapple Express", size: "3.5g", category: "Flower" },
  ];

  return products.map((p) => {
    const yourPrice = 35 + Math.random() * 15;
    const market: MarketStats = {
      min: yourPrice - 5 - Math.random() * 3,
      median: yourPrice - 2 + Math.random() * 4,
      p90: yourPrice + 3 + Math.random() * 5,
      count: 8 + Math.floor(Math.random() * 4),
    };

    const ladder: LadderPoint[] = Array.from({ length: 12 }, (_, i) => ({
      storeId: `s${i}`,
      storeName: `Store ${i + 1}`,
      price: market.min + (i / 12) * (market.p90 - market.min),
      lastSeen: new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000).toISOString(),
      isSale: Math.random() > 0.8,
    }));

    const suggestion = suggestPrice({
      yourPrice,
      market,
      ladder,
      strategy,
    });

    const currentRank = ladder.filter((l) => l.price < yourPrice).length + 1;
    const gapPercent = ((yourPrice - market.median) / market.median) * 100;

    return {
      ...p,
      yourPrice,
      market,
      ladder,
      currentRank,
      gapPercent,
      suggested: suggestion.suggested,
      expectedRank: suggestion.expectedRank,
      confidence: 75 + Math.floor(Math.random() * 25),
      priceHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        price: yourPrice + Math.random() * 4 - 2,
      })),
      recentEvents: [
        { timestamp: "2h ago", description: "Evergreen Cannabis lowered price by $1.50" },
        { timestamp: "1d ago", description: "Back in stock at 2 stores" },
      ],
    };
  });
}


