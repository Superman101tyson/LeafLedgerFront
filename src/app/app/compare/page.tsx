"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { DataFreshness } from "@/components/data-freshness";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActionListDrawer } from "@/components/compare/action-list-drawer";
import { 
  Download, 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  Tag, 
  Package, 
  AlertTriangle,
  Bookmark,
  ShoppingCart,
  AlertCircle,
  Clock,
  XCircle,
  Store,
} from "lucide-react";
import {
  generatePriceRecommendations,
  generateSalesOpportunities,
  generateInventoryInsights,
  generateMarketAlerts,
} from "@/lib/mock-advisor-data";

export default function MarketAdvisorPage() {
  const [strategy, setStrategy] = useState<"median" | "win" | "hold" | "custom">("median");
  const [competitorSet, setCompetitorSet] = useState("all");
  const [dateRange, setDateRange] = useState("7d");
  const [savedActions, setSavedActions] = useState<any[]>([]);

  const lastUpdated = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const nextUpdate = new Date(Date.now() + 4 * 60 * 60 * 1000);

  // Generate realistic data using mocks
  const priceRecommendations = useMemo(() => generatePriceRecommendations(strategy), [strategy]);
  const salesOpportunities = useMemo(() => generateSalesOpportunities(), []);
  const inventoryInsights = useMemo(() => generateInventoryInsights(), []);
  const marketAlerts = useMemo(() => generateMarketAlerts(), []);

  const handleSaveAction = (item: any, type: "pricing" | "sales" | "inventory" | "alert") => {
    const actionItem = {
      id: `${type}-${item.id}-${Date.now()}`,
      type,
      product: item.product,
      category: item.category,
      recommendation: type === "pricing" 
        ? `Change price from $${item.yourPrice} → $${item.suggestedPrice}`
        : type === "sales"
        ? item.recommendation
        : type === "inventory"
        ? item.recommendation
        : item.recommendation,
      impact: item.impact || item.estimatedImpact || item.reason,
      status: "saved" as const,
      savedAt: new Date(),
    };
    
    setSavedActions(prev => [...prev, actionItem]);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "removal_trend":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "oos_trend":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "restock_pattern":
        return <Package className="h-5 w-5 text-blue-600" />;
      case "market_exit":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 border-red-200";
      case "medium":
        return "bg-orange-50 border-orange-200";
      case "low":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getInsightIcon = (icon: string) => {
    switch (icon) {
      case "fast":
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case "slow":
        return <TrendingDown className="h-5 w-5 text-orange-600" />;
      case "add":
        return <ShoppingCart className="h-5 w-5 text-blue-600" />;
      case "trending":
        return <Package className="h-5 w-5 text-purple-600" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getInsightColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-50 border-green-200";
      case "orange":
        return "bg-orange-50 border-orange-200";
      case "blue":
        return "bg-blue-50 border-blue-200";
      case "purple":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="py-8 px-4 max-w-[1600px] mx-auto">
      <PageHeader
        title="Market Advisor"
        subtitle="AI-powered pricing, inventory, and competitive intelligence"
        actions={
          <div className="flex items-center gap-2">
            <ActionListDrawer
              trigger={
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Action List ({savedActions.length})
                </Button>
              }
              items={savedActions}
            />
            <DataFreshness lastUpdated={lastUpdated} nextUpdate={nextUpdate} />
          </div>
        }
      />

      {/* Scope Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Competitor Set</label>
              <Select value={competitorSet} onValueChange={setCompetitorSet}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tracked Stores (8)</SelectItem>
                  <SelectItem value="vancouver">Vancouver (5)</SelectItem>
                  <SelectItem value="victoria">Victoria & Island (2)</SelectItem>
                  <SelectItem value="fraser">Fraser Valley (1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Pricing Strategy</label>
              <Select value={strategy} onValueChange={(v) => setStrategy(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="median">Match Median</SelectItem>
                  <SelectItem value="win">Win the Aisle</SelectItem>
                  <SelectItem value="hold">Hold Margin</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Interface */}
      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Price Recommendations
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Sales Opportunities
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory Insights
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Market Alerts
          </TabsTrigger>
        </TabsList>

        {/* Price Recommendations Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Smart Pricing Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Based on <strong>{strategy === "median" ? "Match Median" : strategy === "win" ? "Win the Aisle" : strategy === "hold" ? "Hold Margin" : "Custom"}</strong> strategy • Showing top opportunities
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="space-y-4">
            {priceRecommendations.map((rec) => (
              <Card key={rec.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{rec.product}</h4>
                        <Badge variant="outline">{rec.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.brand}</p>
                    </div>
                    <Badge variant={rec.gap > 0 ? "destructive" : "default"}>
                      {rec.gap > 0 ? `+$${rec.gap.toFixed(2)} Above` : `$${Math.abs(rec.gap).toFixed(2)} Below`}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Your Price</p>
                      <p className="text-xl font-bold">${rec.yourPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Market Range</p>
                      <p className="text-lg font-semibold text-blue-600">${rec.marketMedian.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">${rec.marketMin.toFixed(2)} - ${rec.marketP90.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Recommended</p>
                      <p className="text-xl font-bold text-green-600">${rec.suggestedPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Price Rank</p>
                      <p className="text-lg font-semibold">#{rec.currentRank} of 8</p>
                      <p className="text-xs text-green-600">→ #{rec.expectedRank} after change</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Data Quality</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${rec.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{rec.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 mb-3">
                    <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">{rec.reason}</p>
                      <p className="text-xs text-blue-700 mt-1">{rec.impact}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSaveAction(rec, "pricing")}
                    >
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save to Action List
                    </Button>
                    <Button size="sm" variant="outline">
                      View Price Ladder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sales Opportunities Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Sales & Promotion Opportunities</h3>
              <p className="text-sm text-muted-foreground">Based on current competitor promotional activity</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Campaign Plan
            </Button>
          </div>

          <div className="space-y-4">
            {salesOpportunities.map((opp) => (
              <Card key={opp.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{opp.product}</h4>
                        <Badge variant="outline">{opp.category}</Badge>
                        <Badge 
                          variant={opp.urgency === "high" ? "destructive" : opp.urgency === "medium" ? "default" : "secondary"}
                        >
                          {opp.urgency.toUpperCase()} URGENCY
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{opp.brand}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Your Current Price</p>
                      <p className="text-xl font-bold">${opp.yourPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Competitor Sale Price</p>
                      <p className="text-lg font-semibold text-orange-600">${opp.competitorSalePrice.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{opp.avgDiscount.toFixed(0)}% off average</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Competitors on Sale</p>
                      <p className="text-lg font-semibold">{opp.competitorsOnSale} of {opp.totalCompetitors}</p>
                      <p className="text-xs text-muted-foreground">{((opp.competitorsOnSale / opp.totalCompetitors) * 100).toFixed(0)}% of market</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Recommended Action</p>
                      <p className="text-lg font-bold text-green-600">{opp.recommendation.split('(')[0]}</p>
                      <p className="text-xs text-muted-foreground">{opp.recommendation.match(/\((.*)\)/)?.[1]}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200 mb-3">
                    <Tag className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-900">{opp.reason}</p>
                      <p className="text-xs text-orange-700 mt-1">Impact: {opp.estimatedImpact}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSaveAction(opp, "sales")}
                    >
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save to Action List
                    </Button>
                    <Button size="sm" variant="outline">
                      View Competitors
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Inventory Insights Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Inventory Intelligence</h3>
              <p className="text-sm text-muted-foreground">Stock recommendations based on market velocity and demand patterns</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Buyer Sheet
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inventoryInsights.map((insight) => (
              <Card key={insight.id} className={`hover:shadow-md transition-shadow ${getInsightColor(insight.color)}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-white border">
                      {getInsightIcon(insight.icon)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{insight.product}</h4>
                          <p className="text-sm text-muted-foreground">{insight.brand}</p>
                        </div>
                        <Badge variant="outline">{insight.category}</Badge>
                      </div>
                      <Badge className="mb-3">{insight.insight}</Badge>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Days in Stock</span>
                      <span className="font-semibold">{insight.avgDaysInStock} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Restock Pattern</span>
                      <span className="font-semibold">{insight.restockFrequency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Market Coverage</span>
                      <span className="font-semibold">{insight.coverage}% of stores</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border mb-3">
                    <p className="text-sm font-medium mb-1">{insight.recommendation}</p>
                    <p className="text-xs text-muted-foreground">{insight.reason}</p>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleSaveAction(insight, "inventory")}
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save to Action List
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Market Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Market Alerts & Trends</h3>
              <p className="text-sm text-muted-foreground">Product removals, supply constraints, and market pattern changes</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>

          <div className="space-y-4">
            {marketAlerts.map((alert) => (
              <Card key={alert.id} className={`hover:shadow-md transition-shadow ${getAlertColor(alert.severity)}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-lg">{alert.product}</h4>
                          <p className="text-sm text-muted-foreground">{alert.brand}</p>
                        </div>
                        <Badge 
                          variant={alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "secondary"}
                        >
                          {alert.severity.toUpperCase()} PRIORITY
                        </Badge>
                      </div>
                      <Badge variant="outline" className="mb-3">{alert.category}</Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="font-medium mb-2">{alert.details}</p>
                    <div className="flex flex-wrap gap-2">
                      {alert.storesAffected.slice(0, 3).map((store, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          <Store className="h-3 w-3 mr-1" />
                          {store}
                        </Badge>
                      ))}
                      {alert.storesAffected.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{alert.storesAffected.length - 3} more stores
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border mb-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.recommendation}</p>
                      <p className="text-xs text-muted-foreground mt-1">Action: {alert.action}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSaveAction(alert, "alert")}
                    >
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save to Action List
                    </Button>
                    <Button size="sm" variant="outline">
                      View Activity Log
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
