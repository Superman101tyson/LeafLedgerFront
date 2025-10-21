"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { DataFreshness } from "@/components/data-freshness";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrandTable } from "@/components/brand-watch/brand-table";
import { BrandDetail } from "@/components/brand-watch/brand-detail";
import { Download, TrendingUp, Package, Store, DollarSign } from "lucide-react";

export default function BrandWatchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("skus_desc");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const lastUpdated = new Date(Date.now() - 1 * 60 * 60 * 1000);
  const nextUpdate = new Date(Date.now() + 5 * 60 * 60 * 1000);

  // Market-wide KPIs
  const kpis = {
    totalBrands: 87,
    avgSkusPerBrand: 12.4,
    avgCoveragePercent: 68,
    topBrandCoverage: 95,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="Brand Watch"
        subtitle="Brand performance analytics and market presence"
        actions={
          <div className="flex items-center gap-2">
            <DataFreshness lastUpdated={lastUpdated} nextUpdate={nextUpdate} />
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Brands
            </Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Brands"
          value={kpis.totalBrands}
          subtitle="tracked in market"
          icon={<Package className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg SKUs per Brand"
          value={kpis.avgSkusPerBrand.toFixed(1)}
          subtitle="product depth"
          icon={<Package className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Coverage"
          value={`${kpis.avgCoveragePercent}%`}
          subtitle="stores carrying"
          icon={<Store className="h-5 w-5" />}
        />
        <MetricCard
          title="Top Brand Coverage"
          value={`${kpis.topBrandCoverage}%`}
          subtitle="highest penetration"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <Input
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="skus_desc">SKUs (High-Low)</SelectItem>
                <SelectItem value="skus_asc">SKUs (Low-High)</SelectItem>
                <SelectItem value="coverage_desc">Coverage (High-Low)</SelectItem>
                <SelectItem value="coverage_asc">Coverage (Low-High)</SelectItem>
                <SelectItem value="median_price_desc">Median Price (High-Low)</SelectItem>
                <SelectItem value="median_price_asc">Median Price (Low-High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedBrand ? (
        <BrandDetail brandName={selectedBrand} onBack={() => setSelectedBrand(null)} />
      ) : (
        <BrandTable
          searchQuery={searchQuery}
          sortBy={sortBy}
          onSelectBrand={setSelectedBrand}
        />
      )}
    </div>
  );
}


