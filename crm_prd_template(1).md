# Dual-Interface B2B/B2C CRM Dashboard - Product Requirements Document

## Overview
Build a modern dual-interface CRM dashboard with separate B2B and B2C sides for managing calls and contacts from our phone system webhook integration.

## Tech Stack
- **Frontend**: Vite + React 18 with TypeScript
- **UI Components**: shadcn/ui
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **Data Fetching**: @supabase/supabase-js
- **Routing**: React Router DOM
- **State Management**: Zustand (optional) or React Context
- **Date Handling**: date-fns

## Product Scope

### B2B CRM Side

#### Calls Page
- **List view** of all B2B calls
- **Popup calendar** for date selection (specific dates or custom ranges)
- **Quick filters**: "Need Callback" and "Confirmed" status
- **Call record details**:
  - Date and time of call
  - Name of contact
  - Success status (connected, transferred, voicemail)
  - Full call summary
  - Transcription of conversation
  - Transfer status
  - Callback time (if required)
  - Decision maker status (Yes/No)
  - Decision maker name and email (if different from contact)
  - Dynamically captured metadata
- **Status toggle**: Manual update from "Need Callback" to "Confirmed"

#### Contacts Page
- **Contact cards** for all leads 
- **Contact card details**:
  - Full name
  - Company (editable)
  - Role/title (editable)
  - Email address
  - Phone number
  - Decision maker status tag
  - Complete call history
- **Search & Filter**: Keyword and attribute-based filtering

### B2C CRM Side

#### Calls Page
- **List view** of all inbound calls
- **Popup date selector**: Daily, weekly, monthly, custom ranges
- **Quick filter**: "Need Callback" or "Confirmed" calls only
- **Call card details**:
  - Caller name and phone number
  - Service requested
  - Preferred appointment time
  - Call notes
  - Callback status
  - Additional relevant details
- **Status toggle**: Manual update from "Need Callback" to "Confirmed"

#### Contacts Page
- **Customer profiles** from inbound interactions
- **Contact card details**:
  - Full name
  - Phone number
  - Email (if collected)
  - Call history and requested services
- **Search functionality**: Name, service type, callback status

### Unified Workflow Features
- **Real-time data logging** with minimal latency
- **Manual status updates** on all call records
- **Consistent UI/UX** across both B2B and B2C sides
- **Responsive design** for desktop and mobile

## Database Schema (from Edge Functions)

### B2B Tables
#### b2b_calls table:
- id (primary key)
- call_id (unique)
- phone_number
- call_time
- duration
- sentiment
- summary
- transcript
- call_outcome
- transfer_status
- callback_time
- decision_maker
- decision_maker_name
- decision_maker_email
- interest_level
- needs_callback
- callback_status
- contact_id (foreign key)

#### b2b_contacts table:
- id (primary key)
- name
- company (editable)
- role (editable)
- email
- phone
- decision_maker
- status
- notes(editable)
- created_at
- updated_at

### B2C Tables
#### b2c_calls table:
- id (primary key)
- call_id (unique)
- caller_name
- phone_number
- call_time
- duration
- sentiment
- summary
- transcript
- call_type
- service_requested
- preferred_appointment_time
- needs_callback
- callback_status
- notes
- contact_id (foreign key)

#### b2c_contacts table:
- id (primary key)
- name
- phone
- email
- service_interest
- status
- notes(editable)
- created_at
- updated_at

## User Interface Requirements

### Design System
- **shadcn/ui components** for consistency
- **Responsive layout** (mobile-first approach)
- **Dark/light mode** toggle
- **Consistent spacing** and typography
- **Status indicators** and badges

### Navigation Structure
```
├── B2B CRM
│   ├── Calls
│   └── Contacts
├── B2C CRM
│   ├── Calls
│   └── Contacts
└── Settings
```

