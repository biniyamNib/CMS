import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
// import {
//   getShareholders,
//   addShareholder,
//   updateShareholder,
//   deleteShareholder,
// } from '../services/shareholderService';

const ShareholderManagement = () => {
  const [shareholders, setShareholders] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shares: '',
    companyId: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Mock user role (replace with auth context)
  const userRole = 'Admin';

  useEffect(() => {
    if (userRole === 'Admin') {
      const fetchShareholders = async () => {
        try {
          const data = await mockGetShareholders();
          setShareholders(data);
        } catch (err) {
          setError('Failed to load shareholders.');
        }
      };
      fetchShareholders();
    } else {
      setError('Unauthorized access.');
    }
  }, []);

  // Mock data fetching function
  const mockGetShareholders = async () => {
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@company.com',
        shares: 1000,
        companyId: 1,
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@company.com',
        shares: 500,
        companyId: 2,
      },
    ];
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Role-based access control
    if (userRole !== 'Admin') {
      setError('You are not authorized to perform this action.');
      return;
    }

    // Client-side validation
    if (!formData.name.match(/^[a-zA-Z\s]{3,}$/)) {
      setError('Name must be at least 3 characters and alphabetic.');
      return;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email.');
      return;
    }
    if (isNaN(formData.shares) || Number(formData.shares) <= 0) {
      setError('Shares must be a positive number.');
      return;
    }
    if (isNaN(formData.companyId) || Number(formData.companyId) <= 0) {
      setError('Please enter a valid company ID.');
      return;
    }

    try {
      if (editingId) {
        // Mock update
        const updatedShareholder = { ...formData, id: editingId };
        setShareholders((prev) =>
          prev.map((sh) => (sh.id === editingId ? updatedShareholder : sh))
        );
        setEditingId(null);
      } else {
        // Mock add
        const newShareholder = { ...formData, id: shareholders.length + 1 };
        setShareholders((prev) => [...prev, newShareholder]);
      }
      setFormData({ name: '', email: '', shares: '', companyId: '' });
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleEdit = (shareholder) => {
    setFormData({
      name: shareholder.name,
      email: shareholder.email,
      shares: shareholder.shares,
      companyId: shareholder.companyId,
    });
    setEditingId(shareholder.id);
  };

  const handleDelete = async (id) => {
    if (userRole !== 'Admin') {
      setError('You are not authorized to perform this action.');
      return;
    }
    try {
      // Mock delete
      setShareholders((prev) => prev.filter((sh) => sh.id !== id));
    } catch (err) {
      setError('Failed to delete shareholder.');
    }
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', email: '', shares: '', companyId: '' });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Shareholder Management</h1>
      </header>
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">
            Manage Shareholders
          </h2>
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">
              {editingId ? 'Edit Shareholder' : 'Add New Shareholder'}
            </h3>
            <form onSubmit={handleSubmit}>
              <Input
                label="Name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter shareholder name"
                required
              />
              <Input
                label="Email"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter shareholder email"
                required
              />
              <Input
                label="Shares"
                id="shares"
                type="number"
                value={formData.shares}
                onChange={handleChange}
                placeholder="Enter number of shares"
                required
              />
              <Input
                label="Company ID"
                id="companyId"
                type="number"
                value={formData.companyId}
                onChange={handleChange}
                placeholder="Enter company ID"
                required
              />
              <div className="flex space-x-4">
                <Button type="submit">
                  {editingId ? 'Update Shareholder' : 'Add Shareholder'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    className="bg-gray-600 hover:bg-gray-700"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Shareholder List</h3>
            {shareholders.length === 0 ? (
              <p className="text-gray-600">No shareholders found.</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Email</th>
                    <th className="border p-2 text-left">Shares</th>
                    <th className="border p-2 text-left">Company ID</th>
                    <th className="border p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shareholders.map((shareholder) => (
                    <tr key={shareholder.id} className="hover:bg-gray-50">
                      <td className="border p-2">{shareholder.name}</td>
                      <td className="border p-2">{shareholder.email}</td>
                      <td className="border p-2">{shareholder.shares}</td>
                      <td className="border p-2">{shareholder.companyId}</td>
                      <td className="border p-2">
                        <button
                          className="text-blue-600 hover:underline mr-2"
                          onClick={() => handleEdit(shareholder)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDelete(shareholder.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <p className="text-gray-600 text-sm text-center mt-4">
            Return to{' '}
            <a
              href="/admin/dashboard"
              className="text-blue-600 hover:underline"
            >
              Admin Dashboard
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ShareholderManagement;