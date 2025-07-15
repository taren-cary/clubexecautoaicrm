import { useState, useEffect } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import { B2CCall, CallFilters } from '../lib/types';

export function useB2CCalls(filters: CallFilters) {
  const [calls, setCalls] = useState<B2CCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCalls();
  }, [filters]);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from(TABLES.B2C_CALLS)
        .select('*')
        .order('call_time', { ascending: false });

      // Apply date filter
      if (filters.dateRange.from) {
        query = query.gte('call_time', filters.dateRange.from.toISOString());
      }
      if (filters.dateRange.to) {
        query = query.lte('call_time', filters.dateRange.to.toISOString());
      }

      // Apply status filter
      if (filters.status !== 'All') {
        query = query.eq('callback_status', filters.status);
      }

      // Apply search filter
      if (filters.search) {
        query = query.or(`caller_name.ilike.%${filters.search}%,phone_number.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCalls(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calls');
    } finally {
      setLoading(false);
    }
  };

  const updateCallStatus = async (callId: number, status: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.B2C_CALLS)
        .update({ callback_status: status })
        .eq('id', callId);

      if (error) throw error;
      
      // Update local state
      setCalls(prev => prev.map(call => 
        call.id === callId ? { ...call, callback_status: status as any } : call
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update call status');
    }
  };

  return { calls, loading, error, updateCallStatus, refetch: fetchCalls };
} 