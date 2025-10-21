"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ALERT_TEMPLATES } from "@/lib/mock-data";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface AlertLibraryProps {
  alertsUsed: number;
  alertsLimit: number;
}

export function AlertLibrary({ alertsUsed, alertsLimit }: AlertLibraryProps) {
  const [configureOpen, setConfigureOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof ALERT_TEMPLATES[0] | null>(null);
  
  const canAddMore = alertsUsed < alertsLimit;

  const handleConfigure = (template: typeof ALERT_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setConfigureOpen(true);
  };

  const handleSave = () => {
    toast.success("Alert rule created successfully");
    setConfigureOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {ALERT_TEMPLATES.map((template) => (
          <Card key={template.type} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-1.5">
                    {template.description}
                  </CardDescription>
                </div>
                <Badge variant="outline">{template.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Show config preview */}
                {template.type === "undercut" && (
                  <div className="text-sm text-muted-foreground">
                    Default threshold: {template.config.threshold}%
                  </div>
                )}
                {template.type === "new_sku" && (
                  <div className="text-sm text-muted-foreground">
                    Watching: {template.config.brands?.join(", ")}
                  </div>
                )}
                {template.type === "median_move" && (
                  <div className="text-sm text-muted-foreground">
                    Threshold: {template.config.threshold}%
                  </div>
                )}

                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleConfigure(template)}
                  disabled={!canAddMore}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Configure & Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!canAddMore && (
        <Card className="border-orange-300 bg-orange-50">
          <CardContent className="pt-6">
            <p className="text-sm text-orange-900">
              You've reached your alert limit. Upgrade your plan to add more alert rules.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Configuration Drawer */}
      <Sheet open={configureOpen} onOpenChange={setConfigureOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Configure {selectedTemplate?.name}</SheetTitle>
            <SheetDescription>
              {selectedTemplate?.description}
            </SheetDescription>
          </SheetHeader>

          {selectedTemplate && (
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input 
                  id="rule-name" 
                  defaultValue={selectedTemplate.name}
                  placeholder="Give this rule a name"
                />
              </div>

              {selectedTemplate.type === "undercut" && (
                <div className="space-y-2">
                  <Label htmlFor="threshold">Threshold (%)</Label>
                  <Input 
                    id="threshold" 
                    type="number"
                    defaultValue={selectedTemplate.config.threshold}
                    placeholder="10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Alert when competitors price below you by this percentage
                  </p>
                </div>
              )}

              {selectedTemplate.type === "new_sku" && (
                <div className="space-y-2">
                  <Label htmlFor="brands">Watched Brands</Label>
                  <Input 
                    id="brands" 
                    defaultValue={selectedTemplate.config.brands?.join(", ")}
                    placeholder="Brand 1, Brand 2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of brands to monitor
                  </p>
                </div>
              )}

              {selectedTemplate.type === "median_move" && (
                <div className="space-y-2">
                  <Label htmlFor="move-threshold">Threshold (%)</Label>
                  <Input 
                    id="move-threshold" 
                    type="number"
                    defaultValue={selectedTemplate.config.threshold}
                    placeholder="5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Alert when market median moves by this percentage
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="frequency">Alert Frequency</Label>
                <Select defaultValue="immediate">
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="channel">Notification Channel</Label>
                <Select defaultValue="email">
                  <SelectTrigger id="channel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="both">Email & SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  Create Rule
                </Button>
                <Button variant="outline" onClick={() => setConfigureOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}


