import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: number;
  subtitle?: string;
  className?: string;
}

export function MetricCard({ title, value, delta, subtitle, className }: MetricCardProps) {
  const deltaColor = delta 
    ? delta > 0 
      ? "text-green-600" 
      : delta < 0 
        ? "text-red-600" 
        : "text-muted-foreground"
    : undefined;

  const DeltaIcon = delta 
    ? delta > 0 
      ? TrendingUp 
      : delta < 0 
        ? TrendingDown 
        : Minus
    : null;

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-3xl font-bold">{value}</p>
            {delta !== undefined && DeltaIcon && (
              <div className={cn("flex items-center gap-1 text-sm font-medium", deltaColor)}>
                <DeltaIcon className="h-4 w-4" />
                <span>{formatPercent(delta)}</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


