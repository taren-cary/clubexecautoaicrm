import React, { useState } from 'react';
import { SearchBar } from '../../components/filters/SearchBar';
import { ContactCard } from '../../components/contacts/ContactCard';
import { ContactDetailModal } from '../../components/contacts/ContactDetailModal';
import { useB2CContacts } from '../../hooks/use-contacts';
import { ContactFilters, B2BContact, B2CContact } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, Plus, Users } from 'lucide-react';

export function B2CContactsPage() {
  const [filters, setFilters] = useState<ContactFilters>({
    search: '',
    status: 'All',
  });
  const [selectedContact, setSelectedContact] = useState<B2CContact | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { contacts, loading, error, refetch } = useB2CContacts(filters);

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleStatusChange = (status: 'Needs Attention' | 'Contacted' | 'All') => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handleViewContact = (contact: B2BContact | B2CContact) => {
    // Since this is B2C page, we know it's a B2C contact
    if (!('company' in contact)) {
      setSelectedContact(contact);
      setIsDetailModalOpen(true);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedContact(null);
  };

  const handleSaveContact = async () => {
    // Refresh the contacts list
    await refetch();
    
    // Close all modals
    setIsDetailModalOpen(false);
    setSelectedContact(null);
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
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold">B2C Contacts</h1>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <SearchBar
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search by name, email, or service interest..."
            />
            <div className="flex space-x-2">
              <Button
                variant={filters.status === 'All' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('All')}
              >
                All
              </Button>
              <Button
                variant={filters.status === 'Needs Attention' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('Needs Attention')}
              >
                Needs Attention
              </Button>
              <Button
                variant={filters.status === 'Contacted' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('Contacted')}
              >
                Contacted
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onView={handleViewContact}
          />
        ))}
      </div>

      {contacts.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No B2C contacts found</p>
            <p className="text-sm">
              {filters.search || filters.status !== 'All' 
                ? 'Try adjusting your search or filters.'
                : 'No B2C contacts available.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      {contacts.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{contacts.length} contacts found</span>
              <span>
                {contacts.filter(c => c.status === 'Needs Attention').length} need attention
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Detail Modal */}
      <ContactDetailModal
        contact={selectedContact}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onSave={handleSaveContact}
      />
    </div>
  );
} 