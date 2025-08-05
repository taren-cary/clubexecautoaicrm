import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { B2BContact, B2CContact } from '../../lib/types';
import { formatDate } from '../../lib/utils';
import { X } from 'lucide-react';

interface ContactDetailModalProps {
  contact: B2BContact | B2CContact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (contact: B2BContact | B2CContact) => void;
}

export function ContactDetailModal({ contact, isOpen, onClose, onEdit }: ContactDetailModalProps) {
  if (!contact) return null;

  const isB2B = 'company' in contact;

  const handleEdit = () => {
    onEdit(contact);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isB2B ? 'B2B' : 'B2C'} Contact Details</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="font-semibold mb-3">Basic Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 font-medium">{contact.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <span className="ml-2">{contact.phone}</span>
              </div>
              {contact.email && (
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <span className="ml-2">{contact.email}</span>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  contact.status === 'Needs Attention' 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {contact.status}
                </span>
              </div>
            </div>
          </div>

          {/* B2B Specific Information */}
          {isB2B && (
            <div>
              <h3 className="font-semibold mb-3">B2B Information</h3>
              <div className="space-y-2 text-sm">
                {(contact as B2BContact).company && (
                  <div>
                    <span className="text-muted-foreground">Company:</span>
                    <span className="ml-2">{(contact as B2BContact).company}</span>
                  </div>
                )}
                {(contact as B2BContact).role && (
                  <div>
                    <span className="text-muted-foreground">Role:</span>
                    <span className="ml-2">{(contact as B2BContact).role}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Decision Maker:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
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
          {!isB2B && (contact as B2CContact).service_interest && (
            <div>
              <h3 className="font-semibold mb-3">B2C Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Service Interest:</span>
                  <span className="ml-2">{(contact as B2CContact).service_interest}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {contact.notes && (
            <div>
              <h3 className="font-semibold mb-3">Notes</h3>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {contact.notes}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div>
            <h3 className="font-semibold mb-3">Timestamps</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2">{formatDate(contact.created_at)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="ml-2">{formatDate(contact.updated_at)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button onClick={handleEdit} className="flex-1">
              Edit Contact
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 