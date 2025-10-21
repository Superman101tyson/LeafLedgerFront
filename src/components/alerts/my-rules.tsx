"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ALERT_TEMPLATES } from "@/lib/mock-data";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface MyRulesProps {
  alertsUsed: number;
  alertsLimit: number;
}

export function MyRules({ alertsUsed, alertsLimit }: MyRulesProps) {
  // Mock active rules (using templates as base)
  const [rules, setRules] = useState(
    ALERT_TEMPLATES.slice(0, 3).map((template, idx) => ({
      id: `rule-${idx}`,
      ...template,
      enabled: idx < 2, // First 2 are enabled
      createdAt: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000),
    }))
  );

  const handleToggle = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
    toast.success("Rule updated");
  };

  const handleEdit = (ruleId: string) => {
    toast.info("Edit functionality would open configuration drawer");
  };

  const handleDelete = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    toast.success("Rule deleted");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Alert Rules</CardTitle>
              <CardDescription>
                Manage your configured price monitoring rules
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {rules.filter(r => r.enabled).length} active
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {rules.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No alert rules configured yet. Visit the Alert Library to create your first rule.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => handleToggle(rule.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{rule.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {rule.type}
                          </Badge>
                          {!rule.enabled && (
                            <Badge variant="secondary" className="text-xs">
                              Disabled
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rule.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pl-11">
                      {rule.type === "undercut" && (
                        <div>Threshold: {rule.config.threshold}%</div>
                      )}
                      {rule.type === "new_sku" && (
                        <div>Watching: {rule.config.brands?.join(", ")}</div>
                      )}
                      {rule.type === "median_move" && (
                        <div>Threshold: {rule.config.threshold}%</div>
                      )}
                      <div>Created: {rule.createdAt.toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(rule.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


