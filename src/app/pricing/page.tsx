import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { PLANS, ADDONS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time cannabis market intelligence for retailers across British Columbia
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {PLANS.map((plan) => (
            <Card 
              key={plan.id} 
              className={plan.id === "pro" ? "border-primary shadow-lg scale-105" : ""}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.id === "pro" && (
                    <Badge>Popular</Badge>
                  )}
                </div>
                <CardDescription>
                  {plan.id === "enterprise" ? (
                    <span className="text-2xl font-bold">Custom</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-foreground">
                        {formatCurrency(plan.price)}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tracked Stores</span>
                    <span className="font-semibold">
                      {plan.stores === 9999 ? "Unlimited" : plan.stores}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Team Seats</span>
                    <span className="font-semibold">
                      {plan.seats === 9999 ? "Unlimited" : plan.seats}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Alert Rules</span>
                    <span className="font-semibold">
                      {plan.alerts === 9999 ? "Unlimited" : plan.alerts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Monthly Swaps</span>
                    <span className="font-semibold">
                      {plan.swaps === 0 ? (
                        <span className="text-xs text-muted-foreground">Add-on</span>
                      ) : plan.swaps === 9999 ? (
                        "Unlimited"
                      ) : (
                        plan.swaps
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs font-semibold mb-3 text-muted-foreground uppercase">
                    Features
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                {plan.id === "enterprise" ? (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="mailto:sales@leafledger.io">Contact Sales</Link>
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={plan.id === "pro" ? "default" : "outline"}
                    asChild
                  >
                    <Link href="mailto:sales@leafledger.io?subject=Book a Demo">
                      Book a Demo
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Add-ons</h2>
            <p className="text-muted-foreground">
              Customize your plan with additional features
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {ADDONS.map((addon) => (
              <Badge 
                key={addon.id} 
                variant="outline" 
                className="px-4 py-2 text-sm font-medium hover:bg-accent cursor-pointer"
              >
                {addon.name} • {addon.price > 0 ? `${formatCurrency(addon.price)}/mo` : "Pricing TBD"}
              </Badge>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            * Monthly Swaps available as add-on for Lite and Starter plans
          </p>
        </div>

        {/* FAQ or Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>Schedule a personalized demo to see LeafLedger in action.</p>
          <p className="mt-2">
            Questions? <a href="mailto:support@leafledger.io" className="text-primary hover:underline">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
}

