import { DashboardStats } from "@/types/expense";
import { formatCurrency } from "@/lib/expenseUtils";
import { TrendingUp, TrendingDown, Wallet, CreditCard, Calendar, ArrowUpRight } from "lucide-react";

interface SummaryCardsProps {
  stats: DashboardStats;
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Spent",
      value: formatCurrency(stats.totalSpent),
      subtitle: `${stats.transactionCount} transactions`,
      icon: Wallet,
      trend: null,
      color: "primary"
    },
    {
      title: "This Month",
      value: formatCurrency(stats.monthlySpent),
      subtitle: "Current month spending",
      icon: Calendar,
      trend: stats.monthlySpent > stats.averageDaily * 30 ? "up" : "down",
      color: "chart-2"
    },
    {
      title: "Daily Average",
      value: formatCurrency(Math.round(stats.averageDaily)),
      subtitle: "Last 30 days",
      icon: TrendingUp,
      trend: null,
      color: "chart-3"
    },
    {
      title: "Highest Expense",
      value: formatCurrency(stats.highestTransaction),
      subtitle: stats.mostUsedCategory,
      icon: ArrowUpRight,
      trend: null,
      color: "chart-4"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="glass-card-glow p-2.5 opacity-0 animate-fade-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className={`p-1 rounded bg-${card.color}/10`}>
              <card.icon className="w-3 h-3" style={{ color: `hsl(var(--${card.color}))` }} />
            </div>
            <p className="text-xs text-muted-foreground">{card.title}</p>
          </div>
          <p className="text-base sm:text-lg font-bold text-foreground tabular-nums">{card.value}</p>
          <p className="text-xs text-muted-foreground truncate">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
