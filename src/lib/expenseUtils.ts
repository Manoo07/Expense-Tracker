import { Expense, Category, PaymentMethod, CategoryData, PaymentMethodData, TrendData, DashboardStats } from "@/types/expense";
import { CATEGORY_COLORS } from "./mockData";
import { startOfMonth, endOfMonth, isWithinInterval, format, subDays, eachDayOfInterval } from "date-fns";

export function calculateDashboardStats(expenses: Expense[]): DashboardStats {
  if (expenses.length === 0) {
    return {
      totalSpent: 0,
      monthlySpent: 0,
      averageDaily: 0,
      transactionCount: 0,
      highestTransaction: 0,
      mostUsedCategory: "Other",
      mostUsedPayment: "UPI"
    };
  }

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const monthlyExpenses = expenses.filter(e => 
    isWithinInterval(e.dateOfExpense, { start: monthStart, end: monthEnd })
  );
  const monthlySpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate average daily (last 30 days)
  const thirtyDaysAgo = subDays(now, 30);
  const last30Days = expenses.filter(e => e.dateOfExpense >= thirtyDaysAgo);
  const averageDaily = last30Days.length > 0 
    ? last30Days.reduce((sum, e) => sum + e.amount, 0) / 30 
    : 0;

  const highestTransaction = Math.max(...expenses.map(e => e.amount));

  // Most used category
  const categoryCount = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);
  const mostUsedCategory = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0] as Category || "Other";

  // Most used payment method
  const paymentCount = expenses.reduce((acc, e) => {
    acc[e.paymentMethod] = (acc[e.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<PaymentMethod, number>);
  const mostUsedPayment = Object.entries(paymentCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0] as PaymentMethod || "UPI";

  return {
    totalSpent,
    monthlySpent,
    averageDaily,
    transactionCount: expenses.length,
    highestTransaction,
    mostUsedCategory,
    mostUsedPayment
  };
}

export function getCategoryData(expenses: Expense[]): CategoryData[] {
  const categoryMap = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = { value: 0, count: 0 };
    }
    acc[expense.category].value += expense.amount;
    acc[expense.category].count += 1;
    return acc;
  }, {} as Record<Category, { value: number; count: number }>);

  return Object.entries(categoryMap)
    .map(([name, data]) => ({
      name: name as Category,
      value: data.value,
      count: data.count,
      color: CATEGORY_COLORS[name as Category]
    }))
    .sort((a, b) => b.value - a.value);
}

export function getPaymentMethodData(expenses: Expense[]): PaymentMethodData[] {
  const methodMap = expenses.reduce((acc, expense) => {
    if (!acc[expense.paymentMethod]) {
      acc[expense.paymentMethod] = { value: 0, count: 0 };
    }
    acc[expense.paymentMethod].value += expense.amount;
    acc[expense.paymentMethod].count += 1;
    return acc;
  }, {} as Record<PaymentMethod, { value: number; count: number }>);

  return Object.entries(methodMap)
    .map(([name, data]) => ({
      name: name as PaymentMethod,
      value: data.value,
      count: data.count
    }))
    .sort((a, b) => b.value - a.value);
}

export function getTrendData(expenses: Expense[], days: number = 30): TrendData[] {
  const now = new Date();
  const startDate = subDays(now, days - 1);
  
  const dateRange = eachDayOfInterval({ start: startDate, end: now });
  
  const dailyTotals = dateRange.map(date => {
    const dayStr = format(date, "yyyy-MM-dd");
    const dayExpenses = expenses.filter(e => 
      format(e.dateOfExpense, "yyyy-MM-dd") === dayStr
    );
    return {
      date: format(date, "MMM dd"),
      amount: dayExpenses.reduce((sum, e) => sum + e.amount, 0)
    };
  });

  return dailyTotals;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 100000) {
    return `${(num / 100000).toFixed(1)}L`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
