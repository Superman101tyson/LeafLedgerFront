"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

interface ScopeBarProps {
  competitorSet?: string;
  onCompetitorSetChange?: (value: string) => void;
  dateRange?: string;
  onDateRangeChange?: (value: string) => void;
  showParentVariant?: boolean;
  viewMode?: "parent" | "variant";
  onViewModeChange?: (mode: "parent" | "variant") => void;
}

export function ScopeBar({
  competitorSet = "all",
  onCompetitorSetChange,
  dateRange = "30d",
  onDateRangeChange,
  viewMode = "variant",
  onViewModeChange,
}: ScopeBarProps) {
  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-wrap items-center gap-6">
        {/* Competitor Set */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <Label htmlFor="competitor-set" className="text-sm font-medium whitespace-nowrap">
            Competitor Set:
          </Label>
          <Select value={competitorSet} onValueChange={onCompetitorSetChange}>
            <SelectTrigger id="competitor-set" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tracked</SelectItem>
              <SelectItem value="vancouver">Vancouver</SelectItem>
              <SelectItem value="victoria">Victoria</SelectItem>
              <SelectItem value="kelowna">Kelowna</SelectItem>
              <SelectItem value="custom">Custom Set</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <Label htmlFor="date-range" className="text-sm font-medium whitespace-nowrap">
            Period:
          </Label>
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger id="date-range" className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Parent/Variant Toggle */}
        <div className="flex items-center gap-2">
          <Label htmlFor="view-mode" className="text-sm font-medium whitespace-nowrap">
            Show Variants:
          </Label>
          <Switch
            id="view-mode"
            checked={viewMode === "variant"}
            onCheckedChange={(checked) => onViewModeChange?.(checked ? "variant" : "parent")}
          />
        </div>
      </div>
    </Card>
  );
}


