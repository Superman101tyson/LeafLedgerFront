"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UsageMeters } from "@/components/usage-meters";
import { UpgradeDrawer } from "@/components/billing/upgrade-drawer";
import { useEntitlements, useUsage, useStores } from "@/lib/hooks";
import { PLANS, ADDONS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Calendar, Sparkles, MapPin, ArrowLeftRight } from "lucide-react";
import { SwapStoreModal } from "@/components/swap-store-modal";

export default function BillingPage() {
  const [upgradeDrawerOpen, setUpgradeDrawerOpen] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const entitlements = useEntitlements();
  const usage = useUsage();
  const trackedStores = useStores();

  const currentPlan = PLANS.find(p => p.id === entitlements.plan);
  const nextRenewal = new Date(Date.now() + 23 * 24 * 60 * 60 * 1000); // 23 days from now

  // Mock current add-ons
  const activeAddons = [
    { ...ADDONS[4], activated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // API
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <PageHeader
        title="Billing & Subscription"
        subtitle="Manage your plan, add-ons, and payment details"
      />

      <div className="space-y-6">
        {/* Current Plan Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentPlan?.name} Plan
                  <Badge variant="default" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Active
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Your current subscription tier
                </CardDescription>
              </div>
              <Button onClick={() => setUpgradeDrawerOpen(true)}>
                Upgrade Plan
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {formatCurrency(currentPlan?.price || 0)}
                  <span className="text-lg text-muted-foreground font-normal">/month</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Next renewal: {nextRenewal.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Visa ending in 4242</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Tracked Stores</div>
                <div className="text-2xl font-semibold mt-1">
                  {currentPlan?.stores === 9999 ? "∞" : currentPlan?.stores}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Team Seats</div>
                <div className="text-2xl font-semibold mt-1">
                  {currentPlan?.seats === 9999 ? "∞" : currentPlan?.seats}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Alert Rules</div>
                <div className="text-2xl font-semibold mt-1">
                  {currentPlan?.alerts === 9999 ? "∞" : currentPlan?.alerts}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Monthly Swaps</div>
                <div className="text-2xl font-semibold mt-1">
                  {currentPlan?.swaps === 0 ? (
                    <span className="text-sm text-muted-foreground">Add-on</span>
                  ) : currentPlan?.swaps === 9999 ? (
                    "∞"
                  ) : (
                    currentPlan?.swaps
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Add-ons */}
        {activeAddons.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Active Add-ons</CardTitle>
              <CardDescription>
                Your current add-on subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeAddons.map((addon) => (
                  <div 
                    key={addon.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{addon.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {addon.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Added {addon.activated.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(addon.price)}/mo
                      </div>
                      <Button variant="ghost" size="sm" className="mt-1 text-xs">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Meters */}
        <UsageMeters
          stores={{ used: usage.stores, limit: entitlements.maxStores }}
          swaps={{ used: usage.swapsUsed, limit: entitlements.monthlySwaps }}
          alerts={{ used: usage.alerts, limit: entitlements.maxAlerts }}
          seats={{ used: usage.seats, limit: entitlements.maxSeats }}
          onAddStores={() => setUpgradeDrawerOpen(true)}
          onBuySwaps={() => setUpgradeDrawerOpen(true)}
          onAddAlerts={() => setUpgradeDrawerOpen(true)}
          onAddSeats={() => setUpgradeDrawerOpen(true)}
        />

        {/* Tracked Stores */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tracked Stores</CardTitle>
                <CardDescription>
                  Stores selected for your subscription (locked)
                </CardDescription>
              </div>
              {entitlements.monthlySwaps === 0 ? (
                <Button 
                  variant="default" 
                  onClick={() => setUpgradeDrawerOpen(true)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Add Swap Addon
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setSwapModalOpen(true)}
                  disabled={entitlements.monthlySwaps - usage.swapsUsed <= 0}
                >
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Swap Store ({entitlements.monthlySwaps - usage.swapsUsed} left)
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trackedStores.map((store) => (
                <div 
                  key={store.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{store.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {store.chain && `${store.chain} • `}{store.city}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {store.address}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Store Lock Policy:</strong> Selected stores are locked to your subscription. 
                {entitlements.monthlySwaps === 0 ? (
                  <> Store swaps are available as an add-on for your plan. Click "Add Swap Addon" above to enable monthly store swaps.</>
                ) : (
                  <> You can swap up to {entitlements.monthlySwaps} stores per month 
                  ({entitlements.monthlySwaps - usage.swapsUsed} remaining this month).
                  Changes activate at the next data refresh.</>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Manage your billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
                <div>
                  <div className="font-medium">Visa ending in 4242</div>
                  <div className="text-sm text-muted-foreground">Expires 12/2025</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Update</Button>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              Your past invoices and payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => {
                const date = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000);
                return (
                  <div 
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {currentPlan?.name} Plan + Add-ons
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">Paid</Badge>
                      <div className="font-semibold">
                        {formatCurrency((currentPlan?.price || 0) + 199)}
                      </div>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade/Add-ons Drawer */}
      <UpgradeDrawer
        open={upgradeDrawerOpen}
        onOpenChange={setUpgradeDrawerOpen}
        currentPlan={entitlements.plan}
      />

      {/* Swap Store Modal */}
      <SwapStoreModal
        open={swapModalOpen}
        onOpenChange={setSwapModalOpen}
        currentStores={trackedStores}
        availableStores={[]} // Would fetch from API
        swapsRemaining={entitlements.monthlySwaps - usage.swapsUsed}
        nextRefreshTime={new Date(Date.now() + 3 * 60 * 60 * 1000)}
        onRequestSwap={(fromId, toId) => {
          console.log(`Swap requested: ${fromId} -> ${toId}`);
        }}
      />
    </div>
  );
}

