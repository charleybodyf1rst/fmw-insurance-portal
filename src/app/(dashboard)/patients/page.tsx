'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, User, FileText, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import type { Patient } from '@/lib/types';

const demoPatients: Patient[] = [
  { id: 1, name: 'John Smith', email: 'john.smith@email.com', member_id: 'BCBS-12345678', group_number: 'GRP-001', therapist_name: 'Dr. Emily Chen', claims_count: 12 },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', member_id: 'BCBS-23456789', group_number: 'GRP-001', therapist_name: 'Dr. Michael Brown', claims_count: 8 },
  { id: 3, name: 'Robert Williams', email: 'rwilliams@email.com', member_id: 'BCBS-34567890', group_number: 'GRP-002', therapist_name: 'Dr. Emily Chen', claims_count: 5 },
  { id: 4, name: 'Maria Garcia', email: 'maria.g@email.com', member_id: 'BCBS-45678901', group_number: 'GRP-003', therapist_name: 'Dr. Lisa Wang', claims_count: 15 },
  { id: 5, name: 'James Davis', email: 'jdavis@email.com', member_id: 'BCBS-56789012', group_number: 'GRP-001', therapist_name: 'Dr. Michael Brown', claims_count: 3 },
];

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>(demoPatients);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await api.searchPatients(searchQuery);
      setPatients(results);
      setSearched(true);
    } catch (error) {
      console.log('Using demo data:', error);
      const filtered = demoPatients.filter(
        p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             p.member_id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPatients(filtered.length > 0 ? filtered : demoPatients);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patient Search</h1>
        <p className="text-gray-600 mt-1">Search for patients by name or member ID</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter patient name or member ID..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            Search
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {searched ? `Search Results (${patients.length})` : 'Recent Patients'}
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {patients.map((patient) => (
            <div key={patient.id} className="p-6 hover:bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-500">{patient.email}</p>
                  <div className="flex gap-4 mt-1 text-xs text-gray-400">
                    <span>Member: {patient.member_id}</span>
                    <span>Group: {patient.group_number}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{patient.therapist_name}</p>
                  <p className="text-xs text-gray-500">Therapist</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{patient.claims_count}</p>
                  <p className="text-xs text-gray-500">Claims</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/patients/${patient.id}`}
                    className="px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary-50"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/claims?patient_id=${patient.id}`}
                    className="px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700 flex items-center gap-1"
                  >
                    <FileText className="h-4 w-4" />
                    Claims
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
