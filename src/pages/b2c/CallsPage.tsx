import { useState } from 'react';
import { CallCard } from '../../components/calls/CallCard';
import { CallDetailModal } from '../../components/calls/CallDetailModal';
import { QuickFilters } from '../../components/filters/QuickFilters';
import { SearchBar } from '../../components/filters/SearchBar';
import { DateRangePicker } from '../../components/filters/DateRangePicker';
import { useB2CCalls } from '../../hooks/use-b2c-calls';
import { B2CCall, CallFilters } from '../../lib/types';

export function B2CCallsPage() {
  const [selectedCall, setSelectedCall] = useState<B2CCall | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState<CallFilters>({
    dateRange: { from: null, to: null },
    status: 'All',
    search: '',
  });

  const { calls, loading, error, updateCallStatus } = useB2CCalls(filters);

  const handleViewDetails = (call: B2CCall | any) => {
    setSelectedCall(call as B2CCall);
    setIsDetailModalOpen(true);
  };

  const handleStatusToggle = (callId: number, newStatus: string) => {
    updateCallStatus(callId, newStatus);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCall(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading calls: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            value={filters.search}
            onChange={(search) => setFilters(prev => ({ ...prev, search }))}
            placeholder="Search by caller name or phone number..."
          />
          <DateRangePicker
            value={filters.dateRange}
            onChange={(dateRange) => setFilters(prev => ({ ...prev, dateRange }))}
          />
        </div>
        <QuickFilters
          status={filters.status}
          onStatusChange={(status) => setFilters(prev => ({ ...prev, status }))}
        />
      </div>

      {/* Calls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calls.map((call) => (
          <CallCard
            key={call.id}
            call={call}
            onStatusToggle={handleStatusToggle}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Empty State */}
      {calls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No calls found matching your filters.</p>
        </div>
      )}

      {/* Call Detail Modal */}
      <CallDetailModal
        call={selectedCall}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onStatusToggle={handleStatusToggle}
      />
    </div>
  );
} 