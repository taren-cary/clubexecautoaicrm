import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { formatDate, formatDuration, formatAppointmentTime, getStatusColor } from '../../lib/utils';
import { B2BCall, B2CCall } from '../../lib/types';
import { Phone, Clock, User, Building2, Calendar } from 'lucide-react';

interface CallCardProps {
  call: B2BCall | B2CCall;
  onStatusToggle: (callId: number, newStatus: string) => void;
  onViewDetails: (call: B2BCall | B2CCall) => void;
}

export function CallCard({ call, onStatusToggle, onViewDetails }: CallCardProps) {
  const isB2B = 'decision_maker' in call;
  
  const handleStatusToggle = () => {
    const newStatus = call.callback_status === 'Need Callback' ? 'Confirmed' : 'Need Callback';
    onStatusToggle(call.id, newStatus);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {isB2B ? (call as B2BCall).decision_maker_name || 'Unknown Contact' : (call as B2CCall).caller_name}
          </CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.callback_status)}`}>
            {call.callback_status}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Phone className="h-4 w-4" />
            <span>{call.phone_number}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(call.duration)}</span>
          </div>
        </div>

        <div className="text-sm">
          <p className="font-medium">Call Time:</p>
          <p className="text-muted-foreground">{formatDate(call.call_time)}</p>
        </div>

        {isB2B && (call as B2BCall).decision_maker && (
          <div className="flex items-center space-x-1 text-sm text-blue-600">
            <Building2 className="h-4 w-4" />
            <span>Decision Maker</span>
          </div>
        )}

        {!isB2B && (call as B2CCall).service_requested && (
          <div className="text-sm">
            <p className="font-medium">Service:</p>
            <p className="text-muted-foreground">{(call as B2CCall).service_requested}</p>
          </div>
        )}

        {!isB2B && (call as B2CCall).preferred_appointment_time && (
          <div className="text-sm">
            <p className="font-medium">Preferred Time:</p>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatAppointmentTime((call as B2CCall).preferred_appointment_time)}</span>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(call)}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant={call.callback_status === 'Need Callback' ? 'default' : 'outline'}
            size="sm"
            onClick={handleStatusToggle}
          >
            {call.callback_status === 'Need Callback' ? 'Mark Confirmed' : 'Mark Callback'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 