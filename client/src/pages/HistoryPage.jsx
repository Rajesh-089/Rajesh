import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { api } from '../services/api.js';
import { History, Trash2, ArrowRight, Calendar, Sprout, AlertCircle, FileText } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

export default function HistoryPage() {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getAdvisoryHistory({ page, limit: 10 });
      setAdvisories(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.warn('History fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this advisory report?')) return;

    try {
      await api.deleteAdvisory(id);
      fetchHistory();
    } catch (err) {
      alert(err.message || 'Could not delete advisory record.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            Chronological Archive
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2 mt-0.5">
            <History className="w-7 h-7 text-purple-600" />
            <span>Advisory History & Previous Records</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review past seasonal recommendations, compare crop plans, and print field records.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" text="Loading previous records..." />
        ) : advisories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/80 p-8 space-y-4">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Advisory Records Found</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              When you generate crop suitability recommendations, fertilizer schedules, or pest diagnostics, they will be archived here.
            </p>
            <Link
              to="/crop-advisory"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-600 text-white font-bold text-sm shadow-sm hover:bg-forest-700 transition-all"
            >
              <Sprout className="w-4 h-4" />
              <span>Create First Advisory Plan</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm divide-y divide-gray-100 overflow-hidden">
              {advisories.map((item) => (
                <div
                  key={item.id}
                  className="p-5 hover:bg-gray-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800">
                        {item.advisory_type}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900">
                      {item.ai_response?.summary || 'Agricultural advisory output generated'}
                    </h3>

                    <p className="text-xs text-gray-500">
                      Model: <span className="font-semibold text-gray-700">{item.model_name || 'Gemini 2.5'}</span> • Language: <span className="uppercase font-semibold">{item.language || 'en'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      to={`/recommendations/${item.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 font-bold text-xs transition-colors"
                    >
                      <span>Open Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs font-bold text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
