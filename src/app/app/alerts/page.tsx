"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, BellRing, Plus, Settings, Check, X } from "lucide-react";
import { AlertsList } from "@/components/alerts/alerts-list";
import { CreateAlertModal } from "@/components/alerts/create-alert-modal";

export default function AlertsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  // Mock metrics
  const metrics = {
    activeAlerts: 8,
    triggeredToday: 3,
    totalTriggered7d: 12,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="Price Alerts"
        subtitle="Monitor competitor pricing and get notified of important changes"
        actions={
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Active Alerts"
          value={metrics.activeAlerts}
          subtitle="currently monitoring"
          icon={<Bell className="h-5 w-5" />}
        />
        <MetricCard
          title="Triggered Today"
          value={metrics.triggeredToday}
          subtitle="new notifications"
          icon={<BellRing className="h-5 w-5" />}
        />
        <MetricCard
          title="Last 7 Days"
          value={metrics.totalTriggered7d}
          subtitle="total triggers"
          icon={<BellRing className="h-5 w-5" />}
        />
      </div>

      {/* Alert Types Info */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 mb-2">Alert Types Available</p>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
                <div>
                  <span className="font-semibold">Price Change:</span> Monitor specific products for price increases/decreases
                </div>
                <div>
                  <span className="font-semibold">New SKU:</span> Get notified when competitors add new products
                </div>
                <div>
                  <span className="font-semibold">Out of Stock:</span> Track when competitors run out of popular items
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs: Active / Triggered / Paused */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">
            Active <Badge variant="secondary" className="ml-2">{metrics.activeAlerts}</Badge>
          </TabsTrigger>
          <TabsTrigger value="triggered">
            Triggered <Badge variant="destructive" className="ml-2">{metrics.triggeredToday}</Badge>
          </TabsTrigger>
          <TabsTrigger value="paused">
            Paused
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <AlertsList filter="active" />
        </TabsContent>

        <TabsContent value="triggered" className="mt-6">
          <AlertsList filter="triggered" />
        </TabsContent>

        <TabsContent value="paused" className="mt-6">
          <AlertsList filter="paused" />
        </TabsContent>
      </Tabs>

      {/* Create Alert Modal */}
      <CreateAlertModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
}
