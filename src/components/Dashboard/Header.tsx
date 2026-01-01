import { Wallet } from "lucide-react";
import { AddExpenseModal } from "./AddExpenseModal";
import { ThemeToggle } from "./ThemeToggle";
import { ExpenseFormData } from "@/types/expense";

interface HeaderProps {
  onAddExpense: (expense: ExpenseFormData) => void;
}

export function Header({ onAddExpense }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20">
          <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base sm:text-xl font-bold text-foreground tracking-tight">
            Expense Tracker
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Personal financial analytics
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <AddExpenseModal onAddExpense={onAddExpense} />
      </div>
    </header>
  );
}
