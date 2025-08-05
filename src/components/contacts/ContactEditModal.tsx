import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { B2BContact, B2CContact, ContactStatus } from '../../lib/types';
import { X } from 'lucide-react';

interface ContactEditModalProps {
  contact: B2BContact | B2CContact | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function ContactEditModal({ contact, isOpen, onClose, onSave }: ContactEditModalProps) {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    status: contact?.status || 'Needs Attention',
    notes: contact?.notes || '',
    company: (contact as B2BContact)?.company || '',
    role: (contact as B2BContact)?.role || '',
    decision_maker: (contact as B2BContact)?.decision_maker || false,
    service_interest: (contact as B2CContact)?.service_interest || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isB2B = contact && 'company' in contact;

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
      const { supabase, TABLES } = await import('../../lib/supabase');
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
                type="button"
                variant={formData.status === 'Needs Attention' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('Needs Attention')}
              >
                Needs Attention
              </Button>
              <Button
                type="button"
                variant={formData.status === 'Contacted' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('Contacted')}
              >
                Contacted
              </Button>
            </div>
          </div>

          {/* Decision Maker (B2B only) */}
          {isB2B && (
            <div className="space-y-2">
              <Label>Decision Maker</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={formData.decision_maker ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, decision_maker: true }))}
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={!formData.decision_maker ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, decision_maker: false }))}
                >
                  No
                </Button>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes..."
              className="w-full p-3 border border-input rounded-md resize-none"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 