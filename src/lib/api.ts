import axios from 'axios';
import { getStoredToken, clearStoredUser } from './auth';
import type {
  AuthResponse,
  InsuranceUser,
  Patient,
  Claim,
  ClaimDetail,
  InsuranceDocument,
  InsuranceAnalytics,
  PaginatedResponse
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.bodyf1rst.net/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredUser();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

const api = {
  // Auth
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/fmw/insurance/auth/login', { email, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/fmw/insurance/auth/logout');
  },

  getProfile: async (): Promise<InsuranceUser> => {
    const response = await apiClient.get('/fmw/insurance/profile');
    return response.data;
  },

  // Patients
  searchPatients: async (query: string): Promise<Patient[]> => {
    const response = await apiClient.get('/fmw/insurance/patients', { params: { query } });
    return response.data.data;
  },

  getPatientDocuments: async (patientId: number): Promise<InsuranceDocument[]> => {
    const response = await apiClient.get(`/fmw/insurance/patients/${patientId}/documents`);
    return response.data.data;
  },

  uploadPatientDocument: async (
    patientId: number,
    file: File,
    type: string,
    claimId?: number,
    description?: string
  ): Promise<{ id: number; file_name: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (claimId) formData.append('claim_id', String(claimId));
    if (description) formData.append('description', description);

    const response = await apiClient.post(
      `/fmw/insurance/patients/${patientId}/documents`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.document;
  },

  // Claims
  getClaims: async (filters?: {
    status?: string;
    patient_id?: number;
    from_date?: string;
    to_date?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Claim>> => {
    const response = await apiClient.get('/fmw/insurance/claims', { params: filters });
    return response.data;
  },

  getClaim: async (claimId: number): Promise<ClaimDetail> => {
    const response = await apiClient.get(`/fmw/insurance/claims/${claimId}`);
    return response.data.data;
  },

  updateClaim: async (
    claimId: number,
    data: {
      status: string;
      approved_amount?: number;
      denial_reason?: string;
      notes?: string
    }
  ): Promise<void> => {
    await apiClient.put(`/fmw/insurance/claims/${claimId}`, data);
  },

  getClaimDocuments: async (claimId: number): Promise<InsuranceDocument[]> => {
    const response = await apiClient.get(`/fmw/insurance/claims/${claimId}/documents`);
    return response.data.data;
  },

  // Documents
  bulkDownloadDocuments: async (documentIds: number[]): Promise<{ id: number; file_name: string; url: string }[]> => {
    const response = await apiClient.post('/fmw/insurance/documents/bulk-download', { document_ids: documentIds });
    return response.data.data;
  },

  // Analytics
  getAnalytics: async (): Promise<InsuranceAnalytics> => {
    const response = await apiClient.get('/fmw/insurance/analytics');
    return response.data.data;
  },
};

export default api;
