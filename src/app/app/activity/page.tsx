"use client";

import { PageHeader } from "@/components/page-header";
import { DataFreshness } from "@/components/data-freshness";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingDown,
  TrendingUp,
  Package,
  AlertCircle,
  Sparkles,
  Tag,
  Search,
  Download,
  Filter,
  Calendar,
  Store,
  X,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

// Mock activity events
const generateActivityEvents = () => {
  const events = [];
  const types = ["price_drop", "price_increase", "new_sku", "restock", "oos", "sale_start", "sale_end"];
  const stores = [
    "Evergreen Cannabis Society",
    "Spiritleaf Victoria",
    "Meta Cannabis Co",
    "City Cannabis Co",
    "BC Cannabis Store",
    "Burb Cannabis",
    "Canna Cabana",
    "Fire & Flower",
  ];
  const products = [
    { name: "Broken Coast Sunset Sherbet 3.5g", brand: "Broken Coast", category: "Flower" },
    { name: "Simply Bare Live Rosin 1g", brand: "Simply Bare", category: "Concentrates" },
    { name: "REDECAN Redees Pre-Rolls 10pk", brand: "REDECAN", category: "Pre-Rolls" },
    { name: "Spinach Blue Dream 3.5g", brand: "Spinach", category: "Flower" },
    { name: "7ACRES Craft Collective 3.5g", brand: "7ACRES", category: "Flower" },
    { name: "Good Supply Grower's Choice 28g", brand: "Good Supply", category: "Flower" },
    { name: "FIGR No. 17 Pre-Rolls 10pk", brand: "FIGR", category: "Pre-Rolls" },
    { name: "Tantalus Blue Dream 3.5g", brand: "Tantalus", category: "Flower" },
    { name: "Pure Sunfarms White Rhino 3.5g", brand: "Pure Sunfarms", category: "Flower" },
    { name: "Aurora Drift Indica 3.5g", brand: "Aurora", category: "Flower" },
  ];

  // Generate events for the last 7 days
  for (let i = 0; i < 150; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const store = stores[Math.floor(Math.random() * stores.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const hoursAgo = Math.floor(Math.random() * 168); // 7 days in hours
    const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    let details = "";
    let oldPrice = 0;
    let newPrice = 0;
    let change = 0;

    if (type === "price_drop" || type === "price_increase") {
      oldPrice = 30 + Math.random() * 20;
      const changePercent = type === "price_drop" ? -(2 + Math.random() * 10) : 2 + Math.random() * 8;
      newPrice = oldPrice * (1 + changePercent / 100);
      change = changePercent;
      details = `${oldPrice.toFixed(2)} → $${newPrice.toFixed(2)} (${change > 0 ? "+" : ""}${change.toFixed(1)}%)`;
    } else if (type === "new_sku") {
      const price = 30 + Math.random() * 20;
      details = `Launched at $${price.toFixed(2)}`;
    } else if (type === "restock") {
      details = `Back in stock`;
    } else if (type === "oos") {
      details = `Out of stock`;
    } else if (type === "sale_start") {
      oldPrice = 30 + Math.random() * 20;
      const discount = 10 + Math.random() * 20;
      newPrice = oldPrice * (1 - discount / 100);
      details = `Sale started: ${discount.toFixed(0)}% off → $${newPrice.toFixed(2)}`;
    } else if (type === "sale_end") {
      const price = 30 + Math.random() * 20;
      details = `Sale ended → $${price.toFixed(2)}`;
    }

    events.push({
      id: `evt-${i}`,
      type,
      timestamp,
      store,
      product: product.name,
      brand: product.brand,
      category: product.category,
      details,
      oldPrice,
      newPrice,
      change,
    });
  }

  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7d");
  const [sortBy, setSortBy] = useState("recent");

  const lastUpdated = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const nextUpdate = new Date(Date.now() + 4 * 60 * 60 * 1000);

  const allEvents = useMemo(() => generateActivityEvents(), []);

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = allEvents;

    // Date range filter
    const now = Date.now();
    const rangeDays = dateRange === "24h" ? 1 : dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
    filtered = filtered.filter((evt) => {
      const daysDiff = (now - evt.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= rangeDays;
    });

    // Event type filter
    if (eventTypeFilter !== "all") {
      filtered = filtered.filter((evt) => evt.type === eventTypeFilter);
    }

    // Store filter
    if (storeFilter !== "all") {
      filtered = filtered.filter((evt) => evt.store === storeFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((evt) => evt.category === categoryFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (evt) =>
          evt.product.toLowerCase().includes(query) ||
          evt.brand.toLowerCase().includes(query) ||
          evt.store.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allEvents, searchQuery, eventTypeFilter, storeFilter, categoryFilter, dateRange]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const priceChanges = filteredEvents.filter((e) => e.type === "price_drop" || e.type === "price_increase");
    const avgPriceChange =
      priceChanges.length > 0
        ? priceChanges.reduce((sum, e) => sum + Math.abs(e.change), 0) / priceChanges.length
        : 0;

    const priceDrops = filteredEvents.filter((e) => e.type === "price_drop").length;
    const priceIncreases = filteredEvents.filter((e) => e.type === "price_increase").length;
    const newSKUs = filteredEvents.filter((e) => e.type === "new_sku").length;
    const restocks = filteredEvents.filter((e) => e.type === "restock").length;
    const oos = filteredEvents.filter((e) => e.type === "oos").length;
    const sales = filteredEvents.filter((e) => e.type === "sale_start" || e.type === "sale_end").length;

    return {
      total: filteredEvents.length,
      priceChanges: priceChanges.length,
      avgPriceChange,
      priceDrops,
      priceIncreases,
      newSKUs,
      restocks,
      oos,
      sales,
    };
  }, [filteredEvents]);

  // Trend data (events per day)
  const trendData = useMemo(() => {
    const days = dateRange === "24h" ? 24 : dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const dayEvents = filteredEvents.filter(
        (evt) => evt.timestamp >= dayStart && evt.timestamp <= dayEnd
      );

      data.push({
        date: dayStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        total: dayEvents.length,
        priceChanges: dayEvents.filter((e) => e.type === "price_drop" || e.type === "price_increase").length,
        newSKUs: dayEvents.filter((e) => e.type === "new_sku").length,
        restocks: dayEvents.filter((e) => e.type === "restock").length,
      });
    }

    return data;
  }, [filteredEvents, dateRange]);

  // Event type breakdown
  const eventTypeBreakdown = useMemo(() => {
    return [
      { type: "Price Drops", count: metrics.priceDrops, color: "#22c55e" },
      { type: "Price Increases", count: metrics.priceIncreases, color: "#ef4444" },
      { type: "New SKUs", count: metrics.newSKUs, color: "#3b82f6" },
      { type: "Restocks", count: metrics.restocks, color: "#a855f7" },
      { type: "Out of Stock", count: metrics.oos, color: "#f59e0b" },
      { type: "Sales", count: metrics.sales, color: "#ec4899" },
    ];
  }, [metrics]);

  // Get unique stores and categories for filters
  const stores = useMemo(() => [...new Set(allEvents.map((e) => e.store))].sort(), [allEvents]);
  const categories = useMemo(() => [...new Set(allEvents.map((e) => e.category))].sort(), [allEvents]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "price_drop":
        return <TrendingDown className="h-5 w-5 text-green-600" />;
      case "price_increase":
        return <TrendingUp className="h-5 w-5 text-red-600" />;
      case "new_sku":
        return <Sparkles className="h-5 w-5 text-blue-600" />;
      case "restock":
        return <Package className="h-5 w-5 text-purple-600" />;
      case "oos":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case "sale_start":
      case "sale_end":
        return <Tag className="h-5 w-5 text-pink-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "price_drop":
        return "bg-green-50 border-green-200";
      case "price_increase":
        return "bg-red-50 border-red-200";
      case "new_sku":
        return "bg-blue-50 border-blue-200";
      case "restock":
        return "bg-purple-50 border-purple-200";
      case "oos":
        return "bg-orange-50 border-orange-200";
      case "sale_start":
      case "sale_end":
        return "bg-pink-50 border-pink-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getEventLabel = (type: string) => {
    const labels: Record<string, string> = {
      price_drop: "Price Drop",
      price_increase: "Price Increase",
      new_sku: "New Product",
      restock: "Restock",
      oos: "Out of Stock",
      sale_start: "Sale Started",
      sale_end: "Sale Ended",
    };
    return labels[type] || type;
  };

  const getTimeSince = (timestamp: Date) => {
    const now = Date.now();
    const then = timestamp.getTime();
    const diffMinutes = Math.floor((now - then) / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  const activeFilters =
    (eventTypeFilter !== "all" ? 1 : 0) +
    (storeFilter !== "all" ? 1 : 0) +
    (categoryFilter !== "all" ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const clearFilters = () => {
    setEventTypeFilter("all");
    setStoreFilter("all");
    setCategoryFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="py-8 px-4 max-w-[1600px] mx-auto">
      <PageHeader
        title="Market Activity Log"
        subtitle="Complete chronological record of all market events"
        actions={
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <DataFreshness lastUpdated={lastUpdated} nextUpdate={nextUpdate} />
          </div>
        }
      />

      {/* Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{metrics.total}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Events</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{metrics.priceDrops}</p>
              <p className="text-xs text-muted-foreground mt-1">Price Drops</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{metrics.priceIncreases}</p>
              <p className="text-xs text-muted-foreground mt-1">Price Increases</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{metrics.newSKUs}</p>
              <p className="text-xs text-muted-foreground mt-1">New Products</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{metrics.restocks}</p>
              <p className="text-xs text-muted-foreground mt-1">Restocks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{metrics.oos}</p>
              <p className="text-xs text-muted-foreground mt-1">Out of Stock</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Filters</CardTitle>
                  <CardDescription>Narrow down activity by type, store, or product</CardDescription>
                </div>
                {activeFilters > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear ({activeFilters})
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, brands, or stores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="price_drop">Price Drops</SelectItem>
                    <SelectItem value="price_increase">Price Increases</SelectItem>
                    <SelectItem value="new_sku">New Products</SelectItem>
                    <SelectItem value="restock">Restocks</SelectItem>
                    <SelectItem value="oos">Out of Stock</SelectItem>
                    <SelectItem value="sale_start">Sales Started</SelectItem>
                    <SelectItem value="sale_end">Sales Ended</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={storeFilter} onValueChange={setStoreFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    {stores.map((store) => (
                      <SelectItem key={store} value={store}>
                        {store}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Activity Feed</CardTitle>
                  <CardDescription>
                    Showing {filteredEvents.length} events
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[800px] overflow-y-auto pr-2">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 border rounded-lg ${getEventColor(event.type)} hover:shadow-sm transition-shadow`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getEventIcon(event.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {getEventLabel(event.type)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {event.category}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {getTimeSince(event.timestamp)}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm">{event.product}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{event.details}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Store className="h-3 w-3" />
                          <span>{event.store}</span>
                          <span>•</span>
                          <span>{event.brand}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No events match your filters</p>
                    <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Trends & Analytics */}
        <div className="space-y-6">
          {/* Activity Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Trend</CardTitle>
              <CardDescription>Events over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} name="Total" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Event Type Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Event Breakdown</CardTitle>
              <CardDescription>By type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={eventTypeBreakdown} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="type" type="category" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Avg Price Change</p>
                <p className="text-2xl font-bold">{metrics.avgPriceChange.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price Volatility</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500"
                      style={{ width: `${Math.min((metrics.avgPriceChange / 10) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {metrics.avgPriceChange > 5 ? "High" : metrics.avgPriceChange > 2 ? "Medium" : "Low"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Market Sentiment</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={metrics.priceDrops > metrics.priceIncreases ? "default" : "destructive"}>
                    {metrics.priceDrops > metrics.priceIncreases ? "Competitive" : "Inflationary"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {metrics.priceDrops} drops vs {metrics.priceIncreases} increases
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


