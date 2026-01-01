import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { PaymentMethodData } from "@/types/expense";
import { formatCurrency, formatNumber } from "@/lib/expenseUtils";
import { PAYMENT_METHOD_COLORS } from "@/lib/mockData";

interface PaymentMethodChartProps {
  data: PaymentMethodData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card p-3 border border-border/50">
        <p className="font-medium text-foreground">{data.name}</p>
        <p className="text-primary font-mono">{formatCurrency(data.value)}</p>
        <p className="text-xs text-muted-foreground">{data.count} transactions</p>
      </div>
    );
  }
  return null;
};

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  const total = data.reduce((sum, method) => sum + method.value, 0);

  return (
    <div className="glass-card p-2.5 opacity-0 animate-fade-up" style={{ animationDelay: "0.4s" }}>
      <div className="mb-1.5">
        <h3 className="font-medium text-xs sm:text-sm text-foreground">Payment Methods</h3>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
            barSize={16}
          >
            <XAxis 
              type="number" 
              tickFormatter={(value) => formatNumber(value)}
              stroke="hsl(var(--muted-foreground))"
              fontSize={9}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={9}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
            <Bar 
              dataKey="value" 
              radius={[0, 3, 3, 0]}
              animationBegin={400}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={PAYMENT_METHOD_COLORS[entry.name]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
        {data.map((method) => {
          const percentage = ((method.value / total) * 100).toFixed(0);
          return (
            <div key={method.name} className="flex items-center gap-1 text-xs">
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: PAYMENT_METHOD_COLORS[method.name] }}
              />
              <span className="text-muted-foreground">{method.name}</span>
              <span className="font-mono text-foreground">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
