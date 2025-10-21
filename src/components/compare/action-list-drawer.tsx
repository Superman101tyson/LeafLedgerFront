"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, TrendingUp, Tag, Package, Download } from "lucide-react";

type ActionItem = {
  id: string;
  type: "pricing" | "sales" | "inventory" | "alert";
  product: string;
  category: string;
  recommendation: string;
  impact: string;
  status: "saved" | "implemented" | "dismissed";
  savedAt: Date;
  implementedAt?: Date;
};

export function ActionListDrawer({ 
  trigger, 
  items = [] 
}: { 
  trigger: React.ReactNode;
  items?: ActionItem[];
}) {
  const [actionItems, setActionItems] = useState<ActionItem[]>(items);

  const savedItems = actionItems.filter(item => item.status === "saved");
  const implementedItems = actionItems.filter(item => item.status === "implemented");
  const dismissedItems = actionItems.filter(item => item.status === "dismissed");

  const handleMarkImplemented = (id: string) => {
    setActionItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, status: "implemented" as const, implementedAt: new Date() }
          : item
      )
    );
  };

  const handleDismiss = (id: string) => {
    setActionItems(items =>
      items.map(item =>
        item.id === id ? { ...item, status: "dismissed" as const } : item
      )
    );
  };

  const handleRestore = (id: string) => {
    setActionItems(items =>
      items.map(item =>
        item.id === id ? { ...item, status: "saved" as const } : item
      )
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pricing":
        return <TrendingUp className="h-4 w-4" />;
      case "sales":
        return <Tag className="h-4 w-4" />;
      case "inventory":
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "pricing":
        return "Price Change";
      case "sales":
        return "Sale/Promo";
      case "inventory":
        return "Inventory";
      case "alert":
        return "Market Alert";
      default:
        return type;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderActionItem = (item: ActionItem, showActions: boolean = true) => (
    <Card key={item.id} className="mb-3">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getTypeIcon(item.type)}
              <span className="ml-1">{getTypeLabel(item.type)}</span>
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
          </div>
          {item.status === "implemented" && (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Implemented
            </Badge>
          )}
        </div>

        <h4 className="font-semibold text-sm mb-2">{item.product}</h4>
        <p className="text-sm mb-2">{item.recommendation}</p>
        <p className="text-xs text-muted-foreground mb-3">{item.impact}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>Saved {formatDate(item.savedAt)}</span>
          {item.implementedAt && (
            <span>Implemented {formatDate(item.implementedAt)}</span>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2">
            {item.status === "saved" && (
              <>
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1"
                  onClick={() => handleMarkImplemented(item.id)}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Mark Implemented
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDismiss(item.id)}
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Dismiss
                </Button>
              </>
            )}
            {item.status === "dismissed" && (
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => handleRestore(item.id)}
              >
                Restore
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Action List</SheetTitle>
          <SheetDescription>
            Track recommendations you've saved to implement in your POS system
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {actionItems.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No saved actions yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Save recommendations from the Market Advisor to track them here
              </p>
            </div>
          ) : (
            <Tabs defaultValue="saved" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="saved">
                  To Do ({savedItems.length})
                </TabsTrigger>
                <TabsTrigger value="implemented">
                  Done ({implementedItems.length})
                </TabsTrigger>
                <TabsTrigger value="dismissed">
                  Dismissed ({dismissedItems.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="saved" className="space-y-2">
                {savedItems.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No pending actions
                  </p>
                ) : (
                  <>
                    <div className="flex justify-end mb-3">
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                    {savedItems.map(item => renderActionItem(item))}
                  </>
                )}
              </TabsContent>

              <TabsContent value="implemented" className="space-y-2">
                {implementedItems.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No implemented actions yet
                  </p>
                ) : (
                  implementedItems.map(item => renderActionItem(item, false))
                )}
              </TabsContent>

              <TabsContent value="dismissed" className="space-y-2">
                {dismissedItems.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No dismissed actions
                  </p>
                ) : (
                  dismissedItems.map(item => renderActionItem(item))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}


