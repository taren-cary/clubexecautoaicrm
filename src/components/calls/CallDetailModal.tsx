import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { formatDate, formatDuration, formatAppointmentTime, getStatusColor } from '../../lib/utils';
import { B2BCall, B2CCall } from '../../lib/types';
import { Phone, Clock, User, Building2, Calendar, MessageSquare } from 'lucide-react';
import { AudioPlayer } from '../audio/AudioPlayer';

interface CallDetailModalProps {
  call: B2BCall | B2CCall | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusToggle: (callId: number, newStatus: string) => void;
}

export function CallDetailModal({ call, isOpen, onClose, onStatusToggle }: CallDetailModalProps) {
  if (!call) return null;

  const isB2B = 'decision_maker' in call;

  const handleStatusToggle = () => {
    const newStatus = call.callback_status === 'Need Callback' ? 'Confirmed' : 'Need Callback';
    onStatusToggle(call.id, newStatus);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Call Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Call Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Call Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(call.call_time)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{call.phone_number}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{formatDuration(call.duration)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.callback_status)}`}>
                    {call.callback_status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{isB2B ? (call as B2BCall).decision_maker_name || 'Unknown' : (call as B2CCall).caller_name}</span>
                </div>
                
                {isB2B && (call as B2BCall).decision_maker && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Building2 className="h-4 w-4" />
                    <span>Decision Maker</span>
                  </div>
                )}

                {!isB2B && (call as B2CCall).service_requested && (
                  <div>
                    <span className="text-muted-foreground">Service:</span>
                    <span className="ml-2">{(call as B2CCall).service_requested}</span>
                  </div>
                )}

                {!isB2B && (call as B2CCall).preferred_appointment_time && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatAppointmentTime((call as B2CCall).preferred_appointment_time)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audio Player */}
          {call.recording_url && (
            <div>
              <h3 className="font-semibold mb-2">Call Recording</h3>
              <AudioPlayer 
                audioUrl={call.recording_url}
                title={`${isB2B ? 'B2B' : 'B2C'} Call - ${call.phone_number}`}
              />
            </div>
          )}

          {/* Call Summary */}
          {call.summary && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Call Summary</span>
              </h3>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {call.summary}
              </p>
            </div>
          )}

          {/* B2B Specific Information */}
          {isB2B && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">B2B Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Interest Level:</span>
                    <span className="ml-2">{(call as B2BCall).interest_level}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Call Outcome:</span>
                    <span className="ml-2">{(call as B2BCall).call_outcome}</span>
                  </div>
                  {(call as B2BCall).callback_time && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatAppointmentTime((call as B2BCall).callback_time)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button
              variant={call.callback_status === 'Need Callback' ? 'default' : 'outline'}
              onClick={handleStatusToggle}
              className="flex-1"
            >
              {call.callback_status === 'Need Callback' ? 'Mark Confirmed' : 'Mark Callback'}
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