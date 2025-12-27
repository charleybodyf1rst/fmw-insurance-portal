// Authentication types
export interface InsuranceUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'claims_processor' | 'viewer';
  insurance_company: {
    id: number;
    name: string;
    code: string;
  };
}

export interface AuthResponse {
  token: string;
  user: InsuranceUser;
}

// Patient types
export interface Patient {
  id: number;
  name: string;
  email: string;
  member_id?: string;
  group_number?: string;
  therapist_name?: string;
  claims_count: number;
}

// Claim types
export interface Claim {
  id: number;
  claim_number: string;
  patient_name: string;
  patient_id: number;
  therapist_name: string;
  service_date: string;
  service_type: string;
  billed_amount: number;
  approved_amount?: number;
  status: ClaimStatus;
  submitted_at?: string;
  processed_at?: string;
}

export interface ClaimDetail extends Claim {
  patient: {
    id: number;
    name: string;
    email: string;
  };
  therapist: {
    id: number;
    name: string;
  };
  diagnosis_codes?: string[];
  procedure_codes?: string[];
  paid_at?: string;
  denial_reason?: string;
  notes?: string;
  documents: ClaimDocument[];
}

export type ClaimStatus =
  | 'draft'
  | 'pending'
  | 'submitted'
  | 'in_review'
  | 'approved'
  | 'denied'
  | 'partially_approved'
  | 'paid';

// Document types
export interface InsuranceDocument {
  id: number;
  type: 'eob' | 'pre_auth' | 'coverage_letter' | 'claim_form' | 'superbill' | 'other';
  direction: 'to_patient' | 'from_patient';
  file_name: string;
  file_size: number;
  description?: string;
  claim_id?: number;
  created_at: string;
}

export interface ClaimDocument {
  id: number;
  type: string;
  file_name: string;
  created_at: string;
}

// Analytics types
export interface InsuranceAnalytics {
  claims_summary: {
    total: number;
    pending: number;
    approved: number;
    denied: number;
    paid: number;
  };
  financial: {
    total_billed: number;
    total_approved: number;
    total_paid: number;
    this_month_billed: number;
  };
  processing: {
    avg_processing_days: number;
    claims_this_month: number;
    claims_last_month: number;
  };
  patients: {
    total_active: number;
  };
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
