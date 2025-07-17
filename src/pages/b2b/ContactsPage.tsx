import React, { useState, useEffect } from 'react';
import { SearchBar } from '../../components/filters/SearchBar';
import { ContactCard } from '../../components/contacts/ContactCard';
import { ContactDetailModal } from '../../components/contacts/ContactDetailModal';
import { useB2BContacts } from '../../hooks/use-contacts';
import { ContactFilters, B2BContact, B2CContact } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, Plus, Building2, Search, Filter } from 'lucide-react';

// Extended filters to include decision maker filter
interface B2BContactFilters extends ContactFilters {
  decisionMaker: 'All' | 'Decision Maker' | 'Not Decision Maker';
}

export function B2BContactsPage() {
  const [filters, setFilters] = useState<B2BContactFilters>({
    search: '',
    status: 'All',
    decisionMaker: 'All',
  });
  const [selectedContact, setSelectedContact] = useState<B2BContact | null>(null);
  const [modalContact, setModalContact] = useState<B2BContact | null>(null); // Separate state for modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { contacts, loading, error, refetch } = useB2BContacts(filters);

  // Update modal contact when selected contact changes
  useEffect(() => {
    setModalContact(selectedContact);
  }, [selectedContact]);

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleStatusChange = (status: 'Needs Attention' | 'Contacted' | 'All') => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handleDecisionMakerChange = (decisionMaker: 'All' | 'Decision Maker' | 'Not Decision Maker') => {
    setFilters(prev => ({ ...prev, decisionMaker }));
  };

  const handleViewContact = (contact: B2BContact | B2CContact) => {
    // Since this is B2B page, we know it's a B2B contact
    if ('company' in contact) {
      setSelectedContact(contact);
      setModalContact(contact); // Set both states
      setIsDetailModalOpen(true);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedContact(null);
    setModalContact(null);
  };

  const handleSaveContact = async () => {
    // Refresh the contacts list
    await refetch();
    
    // Close all modals
    setIsDetailModalOpen(false);
    setSelectedContact(null);
  };

  // Filter contacts based on decision maker status
  const filteredContacts = contacts.filter(contact => {
    if (filters.decisionMaker === 'All') return true;
    if (filters.decisionMaker === 'Decision Maker') return (contact as B2BContact).decision_maker;
    if (filters.decisionMaker === 'Not Decision Maker') return !(contact as B2BContact).decision_maker;
    return true;
  });

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
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Section */}
          <div>
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span>Search</span>
            </h4>
            <SearchBar
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search by name, company, or email..."
            />
          </div>
          
          {/* Status Filters Section */}
          <div>
            <h4 className="font-medium mb-3">Contact Status</h4>
            <div className="flex space-x-2">
              <Button
                variant={filters.status === 'All' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('All')}
              >
                All Status
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
          
          {/* Decision Maker Filters Section */}
          <div>
            <h4 className="font-medium mb-3">Decision Maker Status</h4>
            <div className="flex space-x-2">
              <Button
                variant={filters.decisionMaker === 'All' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDecisionMakerChange('All')}
              >
                All Contacts
              </Button>
              <Button
                variant={filters.decisionMaker === 'Decision Maker' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDecisionMakerChange('Decision Maker')}
              >
                Decision Makers
              </Button>
              <Button
                variant={filters.decisionMaker === 'Not Decision Maker' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDecisionMakerChange('Not Decision Maker')}
              >
                Not Decision Makers
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onView={handleViewContact}
          />
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No B2B contacts found</p>
            <p className="text-sm">
              {filters.search || filters.status !== 'All' || filters.decisionMaker !== 'All'
                ? 'Try adjusting your search or filters.'
                : 'No B2B contacts available.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      {filteredContacts.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{filteredContacts.length} contacts found</span>
              <div className="flex space-x-4">
                <span>
                  {filteredContacts.filter(c => c.status === 'Needs Attention').length} need attention
                </span>
                <span>
                  {filteredContacts.filter(c => (c as B2BContact).decision_maker).length} decision makers
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Detail Modal - use modalContact instead of selectedContact */}
      <ContactDetailModal
        contact={modalContact}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onSave={handleSaveContact}
      />
    </div>
  );
} 