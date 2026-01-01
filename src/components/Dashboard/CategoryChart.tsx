import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CategoryData } from "@/types/expense";
import { formatCurrency } from "@/lib/expenseUtils";

interface CategoryChartProps {
  data: CategoryData[];
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

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4 justify-center">
      {payload?.slice(0, 6).map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1.5">
          <div 
            className="w-2.5 h-2.5 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function CategoryChart({ data }: CategoryChartProps) {
  const topCategories = data.slice(0, 6);
  const total = topCategories.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div className="glass-card p-2.5 opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
      <div className="mb-1.5">
        <h3 className="font-medium text-xs sm:text-sm text-foreground">By Category</h3>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={topCategories}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={50}
              paddingAngle={2}
              dataKey="value"
              animationBegin={300}
              animationDuration={800}
            >
              {topCategories.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {topCategories.slice(0, 4).map((cat) => (
          <div key={cat.name} className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
            <span className="text-xs text-muted-foreground">{cat.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-1.5 pt-1.5 border-t border-border/50 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Total</span>
        <span className="font-mono text-xs font-semibold text-primary">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
