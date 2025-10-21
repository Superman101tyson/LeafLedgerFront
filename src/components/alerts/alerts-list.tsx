"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/lib/utils";
import { Bell, BellOff, Trash2, TrendingDown, TrendingUp, Package, XCircle, Check } from "lucide-react";

interface AlertsListProps {
  filter: "active" | "triggered" | "paused";
}

export function AlertsList({ filter }: AlertsListProps) {
  const [alerts, setAlerts] = useState(generateMockAlerts());

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, active: !alert.active } : alert
      )
    );
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, triggered: false } : alert
      )
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "active") return alert.active && !alert.triggered;
    if (filter === "triggered") return alert.triggered;
    if (filter === "paused") return !alert.active;
    return true;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "price_decrease":
        return <TrendingDown className="h-5 w-5 text-green-600" />;
      case "price_increase":
        return <TrendingUp className="h-5 w-5 text-red-600" />;
      case "new_sku":
        return <Package className="h-5 w-5 text-blue-600" />;
      case "out_of_stock":
        return <XCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getAlertLabel = (type: string) => {
    switch (type) {
      case "price_decrease":
        return "Price Decrease";
      case "price_increase":
        return "Price Increase";
      case "new_sku":
        return "New SKU";
      case "out_of_stock":
        return "Out of Stock";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-3">
      {filteredAlerts.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          <BellOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No alerts in this category</p>
        </Card>
      ) : (
        filteredAlerts.map((alert) => (
          <Card key={alert.id} className={`p-4 ${alert.triggered ? "border-red-500 bg-red-50" : ""}`}>
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="mt-1">{getAlertIcon(alert.type)}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{getAlertLabel(alert.type)}</Badge>
                      {alert.triggered && (
                        <Badge variant="destructive">TRIGGERED</Badge>
                      )}
                    </div>
                    <h4 className="font-semibold">{alert.productName}</h4>
                    <p className="text-sm text-muted-foreground">{alert.condition}</p>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={alert.active}
                      onCheckedChange={() => toggleAlert(alert.id)}
                    />
                  </div>
                </div>

                {/* Trigger Details (if triggered) */}
                {alert.triggered && alert.triggerDetails && (
                  <div className="mt-3 p-3 bg-white border border-red-200 rounded">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-red-900">
                          {alert.triggerDetails.store}
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                          {alert.triggerDetails.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.triggerDetails.timestamp}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span>Created: {alert.createdAt}</span>
                  {alert.lastTriggered && <span>Last triggered: {alert.lastTriggered}</span>}
                </div>
              </div>

              {/* Delete Button */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => deleteAlert(alert.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

// Mock data generator
function generateMockAlerts() {
  return [
    {
      id: "1",
      type: "price_decrease",
      productName: "Broken Coast Sunset Sherbet 3.5g",
      condition: "Alert when any competitor drops below $38.00",
      active: true,
      triggered: true,
      createdAt: "3d ago",
      lastTriggered: "2h ago",
      triggerDetails: {
        store: "Evergreen Cannabis Society",
        message: "Price dropped to $37.99 (was $41.99)",
        timestamp: "2h ago",
      },
    },
    {
      id: "2",
      type: "new_sku",
      productName: "Simply Bare - Any New Product",
      condition: "Alert when Simply Bare adds any new SKU",
      active: true,
      triggered: true,
      createdAt: "1w ago",
      lastTriggered: "4h ago",
      triggerDetails: {
        store: "Meta Cannabis Co",
        message: "New product: Simply Bare Live Rosin 1g at $49.99",
        timestamp: "4h ago",
      },
    },
    {
      id: "3",
      type: "price_increase",
      productName: "Spinach Blue Dream 3.5g",
      condition: "Alert when any competitor increases above $35.00",
      active: true,
      triggered: false,
      createdAt: "5d ago",
      lastTriggered: "1d ago",
    },
    {
      id: "4",
      type: "out_of_stock",
      productName: "REDECAN Redees Pre-Rolls 10pk",
      condition: "Alert when this product goes out of stock at 3+ stores",
      active: true,
      triggered: false,
      createdAt: "2w ago",
      lastTriggered: null,
    },
    {
      id: "5",
      type: "price_decrease",
      productName: "Good Supply Pineapple Express 3.5g",
      condition: "Alert when price drops by 10% or more",
      active: true,
      triggered: true,
      createdAt: "1w ago",
      lastTriggered: "12h ago",
      triggerDetails: {
        store: "Tokyo Smoke - Robson",
        message: "Price dropped by 12% to $24.99 (was $28.39)",
        timestamp: "12h ago",
      },
    },
    {
      id: "6",
      type: "price_increase",
      productName: "7ACRES Jack Haze 3.5g",
      condition: "Alert when price increases by 5% or more",
      active: false,
      triggered: false,
      createdAt: "3w ago",
      lastTriggered: "2d ago",
    },
  ];
}


