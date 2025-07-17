import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { formatDate, getStatusColor } from '../../lib/utils';
import { B2BContact, B2CContact } from '../../lib/types';
import { User, Phone, Mail, Building2, Calendar, AlertCircle, Eye } from 'lucide-react';

interface ContactCardProps {
  contact: B2BContact | B2CContact;
  onView: (contact: B2BContact | B2CContact) => void;
}

export function ContactCard({ contact, onView }: ContactCardProps) {
  const isB2B = 'company' in contact;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{contact.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
              {contact.status}
            </span>
            {/* Decision Maker Badge for B2B */}
            {isB2B && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                (contact as B2BContact).decision_maker 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {(contact as B2BContact).decision_maker ? 'Decision Maker' : 'Not Decision Maker'}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{contact.phone}</span>
        </div>

        {contact.email && (
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{contact.email}</span>
          </div>
        )}

        {isB2B && (contact as B2BContact).company && (
          <div className="flex items-center space-x-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span>{(contact as B2BContact).company}</span>
          </div>
        )}

        {isB2B && (contact as B2BContact).role && (
          <div className="flex items-center space-x-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{(contact as B2BContact).role}</span>
          </div>
        )}

        {!isB2B && (contact as B2CContact).service_interest && (
          <div className="text-sm">
            <p className="font-medium">Service Interest:</p>
            <p className="text-muted-foreground">{(contact as B2CContact).service_interest}</p>
          </div>
        )}

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Created: {formatDate(contact.created_at)}</span>
        </div>

        {contact.notes && (
          <div className="text-sm">
            <p className="font-medium">Notes:</p>
            <p className="text-muted-foreground line-clamp-2">{contact.notes}</p>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(contact)}
          className="w-full"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
} 