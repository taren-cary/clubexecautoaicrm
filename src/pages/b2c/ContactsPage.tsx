import { useState, useMemo } from 'react';
import { ContactCard } from '../../components/contacts/ContactCard';
import { ContactDetailModal } from '../../components/contacts/ContactDetailModal';
import { ContactEditModal } from '../../components/contacts/ContactEditModal';
import { SearchBar } from '../../components/filters/SearchBar';
import { useB2CContacts } from '../../hooks/use-contacts';
import { B2BContact, B2CContact } from '../../lib/types';

export function B2CContactsPage() {
  const [selectedContact, setSelectedContact] = useState<B2CContact | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Memoize the filters object to prevent infinite re-renders
  const filters = useMemo(() => ({ search, status: 'All' as const }), [search]);

  const { contacts, loading, error, refetch } = useB2CContacts(filters);

  const handleViewDetails = (contact: B2BContact | B2CContact) => {
    if (!('company' in contact)) {
      setSelectedContact(contact as B2CContact);
      setIsDetailModalOpen(true);
    }
  };

  const handleEdit = (contact: B2BContact | B2CContact) => {
    if (!('company' in contact)) {
      setSelectedContact(contact as B2CContact);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedContact(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedContact(null);
  };

  const handleSaveContact = () => {
    refetch();
    handleCloseEditModal();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contacts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading contacts: {error}</p>
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
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or phone..."
        />
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Empty State */}
      {contacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No contacts found matching your search.</p>
        </div>
      )}

      {/* Contact Detail Modal */}
      <ContactDetailModal
        contact={selectedContact}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onEdit={handleEdit}
      />

      {/* Contact Edit Modal */}
      <ContactEditModal
        contact={selectedContact}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveContact}
      />
    </div>
  );
} 