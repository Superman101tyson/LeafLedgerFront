import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DataFreshnessProps {
  lastUpdated: Date | string;
  nextUpdate?: Date | string;
}

export function DataFreshness({ lastUpdated, nextUpdate }: DataFreshnessProps) {
  const now = new Date();
  const updated = new Date(lastUpdated);
  const diffMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
  
  let freshnessText = "";
  if (diffMinutes < 60) {
    freshnessText = `${diffMinutes}m ago`;
  } else if (diffMinutes < 1440) {
    freshnessText = `${Math.floor(diffMinutes / 60)}h ago`;
  } else {
    freshnessText = formatDate(updated);
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="gap-1.5">
        <Clock className="h-3 w-3" />
        <span className="text-xs">Updated {freshnessText}</span>
      </Badge>
      {nextUpdate && (
        <span className="text-xs text-muted-foreground">
          Next refresh in {Math.floor((new Date(nextUpdate).getTime() - now.getTime()) / (1000 * 60))}m
        </span>
      )}
    </div>
  );
}


