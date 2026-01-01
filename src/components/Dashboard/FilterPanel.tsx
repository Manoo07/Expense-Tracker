import { useState } from "react";
import { Category, PaymentMethod } from "@/types/expense";
import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfYear } from "date-fns";
import { CalendarIcon, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface FilterPanelProps {
  selectedCategories: Category[];
  selectedPaymentMethods: PaymentMethod[];
  dateRange: { from: Date; to: Date };
  onCategoryChange: (categories: Category[]) => void;
  onPaymentMethodChange: (methods: PaymentMethod[]) => void;
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
  onClearFilters: () => void;
}

const categories: Category[] = [
  "Mobile", "Groceries", "Home", "Loans", "EMI", "Transport",
  "Health", "Entertainment", "Shopping", "Food", "Utilities", "Other"
];

const paymentMethods: PaymentMethod[] = ["UPI", "Cash", "Card", "Bank Transfer"];

const datePresets = [
  { label: "Last 7 days", getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: "Last 30 days", getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: "This month", getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: "Last 3 months", getValue: () => ({ from: subMonths(new Date(), 3), to: new Date() }) },
  { label: "This year", getValue: () => ({ from: startOfYear(new Date()), to: new Date() }) },
];

export function FilterPanel({
  selectedCategories,
  selectedPaymentMethods,
  dateRange,
  onCategoryChange,
  onPaymentMethodChange,
  onDateRangeChange,
  onClearFilters,
}: FilterPanelProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const toggleCategory = (cat: Category) => {
    if (selectedCategories.includes(cat)) {
      onCategoryChange(selectedCategories.filter((c) => c !== cat));
    } else {
      onCategoryChange([...selectedCategories, cat]);
    }
  };

  const togglePaymentMethod = (method: PaymentMethod) => {
    if (selectedPaymentMethods.includes(method)) {
      onPaymentMethodChange(selectedPaymentMethods.filter((m) => m !== method));
    } else {
      onPaymentMethodChange([...selectedPaymentMethods, method]);
    }
  };

  const selectMonth = (monthOffset: number) => {
    const newMonth = subMonths(currentMonth, -monthOffset);
    setCurrentMonth(newMonth);
    onDateRangeChange({
      from: startOfMonth(newMonth),
      to: endOfMonth(newMonth),
    });
  };

  const goToPrevMonth = () => {
    selectMonth(-1);
  };

  const goToNextMonth = () => {
    selectMonth(1);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedPaymentMethods.length > 0;

  return (
    <div className="space-y-2">
      {/* Month Navigation - Mobile First */}
      <div className="glass-card p-2">
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevMonth}
            className="h-7 w-7"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          
          <div className="flex-1 text-center">
            <h2 className="text-sm sm:text-base font-semibold text-foreground">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextMonth}
            className="h-7 w-7"
            disabled={currentMonth >= new Date()}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          variant={showFilters ? "secondary" : "outline"}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-1.5 text-xs h-7 px-2"
        >
          <Filter className="w-3 h-3" />
          {hasActiveFilters && (
            <Badge variant="secondary" className="h-4 px-1 text-xs bg-primary text-primary-foreground">
              {selectedCategories.length + selectedPaymentMethods.length}
            </Badge>
          )}
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7 px-2">
              <CalendarIcon className="w-3 h-3" />
              {format(dateRange.from, "MM/dd")} - {format(dateRange.to, "MM/dd")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover border-border max-w-[90vw]" align="start">
            <div className="p-2 border-b border-border">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Quick Select</p>
              <div className="flex flex-wrap gap-1">
                {datePresets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const range = preset.getValue();
                      onDateRangeChange(range);
                      setCurrentMonth(range.from);
                    }}
                    className="text-xs h-6 px-2"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            <Calendar
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  onDateRangeChange({ from: range.from, to: range.to });
                  setCurrentMonth(range.from);
                }
              }}
              numberOfMonths={1}
              className="pointer-events-auto text-xs p-2"
            />
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground text-xs h-7 px-2"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="glass-card p-2 space-y-2 animate-fade-in">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Categories</p>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={selectedCategories.includes(cat) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all text-xs py-0.5 px-1.5",
                    selectedCategories.includes(cat)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Payment Methods</p>
            <div className="flex flex-wrap gap-1">
              {paymentMethods.map((method) => (
                <Badge
                  key={method}
                  variant={selectedPaymentMethods.includes(method) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all text-xs py-0.5 px-1.5",
                    selectedPaymentMethods.includes(method)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  onClick={() => togglePaymentMethod(method)}
                >
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
