import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { B2BContact, B2CContact, ContactStatus } from '../../lib/types';
import { supabase, TABLES } from '../../lib/supabase';
import { Loader2, Save, X } from 'lucide-react';

interface ContactEditModalProps {
  contact: B2BContact | B2CContact | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function ContactEditModal({ contact, isOpen, onClose, onSave }: ContactEditModalProps) {
  const [formData, setFormData] = useState<Partial<B2BContact | B2CContact>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isB2B = contact && 'company' in contact;

  useEffect(() => {
    if (contact) {
      setFormData(contact);
      setError(null);
    }
  }, [contact]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (status: ContactStatus) => {
    setFormData(prev => ({ ...prev, status }));
  };

  const handleSave = async () => {
    if (!contact) return;

    setLoading(true);
    setError(null);

    try {
      const table = isB2B ? TABLES.B2B_CONTACTS : TABLES.B2C_CONTACTS;
      const { error } = await supabase
        .from(table)
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          notes: formData.notes,
          ...(isB2B && {
            company: formData.company,
            role: formData.role,
            decision_maker: formData.decision_maker,
          }),
          ...(!isB2B && {
            service_interest: formData.service_interest,
          }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', contact.id);

      if (error) throw error;

      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contact');
    } finally {
      setLoading(false);
    }
  };

  if (!contact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit {isB2B ? 'B2B' : 'B2C'} Contact</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Email address"
            />
          </div>

          {/* B2B Specific Fields */}
          {isB2B && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company || ''}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role || ''}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="Job title"
                />
              </div>
            </div>
          )}

          {/* B2C Specific Fields */}
          {!isB2B && (
            <div className="space-y-2">
              <Label htmlFor="service_interest">Service Interest</Label>
              <Input
                id="service_interest"
                value={formData.service_interest || ''}
                onChange={(e) => handleInputChange('service_interest', e.target.value)}
                placeholder="Service of interest"
              />
            </div>
          )}

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex space-x-2">
              <Button
                variant={formData.status === 'Needs Attention' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('Needs Attention')}
              >
                Needs Attention
              </Button>
              <Button
                variant={formData.status === 'Contacted' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('Contacted')}
              >
                Contacted
              </Button>
            </div>
          </div>

          {/* B2B Decision Maker */}
          {isB2B && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="decision_maker"
                checked={formData.decision_maker || false}
                onChange={(e) => handleInputChange('decision_maker', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="decision_maker">Decision Maker</Label>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={loading || !formData.name || !formData.phone}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>Save Changes</span>
            </Button>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 