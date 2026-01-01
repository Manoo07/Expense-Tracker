import { useState } from "react";
import { Expense, Category } from "@/types/expense";
import { formatCurrency } from "@/lib/expenseUtils";
import { CATEGORY_COLORS } from "@/lib/mockData";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Receipt, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ExpenseTableProps {
  expenses: Expense[];
}

type SortField = "date" | "amount" | "category";
type SortOrder = "asc" | "desc";

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [visibleCount, setVisibleCount] = useState(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "date":
        comparison = a.dateOfExpense.getTime() - b.dateOfExpense.getTime();
        break;
      case "amount":
        comparison = a.amount - b.amount;
        break;
      case "category":
        comparison = a.category.localeCompare(b.category);
        break;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const visibleExpenses = sortedExpenses.slice(0, visibleCount);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
    ) : (
      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
    );
  };

  const getCategoryStyle = (category: Category) => ({
    backgroundColor: `${CATEGORY_COLORS[category]}20`,
    color: CATEGORY_COLORS[category],
    borderColor: `${CATEGORY_COLORS[category]}40`
  });

  return (
    <div className="glass-card opacity-0 animate-fade-up" style={{ animationDelay: "0.6s" }}>
      {/* Mobile Card View */}
      <div className="block sm:hidden max-h-[60vh] overflow-y-auto">
        {visibleExpenses.map((expense) => (
          <div 
            key={expense.id} 
            className="p-4 border-b border-border/30 last:border-b-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge 
                    variant="outline"
                    className="category-badge border text-xs"
                    style={getCategoryStyle(expense.category)}
                  >
                    {expense.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {expense.paymentMethod}
                  </span>
                </div>
                <p className="text-sm truncate text-foreground">
                  {expense.description || "-"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(expense.dateOfExpense, "MMM dd, yyyy")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono font-semibold text-foreground">
                  {formatCurrency(expense.amount)}
                </p>
                <div className="flex items-center justify-end gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2.5 h-2.5 ${
                        i < expense.importance
                          ? "fill-chart-5 text-chart-5"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block">
        {/* Fixed Header */}
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead
                className="cursor-pointer hover:text-foreground transition-colors bg-card w-[120px]"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-1">
                  Date
                  <SortIcon field="date" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground transition-colors bg-card w-[100px]"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center gap-1">
                  Category
                  <SortIcon field="category" />
                </div>
              </TableHead>
              <TableHead className="bg-card">Description</TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground transition-colors text-right bg-card w-[100px]"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center gap-1 justify-end">
                  Amount
                  <SortIcon field="amount" />
                </div>
              </TableHead>
              <TableHead className="bg-card w-[80px] text-center">Payment</TableHead>
              <TableHead className="text-center bg-card w-[100px]">Priority</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        
        {/* Scrollable Body */}
        <div className="max-h-[50vh] overflow-y-auto">
          <Table className="table-fixed">
            <TableBody>
            {visibleExpenses.map((expense) => (
              <TableRow 
                key={expense.id} 
                className="border-border/30 hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-mono text-xs text-muted-foreground w-[120px]">
                  {format(expense.dateOfExpense, "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="w-[100px]">
                  <Badge 
                    variant="outline"
                    className="category-badge border text-xs"
                    style={getCategoryStyle(expense.category)}
                  >
                    {expense.category}
                  </Badge>
                </TableCell>
                <TableCell className="truncate text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate">{expense.description || "-"}</span>
                    {expense.receiptRequired && (
                      <Receipt className="w-3 h-3 text-muted-foreground shrink-0" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-xs font-medium text-foreground w-[100px]">
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell className="w-[80px] text-center">
                  <span className="payment-badge text-xs">{expense.paymentMethod}</span>
                </TableCell>
                <TableCell className="w-[100px]">
                  <div className="flex items-center justify-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-2.5 h-2.5 ${
                          i < expense.importance
                            ? "fill-chart-5 text-chart-5"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>

      {visibleCount < expenses.length && (
        <div className="p-3 sm:p-4 border-t border-border/50">
          <button
            onClick={() => setVisibleCount(prev => Math.min(prev + 10, expenses.length))}
            className="w-full py-2 text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Load More ({expenses.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
