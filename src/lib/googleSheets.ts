import { Expense, Category, PaymentMethod } from "@/types/expense";

export function parseGoogleSheetUrl(url: string): { sheetId: string; gid: string } | null {
  try {
    const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
    const match = url.match(regex);
    
    if (!match) return null;
    
    const sheetId = match[1];
    
    // Extract gid from URL
    const gidMatch = url.match(/gid=(\d+)/);
    const gid = gidMatch ? gidMatch[1] : "0";
    
    return { sheetId, gid };
  } catch {
    return null;
  }
}

export function buildCsvUrl(sheetId: string, gid: string): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
}

function parseCategory(value: string): Category {
  const categories: Category[] = [
    "Mobile", "Groceries", "Home", "Loans", "EMI", "Transport",
    "Health", "Entertainment", "Shopping", "Food", "Utilities", "Other"
  ];
  
  const normalized = value?.trim();
  const found = categories.find(c => 
    c.toLowerCase() === normalized?.toLowerCase()
  );
  
  return found || "Other";
}

function parsePaymentMethod(value: string): PaymentMethod {
  const methods: PaymentMethod[] = ["UPI", "Cash", "Card", "Bank Transfer"];
  const normalized = value?.trim()?.toLowerCase();
  
  if (normalized?.includes("upi")) return "UPI";
  if (normalized?.includes("cash")) return "Cash";
  if (normalized?.includes("card") || normalized?.includes("credit") || normalized?.includes("debit")) return "Card";
  if (normalized?.includes("bank") || normalized?.includes("transfer") || normalized?.includes("neft") || normalized?.includes("imps")) return "Bank Transfer";
  
  return methods.find(m => m.toLowerCase() === normalized) || "UPI";
}

function parseDate(value: string): Date {
  if (!value) return new Date();
  
  // Try multiple date formats
  // Format: MM/DD/YYYY HH:MM:SS or DD/MM/YYYY or YYYY-MM-DD
  const cleanValue = value.trim();
  
  // Try parsing as-is first
  let date = new Date(cleanValue);
  if (!isNaN(date.getTime())) return date;
  
  // Try DD/MM/YYYY format
  const ddmmyyyy = cleanValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(date.getTime())) return date;
  }
  
  // Try MM/DD/YYYY format
  const mmddyyyy = cleanValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (mmddyyyy) {
    const [, month, day, year] = mmddyyyy;
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(date.getTime())) return date;
  }
  
  return new Date();
}

function parseAmount(value: string): number {
  if (!value) return 0;
  // Remove currency symbols, commas, and spaces
  const cleaned = value.replace(/[₹$,\s]/g, "").trim();
  const amount = parseFloat(cleaned);
  return isNaN(amount) ? 0 : amount;
}

function parseImportance(value: string): 1 | 2 | 3 | 4 | 5 {
  const num = parseInt(value);
  if (num >= 1 && num <= 5) return num as 1 | 2 | 3 | 4 | 5;
  return 3;
}

export function parseCsvToExpenses(csvText: string): Expense[] {
  const lines = csvText.split("\n");
  if (lines.length < 2) return [];
  
  // Parse headers (first row)
  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
  
  // Find column indices based on common header names
  const findColumn = (keywords: string[]): number => {
    return headers.findIndex(h => 
      keywords.some(k => h.includes(k.toLowerCase()))
    );
  };
  
  const timestampCol = findColumn(["timestamp", "time stamp", "created"]);
  const dateCol = findColumn(["date of expense", "expense date", "date"]);
  const categoryCol = findColumn(["category", "type"]);
  const amountCol = findColumn(["amount", "spent", "cost", "price"]);
  const descriptionCol = findColumn(["description", "desc", "note", "details"]);
  const paymentCol = findColumn(["payment", "method", "pay"]);
  const receiptCol = findColumn(["receipt"]);
  const importanceCol = findColumn(["importance", "priority", "scale"]);
  
  const expenses: Expense[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    if (values.length < 3) continue; // Skip invalid rows
    
    const getValue = (col: number): string => {
      if (col === -1 || col >= values.length) return "";
      return values[col] || "";
    };
    
    const timestampValue = getValue(timestampCol);
    const dateValue = getValue(dateCol) || timestampValue;
    const amountValue = getValue(amountCol);
    
    // Skip rows without valid amount
    const amount = parseAmount(amountValue);
    if (amount <= 0) continue;
    
    const expense: Expense = {
      id: `sheet-${i}-${Date.now()}`,
      timestamp: parseDate(timestampValue),
      dateOfExpense: parseDate(dateValue),
      category: parseCategory(getValue(categoryCol)),
      amount,
      description: getValue(descriptionCol) || getValue(categoryCol),
      paymentMethod: parsePaymentMethod(getValue(paymentCol)),
      receiptRequired: getValue(receiptCol).toLowerCase().includes("yes"),
      importance: parseImportance(getValue(importanceCol))
    };
    
    expenses.push(expense);
  }
  
  return expenses.sort((a, b) => b.dateOfExpense.getTime() - a.dateOfExpense.getTime());
}

// Parse CSV line handling quoted values with commas
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

export async function fetchGoogleSheetData(sheetUrl: string): Promise<Expense[]> {
  const parsed = parseGoogleSheetUrl(sheetUrl);
  
  if (!parsed) {
    throw new Error("Invalid Google Sheets URL");
  }
  
  const csvUrl = buildCsvUrl(parsed.sheetId, parsed.gid);
  
  const response = await fetch(csvUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
  }
  
  const csvText = await response.text();
  
  if (csvText.includes("<!DOCTYPE html>") || csvText.includes("<html")) {
    throw new Error("Sheet is not publicly accessible. Please make sure the sheet is published or shared with 'Anyone with the link'.");
  }
  
  return parseCsvToExpenses(csvText);
}
