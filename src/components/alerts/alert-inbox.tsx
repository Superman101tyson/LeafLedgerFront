"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertInboxItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Check, Clock, Eye, VolumeX, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function AlertInbox() {
  const [filter, setFilter] = useState<string>("all");
  
  // Mock inbox items
  const [items, setItems] = useState<AlertInboxItem[]>([
    {
      id: "1",
      ruleId: "rule-1",
      type: "undercut",
      message: "City Cannabis Co is pricing Broken Coast Sunset Sherbet 3.5g 12% below your price ($36.99 vs $41.99)",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "unread",
      variantId: "v1",
      storeId: "s1",
    },
    {
      id: "2",
      ruleId: "rule-2",
      type: "new_sku",
      message: "Simply Bare launched new product: Blue Dream Live Rosin 1g",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: "unread",
      variantId: "v2",
    },
    {
      id: "3",
      ruleId: "rule-3",
      type: "back_in_stock",
      message: "REDECAN Redees Pre-Rolls 10pk is back in stock at Spiritleaf Victoria",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      status: "unread",
      variantId: "v4",
      storeId: "s5",
    },
    {
      id: "4",
      ruleId: "rule-1",
      type: "median_move",
      message: "Market median for Spinach Blue Dream 3.5g increased by 8.5% ($32.99 → $35.79)",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "read",
      variantId: "v3",
    },
  ]);

  const filteredItems = items.filter(item => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const handleAck = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: "read" as const } : item
    ));
    toast.success("Alert acknowledged");
  };

  const handleSnooze = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: "snoozed" as const } : item
    ));
    toast.success("Alert snoozed for 24 hours");
  };

  const handleMute = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: "muted" as const } : item
    ));
    toast.success("Alert muted");
  };

  const handleViewLadder = (item: AlertInboxItem) => {
    if (item.variantId) {
      toast.info(`Would navigate to price ladder for variant ${item.variantId}`);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "undercut": return "💰";
      case "new_sku": return "✨";
      case "back_in_stock": return "📦";
      case "median_move": return "📈";
      case "rank_loss": return "⚠️";
      default: return "🔔";
    }
  };

  const getTimeSince = (timestamp: string) => {
    const now = Date.now();
    const then = new Date(timestamp).getTime();
    const diffMinutes = Math.floor((now - then) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center justify-between">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Alerts</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="snoozed">Snoozed</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="text-sm text-muted-foreground">
          {filteredItems.filter(i => i.status === "unread").length} unread
        </div>
      </div>

      {/* Alert Items */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No alerts to display
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <Card 
              key={item.id}
              className={item.status === "unread" ? "border-primary" : ""}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{getAlertIcon(item.type)}</div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {item.type.replace("_", " ")}
                          </Badge>
                          {item.status === "unread" && (
                            <Badge variant="default" className="text-xs">New</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {getTimeSince(item.timestamp)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm">{item.message}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {item.status === "unread" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAck(item.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSnooze(item.id)}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Snooze
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMute(item.id)}
                      >
                        <VolumeX className="h-3 w-3 mr-1" />
                        Mute
                      </Button>
                      {item.variantId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewLadder(item)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Ladder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


