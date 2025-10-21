"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MOCK_VARIANTS, BC_STORES } from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Download, Bell, TrendingUp, TrendingDown } from "lucide-react";
import { MiniSparkline } from "./mini-sparkline";

interface PriceLadderModalProps {
  variantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PriceLadderModal({ variantId, open, onOpenChange }: PriceLadderModalProps) {
  const [pricePerUnit, setPricePerUnit] = useState(false);

  const variant = MOCK_VARIANTS.find(v => v.id === variantId);
  
  if (!variant) return null;

  // Generate mock price ladder
  const stores = BC_STORES.slice(0, variant.coverage);
  const priceLadder = stores.map((store, idx) => ({
    store,
    price: variant.minPrice + (idx / stores.length) * (variant.p90Price - variant.minPrice),
    onSale: Math.random() > 0.85,
    lastSeen: new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000),
    rank: idx + 1,
  })).sort((a, b) => a.price - b.price);

  const yourStore = priceLadder[Math.floor(priceLadder.length / 3)];
  const minPriceStore = priceLadder[0];
  const gapToMin = yourStore.price - minPriceStore.price;
  const gapToMedian = yourStore.price - variant.medianPrice;

  const priceHistory = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: variant.medianPrice + Math.random() * 5 - 2.5,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {variant.product.brand} • {variant.product.name}
          </DialogTitle>
          <DialogDescription>
            {variant.size} • {variant.product.category}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-2 gap-6 py-4">
            {/* Left: Price Ladder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Price Ladder</h3>
                <div className="flex items-center gap-2">
                  <Switch
                    id="price-per-unit"
                    checked={pricePerUnit}
                    onCheckedChange={setPricePerUnit}
                  />
                  <Label htmlFor="price-per-unit" className="text-sm">
                    Per gram
                  </Label>
                </div>
              </div>

              <div className="border rounded-lg max-h-96 overflow-y-auto">
                {priceLadder.map((item) => (
                  <div
                    key={item.store.id}
                    className={`flex items-center justify-between p-3 border-b last:border-b-0 ${
                      item.store.id === yourStore.store.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-sm font-medium text-muted-foreground w-8">
                        #{item.rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.store.name}</div>
                        <div className="text-xs text-muted-foreground">{item.store.city}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.onSale && (
                        <Badge variant="destructive" className="text-xs">Sale</Badge>
                      )}
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(item.price)}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.floor((Date.now() - item.lastSeen.getTime()) / (1000 * 60))}m ago
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Analytics & Actions */}
            <div className="space-y-4">
              {/* Your Position */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Your Position</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current Price</span>
                    <span className="text-2xl font-bold">{formatCurrency(yourStore.price)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Market Rank</span>
                    <span className="font-semibold">#{yourStore.rank} of {priceLadder.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Percentile</span>
                    <span className="font-semibold">
                      {Math.round((yourStore.rank / priceLadder.length) * 100)}th
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Gaps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Price Gaps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Gap to Minimum</span>
                    <span className={`font-semibold ${gapToMin > 5 ? "text-red-600" : "text-green-600"}`}>
                      {gapToMin > 0 ? "+" : ""}{formatCurrency(gapToMin)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Gap to Median</span>
                    <span className={`font-semibold ${gapToMedian > 0 ? "text-red-600" : "text-green-600"}`}>
                      {gapToMedian > 0 ? "+" : ""}{formatCurrency(gapToMedian)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">7-Day Change</span>
                    <div className={`flex items-center gap-1 font-semibold ${
                      variant.delta7d > 0 ? "text-red-600" : "text-green-600"
                    }`}>
                      {variant.delta7d > 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>{formatPercent(variant.delta7d)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 30-Day Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">30-Day Price Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32">
                    <MiniSparkline data={priceHistory} />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Bell className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


