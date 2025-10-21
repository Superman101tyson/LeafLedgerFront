"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingDown, TrendingUp, Package, Sparkles, XCircle } from "lucide-react";

interface CompetitorActivityProps {
  dateRange: string;
}

export function CompetitorActivity({ dateRange }: CompetitorActivityProps) {
  const [eventFilter, setEventFilter] = useState("all");

  // Mock competitor events
  const events = [
    {
      id: "1",
      type: "price_change",
      direction: "down",
      product: "Broken Coast Sunset Sherbet 3.5g",
      store: "Evergreen Cannabis Society",
      detail: "$41.99 → $39.99 (-4.8%)",
      timestamp: "2h ago",
    },
    {
      id: "2",
      type: "new_sku",
      product: "Simply Bare Live Rosin 1g",
      store: "Meta Cannabis Co",
      detail: "New product launched at $49.99",
      timestamp: "4h ago",
    },
    {
      id: "3",
      type: "restock",
      product: "REDECAN Redees Pre-Rolls 10pk",
      store: "Spiritleaf Victoria",
      detail: "Back in stock after 3 days",
      timestamp: "6h ago",
    },
    {
      id: "4",
      type: "price_change",
      direction: "up",
      product: "Spinach Blue Dream 3.5g",
      store: "Tokyo Smoke - Robson",
      detail: "$32.99 → $34.99 (+6.1%)",
      timestamp: "8h ago",
    },
    {
      id: "5",
      type: "removed",
      product: "Good Supply Grower's Choice 3.5g",
      store: "Kiaro Kelowna",
      detail: "Removed from menu (was $28.99)",
      timestamp: "12h ago",
    },
    {
      id: "6",
      type: "restock",
      product: "Broken Coast Ruxton 3.5g",
      store: "EGGS Cannabis",
      detail: "Back in stock at $44.99",
      timestamp: "1d ago",
    },
  ];

  const filteredEvents = events.filter((e) => {
    if (eventFilter === "all") return true;
    return e.type === eventFilter;
  });

  const getEventIcon = (type: string, direction?: string) => {
    switch (type) {
      case "price_change":
        return direction === "down" ? (
          <TrendingDown className="h-5 w-5 text-green-600" />
        ) : (
          <TrendingUp className="h-5 w-5 text-red-600" />
        );
      case "new_sku":
        return <Sparkles className="h-5 w-5 text-blue-600" />;
      case "restock":
        return <Package className="h-5 w-5 text-green-600" />;
      case "removed":
        return <XCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <Package className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getEventColor = (type: string, direction?: string) => {
    switch (type) {
      case "price_change":
        return direction === "down" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
      case "new_sku":
        return "bg-blue-50 border-blue-200";
      case "restock":
        return "bg-green-50 border-green-200";
      case "removed":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case "price_change":
        return "Price Change";
      case "new_sku":
        return "New SKU";
      case "restock":
        return "Restocked";
      case "removed":
        return "Removed";
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Competitor Activity</CardTitle>
            <CardDescription>Recent changes in your competitor set</CardDescription>
          </div>
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="price_change">Price Changes</SelectItem>
              <SelectItem value="new_sku">New SKUs</SelectItem>
              <SelectItem value="restock">Restocks</SelectItem>
              <SelectItem value="removed">Removals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`p-3 border rounded-lg ${getEventColor(event.type, event.direction)} transition-shadow hover:shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getEventIcon(event.type, event.direction)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {getEventLabel(event.type)}
                    </Badge>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {event.timestamp}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{event.product}</h4>
                  <p className="text-sm text-muted-foreground mb-1">{event.store}</p>
                  <p className="text-sm font-medium">{event.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No activity matches your filter
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full" size="sm">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


