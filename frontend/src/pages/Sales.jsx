import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import SearchFilterBar from '../components/SearchFilterBar';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { saleAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const emptyForm = {
  customerName: '', productType: 'Eggs', quantity: '',
  unitPrice: '', date: '',
};

const Sales = () => {
  const [sales, setSales] = useState([]);
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

  useEffect(() => { fetchSales(); }, [search, startDate, endDate]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (startDate && endDate) { params.startDate = startDate; params.endDate = endDate; }
      setSales(await saleAPI.getAll(params));
    } catch (error) { showToast(error.message, 'error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice),
      };
      if (editId) { await saleAPI.update(editId, payload); showToast('Sale updated'); }
      else { await saleAPI.create(payload); showToast('Sale recorded'); }
      resetForm(); fetchSales();
    } catch (error) { showToast(error.message, 'error'); }
  };

  const handleEdit = (sale) => {
    setFormData({
      customerName: sale.customerName, productType: sale.productType,
      quantity: sale.quantity, unitPrice: sale.unitPrice,
      date: sale.date.split('T')[0],
    });
    setEditId(sale._id); setShowForm(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await saleAPI.delete(deleteId);
      showToast('Sale deleted');
      setDeleteId(null); fetchSales();
    } catch (error) { showToast(error.message, 'error'); }
    finally { setDeleteLoading(false); }
  };

  const resetForm = () => { setFormData(emptyForm); setEditId(null); setShowForm(false); };
  const totalPrice = (Number(formData.quantity) || 0) * (Number(formData.unitPrice) || 0);

  return (
    <DashboardLayout title="Sales Management">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">Manage egg and bird sales</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ New Sale'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="font-semibold mb-4">{editId ? 'Edit Sale' : 'Record New Sale'}</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" placeholder="Customer Name" value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="input-field" required />
            <select value={formData.productType}
              onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
              className="input-field">
              <option value="Eggs">Eggs</option>
              <option value="Birds">Birds</option>
              <option value="Other">Other</option>
            </select>
            <input type="number" placeholder="Quantity" value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="input-field" required min="1" />
            <input type="number" placeholder="Unit Price ($)" value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              className="input-field" required min="0" step="0.01" />
            <input type="date" value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field" required />
            <div className="flex items-center px-4 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Price: <strong className="text-green-700">${totalPrice.toLocaleString()}</strong></span>
            </div>
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
        searchPlaceholder="Search by customer or product..." />

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Customer</th>
                <th className="text-left py-3 px-4 font-semibold">Product</th>
                <th className="text-left py-3 px-4 font-semibold">Qty</th>
                <th className="text-left py-3 px-4 font-semibold">Unit Price</th>
                <th className="text-left py-3 px-4 font-semibold">Total Price</th>
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">No sales records found</td></tr>
              ) : sales.map((sale) => (
                <tr key={sale._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{sale.customerName}</td>
                  <td className="py-3 px-4">{sale.productType}</td>
                  <td className="py-3 px-4">{sale.quantity}</td>
                  <td className="py-3 px-4">${sale.unitPrice}</td>
                  <td className="py-3 px-4 font-semibold text-green-600">${sale.totalPrice.toLocaleString()}</td>
                  <td className="py-3 px-4">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(sale)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button onClick={() => setDeleteId(sale._id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} title="Delete Sale"
        message="Are you sure you want to delete this sale record?"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleteLoading} />
    </DashboardLayout>
  );
};

export default Sales;