### Key Components Needed
- **DualLayout** - Main app shell with B2B/B2C toggle
- **CallList** - Reusable for both B2B and B2C
- **ContactList** - Reusable with different schemas
- **DateRangePicker** - Popup calendar component
- **QuickFilters** - Status-based filtering
- **CallDetailModal** - Expandable call records
- **ContactCard** - Individual contact display
- **StatusToggle** - Callback status management
- **SearchBar** - Keyword and attribute filtering


## File Structure
```
src/
├── components/
│   ├── ui/ (shadcn components)
│   ├── layout/
│   │   ├── DualLayout.tsx
│   │   └── Navigation.tsx
│   ├── calls/
│   │   ├── CallList.tsx
│   │   ├── CallCard.tsx
│   │   ├── CallDetailModal.tsx
│   │   └── AudioPlayer.tsx
│   ├── contacts/
│   │   ├── ContactList.tsx
│   │   ├── ContactCard.tsx
│   │   └── ContactForm.tsx
│   ├── filters/
│   │   ├── DateRangePicker.tsx
│   │   ├── QuickFilters.tsx
│   │   └── SearchBar.tsx
│   └── common/
│       ├── StatusToggle.tsx
│       └── LoadingSpinner.tsx
├── pages/
│   ├── b2b/
│   │   ├── CallsPage.tsx
│   │   └── ContactsPage.tsx
│   └── b2c/
│       ├── CallsPage.tsx
│       └── ContactsPage.tsx
├── lib/
│   ├── supabase.ts
│   ├── types.ts
│   └── utils.ts
├── hooks/
│   ├── use-b2b-calls.ts
│   ├── use-b2c-calls.ts
│   └── use-contacts.ts
└── App.tsx
```

## Edge Functions

