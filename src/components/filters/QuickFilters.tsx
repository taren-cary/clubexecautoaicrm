import React from 'react';
import { Button } from '../ui/button';
import { CallbackStatus } from '../../lib/types';

interface QuickFiltersProps {
  status: CallbackStatus | 'All';
  onStatusChange: (status: CallbackStatus | 'All') => void;
}

export function QuickFilters({ status, onStatusChange }: QuickFiltersProps) {
  return (
    <div className="flex space-x-2">
      <Button
        variant={status === 'All' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onStatusChange('All')}
      >
        All
      </Button>
      <Button
        variant={status === 'Need Callback' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onStatusChange('Need Callback')}
      >
        Need Callback
      </Button>
      <Button
        variant={status === 'Confirmed' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onStatusChange('Confirmed')}
      >
        Confirmed
      </Button>
    </div>
  );
} 