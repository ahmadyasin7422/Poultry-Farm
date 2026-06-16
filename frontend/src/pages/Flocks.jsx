import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import SearchFilterBar from '../components/SearchFilterBar';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { flockAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const emptyForm = {
  batchName: '', breed: '', totalBirds: '', purchaseDate: '',
  age: '', mortalityCount: '', notes: '',
};

const Flocks = () => {
  const [flocks, setFlocks] = useState([]);
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

  useEffect(() => { fetchFlocks(); }, [search, startDate, endDate]);

  const fetchFlocks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (startDate && endDate) { params.startDate = startDate; params.endDate = endDate; }
      setFlocks(await flockAPI.getAll(params));
    } catch (error) { showToast(error.message, 'error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        totalBirds: Number(formData.totalBirds),
        age: Number(formData.age) || 0,
        mortalityCount: Number(formData.mortalityCount) || 0,
      };
      if (editId) { await flockAPI.update(editId, payload); showToast('Flock updated'); }
      else { await flockAPI.create(payload); showToast('Flock added'); }
      resetForm(); fetchFlocks();
    } catch (error) { showToast(error.message, 'error'); }
  };

  const handleEdit = (flock) => {
    setFormData({
      batchName: flock.batchName, breed: flock.breed, totalBirds: flock.totalBirds,
      purchaseDate: flock.purchaseDate.split('T')[0], age: flock.age,
      mortalityCount: flock.mortalityCount, notes: flock.notes || '',
    });
    setEditId(flock._id); setShowForm(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await flockAPI.delete(deleteId);
      showToast('Flock deleted');
      setDeleteId(null); fetchFlocks();
    } catch (error) { showToast(error.message, 'error'); }
    finally { setDeleteLoading(false); }
  };

  const resetForm = () => { setFormData(emptyForm); setEditId(null); setShowForm(false); };
  const currentBirds = (f) => Math.max(0, f.totalBirds - f.mortalityCount);

  return (
    <DashboardLayout title="Flock Management">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">Manage poultry flock batches</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Flock'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="font-semibold mb-4">{editId ? 'Edit Flock' : 'Add New Flock'}</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" placeholder="Batch Name" value={formData.batchName}
              onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
              className="input-field" required />
            <input type="text" placeholder="Breed" value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              className="input-field" required />
            <input type="number" placeholder="Total Birds" value={formData.totalBirds}
              onChange={(e) => setFormData({ ...formData, totalBirds: e.target.value })}
              className="input-field" required min="0" />
            <input type="date" value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className="input-field" required />
            <input type="number" placeholder="Age (weeks)" value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="input-field" min="0" />
            <input type="number" placeholder="Mortality Count" value={formData.mortalityCount}
              onChange={(e) => setFormData({ ...formData, mortalityCount: e.target.value })}
              className="input-field" min="0" />
            <textarea placeholder="Notes" value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field md:col-span-2 lg:col-span-3" rows="2" />
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
        searchPlaceholder="Search by batch or breed..." />

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Batch</th>
                <th className="text-left py-3 px-4 font-semibold">Breed</th>
                <th className="text-left py-3 px-4 font-semibold">Total Birds</th>
                <th className="text-left py-3 px-4 font-semibold">Purchase Date</th>
                <th className="text-left py-3 px-4 font-semibold">Age</th>
                <th className="text-left py-3 px-4 font-semibold">Mortality</th>
                <th className="text-left py-3 px-4 font-semibold">Current</th>
                <th className="text-left py-3 px-4 font-semibold">Notes</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flocks.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-8 text-gray-500">No flock records found</td></tr>
              ) : flocks.map((flock) => (
                <tr key={flock._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{flock.batchName}</td>
                  <td className="py-3 px-4">{flock.breed}</td>
                  <td className="py-3 px-4">{flock.totalBirds}</td>
                  <td className="py-3 px-4">{new Date(flock.purchaseDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{flock.age} wks</td>
                  <td className="py-3 px-4">{flock.mortalityCount}</td>
                  <td className="py-3 px-4 font-semibold text-farm-600">{currentBirds(flock)}</td>
                  <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{flock.notes || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(flock)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button onClick={() => setDeleteId(flock._id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} title="Delete Flock"
        message="Are you sure you want to delete this flock? This cannot be undone."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleteLoading} />
    </DashboardLayout>
  );
};

export default Flocks;
