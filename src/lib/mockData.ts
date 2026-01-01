import { Expense, Category, PaymentMethod } from "@/types/expense";

const categories: Category[] = [
  "Mobile", "Groceries", "Home", "Loans", "EMI", "Transport",
  "Health", "Entertainment", "Shopping", "Food", "Utilities", "Other"
];

const paymentMethods: PaymentMethod[] = ["UPI", "Cash", "Card", "Bank Transfer"];

const descriptions: Record<Category, string[]> = {
  Mobile: ["Phone recharge", "Data pack", "Jio recharge", "Airtel plan", "Vi pack"],
  Groceries: ["Weekly groceries", "Vegetables", "Fruits & veggies", "Monthly stock", "Milk & dairy"],
  Home: ["Rent payment", "Maintenance", "Electricity bill", "Water bill", "House repairs"],
  Loans: ["Fibe Loan", "Personal loan EMI", "Car loan", "Education loan", "Home loan"],
  EMI: ["Credit card EMI", "Phone EMI", "Laptop EMI", "AC EMI", "TV EMI"],
  Transport: ["Petrol", "Uber/Ola", "Metro card", "Bus fare", "Auto fare"],
  Health: ["Medicine", "Doctor consultation", "Lab tests", "Pharmacy", "Health checkup"],
  Entertainment: ["Netflix", "Movies", "Spotify", "Gaming", "Concert tickets"],
  Shopping: ["Clothes", "Electronics", "Amazon order", "Flipkart", "Online shopping"],
  Food: ["Restaurant", "Swiggy", "Zomato", "Dining out", "Office lunch"],
  Utilities: ["Gas cylinder", "Internet bill", "DTH recharge", "Cable TV", "Society maintenance"],
  Other: ["Miscellaneous", "Gift", "Donation", "Personal expense", "Unknown"]
};

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomAmount(category: Category): number {
  const ranges: Record<Category, [number, number]> = {
    Mobile: [199, 999],
    Groceries: [500, 5000],
    Home: [5000, 25000],
    Loans: [5000, 15000],
    EMI: [2000, 10000],
    Transport: [100, 3000],
    Health: [200, 5000],
    Entertainment: [100, 2000],
    Shopping: [500, 15000],
    Food: [150, 2500],
    Utilities: [200, 3000],
    Other: [100, 5000]
  };
  const [min, max] = ranges[category];
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateMockExpenses(count: number = 150): Expense[] {
  const expenses: Expense[] = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const dateOfExpense = randomDate(startDate, endDate);
    const timestamp = new Date(dateOfExpense);
    timestamp.setHours(
      Math.floor(Math.random() * 14) + 8,
      Math.floor(Math.random() * 60),
      Math.floor(Math.random() * 60)
    );

    expenses.push({
      id: `exp-${i + 1}`,
      timestamp,
      dateOfExpense,
      category,
      amount: randomAmount(category),
      description: descriptions[category][Math.floor(Math.random() * descriptions[category].length)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      receiptRequired: Math.random() > 0.7,
      importance: (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5
    });
  }

  return expenses.sort((a, b) => b.dateOfExpense.getTime() - a.dateOfExpense.getTime());
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Mobile: "hsl(199, 89%, 48%)",
  Groceries: "hsl(142, 71%, 45%)",
  Home: "hsl(32, 95%, 44%)",
  Loans: "hsl(0, 72%, 51%)",
  EMI: "hsl(270, 67%, 58%)",
  Transport: "hsl(47, 96%, 53%)",
  Health: "hsl(340, 82%, 52%)",
  Entertainment: "hsl(291, 64%, 42%)",
  Shopping: "hsl(199, 89%, 48%)",
  Food: "hsl(25, 95%, 53%)",
  Utilities: "hsl(173, 80%, 40%)",
  Other: "hsl(215, 20%, 55%)"
};

export const PAYMENT_METHOD_COLORS: Record<PaymentMethod, string> = {
  UPI: "hsl(162, 78%, 45%)",
  Cash: "hsl(47, 96%, 53%)",
  Card: "hsl(270, 67%, 58%)",
  "Bank Transfer": "hsl(199, 89%, 48%)"
};
