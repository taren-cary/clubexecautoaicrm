import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { B2BContact, B2CContact } from '../../lib/types';
import { formatDate, getStatusColor } from '../../lib/utils';
import { 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Calendar, 
  AlertCircle, 
  Edit3, 
  X,
  MapPin,
  Briefcase
} from 'lucide-react';
import { ContactEditModal } from './ContactEditModal';

interface ContactDetailModalProps {
  contact: B2BContact | B2CContact | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function ContactDetailModal({ contact, isOpen, onClose, onSave }: ContactDetailModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const isB2B = contact && 'company' in contact;

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCloseEdit = () => {
    setIsEditMode(false);
  };

  const handleSave = (updatedContact?: B2BContact | B2CContact) => {
    onSave(); // This will trigger the parent's handleSaveContact
    // The parent will close the modal, so we don't need to do anything here
  };

  if (!contact) return null;

  return (
    <>
      <Dialog open={isOpen && !isEditMode} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Contact Details</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleEdit}>
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Basic Information</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Name:</span>
                    <span className="text-sm">{contact.name || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                    <span className="text-sm">{contact.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                    <span className="text-sm">{contact.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* B2B Specific Information */}
              {isB2B && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>Company Information</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Company:</span>
                      <span className="text-sm">{(contact as B2BContact).company || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Role:</span>
                      <span className="text-sm">{(contact as B2BContact).role || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Decision Maker:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (contact as B2BContact).decision_maker 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {(contact as B2BContact).decision_maker ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* B2C Specific Information */}
              {!isB2B && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Service Information</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Service Interest:</span>
                      <span className="text-sm">{(contact as B2CContact).service_interest || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notes Section */}
            {contact.notes && (
              <div>
                <h3 className="font-semibold mb-3">Notes</h3>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">{contact.notes}</p>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {formatDate(contact.created_at)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Updated: {formatDate(contact.updated_at)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-4 border-t">
              <Button onClick={handleEdit} className="flex-1">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Contact
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <ContactEditModal
        contact={contact}
        isOpen={isEditMode}
        onClose={handleCloseEdit}
        onSave={handleSave}
      />
    </>
  );
} 