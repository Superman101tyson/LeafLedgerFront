"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlanTier } from "@/lib/types";
import { PlanStep } from "@/components/onboarding/plan-step";
import { StoresStep } from "@/components/onboarding/stores-step";
import { LockConfirmationStep } from "@/components/onboarding/lock-confirmation-step";
import { AlertsStep } from "@/components/onboarding/alerts-step";
import { CheckoutStep } from "@/components/onboarding/checkout-step";

const STEPS = [
  { id: 1, title: "Choose Plan", description: "Select your subscription tier" },
  { id: 2, title: "Select Stores", description: "Choose stores to track" },
  { id: 3, title: "Lock Confirmation", description: "Review your selections" },
  { id: 4, title: "Configure Alerts", description: "Set up default alerts" },
  { id: 5, title: "Checkout", description: "Complete your setup" },
];

function OnboardingContent() {
  const searchParams = useSearchParams();
  const initialPlan = (searchParams.get("plan") as PlanTier) || "lite";

  const [currentStep, setCurrentStep] = useState(1);
  const [plan, setPlan] = useState<PlanTier>(initialPlan);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [lockConfirmed, setLockConfirmed] = useState(false);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to LeafLedger</h1>
          <p className="text-muted-foreground">
            Let's get you set up in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  Step {currentStep} of {STEPS.length}
                </span>
                <span className="text-muted-foreground">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} />
              <div className="flex justify-between text-xs text-muted-foreground pt-2">
                {STEPS.map((step) => (
                  <span 
                    key={step.id}
                    className={currentStep === step.id ? "text-foreground font-medium" : ""}
                  >
                    {step.title}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStep === 1 && (
              <PlanStep selectedPlan={plan} onPlanChange={setPlan} />
            )}
            {currentStep === 2 && (
              <StoresStep
                plan={plan}
                selectedStores={selectedStores}
                onStoresChange={setSelectedStores}
              />
            )}
            {currentStep === 3 && (
              <LockConfirmationStep
                plan={plan}
                selectedStores={selectedStores}
                confirmed={lockConfirmed}
                onConfirmChange={setLockConfirmed}
              />
            )}
            {currentStep === 4 && (
              <AlertsStep
                plan={plan}
                selectedAlerts={selectedAlerts}
                onAlertsChange={setSelectedAlerts}
              />
            )}
            {currentStep === 5 && (
              <CheckoutStep
                plan={plan}
                storeCount={selectedStores.length}
                alertCount={selectedAlerts.length}
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 2 && selectedStores.length === 0) ||
                  (currentStep === 3 && !lockConfirmed) ||
                  currentStep === 5
                }
              >
                {currentStep === STEPS.length ? "Complete" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}


