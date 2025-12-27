'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react';
import api from '@/lib/api';
import type { InsuranceAnalytics, Claim } from '@/lib/types';

// Demo data
const demoAnalytics: InsuranceAnalytics = {
  claims_summary: {
    total: 1248,
    pending: 47,
    approved: 892,
    denied: 123,
    paid: 186,
  },
  financial: {
    total_billed: 2456780,
    total_approved: 1987654,
    total_paid: 1654321,
    this_month_billed: 187500,
  },
  processing: {
    avg_processing_days: 4.2,
    claims_this_month: 156,
    claims_last_month: 142,
  },
  patients: {
    total_active: 423,
  },
};

const demoClaims: Claim[] = [
  { id: 1, claim_number: 'CLM-20251226-ABC123', patient_name: 'John Smith', patient_id: 1, therapist_name: 'Dr. Emily Chen', service_date: '2025-12-20', service_type: 'Individual Therapy', billed_amount: 175, status: 'submitted' },
  { id: 2, claim_number: 'CLM-20251225-DEF456', patient_name: 'Sarah Johnson', patient_id: 2, therapist_name: 'Dr. Michael Brown', service_date: '2025-12-19', service_type: 'Group Therapy', billed_amount: 85, status: 'in_review' },
  { id: 3, claim_number: 'CLM-20251224-GHI789', patient_name: 'Robert Williams', patient_id: 3, therapist_name: 'Dr. Emily Chen', service_date: '2025-12-18', service_type: 'Assessment', billed_amount: 250, status: 'pending' },
  { id: 4, claim_number: 'CLM-20251223-JKL012', patient_name: 'Maria Garcia', patient_id: 4, therapist_name: 'Dr. Lisa Wang', service_date: '2025-12-17', service_type: 'Individual Therapy', billed_amount: 175, status: 'approved', approved_amount: 150 },
  { id: 5, claim_number: 'CLM-20251222-MNO345', patient_name: 'James Davis', patient_id: 5, therapist_name: 'Dr. Michael Brown', service_date: '2025-12-16', service_type: 'Individual Therapy', billed_amount: 175, status: 'denied' },
];

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<InsuranceAnalytics | null>(null);
  const [recentClaims, setRecentClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [analyticsData, claimsData] = await Promise.all([
          api.getAnalytics(),
          api.getClaims({ per_page: 5 }),
        ]);
        setAnalytics(analyticsData);
        setRecentClaims(claimsData.data);
      } catch (error) {
        console.log('Using demo data:', error);
        setAnalytics(demoAnalytics);
        setRecentClaims(demoClaims);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = analytics || demoAnalytics;
  const monthChange = stats.processing.claims_this_month - stats.processing.claims_last_month;
  const monthChangePercent = stats.processing.claims_last_month > 0
    ? Math.round((monthChange / stats.processing.claims_last_month) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Claims Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of claims processing and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FileText className="h-6 w-6 text-blue-600" />}
          label="Total Claims"
          value={stats.claims_summary.total.toLocaleString()}
          change={`${monthChange >= 0 ? '+' : ''}${monthChange} this month`}
          changeType={monthChange >= 0 ? 'positive' : 'negative'}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-amber-600" />}
          label="Pending Review"
          value={stats.claims_summary.pending.toString()}
          change="Needs attention"
          changeType="neutral"
          bgColor="bg-amber-50"
        />
        <StatCard
          icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          label="Approved"
          value={stats.claims_summary.approved.toLocaleString()}
          change={`${Math.round((stats.claims_summary.approved / stats.claims_summary.total) * 100)}% approval rate`}
          changeType="positive"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<DollarSign className="h-6 w-6 text-primary" />}
          label="Total Paid"
          value={`$${(stats.financial.total_paid / 1000).toFixed(0)}K`}
          change={`$${(stats.financial.this_month_billed / 1000).toFixed(0)}K billed this month`}
          changeType="positive"
          bgColor="bg-primary-50"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Processing Time</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.processing.avg_processing_days.toFixed(1)}</p>
          <p className="text-gray-500 text-sm">Average days to process</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Active Members</h3>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.patients.total_active}</p>
          <p className="text-gray-500 text-sm">Covered patients</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Denial Rate</h3>
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round((stats.claims_summary.denied / stats.claims_summary.total) * 100)}%
          </p>
          <p className="text-gray-500 text-sm">{stats.claims_summary.denied} claims denied</p>
        </div>
      </div>

      {/* Recent Claims */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Claims</h2>
            <Link href="/claims" className="text-primary text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(recentClaims.length > 0 ? recentClaims : demoClaims).map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{claim.claim_number}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{claim.patient_name}</p>
                    <p className="text-xs text-gray-500">{claim.therapist_name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{claim.service_type}</p>
                    <p className="text-xs text-gray-500">{claim.service_date}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${claim.billed_amount.toFixed(2)}
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
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  changeType,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center gap-1 mt-1">
            {changeType === 'positive' && <ArrowUpRight className="h-4 w-4 text-green-500" />}
            {changeType === 'negative' && <ArrowDownRight className="h-4 w-4 text-red-500" />}
            <span className={`text-xs ${
              changeType === 'positive' ? 'text-green-600' :
              changeType === 'negative' ? 'text-red-600' :
              'text-gray-500'
            }`}>
              {change}
            </span>
          </div>
        </div>
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
