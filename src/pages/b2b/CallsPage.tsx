import React, { useState } from 'react';
import { DateRangePicker } from '../../components/filters/DateRangePicker';
import { QuickFilters } from '../../components/filters/QuickFilters';
import { SearchBar } from '../../components/filters/SearchBar';
import { CallCard } from '../../components/calls/CallCard';
import { CallDetailModal } from '../../components/calls/CallDetailModal';
import { useB2BCalls } from '../../hooks/use-b2b-calls';
import { CallFilters, CallbackStatus, DateRange, B2BCall } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Loader2 } from 'lucide-react';

export function B2BCallsPage() {
  const [filters, setFilters] = useState<CallFilters>({
    dateRange: { from: null, to: null },
    status: 'All',
    search: '',
  });
  const [selectedCall, setSelectedCall] = useState<B2BCall | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { calls, loading, error, updateCallStatus } = useB2BCalls(filters);

  const handleDateRangeChange = (dateRange: DateRange) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const handleStatusChange = (status: CallbackStatus | 'All') => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleViewDetails = (call: B2BCall) => {
    setSelectedCall(call);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCall(null);
  };

  const handleStatusToggle = (callId: number, newStatus: string) => {
    updateCallStatus(callId, newStatus);
    if (selectedCall && selectedCall.id === callId) {
      setSelectedCall(prev => prev ? { ...prev, callback_status: newStatus as CallbackStatus } : null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">B2B Calls</h1>
        <div className="text-sm text-muted-foreground">
          {calls.length} calls found
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <DateRangePicker
              dateRange={filters.dateRange}
              onDateRangeChange={handleDateRangeChange}
            />
            <QuickFilters
              status={filters.status}
              onStatusChange={handleStatusChange}
            />
          </div>
          <SearchBar
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by phone number or decision maker..."
          />
        </CardContent>
      </Card>

      {/* Calls List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {calls.map((call) => (
          <CallCard
            key={call.id}
            call={call}
            onStatusToggle={updateCallStatus}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {calls.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No B2B calls found matching your filters.
          </CardContent>
        </Card>
      )}

      {/* Call Detail Modal */}
      <CallDetailModal
        call={selectedCall}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusToggle={handleStatusToggle}
      />
    </div>
  );
} 