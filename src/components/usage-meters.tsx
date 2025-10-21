import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Users, Bell, ArrowLeftRight } from "lucide-react";

interface MeterProps {
  used: number;
  limit: number;
  label: string;
  icon: React.ReactNode;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

function UsageMeter({ used, limit, label, icon, ctaLabel, onCtaClick }: MeterProps) {
  const percentage = (used / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <span className={`text-sm font-semibold ${isAtLimit ? "text-destructive" : isNearLimit ? "text-orange-600" : ""}`}>
          {used} / {limit}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={isAtLimit ? "[&>div]:bg-destructive" : isNearLimit ? "[&>div]:bg-orange-500" : ""}
      />
      {ctaLabel && onCtaClick && (isNearLimit || isAtLimit) && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onCtaClick}
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}

interface UsageMetersProps {
  stores: { used: number; limit: number };
  swaps: { used: number; limit: number };
  alerts: { used: number; limit: number };
  seats: { used: number; limit: number };
  onAddStores?: () => void;
  onBuySwaps?: () => void;
  onAddAlerts?: () => void;
  onAddSeats?: () => void;
}

export function UsageMeters({
  stores,
  swaps,
  alerts,
  seats,
  onAddStores,
  onBuySwaps,
  onAddAlerts,
  onAddSeats,
}: UsageMetersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage & Limits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <UsageMeter
          used={stores.used}
          limit={stores.limit}
          label="Tracked Stores"
          icon={<Store className="h-4 w-4" />}
          ctaLabel="Add +5 Stores"
          onCtaClick={onAddStores}
        />
        
        <UsageMeter
          used={swaps.used}
          limit={swaps.limit}
          label="Store Swaps This Month"
          icon={<ArrowLeftRight className="h-4 w-4" />}
          ctaLabel="Buy +10 Swaps"
          onCtaClick={onBuySwaps}
        />
        
        <UsageMeter
          used={alerts.used}
          limit={alerts.limit}
          label="Alert Rules"
          icon={<Bell className="h-4 w-4" />}
          ctaLabel="Upgrade Plan"
          onCtaClick={onAddAlerts}
        />
        
        <UsageMeter
          used={seats.used}
          limit={seats.limit}
          label="Team Seats"
          icon={<Users className="h-4 w-4" />}
          ctaLabel="Add Seats"
          onCtaClick={onAddSeats}
        />
      </CardContent>
    </Card>
  );
}


