import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { dashboardAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const Reports = () => {
  const [period, setPeriod] = useState('daily');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchReport();
  }, [period]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getReports(period);
      setReport(data);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const periods = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <DashboardLayout title="Reports">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <p className="text-gray-600">View farm performance reports</p>
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p.value
                  ? 'bg-farm-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : report ? (
        <>
          {/* Financial Summary */}
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            <div className="stat-card border-l-4 border-l-green-500">
              <p className="text-sm text-gray-500 mb-1">Total Sales</p>
              <p className="text-3xl font-bold text-green-600">
                ${report.totalSales.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">{report.salesCount} transactions</p>
            </div>
            <div className="stat-card border-l-4 border-l-red-500">
              <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600">
                ${report.totalExpenses.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">{report.expensesCount} records</p>
            </div>
            <div className={`stat-card border-l-4 ${report.netProfit >= 0 ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
              <p className="text-sm text-gray-500 mb-1">Net Profit</p>
              <p className={`text-3xl font-bold ${report.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                ${report.netProfit.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1 capitalize">{report.period} report</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Egg Production Summary */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🥚</span> Egg Production Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-600">Good Eggs</span>
                  <span className="font-bold text-green-700">{report.eggSummary.goodEggs}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-600">Damaged Eggs</span>
                  <span className="font-bold text-red-700">{report.eggSummary.damagedEggs}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span className="text-gray-600">Total Eggs</span>
                  <span className="font-bold text-amber-700">{report.eggSummary.totalEggs}</span>
                </div>
                <p className="text-sm text-gray-500">
                  Based on {report.eggSummary.recordCount} collection record(s)
                </p>
              </div>
            </div>

            {/* Feed Cost Summary */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🌾</span> Feed Cost Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-farm-50 rounded-lg">
                  <span className="text-gray-600">Total Feed Cost</span>
                  <span className="font-bold text-farm-700">
                    ${report.feedSummary.totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600">Total Quantity</span>
                  <span className="font-bold text-blue-700">
                    {report.feedSummary.totalQuantityKg} kg
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Based on {report.feedSummary.recordCount} feed record(s)
                </p>
              </div>
            </div>
          </div>

          {/* Date Range Info */}
          <div className="mt-6 card bg-gray-50">
            <p className="text-sm text-gray-600">
              Report period:{' '}
              <strong>{new Date(report.dateRange.start).toLocaleDateString()}</strong> to{' '}
              <strong>{new Date(report.dateRange.end).toLocaleDateString()}</strong>
            </p>
          </div>
        </>
      ) : null}
    </DashboardLayout>
  );
};

export default Reports;
