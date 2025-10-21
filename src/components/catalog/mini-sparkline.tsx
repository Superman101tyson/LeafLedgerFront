"use client";

import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface MiniSparklineProps {
  data: Array<{ date: string; price: number }>;
}

export function MiniSparkline({ data }: MiniSparklineProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border rounded-lg shadow-lg p-2 text-sm">
                  <p className="font-medium">{formatCurrency(payload[0].value as number)}</p>
                  <p className="text-xs text-muted-foreground">{payload[0].payload.date}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke="hsl(142 76% 36%)" 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}