### 1. B2C Call Processing Function
```javascript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
// Convert Unix timestamp (milliseconds) to ISO string
function timestampToISOString(timestamp) {
  if (!timestamp) return new Date().toISOString();
  return new Date(parseInt(timestamp)).toISOString();
}
// Parse appointment date/time strings to Eastern Time
function parseAppointmentDateTime(dateTimeString) {
  if (!dateTimeString) return null;
  console.log(`Parsing appointment date/time: "${dateTimeString}"`);
  const now = new Date();
  let appointmentDate = new Date(now);
  const lowerCaseDateTime = dateTimeString.toLowerCase();
  // Handle common date references
  if (lowerCaseDateTime.includes('tomorrow')) {
    appointmentDate.setDate(appointmentDate.getDate() + 1);
  } else if (lowerCaseDateTime.includes('today')) {
  // Keep today's date
  } else if (lowerCaseDateTime.includes('next week')) {
    appointmentDate.setDate(appointmentDate.getDate() + 7);
  } else {
    // Try to handle specific days of the week
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday'
    ];
    for(let i = 0; i < days.length; i++){
      if (lowerCaseDateTime.includes(days[i])) {
        const today = appointmentDate.getDay();
        let daysToAdd = i - today;
        if (daysToAdd <= 0) daysToAdd += 7;
        appointmentDate.setDate(appointmentDate.getDate() + daysToAdd);
        break;
      }
    }
  }
  // Extract time using flexible pattern matching
  let timeMatch = lowerCaseDateTime.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const period = timeMatch[3].toLowerCase();
    if (period === 'pm' && hours < 12) {
      hours += 12;
    } else if (period === 'am' && hours === 12) {
      hours = 0;
    }
    appointmentDate.setHours(hours, minutes, 0, 0);
  } else {
    // Try to extract just the hour
    timeMatch = lowerCaseDateTime.match(/(\d{1,2})\s*(am|pm)/);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const period = timeMatch[2].toLowerCase();
      if (period === 'pm' && hours < 12) {
        hours += 12;
      } else if (period === 'am' && hours === 12) {
        hours = 0;
      }
      appointmentDate.setHours(hours, 0, 0, 0);
    } else {
      // Default to 10 AM if no time specified
      appointmentDate.setHours(10, 0, 0, 0);
    }
  }
  // Convert to Eastern Time (simplified - in production use proper timezone library)
  const isEDT = function(d) {
    const year = d.getUTCFullYear();
    const marchSecondSunday = new Date(Date.UTC(year, 2, 8 + (7 - new Date(Date.UTC(year, 2, 8)).getUTCDay()) % 7));
    const novemberFirstSunday = new Date(Date.UTC(year, 10, 1 + (7 - new Date(Date.UTC(year, 10, 1)).getUTCDay()) % 7));
    return d >= marchSecondSunday && d < novemberFirstSunday;
  }(appointmentDate);
  const hours = appointmentDate.getUTCHours();
  const easternDate = new Date(appointmentDate);
  const hoursToAdd = isEDT ? 4 : 5;
  easternDate.setUTCHours(hours + hoursToAdd);
  console.log(`Adjusted for Eastern Time (${isEDT ? 'EDT' : 'EST'}): ${easternDate.toISOString()}`);
  return easternDate.toISOString();
}
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  console.log("Incoming request method:", req.method);
  console.log("Request headers:", Object.fromEntries(req.headers.entries()));
  try {
    // Create Supabase client with SERVICE ROLE key to bypass RLS policies
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    console.log("Supabase URL:", supabaseUrl ? "Set" : "Missing");
    console.log("Service Role Key:", supabaseServiceKey ? "Set" : "Missing");
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        }
      }
    });
    // Parse the request body
    let payload;
    try {
      payload = await req.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid JSON in request body",
        details: parseError.message
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 400
      });
    }
    const { event, call } = payload;
    console.log(`Received ${event} event for call ${call?.call_id}`);
    // Test database connection first
    try {
      const { data: testData, error: testError } = await supabaseClient.from("b2c_calls").select("count").limit(1);
      if (testError) {
        console.error("Database connection test failed:", testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      console.log("Database connection test successful");
    } catch (dbError) {
      console.error("Database test error:", dbError);
      throw dbError;
    }
    // Process call_analyzed events for inbound B2C calls
    if (event === "call_analyzed") {
      const callId = call?.call_id || `call-${Date.now()}`;
      const customData = call?.call_analysis?.custom_analysis_data || {};
      console.log("Custom analysis data:", JSON.stringify(customData, null, 2));
      // Extract B2C specific data
      const callType = customData.type || "General Inquiry";
      const serviceRequested = customData.service || "";
      const appointmentDateTime = customData.date_time ? parseAppointmentDateTime(customData.date_time) : null;
      const customerName = customData.name || "";
      const customerEmail = customData.email || "";
      const customerPhone = customData.phoneNumber || call?.from_number || "";
      const needsCallback = customData.need_callback === true || customData.need_callback === "true";
      const detailedSummary = customData.detailed_call_summary || call?.call_analysis?.call_summary || "";
      // Standard call data
      const callTime = timestampToISOString(call?.start_timestamp || Date.now());
      const duration = Math.floor((call?.duration_ms || 0) / 1000);
      const sentiment = call?.call_analysis?.user_sentiment || null;
      const transcript = call?.transcript || "";
      // Create B2C call record
      console.log("Creating B2C call record:", {
        call_id: callId,
        caller_name: customerName,
        phone_number: customerPhone,
        call_time: callTime,
        duration,
        sentiment,
        call_type: callType,
        service_requested: serviceRequested,
        preferred_appointment_time: appointmentDateTime,
        needs_callback: needsCallback
      });
      const { data: callRecord, error: callError } = await supabaseClient.from("b2c_calls").insert({
        call_id: callId,
        caller_name: customerName || "Unknown",
        phone_number: customerPhone,
        call_time: callTime,
        duration,
        sentiment,
        summary: detailedSummary,
        transcript,
        call_type: callType,
        service_requested: serviceRequested,
        preferred_appointment_time: appointmentDateTime,
        needs_callback: needsCallback,
        callback_status: needsCallback ? 'Need Callback' : 'Confirmed'
      }).select().single();
      if (callError) {
        throw callError;
      }
      console.log("Successfully created B2C call record:", callRecord);
      // Handle customer contact creation/update if we have valid contact info
      if (customerName || customerEmail || customerPhone) {
        let contactId;
        // Check if contact exists by phone
        let { data: existingContact, error: contactError } = await supabaseClient.from("b2c_contacts").select("id").eq("phone", customerPhone).maybeSingle();
        if (contactError) {
          throw contactError;
        }
        if (!existingContact) {
          // Create new contact
          console.log("Creating new B2C contact");
          const { data: newContact, error: createError } = await supabaseClient.from("b2c_contacts").insert({
            name: customerName || "Unknown",
            phone: customerPhone,
            email: customerEmail || "",
            service_interest: serviceRequested,
            status: needsCallback ? 'Needs Attention' : 'Contacted'
          }).select("id").single();
          if (createError) {
            throw createError;
          }
          contactId = newContact.id;
        } else {
          contactId = existingContact.id;
          // Update existing contact with new information
          const updateData = {};
          if (customerName) updateData.name = customerName;
          if (customerEmail) updateData.email = customerEmail;
          if (serviceRequested) updateData.service_interest = serviceRequested;
          updateData.status = needsCallback ? 'Needs Attention' : 'Contacted';
          if (Object.keys(updateData).length > 0) {
            console.log("Updating existing B2C contact:", updateData);
            const { error: updateError } = await supabaseClient.from("b2c_contacts").update(updateData).eq("id", contactId);
            if (updateError) {
              throw updateError;
            }
          }
        }
        // Link call to contact
        const { error: linkError } = await supabaseClient.from("b2c_calls").update({
          contact_id: contactId
        }).eq("id", callRecord.id);
        if (linkError) {
          throw linkError;
        }
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Successfully processed B2C call data",
        call_id: callId,
        needs_callback: needsCallback,
        service_requested: serviceRequested,
        appointment_time: appointmentDateTime
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200
      });
    } else {
      // For non-call_analyzed events, just acknowledge
      console.log(`Ignoring ${event} event - not relevant for B2C processing`);
      return new Response(JSON.stringify({
        success: true,
        message: `Acknowledged ${event} event`
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200
      });
    }
  } catch (error) {
    console.error("Error processing B2C webhook:", error);
    console.error("Error stack:", error.stack);
    // Return a more detailed error response
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      errorDetails: {
        name: error.name,
        stack: error.stack,
        cause: error.cause
      },
      timestamp: new Date().toISOString()
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 500 // Changed from 400 to 500 for server errors
    });
  }
});

```

