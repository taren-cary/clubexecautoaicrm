// Base types
export type CallbackStatus = 'Need Callback' | 'Confirmed';
export type ContactStatus = 'Needs Attention' | 'Contacted';

// B2B Types
export interface B2BCall {
  id: number;
  call_id: string;
  phone_number: string;
  call_time: string;
  duration: number;
  sentiment: string | null;
  summary: string;
  transcript: string;
  call_outcome: string;
  transfer_status: string;
  callback_time: string | null;
  decision_maker: boolean;
  decision_maker_name: string | null;
  decision_maker_email: string | null;
  interest_level: string;
  needs_callback: boolean;
  callback_status: CallbackStatus;
  contact_id: number | null;
  recording_url?: string | null;
}

export interface B2BContact {
  id: number;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  decision_maker: boolean;
  status: ContactStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

// B2C Types
export interface B2CCall {
  id: number;
  call_id: string;
  caller_name: string;
  phone_number: string;
  call_time: string;
  duration: number;
  sentiment: string | null;
  summary: string;
  transcript: string;
  call_type: string;
  service_requested: string;
  preferred_appointment_time: string | null;
  needs_callback: boolean;
  callback_status: CallbackStatus;
  notes: string;
  contact_id: number | null;
  recording_url?: string | null;
}

export interface B2CContact {
  id: number;
  name: string;
  phone: string;
  email: string;
  service_interest: string;
  status: ContactStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Filter types
export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface CallFilters {
  dateRange: DateRange;
  status: CallbackStatus | 'All';
  search: string;
}

export interface ContactFilters {
  search: string;
  status: ContactStatus | 'All';
} 