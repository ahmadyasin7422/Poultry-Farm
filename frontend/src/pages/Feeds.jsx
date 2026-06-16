import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import SearchFilterBar from '../components/SearchFilterBar';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { feedAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const emptyForm = { feedName: '', quantityKg: '', cost: '', supplier: '', date: '' };

const Feeds = () => {
  const [feeds, setFeeds] = useState([]);
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

  useEffect(() => { fetchFeeds(); }, [search, startDate, endDate]);

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (startDate && endDate) { params.startDate = startDate; params.endDate = endDate; }
      setFeeds(await feedAPI.getAll(params));
    } catch (error) { showToast(error.message, 'error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, quantityKg: Number(formData.quantityKg), cost: Number(formData.cost) };
      if (editId) { await feedAPI.update(editId, payload); showToast('Feed updated'); }
      else { await feedAPI.create(payload); showToast('Feed added'); }
      resetForm(); fetchFeeds();
    } catch (error) { showToast(error.message, 'error'); }
  };

  const handleEdit = (feed) => {
    setFormData({
      feedName: feed.feedName, quantityKg: feed.quantityKg, cost: feed.cost,
      supplier: feed.supplier || '', date: feed.date.split('T')[0],
    });
    setEditId(feed._id); setShowForm(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await feedAPI.delete(deleteId);
      showToast('Feed deleted');
      setDeleteId(null); fetchFeeds();
    } catch (error) { showToast(error.message, 'error'); }
    finally { setDeleteLoading(false); }
  };

  const resetForm = () => { setFormData(emptyForm); setEditId(null); setShowForm(false); };

  return (
    <DashboardLayout title="Feed Management">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">Track feed purchases and suppliers</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Feed Record'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="font-semibold mb-4">{editId ? 'Edit Feed' : 'Add Feed Record'}</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" placeholder="Feed Name" value={formData.feedName}
              onChange={(e) => setFormData({ ...formData, feedName: e.target.value })}
              className="input-field" required />
            <input type="number" placeholder="Quantity (kg)" value={formData.quantityKg}
              onChange={(e) => setFormData({ ...formData, quantityKg: e.target.value })}
              className="input-field" required min="0" step="0.1" />
            <input type="number" placeholder="Cost ($)" value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="input-field" required min="0" step="0.01" />
            <input type="text" placeholder="Supplier" value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="input-field" />
            <input type="date" value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field" required />
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
        searchPlaceholder="Search by feed name or supplier..." />

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Feed Name</th>
                <th className="text-left py-3 px-4 font-semibold">Quantity (kg)</th>
                <th className="text-left py-3 px-4 font-semibold">Cost</th>
                <th className="text-left py-3 px-4 font-semibold">Supplier</th>
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeds.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No feed records found</td></tr>
              ) : feeds.map((feed) => (
                <tr key={feed._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{feed.feedName}</td>
                  <td className="py-3 px-4">{feed.quantityKg} kg</td>
                  <td className="py-3 px-4">${feed.cost.toLocaleString()}</td>
                  <td className="py-3 px-4">{feed.supplier || '-'}</td>
                  <td className="py-3 px-4">{new Date(feed.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(feed)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button onClick={() => setDeleteId(feed._id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} title="Delete Feed Record"
        message="Are you sure you want to delete this feed record?"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleteLoading} />
    </DashboardLayout>
  );
};

export default Feeds;
