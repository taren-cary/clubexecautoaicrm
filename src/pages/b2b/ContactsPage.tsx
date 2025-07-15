import React, { useState } from 'react';
import { SearchBar } from '../../components/filters/SearchBar';
import { ContactCard } from '../../components/contacts/ContactCard';
import { ContactEditModal } from '../../components/contacts/ContactEditModal';
import { useB2BContacts } from '../../hooks/use-contacts';
import { ContactFilters, B2BContact, B2CContact } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, Plus, Building2 } from 'lucide-react';

export function B2BContactsPage() {
  const [filters, setFilters] = useState<ContactFilters>({
    search: '',
    status: 'All',
  });
  const [selectedContact, setSelectedContact] = useState<B2BContact | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { contacts, loading, error, refetch } = useB2BContacts(filters);

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleStatusChange = (status: 'Needs Attention' | 'Contacted' | 'All') => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handleEditContact = (contact: B2BContact | B2CContact) => {
    // Since this is B2B page, we know it's a B2B contact
    if ('company' in contact) {
      setSelectedContact(contact);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedContact(null);
  };

  const handleSaveContact = () => {
    refetch(); // Refresh the contacts list
  };

  // Remove handleAddContact function

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
          <Building2 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">B2B Contacts</h1>
        </div>
        {/* Remove Add Contact button */}
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
              placeholder="Search by name, company, or email..."
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
            onEdit={handleEditContact}
          />
        ))}
      </div>

      {contacts.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No B2B contacts found</p>
            <p className="text-sm">
              {filters.search || filters.status !== 'All' 
                ? 'Try adjusting your search or filters.'
                : 'No B2B contacts available.'
              }
            </p>
            {/* Remove Add First Contact button */}
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

      {/* Edit Contact Modal */}
      <ContactEditModal
        contact={selectedContact}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveContact}
      />
    </div>
  );
} 