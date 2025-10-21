"use client";

import { PageHeader } from "@/components/page-header";
import { MetricCard } from "@/components/metric-card";
import { DataFreshness } from "@/components/data-freshness";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingDown, TrendingUp, Package, AlertCircle, ExternalLink, Sparkles, Store, DollarSign, ShoppingCart, Activity, Target, Percent } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from "recharts";

export default function DashboardPage() {
  const lastUpdated = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2h ago
  const nextUpdate = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4h from now
  const [dateRange, setDateRange] = useState("7d");

  // Enhanced KPIs
  const kpis = {
    totalProducts: 487,
    totalProductsDelta: 12,
    avgMarketPrice: 38.42,
    avgMarketPriceDelta: -1.8,
    trackedStores: 8,
    openAlerts: 7,
    priceChanges7d: 23,
    priceChanges7dDelta: 12.5,
    coverage: 87,
    yourMedianPrice: 39.99,
    marketMedianPrice: 38.42,
    competitiveIndex: 104.1, // Your median / market median * 100
  };

  // Market Price Trend (30 days)
  const priceHistory = useMemo(() => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        yourPrice: 39.0 + Math.random() * 2 - 1,
        marketPrice: 38.0 + Math.random() * 1.5 - 0.75,
        min: 34.0 + Math.random() * 2,
        max: 44.0 + Math.random() * 2,
      });
    }
    return data;
  }, []);

  // Category Distribution
  const categoryData = useMemo(() => [
    { name: "Flower", value: 45, color: "#22c55e" },
    { name: "Pre-Rolls", value: 25, color: "#3b82f6" },
    { name: "Vapes", value: 15, color: "#a855f7" },
    { name: "Edibles", value: 10, color: "#f59e0b" },
    { name: "Concentrates", value: 5, color: "#ec4899" },
  ], []);

  // Price Distribution
  const priceDistribution = useMemo(() => [
    { range: "$0-20", count: 45 },
    { range: "$20-30", count: 120 },
    { range: "$30-40", count: 180 },
    { range: "$40-50", count: 95 },
    { range: "$50+", count: 47 },
  ], []);

  // Weekly Activity Trend
  const weeklyActivity = useMemo(() => [
    { day: "Mon", priceChanges: 12, newSKUs: 3, restocks: 8 },
    { day: "Tue", priceChanges: 18, newSKUs: 2, restocks: 5 },
    { day: "Wed", priceChanges: 9, newSKUs: 1, restocks: 12 },
    { day: "Thu", priceChanges: 23, newSKUs: 5, restocks: 7 },
    { day: "Fri", priceChanges: 15, newSKUs: 2, restocks: 9 },
    { day: "Sat", priceChanges: 8, newSKUs: 1, restocks: 4 },
    { day: "Sun", priceChanges: 11, newSKUs: 0, restocks: 6 },
  ], []);

  // Top Movers
  const topMovers = useMemo(() => [
    { product: "Broken Coast Sunset Sherbet 3.5g", change: -7.5, volume: "High", category: "Flower" },
    { product: "Simply Bare Live Rosin 1g", change: 12.3, volume: "Medium", category: "Concentrates" },
    { product: "REDECAN Redees Pre-Rolls 10pk", change: -4.2, volume: "High", category: "Pre-Rolls" },
    { product: "Spinach Blue Dream 3.5g", change: 5.2, volume: "High", category: "Flower" },
    { product: "Good Supply Grower's Choice 28g", change: -3.8, volume: "Medium", category: "Flower" },
  ], []);

  // Today's Moves
  const todaysMoves = [
    {
      id: "1",
      type: "price_drop",
      title: "Broken Coast Sunset Sherbet 3.5g",
      subtitle: "Market median dropped 7.5% → $36.99",
      store: "Evergreen Cannabis Society",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      variantId: "v1",
    },
    {
      id: "2",
      type: "new_sku",
      title: "Simply Bare Live Rosin 1g",
      subtitle: "New product launched across 8 stores",
      store: "Multiple stores",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      variantId: "v5",
    },
    {
      id: "3",
      type: "restock",
      title: "REDECAN Redees Pre-Rolls 10pk",
      subtitle: "Back in stock at 3 competitor stores",
      store: "Spiritleaf Victoria",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      variantId: "v4",
    },
    {
      id: "4",
      type: "price_increase",
      title: "Spinach Blue Dream 3.5g",
      subtitle: "Market median increased 5.2% → $34.99",
      store: "Meta Cannabis Co",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      variantId: "v3",
    },
    {
      id: "5",
      type: "oos",
      title: "7ACRES Craft Collective 3.5g",
      subtitle: "Out of stock at 2 competitor stores",
      store: "City Cannabis Co",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      variantId: "v6",
    },
  ];

  const getMoveIcon = (type: string) => {
    switch (type) {
      case "price_drop":
        return <TrendingDown className="h-5 w-5 text-green-600" />;
      case "price_increase":
        return <TrendingUp className="h-5 w-5 text-red-600" />;
      case "new_sku":
        return <Sparkles className="h-5 w-5 text-blue-600" />;
      case "restock":
        return <Package className="h-5 w-5 text-green-600" />;
      case "oos":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getMoveColor = (type: string) => {
    switch (type) {
      case "price_drop":
        return "bg-green-50 border-green-200";
      case "price_increase":
        return "bg-red-50 border-red-200";
      case "new_sku":
        return "bg-blue-50 border-blue-200";
      case "restock":
        return "bg-green-50 border-green-200";
      case "oos":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTimeSince = (timestamp: Date) => {
    const now = Date.now();
    const then = timestamp.getTime();
    const diffMinutes = Math.floor((now - then) / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  return (
    <div className="py-8 px-4 max-w-[1600px] mx-auto">
      <PageHeader
        title="Analytics Dashboard"
        subtitle="Comprehensive market intelligence for your tracked stores"
        actions={
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <DataFreshness lastUpdated={lastUpdated} nextUpdate={nextUpdate} />
          </div>
        }
      />

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Products Tracked"
          value={kpis.totalProducts}
          delta={kpis.totalProductsDelta}
          subtitle="Across your market"
          icon={<Package className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Avg Market Price"
          value={`$${kpis.avgMarketPrice.toFixed(2)}`}
          delta={kpis.avgMarketPriceDelta}
          subtitle="Median across tracked SKUs"
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Tracked Stores"
          value={kpis.trackedStores}
          subtitle="Active competitors"
          icon={<Store className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Price Changes (7d)"
          value={kpis.priceChanges7d}
          delta={kpis.priceChanges7dDelta}
          subtitle="vs previous 7d"
          icon={<Activity className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Competitive Index</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{kpis.competitiveIndex.toFixed(1)}%</p>
                  <Badge variant={kpis.competitiveIndex > 100 ? "secondary" : "default"}>
                    {kpis.competitiveIndex > 100 ? "Above Market" : "Below Market"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your: ${kpis.yourMedianPrice} vs Market: ${kpis.marketMedianPrice}
                </p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Market Coverage</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{kpis.coverage}%</p>
                  <Badge variant="default">Excellent</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((kpis.totalProducts * kpis.coverage) / 100)} of {kpis.totalProducts} SKUs
                </p>
              </div>
              <Percent className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Open Alerts</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{kpis.openAlerts}</p>
                  <Badge variant="destructive">Action Required</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Requires immediate attention
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Price Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Price Trends (30 Days)</CardTitle>
            <CardDescription>Your pricing vs market median</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="yourPrice"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.2}
                  name="Your Avg Price"
                />
                <Area
                  type="monotone"
                  dataKey="marketPrice"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  name="Market Median"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Market Activity (7 Days)</CardTitle>
            <CardDescription>Price changes, new SKUs, and restocks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="priceChanges" fill="#3b82f6" name="Price Changes" />
                <Bar dataKey="newSKUs" fill="#22c55e" name="New SKUs" />
                <Bar dataKey="restocks" fill="#a855f7" name="Restocks" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Product Mix by Category</CardTitle>
            <CardDescription>Percentage of tracked products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={(entry) => `${entry.value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {categoryData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Price Distribution</CardTitle>
            <CardDescription>Number of products by price range</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priceDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="range" type="category" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" name="Products" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Movers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Price Movers (7d)</CardTitle>
                <CardDescription>Biggest price changes this week</CardDescription>
              </div>
              <Link href="/app/catalog">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMovers.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.product}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{product.volume} Volume</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-600" />
                    )}
                    <span
                      className={`font-semibold ${
                        product.change > 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {product.change > 0 ? "+" : ""}
                      {product.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Moves Feed */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today's Market Moves</CardTitle>
                <CardDescription>Recent activity in tracked stores</CardDescription>
              </div>
              <Link href="/app/catalog">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysMoves.slice(0, 5).map((move) => (
                <div
                  key={move.id}
                  className={`p-3 border rounded-lg ${getMoveColor(move.type)} hover:shadow-sm transition-shadow`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getMoveIcon(move.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{move.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {move.subtitle}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span className="truncate">{move.store}</span>
                            <span>•</span>
                            <span>{getTimeSince(move.timestamp)}</span>
                          </div>
                        </div>
                        <Link href={`/app/catalog?variant=${move.variantId}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
