import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import SearchFilterBar from '../components/SearchFilterBar';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { expenseAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const emptyForm = { title: '', category: '', amount: '', description: '', date: '' };

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => { fetchExpenses(); }, [search, startDate, endDate]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (startDate && endDate) { params.startDate = startDate; params.endDate = endDate; }
      setExpenses(await expenseAPI.getAll(params));
    } catch (error) { showToast(error.message, 'error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, amount: Number(formData.amount) };
      if (editId) { await expenseAPI.update(editId, payload); showToast('Expense updated'); }
      else { await expenseAPI.create(payload); showToast('Expense added'); }
      resetForm(); fetchExpenses();
    } catch (error) { showToast(error.message, 'error'); }
  };

  const handleEdit = (expense) => {
    setFormData({
      title: expense.title, category: expense.category, amount: expense.amount,
      description: expense.description || '', date: expense.date.split('T')[0],
    });
    setEditId(expense._id); setShowForm(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await expenseAPI.delete(deleteId);
      showToast('Expense deleted');
      setDeleteId(null); fetchExpenses();
    } catch (error) { showToast(error.message, 'error'); }
    finally { setDeleteLoading(false); }
  };

  const resetForm = () => { setFormData(emptyForm); setEditId(null); setShowForm(false); };

  return (
    <DashboardLayout title="Expense Management">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">Track farm expenses and costs</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="font-semibold mb-4">{editId ? 'Edit Expense' : 'Add New Expense'}</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" placeholder="Title" value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field" required />
            <input type="text" placeholder="Category" value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field" required />
            <input type="number" placeholder="Amount ($)" value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input-field" required min="0" step="0.01" />
            <input type="date" value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field" required />
            <textarea placeholder="Description" value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field md:col-span-2" rows="2" />
            <div className="md:col-span-2 lg:col-span-3 flex gap-3">
              <button type="submit" className="btn-primary">{editId ? 'Update' : 'Save'}</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <SearchFilterBar search={search} onSearchChange={setSearch}
        startDate={startDate} endDate={endDate}
        onStartDateChange={setStartDate} onEndDateChange={setEndDate}
        searchPlaceholder="Search by title or category..." />

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Title</th>
                <th className="text-left py-3 px-4 font-semibold">Category</th>
                <th className="text-left py-3 px-4 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">Description</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No expense records found</td></tr>
              ) : expenses.map((expense) => (
                <tr key={expense._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{expense.title}</td>
                  <td className="py-3 px-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{expense.category}</span></td>
                  <td className="py-3 px-4 font-semibold text-red-600">${expense.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{expense.description || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(expense)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button onClick={() => setDeleteId(expense._id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} title="Delete Expense"
        message="Are you sure you want to delete this expense record?"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleteLoading} />
    </DashboardLayout>
  );
};

export default Expenses;
