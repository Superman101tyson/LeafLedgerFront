"use client";

import { useState } from "react";
import Link from "next/link";
import { PlanTier } from "@/lib/types";
import { PLANS } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Check, CreditCard, Sparkles } from "lucide-react";

interface CheckoutStepProps {
  plan: PlanTier;
  storeCount: number;
  alertCount: number;
}

export function CheckoutStep({ plan, storeCount, alertCount }: CheckoutStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const planDetails = PLANS.find(p => p.id === plan);
  
  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <div className="space-y-6 text-center py-12">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Welcome to LeafLedger!</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your account has been created successfully. Your first data refresh will begin shortly.
          </p>
        </div>
        <Card className="max-w-md mx-auto text-left">
          <CardHeader>
            <CardTitle className="text-lg">What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Data Collection Starting</p>
                <p className="text-sm text-muted-foreground">
                  Your first market data will be ready in 2-4 hours
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Alerts Configured</p>
                <p className="text-sm text-muted-foreground">
                  {alertCount} alert rules are now active
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Subscription Active</p>
                <p className="text-sm text-muted-foreground">
                  {planDetails?.name} plan is now active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/app/catalog">
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/app/settings">
              View Settings
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your subscription details</CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              New Subscription
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-lg">{planDetails?.name} Plan</span>
              <span className="text-2xl font-bold">{formatCurrency(planDetails?.price || 0)}</span>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tracked Stores</span>
                <span className="font-medium">{storeCount} selected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Alert Rules</span>
                <span className="font-medium">{alertCount} configured</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Team Seats</span>
                <span className="font-medium">{planDetails?.seats}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Data Refresh</span>
                <span className="font-medium">2× Daily</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between font-medium">
              <span>Monthly Subscription</span>
              <span className="text-2xl">{formatCurrency(planDetails?.price || 0)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Billed monthly. First charge will be processed today.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Info (Mock) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
          <CardDescription>
            Secure payment via Stripe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your payment will be processed securely. You can manage your payment method anytime in billing settings.
          </p>
        </CardContent>
      </Card>

      {/* Action Button */}
      <Button 
        size="lg" 
        className="w-full text-lg h-12"
        onClick={handleCheckout}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Complete Setup"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}

