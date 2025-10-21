"use client";

import { PlanTier } from "@/lib/types";
import { PLANS, ALERT_TEMPLATES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bell } from "lucide-react";

interface AlertsStepProps {
  plan: PlanTier;
  selectedAlerts: string[];
  onAlertsChange: (alerts: string[]) => void;
}

export function AlertsStep({ plan, selectedAlerts, onAlertsChange }: AlertsStepProps) {
  const planDetails = PLANS.find(p => p.id === plan);
  const maxAlerts = planDetails?.alerts || 5;
  const isAtLimit = selectedAlerts.length >= maxAlerts;

  // Pre-select first 3 alerts by default
  if (selectedAlerts.length === 0 && ALERT_TEMPLATES.length >= 3) {
    onAlertsChange(ALERT_TEMPLATES.slice(0, 3).map(t => t.type));
  }

  const toggleAlert = (alertType: string) => {
    if (selectedAlerts.includes(alertType)) {
      onAlertsChange(selectedAlerts.filter(a => a !== alertType));
    } else if (!isAtLimit) {
      onAlertsChange([...selectedAlerts, alertType]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Limit Indicator */}
      <Card className={isAtLimit ? "border-orange-300 bg-orange-50" : ""}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isAtLimit && <AlertCircle className="h-5 w-5 text-orange-600" />}
              <Bell className="h-5 w-5" />
              <span className="font-medium">
                {selectedAlerts.length} of {maxAlerts} alert rules configured
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            We've pre-selected the most popular alert rules to get you started. 
            You can customize these later in your dashboard.
          </p>
        </CardContent>
      </Card>

      {/* Alert Templates */}
      <div className="space-y-3">
        {ALERT_TEMPLATES.map((template) => {
          const isSelected = selectedAlerts.includes(template.type);
          const canSelect = !isAtLimit || isSelected;

          return (
            <Card 
              key={template.type}
              className={`cursor-pointer transition-colors ${isSelected ? "border-primary bg-accent" : ""} ${!canSelect ? "opacity-50" : ""}`}
              onClick={() => canSelect && toggleAlert(template.type)}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Checkbox 
                    checked={isSelected}
                    disabled={!canSelect}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      {isSelected && <Badge variant="default">Active</Badge>}
                    </div>
                    <CardDescription className="mt-1.5">
                      {template.description}
                    </CardDescription>
                    {template.config && Object.keys(template.config).length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {template.type === "undercut" && `Threshold: ${template.config.threshold}%`}
                        {template.type === "new_sku" && `Watching: ${template.config.brands?.join(", ")}`}
                        {template.type === "median_move" && `Threshold: ${template.config.threshold}%`}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Footer Note */}
      <p className="text-sm text-muted-foreground text-center pt-4">
        You can add, remove, or customize alert rules anytime from your dashboard.
      </p>
    </div>
  );
}


