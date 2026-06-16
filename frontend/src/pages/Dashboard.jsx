import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { dashboardAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await dashboardAPI.getStats();
      setStats(data);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats
    ? [
        { title: 'Total Birds', value: stats.totalBirds, icon: '🐔', color: 'bg-blue-50 text-blue-700' },
        { title: 'Total Eggs', value: stats.totalEggs, icon: '🥚', color: 'bg-amber-50 text-amber-700' },
        { title: 'Total Sales', value: `$${stats.totalSales.toLocaleString()}`, icon: '💰', color: 'bg-green-50 text-green-700' },
        { title: 'Total Expenses', value: `$${stats.totalExpenses.toLocaleString()}`, icon: '📝', color: 'bg-red-50 text-red-700' },
        {
          title: 'Net Profit',
          value: `$${stats.netProfit.toLocaleString()}`,
          icon: '📈',
          color: stats.netProfit >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
        },
      ]
    : [];

  return (
    <DashboardLayout title="Dashboard">
      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="text-lg text-gray-600">Farm overview from live database data</h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {statCards.map((card, index) => (
              <div key={index} className="stat-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <span className={`text-2xl p-2 rounded-lg ${card.color}`}>{card.icon}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { path: '/flocks', label: 'Add Flock', icon: '🐔' },
                  { path: '/eggs', label: 'Record Eggs', icon: '🥚' },
                  { path: '/sales', label: 'New Sale', icon: '💰' },
                  { path: '/expenses', label: 'Add Expense', icon: '📝' },
                ].map((action) => (
                  <Link key={action.path} to={action.path}
                    className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-farm-300 hover:bg-farm-50 transition-colors">
                    <span>{action.icon}</span>
                    <span className="text-sm font-medium">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Profit Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sales</span>
                  <span className="font-semibold text-green-600">${stats?.totalSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Expenses</span>
                  <span className="font-semibold text-red-600">${stats?.totalExpenses.toLocaleString()}</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="font-semibold">Net Profit</span>
                  <span className={`font-bold text-lg ${stats?.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${stats?.netProfit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
