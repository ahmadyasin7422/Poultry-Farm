import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import SearchFilterBar from '../components/SearchFilterBar';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { eggAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const emptyForm = { date: '', goodEggs: '', damagedEggs: '' };

const Eggs = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => { fetchRecords(); }, [startDate, endDate]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate && endDate) { params.startDate = startDate; params.endDate = endDate; }
      setRecords(await eggAPI.getAll(params));
    } catch (error) { showToast(error.message, 'error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        date: formData.date,
        goodEggs: Number(formData.goodEggs),
        damagedEggs: Number(formData.damagedEggs) || 0,
      };
      if (editId) { await eggAPI.update(editId, payload); showToast('Record updated'); }
      else { await eggAPI.create(payload); showToast('Egg collection recorded'); }
      resetForm(); fetchRecords();
    } catch (error) { showToast(error.message, 'error'); }
  };

  const handleEdit = (record) => {
    setFormData({
      date: record.date.split('T')[0],
      goodEggs: record.goodEggs,
      damagedEggs: record.damagedEggs,
    });
    setEditId(record._id); setShowForm(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await eggAPI.delete(deleteId);
      showToast('Record deleted');
      setDeleteId(null); fetchRecords();
    } catch (error) { showToast(error.message, 'error'); }
    finally { setDeleteLoading(false); }
  };

  const resetForm = () => { setFormData(emptyForm); setEditId(null); setShowForm(false); };
  const totalPreview = (Number(formData.goodEggs) || 0) + (Number(formData.damagedEggs) || 0);

  return (
    <DashboardLayout title="Egg Production">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">Record daily egg collection</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Record Eggs'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="font-semibold mb-4">{editId ? 'Edit Record' : 'Daily Egg Collection'}</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input type="date" value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field" required />
            <input type="number" placeholder="Good Eggs" value={formData.goodEggs}
              onChange={(e) => setFormData({ ...formData, goodEggs: e.target.value })}
              className="input-field" required min="0" />
            <input type="number" placeholder="Damaged Eggs" value={formData.damagedEggs}
              onChange={(e) => setFormData({ ...formData, damagedEggs: e.target.value })}
              className="input-field" min="0" />
            <div className="flex items-center px-4 bg-farm-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Eggs: <strong>{totalPreview}</strong></span>
            </div>
            <div className="md:col-span-2 lg:col-span-4 flex gap-3">
              <button type="submit" className="btn-primary">{editId ? 'Update' : 'Save'}</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <SearchFilterBar search="" onSearchChange={() => {}}
        startDate={startDate} endDate={endDate}
        onStartDateChange={setStartDate} onEndDateChange={setEndDate}
        showSearch={false} />

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">Good Eggs</th>
                <th className="text-left py-3 px-4 font-semibold">Damaged Eggs</th>
                <th className="text-left py-3 px-4 font-semibold">Total Eggs</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">No egg records found</td></tr>
              ) : records.map((record) => (
                <tr key={record._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-green-600">{record.goodEggs}</td>
                  <td className="py-3 px-4 text-red-600">{record.damagedEggs}</td>
                  <td className="py-3 px-4 font-semibold">{record.totalEggs}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(record)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button onClick={() => setDeleteId(record._id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} title="Delete Record"
        message="Are you sure you want to delete this egg production record?"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleteLoading} />
    </DashboardLayout>
  );
};

export default Eggs;
