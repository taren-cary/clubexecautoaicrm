import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '../ui/button';
import { DateRange } from '../../lib/types';
import { format } from 'date-fns';

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleQuickSelect = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    onDateRangeChange({ from, to });
    setIsOpen(false);
  };

  const clearDates = () => {
    onDateRangeChange({ from: null, to: null });
  };

  const formatDateRange = () => {
    if (!dateRange.from && !dateRange.to) return 'Select dates';
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
    }
    if (dateRange.from) return `From ${format(dateRange.from, 'MMM d, yyyy')}`;
    if (dateRange.to) return `Until ${format(dateRange.to, 'MMM d, yyyy')}`;
    return 'Select dates';
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="justify-start text-left font-normal"
      >
        <Calendar className="mr-2 h-4 w-4" />
        {formatDateRange()}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-card border rounded-md shadow-lg z-50">
          <div className="p-3">
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleQuickSelect(0)}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleQuickSelect(7)}
              >
                Last 7 days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleQuickSelect(30)}
              >
                Last 30 days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleQuickSelect(90)}
              >
                Last 90 days
              </Button>
            </div>
            
            <div className="mt-3 pt-3 border-t">
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    onDateRangeChange({ ...dateRange, from: date });
                  }}
                  className="flex-1 px-2 py-1 text-sm border rounded"
                />
                <span className="text-muted-foreground">to</span>
                <input
                  type="date"
                  value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    onDateRangeChange({ ...dateRange, to: date });
                  }}
                  className="flex-1 px-2 py-1 text-sm border rounded"
                />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDates}
                className="text-destructive"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 