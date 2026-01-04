import { useState } from "react";
import { Link2, Loader2, CheckCircle2, AlertCircle, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseGoogleSheetUrl } from "@/lib/googleSheets";
import { cn } from "@/lib/utils";

interface SheetConnectorProps {
  onConnect: (url: string, webhook?: string) => Promise<void>;
  onDisconnect: () => void;
  onRefresh: () => Promise<void>;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  expenseCount: number;
  lastUpdated: Date | null;
}

export function SheetConnector({
  onConnect,
  onDisconnect,
  onRefresh,
  isConnected,
  isLoading,
  error,
  expenseCount,
  lastUpdated,
}: SheetConnectorProps) {
  const [sheetUrl, setSheetUrl] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);

  const handleUrlChange = (value: string) => {
    setSheetUrl(value);
    const parsed = parseGoogleSheetUrl(value);
    setIsValidUrl(!!parsed);
  };

  const handleConnect = async () => {
    if (!isValidUrl) return;
    await onConnect(sheetUrl, webhookUrl || undefined);
  };

  if (isConnected) {
    return (
      <div className="glass-card p-3 animate-fade-in">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Sheet Connected</p>
              <p className="text-xs text-muted-foreground">
                {expenseCount} expenses
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="gap-1 h-7 text-xs px-2"
            >
              <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDisconnect}
              className="gap-1 text-muted-foreground hover:text-foreground h-7 text-xs px-2"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-3 sm:p-4 animate-fade-in">
      <div className="flex items-start gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-chart-2/10 border border-chart-2/20">
          <Link2 className="w-4 h-4 text-chart-2" />
        </div>
        <div>
          <h3 className="font-medium text-sm text-foreground">Connect Google Sheet</h3>
          <p className="text-xs text-muted-foreground">
            Paste your public sheet URL and optional webhook URL
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="https://docs.google.com/spreadsheets/d/..."
            value={sheetUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="flex-1 bg-background border-border font-mono text-xs h-8"
          />
          <Button
            onClick={handleConnect}
            disabled={!isValidUrl || isLoading}
            className="gap-1.5 h-8 text-xs px-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="hidden sm:inline">Loading</span>
              </>
            ) : (
              "Connect"
            )}
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Webhook URL (optional, for adding expenses)"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="flex-1 bg-background border-border font-mono text-xs h-8"
          />
        </div>

        {sheetUrl && !isValidUrl && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Invalid Google Sheets URL
          </p>
        )}

        {error && (
          <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-xs text-destructive flex items-start gap-1.5">
              <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
