'use client';

import { useState } from 'react';
import { Upload, FileText, Download, Search, Loader2, File, Filter } from 'lucide-react';

const demoDocuments = [
  { id: 1, file_name: 'EOB_Smith_Dec2025.pdf', type: 'eob', patient_name: 'John Smith', created_at: '2025-12-26' },
  { id: 2, file_name: 'PreAuth_Johnson.pdf', type: 'pre_auth', patient_name: 'Sarah Johnson', created_at: '2025-12-25' },
  { id: 3, file_name: 'Coverage_Williams.pdf', type: 'coverage_letter', patient_name: 'Robert Williams', created_at: '2025-12-24' },
  { id: 4, file_name: 'EOB_Garcia_Nov2025.pdf', type: 'eob', patient_name: 'Maria Garcia', created_at: '2025-12-23' },
  { id: 5, file_name: 'Superbill_Davis_1219.pdf', type: 'superbill', patient_name: 'James Davis', created_at: '2025-12-22' },
];

const typeLabels: Record<string, string> = {
  eob: 'EOB',
  pre_auth: 'Pre-Authorization',
  coverage_letter: 'Coverage Letter',
  claim_form: 'Claim Form',
  superbill: 'Superbill',
  other: 'Other',
};

export default function DocumentsPage() {
  const [documents] = useState(demoDocuments);
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [downloading, setDownloading] = useState(false);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.patient_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSelectAll = () => {
    if (selectedDocs.length === filteredDocs.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(filteredDocs.map(d => d.id));
    }
  };

  const handleBulkDownload = async () => {
    if (selectedDocs.length === 0) return;
    setDownloading(true);
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 1500));
    setDownloading(false);
    alert(`Downloaded ${selectedDocs.length} documents`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600 mt-1">Upload and manage insurance documents</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700">
          <Upload className="h-5 w-5" />
          Upload Document
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">All Types</option>
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          {selectedDocs.length > 0 && (
            <button
              onClick={handleBulkDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-600 disabled:opacity-50"
            >
              {downloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
              Download ({selectedDocs.length})
            </button>
          )}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedDocs.length === filteredDocs.length && filteredDocs.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes(doc.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDocs([...selectedDocs, doc.id]);
                        } else {
                          setSelectedDocs(selectedDocs.filter(id => id !== doc.id));
                        }
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{doc.file_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                      {typeLabels[doc.type] || doc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{doc.patient_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{doc.created_at}</td>
                  <td className="px-6 py-4">
                    <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      Download
                    </button>
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
