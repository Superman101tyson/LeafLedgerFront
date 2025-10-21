"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PlanTier } from "@/lib/types";
import { PLANS, ADDONS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface UpgradeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: PlanTier;
}

export function UpgradeDrawer({ open, onOpenChange, currentPlan }: UpgradeDrawerProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(currentPlan);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const availablePlans = PLANS.filter(p => p.id !== "enterprise");
  const selectedPlanDetails = PLANS.find(p => p.id === selectedPlan);
  const currentPlanDetails = PLANS.find(p => p.id === currentPlan);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const calculateTotal = () => {
    const planPrice = selectedPlanDetails?.price || 0;
    const addonsPrice = selectedAddons.reduce((sum, addonId) => {
      const addon = ADDONS.find(a => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);
    return planPrice + addonsPrice;
  };

  const calculateProration = () => {
    // Mock proration calculation
    const currentPrice = currentPlanDetails?.price || 0;
    const newPrice = selectedPlanDetails?.price || 0;
    const daysLeft = 23; // days until renewal
    const daysInMonth = 30;
    
    return ((newPrice - currentPrice) * daysLeft) / daysInMonth;
  };

  const handleConfirm = () => {
    toast.success("Plan updated successfully!");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Upgrade Your Plan</SheetTitle>
          <SheetDescription>
            Change your plan or add new features
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs defaultValue="plans">
            <TabsList className="w-full">
              <TabsTrigger value="plans" className="flex-1">Change Plan</TabsTrigger>
              <TabsTrigger value="addons" className="flex-1">Add-ons</TabsTrigger>
            </TabsList>

            {/* Plans Tab */}
            <TabsContent value="plans" className="space-y-4 mt-4">
              <RadioGroup value={selectedPlan} onValueChange={(v) => setSelectedPlan(v as PlanTier)}>
                <div className="space-y-3">
                  {availablePlans.map((plan) => {
                    const isCurrent = plan.id === currentPlan;
                    const isUpgrade = plan.price > (currentPlanDetails?.price || 0);

                    return (
                      <Card 
                        key={plan.id}
                        className={`cursor-pointer transition-all ${
                          selectedPlan === plan.id ? "border-primary shadow-md" : ""
                        } ${isCurrent ? "bg-accent/50" : ""}`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value={plan.id} id={plan.id} />
                              <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                  {plan.name}
                                  {isCurrent && (
                                    <Badge variant="secondary" className="text-xs">Current</Badge>
                                  )}
                                  {plan.id === "pro" && !isCurrent && (
                                    <Badge variant="default" className="text-xs gap-1">
                                      <Sparkles className="h-3 w-3" />
                                      Popular
                                    </Badge>
                                  )}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  <span className="text-xl font-bold text-foreground">
                                    {formatCurrency(plan.price)}
                                  </span>
                                  <span className="text-muted-foreground">/month</span>
                                </CardDescription>
                              </div>
                            </div>
                            {isUpgrade && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Upgrade
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div className="text-muted-foreground">Stores: <span className="font-semibold text-foreground">{plan.stores}</span></div>
                            <div className="text-muted-foreground">Seats: <span className="font-semibold text-foreground">{plan.seats}</span></div>
                            <div className="text-muted-foreground">Alerts: <span className="font-semibold text-foreground">{plan.alerts}</span></div>
                            <div className="text-muted-foreground">Swaps: <span className="font-semibold text-foreground">{plan.swaps}</span></div>
                          </div>
                          <ul className="space-y-1.5">
                            {plan.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-xs">
                                <Check className="h-3 w-3 text-primary shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </RadioGroup>
            </TabsContent>

            {/* Add-ons Tab */}
            <TabsContent value="addons" className="space-y-4 mt-4">
              <div className="space-y-3">
                {ADDONS.map((addon) => (
                  <Card 
                    key={addon.id}
                    className={`cursor-pointer transition-all ${
                      selectedAddons.includes(addon.id) ? "border-primary bg-accent/50" : ""
                    }`}
                    onClick={() => toggleAddon(addon.id)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedAddons.includes(addon.id)}
                          onCheckedChange={() => toggleAddon(addon.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{addon.name}</div>
                              <div className="text-sm text-muted-foreground mt-0.5">
                                {addon.description}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{formatCurrency(addon.price)}</div>
                              <div className="text-xs text-muted-foreground">per month</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan: {selectedPlanDetails?.name}</span>
                <span className="font-semibold">{formatCurrency(selectedPlanDetails?.price || 0)}</span>
              </div>
              
              {selectedAddons.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    {selectedAddons.map(addonId => {
                      const addon = ADDONS.find(a => a.id === addonId);
                      return addon ? (
                        <div key={addonId} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{addon.name}</span>
                          <span className="font-semibold">{formatCurrency(addon.price)}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </>
              )}

              <Separator />
              
              {selectedPlan !== currentPlan && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Prorated charge today</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(Math.max(0, calculateProration()))}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-base pt-2">
                <span className="font-semibold">Monthly Total</span>
                <span className="text-2xl font-bold">{formatCurrency(calculateTotal())}</span>
              </div>

              <Button 
                className="w-full mt-4" 
                size="lg"
                onClick={handleConfirm}
                disabled={selectedPlan === currentPlan && selectedAddons.length === 0}
              >
                Confirm Changes
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Changes will take effect immediately. You'll be charged the prorated amount today.
              </p>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}


