"use client";

import { PlanTier } from "@/lib/types";
import { PLANS } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Check } from "lucide-react";

interface PlanStepProps {
  selectedPlan: PlanTier;
  onPlanChange: (plan: PlanTier) => void;
}

export function PlanStep({ selectedPlan, onPlanChange }: PlanStepProps) {
  const availablePlans = PLANS.filter(p => p.id !== "enterprise");

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedPlan} onValueChange={(v) => onPlanChange(v as PlanTier)}>
        <div className="grid gap-4">
          {availablePlans.map((plan) => (
            <Card 
              key={plan.id}
              className={selectedPlan === plan.id ? "border-primary shadow-md" : "cursor-pointer hover:border-primary/50"}
              onClick={() => onPlanChange(plan.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={plan.id} id={plan.id} />
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {plan.name}
                        {plan.id === "pro" && <Badge variant="default">Popular</Badge>}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <span className="text-2xl font-bold text-foreground">
                          {formatCurrency(plan.price)}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right text-sm space-y-1">
                    <div><span className="font-semibold">{plan.stores}</span> stores</div>
                    <div><span className="font-semibold">{plan.seats}</span> seats</div>
                    <div><span className="font-semibold">{plan.alerts}</span> alerts</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-2 gap-2 text-sm">
                  {plan.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}