### 2. B2B Call Processing Function
```javascript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
// Convert Unix timestamp (milliseconds) to ISO string
function timestampToISOString(timestamp) {
  if (!timestamp) return new Date().toISOString();
  return new Date(parseInt(timestamp)).toISOString();
}
// Parse callback time to ISO string
function parseCallbackTime(callbackTimeString) {
  if (!callbackTimeString) return null;
  console.log(`Parsing callback time: "${callbackTimeString}"`);
  const now = new Date();
  let callbackDate = new Date(now);
  const lowerCaseTime = callbackTimeString.toLowerCase();
  // Handle common date references
  if (lowerCaseTime.includes('tomorrow')) {
    callbackDate.setDate(callbackDate.getDate() + 1);
  } else if (lowerCaseTime.includes('today')) {
  // Keep today's date
  } else if (lowerCaseTime.includes('next week')) {
    callbackDate.setDate(callbackDate.getDate() + 7);
  } else {
    // Try to handle specific days of the week
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday'
    ];
    for(let i = 0; i < days.length; i++){
      if (lowerCaseTime.includes(days[i])) {
        const today = callbackDate.getDay();
        let daysToAdd = i - today;
        if (daysToAdd <= 0) daysToAdd += 7;
        callbackDate.setDate(callbackDate.getDate() + daysToAdd);
        break;
      }
    }
  }
  // Extract time
  let timeMatch = lowerCaseTime.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const period = timeMatch[3].toLowerCase();
    if (period === 'pm' && hours < 12) {
      hours += 12;
    } else if (period === 'am' && hours === 12) {
      hours = 0;
    }
    callbackDate.setHours(hours, minutes, 0, 0);
  } else {
    // Default to 10 AM if no time specified
    callbackDate.setHours(10, 0, 0, 0);
  }
  return callbackDate.toISOString();
}
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  console.log("Incoming request method:", req.method);
  console.log("Request headers:", Object.fromEntries(req.headers.entries()));
  try {
    // Create Supabase client with SERVICE ROLE key to bypass RLS policies
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    console.log("Supabase URL:", supabaseUrl ? "Set" : "Missing");
    console.log("Service Role Key:", supabaseServiceKey ? "Set" : "Missing");
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        }
      }
    });
    // Parse the request body
    let payload;
    try {
      payload = await req.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid JSON in request body",
        details: parseError.message
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 400
      });
    }
    const { event, call } = payload;
    console.log(`Received ${event} event for call ${call?.call_id}`);
    // Test database connection first
    try {
      const { data: testData, error: testError } = await supabaseClient.from("b2b_calls").select("count").limit(1);
      if (testError) {
        console.error("Database connection test failed:", testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      console.log("Database connection test successful");
    } catch (dbError) {
      console.error("Database test error:", dbError);
      throw dbError;
    }
    // Process call_analyzed events for outbound B2B calls
    if (event === "call_analyzed") {
      const callId = call?.call_id || `call-${Date.now()}`;
      const customData = call?.call_analysis?.custom_analysis_data || {};
      console.log("Custom analysis data:", JSON.stringify(customData, null, 2));
      // Extract B2B specific data
      const callbackTime = customData.callback_time ? parseCallbackTime(customData.callback_time) : null;
      const isDecisionMaker = customData.decision_maker === true || customData.decision_maker === "true";
      const interestLevel = customData.interest_level || "Unknown";
      const callOutcome = customData.call_outcome || "Unknown";
      const correctName = customData.correct_name || "";
      const correctEmail = customData.correct_email || "";
      const detailedSummary = customData.detailed_call_summary || call?.call_analysis?.call_summary || "";
      // Standard call data
      const phoneNumber = call?.to_number || call?.from_number || "Unknown";
      const callTime = timestampToISOString(call?.start_timestamp || Date.now());
      const duration = Math.floor((call?.duration_ms || 0) / 1000);
      const sentiment = call?.call_analysis?.user_sentiment || null;
      const transcript = call?.transcript || "";
      const transferStatus = call?.disconnect_reason === "call_transfer" ? "Transferred" : "Not Transferred";
      // Determine if follow-up is needed
      const needsCallback = callbackTime !== null || interestLevel.toLowerCase().includes('interested');
      // Create B2B call record
      console.log("Creating B2B call record:", {
        call_id: callId,
        phone_number: phoneNumber,
        call_time: callTime,
        duration,
        sentiment,
        call_outcome: callOutcome,
        transfer_status: transferStatus,
        callback_time: callbackTime,
        decision_maker: isDecisionMaker,
        interest_level: interestLevel,
        needs_callback: needsCallback
      });
      const { data: callRecord, error: callError } = await supabaseClient.from("b2b_calls").insert({
        call_id: callId,
        phone_number: phoneNumber,
        call_time: callTime,
        duration,
        sentiment,
        summary: detailedSummary,
        transcript,
        call_outcome: callOutcome,
        transfer_status: transferStatus,
        callback_time: callbackTime,
        decision_maker: isDecisionMaker,
        decision_maker_name: correctName || null,
        decision_maker_email: correctEmail || null,
        interest_level: interestLevel,
        needs_callback: needsCallback,
        callback_status: needsCallback ? 'Need Callback' : 'Confirmed'
      }).select().single();
      if (callError) {
        throw callError;
      }
      console.log("Successfully created B2B call record:", callRecord);
      // Handle contact creation/update if we have valid contact info
      if (correctName || correctEmail || phoneNumber !== "Unknown") {
        let contactId;
        // Check if contact exists by phone
        let { data: existingContact, error: contactError } = await supabaseClient.from("b2b_contacts").select("id").eq("phone", phoneNumber).maybeSingle();
        if (contactError) {
          throw contactError;
        }
        if (!existingContact) {
          // Create new contact
          console.log("Creating new B2B contact");
          const { data: newContact, error: createError } = await supabaseClient.from("b2b_contacts").insert({
            name: correctName || "Unknown",
            phone: phoneNumber,
            email: correctEmail || "",
            decision_maker: isDecisionMaker,
            status: needsCallback ? 'Needs Attention' : 'Contacted'
          }).select("id").single();
          if (createError) {
            throw createError;
          }
          contactId = newContact.id;
        } else {
          contactId = existingContact.id;
          // Update existing contact
          const updateData = {};
          if (correctName) updateData.name = correctName;
          if (correctEmail) updateData.email = correctEmail;
          if (isDecisionMaker) updateData.decision_maker = true;
          updateData.status = needsCallback ? 'Needs Attention' : 'Contacted';
          if (Object.keys(updateData).length > 0) {
            console.log("Updating existing B2B contact:", updateData);
            const { error: updateError } = await supabaseClient.from("b2b_contacts").update(updateData).eq("id", contactId);
            if (updateError) {
              throw updateError;
            }
          }
        }
        // Link call to contact
        const { error: linkError } = await supabaseClient.from("b2b_calls").update({
          contact_id: contactId
        }).eq("id", callRecord.id);
        if (linkError) {
          throw linkError;
        }
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Successfully processed B2B call data",
        call_id: callId,
        needs_callback: needsCallback,
        decision_maker: isDecisionMaker,
        interest_level: interestLevel
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200
      });
    } else {
      // For non-call_analyzed events, just acknowledge
      console.log(`Ignoring ${event} event - not relevant for B2B processing`);
      return new Response(JSON.stringify({
        success: true,
        message: `Acknowledged ${event} event`
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200
      });
    }
  } catch (error) {
    console.error("Error processing B2B webhook:", error);
    console.error("Error stack:", error.stack);
    // Return a more detailed error response
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      errorDetails: {
        name: error.name,
        stack: error.stack,
        cause: error.cause
      },
      timestamp: new Date().toISOString()
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 500 // Changed from 400 to 500 for server errors
    });
  }
});

```

