"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/metric-card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ArrowLeft, Package, Store, TrendingUp, DollarSign } from "lucide-react";
import { MiniSparkline } from "@/components/catalog/mini-sparkline";

interface BrandDetailProps {
  brandName: string;
  onBack: () => void;
}

export function BrandDetail({ brandName, onBack }: BrandDetailProps) {
  // Mock detailed brand data
  const brandData = {
    name: brandName,
    category: "Premium",
    totalSkus: 24,
    avgCoverage: 88,
    medianPrice: 42.99,
    priceRange: { min: 28.99, max: 59.99 },
    delta7d: -2.1,
    delta30d: -5.3,
    topCategories: [
      { name: "Flower", skus: 18, percent: 75 },
      { name: "Pre-Rolls", skus: 4, percent: 17 },
      { name: "Vapes", skus: 2, percent: 8 },
    ],
    topProducts: [
      { name: "Sunset Sherbet 3.5g", coverage: 95, medianPrice: 41.99, delta7d: -1.5 },
      { name: "Ruxton 3.5g", coverage: 92, medianPrice: 44.99, delta7d: -2.8 },
      { name: "Galiano 3.5g", coverage: 88, medianPrice: 42.99, delta7d: -0.5 },
      { name: "Frost Monster 3.5g", coverage: 85, medianPrice: 39.99, delta7d: 0 },
    ],
    priceHistory: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      price: 42.99 + Math.random() * 3 - 1.5,
    })),
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Brands
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold">{brandData.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="default">{brandData.category}</Badge>
            <Badge variant="outline">{brandData.totalSkus} SKUs</Badge>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total SKUs"
          value={brandData.totalSkus}
          subtitle="products tracked"
          icon={<Package className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Coverage"
          value={`${brandData.avgCoverage}%`}
          subtitle="stores carrying"
          icon={<Store className="h-5 w-5" />}
        />
        <MetricCard
          title="Median Price"
          value={formatCurrency(brandData.medianPrice)}
          subtitle={`Range: ${formatCurrency(brandData.priceRange.min)} - ${formatCurrency(
            brandData.priceRange.max
          )}`}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          title="Price Δ 7d"
          value={formatPercent(brandData.delta7d / 100)}
          subtitle={`30d: ${formatPercent(brandData.delta30d / 100)}`}
          delta={brandData.delta7d}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Price Trend */}
        <Card>
          <CardHeader>
            <CardTitle>30-Day Median Price Trend</CardTitle>
            <CardDescription>Average across all SKUs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <MiniSparkline data={brandData.priceHistory} />
            </div>
          </CardContent>
        </Card>

        {/* Category Mix */}
        <Card>
          <CardHeader>
            <CardTitle>Category Mix</CardTitle>
            <CardDescription>SKU distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {brandData.topCategories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {cat.skus} SKUs ({cat.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Best-performing SKUs by coverage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium text-sm">Product</th>
                  <th className="text-center p-3 font-medium text-sm">Coverage</th>
                  <th className="text-right p-3 font-medium text-sm">Median Price</th>
                  <th className="text-center p-3 font-medium text-sm">Δ7d</th>
                </tr>
              </thead>
              <tbody>
                {brandData.topProducts.map((product, idx) => (
                  <tr key={idx} className="border-b hover:bg-accent/50">
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary">{product.coverage}%</Badge>
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {formatCurrency(product.medianPrice)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-sm font-medium ${
                          product.delta7d > 0
                            ? "text-red-600"
                            : product.delta7d < 0
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {product.delta7d > 0 ? "+" : ""}
                        {product.delta7d.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


