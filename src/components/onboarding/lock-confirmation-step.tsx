"use client";

import { PlanTier } from "@/lib/types";
import { PLANS, BC_STORES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface LockConfirmationStepProps {
  plan: PlanTier;
  selectedStores: string[];
  confirmed: boolean;
  onConfirmChange: (confirmed: boolean) => void;
}

const SWAP_QUOTAS: Record<PlanTier, number> = {
  lite: 2,
  starter: 2,
  pro: 5,
  provincial: 20,
  enterprise: 999,
};

export function LockConfirmationStep({ 
  plan, 
  selectedStores, 
  confirmed, 
  onConfirmChange 
}: LockConfirmationStepProps) {
  const swapQuota = SWAP_QUOTAS[plan] || 2;
  const stores = BC_STORES.filter(s => selectedStores.includes(s.id));

  return (
    <div className="space-y-6">
      {/* Warning Card */}
      <Card className="border-orange-300 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium text-orange-900">
                Important: Store Selection Lock
              </p>
              <p className="text-sm text-orange-800">
                Once confirmed, your tracked stores will be locked. You can swap up to {swapQuota} stores per month, 
                but changes require advance notice and will activate at the next refresh cycle.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Stores Review */}
      <Card>
        <CardHeader>
          <CardTitle>Your Selected Stores ({selectedStores.length})</CardTitle>
          <CardDescription>
            Review your selections before confirming
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stores.map(store => (
              <div 
                key={store.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{store.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {store.chain} • {store.city}
                  </div>
                </div>
                <Badge variant="outline">{store.city}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quota Information */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Swap Quota</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Available swaps per month:</span>
              <span className="font-semibold text-lg">{swapQuota}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Store swaps take effect at the next scheduled data refresh (typically within 12 hours).
              Additional swaps can be purchased as needed.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Checkbox */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Checkbox 
              id="lock-confirm"
              checked={confirmed}
              onCheckedChange={(checked) => onConfirmChange(checked as boolean)}
            />
            <div className="space-y-1">
              <Label 
                htmlFor="lock-confirm"
                className="text-base font-medium cursor-pointer"
              >
                I understand and agree to the store lock policy
              </Label>
              <p className="text-sm text-muted-foreground">
                I acknowledge that my store selections will be locked and can only be changed {swapQuota} times per month.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


