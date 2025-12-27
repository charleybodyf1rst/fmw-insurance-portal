'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Filter, FileText, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import type { Claim } from '@/lib/types';

const demoClaims: Claim[] = [
  { id: 1, claim_number: 'CLM-20251226-ABC123', patient_name: 'John Smith', patient_id: 1, therapist_name: 'Dr. Emily Chen', service_date: '2025-12-20', service_type: 'Individual Therapy', billed_amount: 175, status: 'submitted' },
  { id: 2, claim_number: 'CLM-20251225-DEF456', patient_name: 'Sarah Johnson', patient_id: 2, therapist_name: 'Dr. Michael Brown', service_date: '2025-12-19', service_type: 'Group Therapy', billed_amount: 85, status: 'in_review' },
  { id: 3, claim_number: 'CLM-20251224-GHI789', patient_name: 'Robert Williams', patient_id: 3, therapist_name: 'Dr. Emily Chen', service_date: '2025-12-18', service_type: 'Assessment', billed_amount: 250, status: 'pending' },
  { id: 4, claim_number: 'CLM-20251223-JKL012', patient_name: 'Maria Garcia', patient_id: 4, therapist_name: 'Dr. Lisa Wang', service_date: '2025-12-17', service_type: 'Individual Therapy', billed_amount: 175, approved_amount: 150, status: 'approved' },
  { id: 5, claim_number: 'CLM-20251222-MNO345', patient_name: 'James Davis', patient_id: 5, therapist_name: 'Dr. Michael Brown', service_date: '2025-12-16', service_type: 'Individual Therapy', billed_amount: 175, status: 'denied' },
  { id: 6, claim_number: 'CLM-20251221-PQR678', patient_name: 'Jennifer Wilson', patient_id: 6, therapist_name: 'Dr. Emily Chen', service_date: '2025-12-15', service_type: 'Group Therapy', billed_amount: 85, approved_amount: 85, status: 'paid' },
  { id: 7, claim_number: 'CLM-20251220-STU901', patient_name: 'Michael Taylor', patient_id: 7, therapist_name: 'Dr. Lisa Wang', service_date: '2025-12-14', service_type: 'Individual Therapy', billed_amount: 175, status: 'submitted' },
  { id: 8, claim_number: 'CLM-20251219-VWX234', patient_name: 'Linda Anderson', patient_id: 8, therapist_name: 'Dr. Michael Brown', service_date: '2025-12-13', service_type: 'Assessment', billed_amount: 250, approved_amount: 200, status: 'partially_approved' },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'denied', label: 'Denied' },
  { value: 'partially_approved', label: 'Partially Approved' },
  { value: 'paid', label: 'Paid' },
];

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchClaims() {
      setLoading(true);
      try {
        const response = await api.getClaims({
          status: statusFilter || undefined,
          page: currentPage,
          per_page: 10,
        });
        setClaims(response.data);
        setTotalPages(response.meta.last_page);
      } catch (error) {
        console.log('Using demo data:', error);
        let filtered = demoClaims;
        if (statusFilter) {
          filtered = demoClaims.filter(c => c.status === statusFilter);
        }
        setClaims(filtered);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }
    fetchClaims();
  }, [statusFilter, currentPage]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claims Management</h1>
          <p className="text-gray-600 mt-1">Review and process insurance claims</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : claims.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No claims found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Billed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {claims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-900">{claim.claim_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{claim.patient_name}</p>
                        <p className="text-xs text-gray-500">{claim.therapist_name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{claim.service_type}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{claim.service_date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ${claim.billed_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {claim.approved_amount ? `$${claim.approved_amount.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <ClaimStatusBadge status={claim.status} />
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/claims/${claim.id}`}
                          className="text-primary text-sm font-medium hover:underline"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ClaimStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
    submitted: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Submitted' },
    in_review: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'In Review' },
    approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
    denied: { bg: 'bg-red-100', text: 'text-red-700', label: 'Denied' },
    partially_approved: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Partial' },
    paid: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Paid' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
