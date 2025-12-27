'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Users,
  FileCheck,
  FileX,
  Loader2,
} from 'lucide-react';
import api from '@/lib/api';
import type { InsuranceAnalytics } from '@/lib/types';

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

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<InsuranceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const data = await api.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.log('Using demo data:', error);
        setAnalytics(demoAnalytics);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = analytics || demoAnalytics;
  const approvalRate = Math.round((stats.claims_summary.approved / stats.claims_summary.total) * 100);
  const denialRate = Math.round((stats.claims_summary.denied / stats.claims_summary.total) * 100);
  const paymentRate = Math.round((stats.financial.total_paid / stats.financial.total_approved) * 100);
  const monthChange = stats.processing.claims_this_month - stats.processing.claims_last_month;
  const monthChangePercent = stats.processing.claims_last_month > 0
    ? Math.round((monthChange / stats.processing.claims_last_month) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Claims processing insights and financial metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<BarChart3 className="h-6 w-6 text-primary" />}
          label="Total Claims"
          value={stats.claims_summary.total.toLocaleString()}
          subtitle={`${stats.processing.claims_this_month} this month`}
          trend={monthChange >= 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(monthChangePercent)}%`}
        />
        <MetricCard
          icon={<FileCheck className="h-6 w-6 text-green-600" />}
          label="Approval Rate"
          value={`${approvalRate}%`}
          subtitle={`${stats.claims_summary.approved} approved`}
          trend="up"
          trendValue="2.3%"
        />
        <MetricCard
          icon={<Clock className="h-6 w-6 text-amber-600" />}
          label="Avg Processing Time"
          value={`${stats.processing.avg_processing_days.toFixed(1)} days`}
          subtitle="Target: 5 days"
          trend="down"
          trendValue="0.5 days"
        />
        <MetricCard
          icon={<DollarSign className="h-6 w-6 text-emerald-600" />}
          label="Total Paid"
          value={`$${(stats.financial.total_paid / 1000000).toFixed(2)}M`}
          subtitle={`${paymentRate}% of approved`}
          trend="up"
          trendValue="12%"
        />
      </div>

      {/* Claims Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Claims Status Breakdown</h2>
          <div className="space-y-4">
            <StatusBar
              label="Approved"
              count={stats.claims_summary.approved}
              total={stats.claims_summary.total}
              color="bg-green-500"
            />
            <StatusBar
              label="Paid"
              count={stats.claims_summary.paid}
              total={stats.claims_summary.total}
              color="bg-emerald-500"
            />
            <StatusBar
              label="Pending"
              count={stats.claims_summary.pending}
              total={stats.claims_summary.total}
              color="bg-yellow-500"
            />
            <StatusBar
              label="Denied"
              count={stats.claims_summary.denied}
              total={stats.claims_summary.total}
              color="bg-red-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Financial Summary</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Total Billed</span>
                <span className="font-semibold">${stats.financial.total_billed.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Total Approved</span>
                <span className="font-semibold">${stats.financial.total_approved.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(stats.financial.total_approved / stats.financial.total_billed) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Total Paid</span>
                <span className="font-semibold">${stats.financial.total_paid.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(stats.financial.total_paid / stats.financial.total_billed) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-50 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.patients.total_active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <FileX className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Denial Rate</p>
              <p className="text-2xl font-bold text-gray-900">{denialRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">This Month Billed</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(stats.financial.this_month_billed / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  subtitle,
  trend,
  trendValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  trend: 'up' | 'down';
  trendValue: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        <div className={`flex items-center gap-1 text-sm ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {trendValue}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}

function StatusBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = Math.round((count / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{count.toLocaleString()} ({percentage}%)</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
