export type Category =
  | "Mobile"
  | "Groceries"
  | "Home"
  | "Loans"
  | "EMI"
  | "Transport"
  | "Health"
  | "Entertainment"
  | "Shopping"
  | "Food"
  | "Utilities"
  | "Other";

export type PaymentMethod = "UPI" | "Cash" | "Card" | "Bank Transfer";

export interface Expense {
  id: string;
  timestamp: Date;
  dateOfExpense: Date;
  category: Category;
  amount: number;
  description: string;
  paymentMethod: PaymentMethod;
  receiptRequired: boolean;
  importance: 1 | 2 | 3 | 4 | 5;
}

export interface ExpenseFormData {
  dateOfExpense: Date;
  category: Category;
  amount: number;
  description: string;
  paymentMethod: PaymentMethod;
  receiptRequired: boolean;
  importance: 1 | 2 | 3 | 4 | 5;
}

export interface CategoryData {
  name: Category;
  value: number;
  count: number;
  color: string;
}

export interface PaymentMethodData {
  name: PaymentMethod;
  value: number;
  count: number;
}

export interface TrendData {
  date: string;
  amount: number;
}

export interface DashboardStats {
  totalSpent: number;
  monthlySpent: number;
  averageDaily: number;
  transactionCount: number;
  highestTransaction: number;
  mostUsedCategory: Category;
  mostUsedPayment: PaymentMethod;
}
