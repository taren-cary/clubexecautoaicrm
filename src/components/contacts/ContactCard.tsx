import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { formatDate } from '../../lib/utils';
import { B2BContact, B2CContact } from '../../lib/types';
import { Phone, Mail, Building2, UserCheck } from 'lucide-react';

interface ContactCardProps {
  contact: B2BContact | B2CContact;
  onViewDetails: (contact: B2BContact | B2CContact) => void;
  onEdit: (contact: B2BContact | B2CContact) => void;
}

export function ContactCard({ contact, onViewDetails, onEdit }: ContactCardProps) {
  const isB2B = 'company' in contact;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{contact.name}</CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            contact.status === 'Needs Attention' 
              ? 'bg-orange-100 text-orange-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {contact.status}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Phone className="h-4 w-4" />
            <span>{contact.phone}</span>
          </div>
          {contact.email && (
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>{contact.email}</span>
            </div>
          )}
        </div>

        {/* B2B Specific Information */}
        {isB2B && (
          <div className="space-y-2">
            {(contact as B2BContact).company && (
              <div className="flex items-center space-x-1 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{(contact as B2BContact).company}</span>
              </div>
            )}
            {(contact as B2BContact).role && (
              <div className="text-sm text-muted-foreground">
                <span>{(contact as B2BContact).role}</span>
              </div>
            )}
            <div className="flex items-center space-x-1 text-sm">
              <UserCheck className="h-4 w-4 text-muted-foreground" />
              <span>Decision Maker: {(contact as B2BContact).decision_maker ? 'Yes' : 'No'}</span>
            </div>
          </div>
        )}

        {/* B2C Specific Information */}
        {!isB2B && (contact as B2CContact).service_interest && (
          <div className="text-sm">
            <p className="font-medium">Service Interest:</p>
            <p className="text-muted-foreground">{(contact as B2CContact).service_interest}</p>
          </div>
        )}

        <div className="text-sm">
          <p className="font-medium">Created:</p>
          <p className="text-muted-foreground">{formatDate(contact.created_at)}</p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(contact)}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(contact)}
          >
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 