import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendData } from "@/types/expense";
import { formatCurrency, formatNumber } from "@/lib/expenseUtils";

interface SpendingTrendProps {
  data: TrendData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-border/50">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-primary font-mono font-semibold">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export function SpendingTrend({ data }: SpendingTrendProps) {
  const maxAmount = Math.max(...data.map(d => d.amount));
  const avgAmount = data.reduce((sum, d) => sum + d.amount, 0) / data.length;

  return (
    <div className="glass-card p-2.5 opacity-0 animate-fade-up md:col-span-2 lg:col-span-1" style={{ animationDelay: "0.5s" }}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <h3 className="font-medium text-xs sm:text-sm text-foreground">Spending Trend</h3>
        <div className="flex gap-2 text-right">
          <div>
            <span className="text-xs text-muted-foreground">Peak </span>
            <span className="font-mono text-xs font-semibold text-foreground">{formatCurrency(maxAmount)}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Avg </span>
            <span className="font-mono text-xs font-semibold text-primary">{formatCurrency(Math.round(avgAmount))}</span>
          </div>
        </div>
      </div>

      <div className="h-[120px] sm:h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={8}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tickMargin={2}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={8}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatNumber(value)}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--primary))"
              strokeWidth={1.5}
              fill="url(#colorAmount)"
              animationBegin={500}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
