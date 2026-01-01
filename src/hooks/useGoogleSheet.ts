import { useState, useCallback, useEffect } from "react";
import { Expense } from "@/types/expense";
import { fetchGoogleSheetData } from "@/lib/googleSheets";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "expense-tracker-sheet-url";
const REFRESH_INTERVAL = 60000; // 1 minute auto-refresh

export function useGoogleSheet() {
  const [sheetUrl, setSheetUrl] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY);
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

  const connect = useCallback(async (url: string) => {
    await fetchData(url);
    setSheetUrl(url);
    localStorage.setItem(STORAGE_KEY, url);
  }, [fetchData]);

  const disconnect = useCallback(() => {
    setSheetUrl(null);
    setExpenses([]);
    setError(null);
    setLastUpdated(null);
    localStorage.removeItem(STORAGE_KEY);
    
    toast({
      title: "Disconnected",
      description: "Google Sheet has been disconnected",
    });
  }, [toast]);

  const refresh = useCallback(async () => {
    if (!sheetUrl) return;
    await fetchData(sheetUrl);
  }, [sheetUrl, fetchData]);

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
    expenses,
    isConnected: !!sheetUrl,
    isLoading,
    error,
    lastUpdated,
    connect,
    disconnect,
    refresh,
    setExpenses,
  };
}
