"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, TrendingUp, Tag, Clock, ExternalLink } from "lucide-react";
import { popularityScore } from "@/lib/services/coach";

export function TrendsPanel() {
  // Mock trend data
  const fastOOS = [
    {
      id: "1",
      product: "Simply Bare Organic Blue Dream",
      size: "3.5g",
      avgInStockDays: 2.1,
      oosEvents: 4,
      popularity: 85,
    },
    {
      id: "2",
      product: "Broken Coast Ruxton",
      size: "3.5g",
      avgInStockDays: 3.2,
      oosEvents: 3,
      popularity: 92,
    },
    {
      id: "3",
      product: "REDECAN Redees",
      size: "10pk",
      avgInStockDays: 1.8,
      oosEvents: 5,
      popularity: 78,
    },
  ];

  const highCoverage = [
    {
      id: "1",
      product: "Spinach Blue Dream",
      size: "3.5g",
      coverage: 95,
      priceDispersion: 8.2,
      medianPrice: 32.99,
    },
    {
      id: "2",
      product: "Good Supply Jean Guy",
      size: "3.5g",
      coverage: 92,
      priceDispersion: 6.5,
      medianPrice: 26.99,
    },
    {
      id: "3",
      product: "REDECAN Wappa",
      size: "3.5g",
      coverage: 88,
      priceDispersion: 7.1,
      medianPrice: 29.99,
    },
  ];

  const promoRate = [
    {
      id: "1",
      category: "Pre-Rolls",
      promoRate: 42,
      avgDiscount: 15.3,
      products: 23,
    },
    {
      id: "2",
      category: "Edibles",
      promoRate: 28,
      avgDiscount: 12.1,
      products: 45,
    },
    {
      id: "3",
      category: "Flower",
      promoRate: 18,
      avgDiscount: 8.5,
      products: 67,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trends & Popularity</CardTitle>
        <CardDescription>Market intelligence and product performance</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fast-oos">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fast-oos">Fast OOS</TabsTrigger>
            <TabsTrigger value="coverage">Coverage</TabsTrigger>
            <TabsTrigger value="promos">Promos</TabsTrigger>
          </TabsList>

          {/* Fast Out-of-Stock */}
          <TabsContent value="fast-oos" className="space-y-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Zap className="h-4 w-4" />
              <span>High-velocity products (short in-stock streaks)</span>
            </div>
            {fastOOS.map((item) => (
              <div key={item.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.product}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.size}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{item.avgInStockDays} days avg</span>
                      </div>
                      <div>{item.oosEvents} OOS events</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary">
                      {item.popularity} popularity
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* High Coverage */}
          <TabsContent value="coverage" className="space-y-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <TrendingUp className="h-4 w-4" />
              <span>Widely carried "must-have" products</span>
            </div>
            {highCoverage.map((item) => (
              <div key={item.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.product}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.size}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <div>{item.coverage}% coverage</div>
                      <div>${item.priceDispersion.toFixed(2)} dispersion</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="font-semibold">${item.medianPrice.toFixed(2)}</div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Promo Rates */}
          <TabsContent value="promos" className="space-y-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Tag className="h-4 w-4" />
              <span>Promotional activity by category</span>
            </div>
            {promoRate.map((item) => (
              <div key={item.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.category}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.products} products tracked
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <div>Avg discount: {item.avgDiscount}%</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant={item.promoRate > 30 ? "default" : "secondary"}
                      className="text-lg px-3 py-1"
                    >
                      {item.promoRate}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">on sale</span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}


