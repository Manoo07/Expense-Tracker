import { useState, useMemo } from "react";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { Expense, ExpenseFormData, Category, PaymentMethod } from "@/types/expense";
import { generateMockExpenses } from "@/lib/mockData";
import {
  calculateDashboardStats,
  getCategoryData,
  getPaymentMethodData,
  getTrendData,
} from "@/lib/expenseUtils";
import { Header } from "@/components/Dashboard/Header";
import { SummaryCards } from "@/components/Dashboard/SummaryCards";
import { CategoryChart } from "@/components/Dashboard/CategoryChart";
import { PaymentMethodChart } from "@/components/Dashboard/PaymentMethodChart";
import { SpendingTrend } from "@/components/Dashboard/SpendingTrend";
import { ExpenseTable } from "@/components/Dashboard/ExpenseTable";
import { FilterPanel } from "@/components/Dashboard/FilterPanel";
import { SheetConnector } from "@/components/Dashboard/SheetConnector";
import { useGoogleSheet } from "@/hooks/useGoogleSheet";

const Index = () => {
  const {
    expenses: sheetExpenses,
    isConnected,
    isLoading,
    error,
    lastUpdated,
    connect,
    disconnect,
    refresh,
    setExpenses: setSheetExpenses,
  } = useGoogleSheet();

  // Use mock data when not connected to a sheet
  const [mockExpenses] = useState<Expense[]>(() => generateMockExpenses(150));
  
  const allExpenses = isConnected ? sheetExpenses : mockExpenses;

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>([]);
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const filteredExpenses = useMemo(() => {
    return allExpenses.filter((expense) => {
      const inDateRange = isWithinInterval(expense.dateOfExpense, {
        start: dateRange.from,
        end: dateRange.to,
      });

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(expense.category);

      const matchesPayment =
        selectedPaymentMethods.length === 0 ||
        selectedPaymentMethods.includes(expense.paymentMethod);

      return inDateRange && matchesCategory && matchesPayment;
    });
  }, [allExpenses, selectedCategories, selectedPaymentMethods, dateRange]);

  const stats = useMemo(() => calculateDashboardStats(filteredExpenses), [filteredExpenses]);
  const categoryData = useMemo(() => getCategoryData(filteredExpenses), [filteredExpenses]);
  const paymentData = useMemo(() => getPaymentMethodData(filteredExpenses), [filteredExpenses]);
  const trendData = useMemo(() => getTrendData(filteredExpenses, 30), [filteredExpenses]);

  const handleAddExpense = (formData: ExpenseFormData) => {
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      timestamp: new Date(),
      ...formData,
    };
    
    if (isConnected) {
      // Add to sheet expenses (local only for now)
      setSheetExpenses((prev) => [newExpense, ...prev]);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedPaymentMethods([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative container px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Header onAddExpense={handleAddExpense} />

        <div className="space-y-4 sm:space-y-6">
          {/* Google Sheet Connector */}
          <SheetConnector
            onConnect={connect}
            onDisconnect={disconnect}
            onRefresh={refresh}
            isConnected={isConnected}
            isLoading={isLoading}
            error={error}
            expenseCount={sheetExpenses.length}
            lastUpdated={lastUpdated}
          />

          {!isConnected && (
            <div className="glass-card p-3 sm:p-4 border-l-4 border-l-chart-5">
              <p className="text-xs sm:text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Demo Mode:</span> Showing sample data. 
                Connect your Google Sheet above to view your real expenses.
              </p>
            </div>
          )}

          <FilterPanel
            selectedCategories={selectedCategories}
            selectedPaymentMethods={selectedPaymentMethods}
            dateRange={dateRange}
            onCategoryChange={setSelectedCategories}
            onPaymentMethodChange={setSelectedPaymentMethods}
            onDateRangeChange={setDateRange}
            onClearFilters={handleClearFilters}
          />

          <SummaryCards stats={stats} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <CategoryChart data={categoryData} />
            <PaymentMethodChart data={paymentData} />
            <SpendingTrend data={trendData} />
          </div>

          <ExpenseTable expenses={filteredExpenses} />
        </div>
      </div>
    </div>
  );
};

export default Index;
