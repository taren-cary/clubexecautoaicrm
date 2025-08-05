import { useState } from 'react';
import { Button } from '../ui/button';
import { Calendar } from 'lucide-react';
import { DateRange } from '../../lib/types';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (type: 'from' | 'to', date: string) => {
    const newDate = date ? new Date(date) : null;
    onChange({
      ...value,
      [type]: newDate,
    });
  };

  const clearDates = () => {
    onChange({ from: null, to: null });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <Calendar className="h-4 w-4" />
        <span>
          {value.from && value.to
            ? `${formatDate(value.from)} - ${formatDate(value.to)}`
            : 'Select date range'}
        </span>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-4 bg-background border rounded-md shadow-lg z-10 min-w-[300px]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">From</label>
                <input
                  type="date"
                  value={formatDate(value.from)}
                  onChange={(e) => handleDateChange('from', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">To</label>
                <input
                  type="date"
                  value={formatDate(value.to)}
                  onChange={(e) => handleDateChange('to', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" onClick={() => setIsOpen(false)}>
                Apply
              </Button>
              <Button size="sm" variant="outline" onClick={clearDates}>
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 