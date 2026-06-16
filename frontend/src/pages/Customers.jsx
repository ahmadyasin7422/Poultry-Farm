import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { customerAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const emptyForm = { name: '', phone: '', address: '', notes: '' };

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => { fetchCustomers(); }, [search]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = search ? { search } : {};
      setCustomers(await customerAPI.getAll(params));
    } catch (error) { showToast(error.message, 'error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await customerAPI.update(editId, formData); showToast('Customer updated'); }
      else { await customerAPI.create(formData); showToast('Customer added'); }
      resetForm(); fetchCustomers();
    } catch (error) { showToast(error.message, 'error'); }
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name, phone: customer.phone,
      address: customer.address || '', notes: customer.notes || '',
    });
    setEditId(customer._id); setShowForm(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await customerAPI.delete(deleteId);
      showToast('Customer deleted');
      setDeleteId(null); fetchCustomers();
    } catch (error) { showToast(error.message, 'error'); }
    finally { setDeleteLoading(false); }
  };

  const resetForm = () => { setFormData(emptyForm); setEditId(null); setShowForm(false); };

  return (
    <DashboardLayout title="Customer Management">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">Manage customer records</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Customer'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="font-semibold mb-4">{editId ? 'Edit Customer' : 'Add New Customer'}</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Name" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field" required />
            <input type="tel" placeholder="Phone" value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field" required />
            <input type="text" placeholder="Address" value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input-field" />
            <textarea placeholder="Notes" value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field" rows="2" />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary">{editId ? 'Update' : 'Save'}</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card mb-6">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone..." className="input-field" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Phone</th>
                <th className="text-left py-3 px-4 font-semibold">Address</th>
                <th className="text-left py-3 px-4 font-semibold">Notes</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">No customers found</td></tr>
              ) : customers.map((customer) => (
                <tr key={customer._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{customer.name}</td>
                  <td className="py-3 px-4">{customer.phone}</td>
                  <td className="py-3 px-4">{customer.address || '-'}</td>
                  <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{customer.notes || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(customer)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button onClick={() => setDeleteId(customer._id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} title="Delete Customer"
        message="Are you sure you want to delete this customer?"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleteLoading} />
    </DashboardLayout>
  );
};

export default Customers;
