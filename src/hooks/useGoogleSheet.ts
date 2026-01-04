import { useState, useCallback, useEffect } from "react";
import { Expense } from "@/types/expense";
import { fetchGoogleSheetData, writeExpenseToSheet } from "@/lib/googleSheets";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "expense-tracker-sheet-url";
const WEBHOOK_KEY = "expense-tracker-webhook-url";
const REFRESH_INTERVAL = 60000; // 1 minute auto-refresh

export function useGoogleSheet() {
  const [sheetUrl, setSheetUrl] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY);
  });
  const [webhookUrl, setWebhookUrl] = useState<string | null>(() => {
    return localStorage.getItem(WEBHOOK_KEY);
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async (url: string, showToast = true) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchGoogleSheetData(url);
      setExpenses(data);
      setLastUpdated(new Date());
      
      if (showToast) {
        toast({
          title: "Sheet loaded",
          description: `Successfully loaded ${data.length} expenses`,
        });
      }
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load sheet";
      setError(message);
      
      if (showToast) {
        toast({
          title: "Failed to load sheet",
          description: message,
          variant: "destructive",
        });
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const connect = useCallback(async (url: string, webhook?: string) => {
    await fetchData(url);
    setSheetUrl(url);
    localStorage.setItem(STORAGE_KEY, url);
    
    if (webhook) {
      setWebhookUrl(webhook);
      localStorage.setItem(WEBHOOK_KEY, webhook);
    }
  }, [fetchData]);

  const disconnect = useCallback(() => {
    setSheetUrl(null);
    setWebhookUrl(null);
    setExpenses([]);
    setError(null);
    setLastUpdated(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(WEBHOOK_KEY);
    
    toast({
      title: "Disconnected",
      description: "Google Sheet has been disconnected",
    });
  }, [toast]);

  const refresh = useCallback(async () => {
    if (!sheetUrl) return;
    await fetchData(sheetUrl);
  }, [sheetUrl, fetchData]);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    if (!webhookUrl) {
      toast({
        title: "Webhook not configured",
        description: "Please configure the webhook URL to add expenses to the sheet",
        variant: "destructive"
      });
      return false;
    }

    try {
      await writeExpenseToSheet(webhookUrl, expense);
      
      // Add to local state optimistically
      const newExpense: Expense = {
        ...expense,
        id: `exp-${Date.now()}`
      };
      setExpenses(prev => [newExpense, ...prev]);
      
      toast({
        title: "Expense added",
        description: "Successfully added to Google Sheet"
      });

      // Refresh after a short delay to get the actual sheet data
      setTimeout(() => {
        if (sheetUrl) {
          fetchData(sheetUrl, false);
        }
      }, 2000);

      return true;
    } catch (error) {
      toast({
        title: "Failed to add expense",
        description: "Could not write to Google Sheet",
        variant: "destructive"
      });
      return false;
    }
  }, [webhookUrl, sheetUrl, toast, fetchData]);

  // Auto-load on mount if URL is saved
  useEffect(() => {
    if (sheetUrl && expenses.length === 0 && !isLoading) {
      fetchData(sheetUrl, false).catch(() => {
        // Silent fail on initial load - user will see the error state
      });
    }
  }, [sheetUrl, expenses.length, isLoading, fetchData]);

  // Auto-refresh interval
  useEffect(() => {
    if (!sheetUrl) return;

    const interval = setInterval(() => {
      fetchData(sheetUrl, false).catch(() => {
        // Silent fail on auto-refresh
      });
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [sheetUrl, fetchData]);

  return {
    sheetUrl,
    webhookUrl,
    expenses,
    isConnected: !!sheetUrl,
    isLoading,
    error,
    lastUpdated,
    connect,
    disconnect,
    refresh,
    addExpense,
    setExpenses,
  };
}