## Environment Variables
```env
VITE_SUPABASE_URL=https://srrxtonbtgvbvpxwxgqd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNycnh0b25idGd2YnZweHd4Z3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDgxNjksImV4cCI6MjA2NzkyNDE2OX0.daA6zo3qmX08HhIPpLfz7G2ObA2cn1lpCVIYQdPsTAs
```

## Getting Started
1. **Initialize Vite React app** with TypeScript
2. **Install dependencies**: shadcn/ui, Supabase client, React Router
3. **Configure shadcn/ui** with Tailwind CSS
4. **Set up Supabase client** and environment variables
5. **Create type definitions** from database schema
6. **Build main layout** with B2B/B2C navigation
7. **Implement B2C calls list** (using existing edge function)
8. **Add date filtering** and quick filters
9. **Build B2B calls list** with additional fields
10. **Create contact management** for both sides
11. **Add search and filtering** functionality
12. **Implement status toggle** workflow
14. **Polish UI/UX** and responsive design

## Success Metrics
- **Performance**: Fast page loads (<2s)
- **Usability**: Intuitive dual-interface navigation
- **Functionality**: Real-time data updates
- **Responsiveness**: Mobile-friendly design
- **Data Integrity**: Accurate filtering and search
- **Workflow**: Efficient status management

## Development Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@supabase/supabase-js": "^2.38.0",
    "date-fns": "^2.29.3",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "tailwindcss": "^3.3.0"
  }
}
```