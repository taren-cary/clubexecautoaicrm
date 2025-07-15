import { useState, useEffect } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import { B2BContact, B2CContact, ContactFilters } from '../lib/types';

export function useB2BContacts(filters: ContactFilters) {
  const [contacts, setContacts] = useState<B2BContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, [filters]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from(TABLES.B2B_CONTACTS)
        .select('*')
        .order('created_at', { ascending: false });

      // Apply status filter
      if (filters.status !== 'All') {
        query = query.eq('status', filters.status);
      }

      // Apply search filter
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,company.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  return { contacts, loading, error, refetch: fetchContacts };
}

export function useB2CContacts(filters: ContactFilters) {
  const [contacts, setContacts] = useState<B2CContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, [filters]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from(TABLES.B2C_CONTACTS)
        .select('*')
        .order('created_at', { ascending: false });

      // Apply status filter
      if (filters.status !== 'All') {
        query = query.eq('status', filters.status);
      }

      // Apply search filter
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,service_interest.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  return { contacts, loading, error, refetch: fetchContacts };
} 