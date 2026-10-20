import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import Notification from '../common/Notification';

const DesignationManagement = () => {
    const [designations, setDesignations] = useState([]);
    const [formData, setFormData] = useState({
    companyId: '',
    name: '',
    description: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    // Mock user role (replace with auth context)
    const userRole = 'Admin';

    useEffect(() => {
    if (['Admin', 'HR'].includes(userRole)) {
        const fetchDesignations = async () => {
        try {
            const data = await mockGetDesignations();
            setDesignations(data);
        } catch (err) {
            setError('Failed to load designations.');
        }
        };
        fetchDesignations();
    } else {
        setError('Unauthorized access.');
        navigate('/dashboard');
    }
    }, [navigate]);

    // Mock data fetching function
    const mockGetDesignations = async () => {
    return [
        { id: 1, companyId: 1, name: 'Software Engineer', description: 'Develops software solutions' },
        { id: 2, companyId: 1, name: 'HR Manager', description: 'Manages HR operations' },
    ];
    };

    const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!['Admin', 'HR'].includes(userRole)) {
        setError('You are not authorized to perform this action.');
        return;
    }

    if (isNaN(formData.companyId) || Number(formData.companyId) <= 0) {
        setError('Please enter a valid company ID.');
        return;
    }
    if (!formData.name.trim()) {
        setError('Designation name is required.');
        return;
    }
    if (designations.some((d) => d.name.toLowerCase() === formData.name.toLowerCase() && d.id !== editingId && d.companyId === Number(formData.companyId))) {
        setError('Designation name already exists for this company.');
        return;
    }

    try {
        const newDesignation = {
        ...formData,
        companyId: Number(formData.companyId),
        };
        if (editingId) {
        // Mock update
        setDesignations((prev) =>
            prev.map((d) => (d.id === editingId ? { ...newDesignation, id: editingId } : d))
        );
        setNotifications([...notifications, {
            id: Date.now(),
            message: `Designation "${newDesignation.name}" updated successfully.`,
            type: 'success',
        }]);
        setEditingId(null);
        } else {
        // Mock add
        setDesignations((prev) => [...prev, { ...newDesignation, id: prev.length + 1 }]);
        setNotifications([...notifications, {
            id: Date.now(),
            message: `Designation "${newDesignation.name}" added successfully.`,
            type: 'success',
        }]);
        }
        setFormData({ companyId: '', name: '', description: '' });
    } catch (err) {
        setError('An error occurred. Please try again.');
    }
    };

    const handleEdit = (designation) => {
    setFormData({
        companyId: designation.companyId,
        name: designation.name,
        description: designation.description,
    });
    setEditingId(designation.id);
    };

    const handleDelete = async (id, name) => {
    if (!['Admin', 'HR'].includes(userRole)) {
        setError('You are not authorized to perform this action.');
        return;
    }
    try {
        setDesignations((prev) => prev.filter((d) => d.id !== id));
        setNotifications([...notifications, {
        id: Date.now(),
        message: `Designation "${name}" deleted successfully.`,
        type: 'success',
        }]);
    } catch (err) {
        setError('Failed to delete designation.');
    }
    };

    const handleCancelEdit = () => {
    setFormData({ companyId: '', name: '', description: '' });
    setEditingId(null);
    };

    const closeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    return (
    <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Designation Management</h1>
        </header>
        <main className="p-6">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Manage Designations</h2>
            {notifications.map((notif) => (
            <Notification
                key={notif.id}
                message={notif.message}
                type={notif.type}
                onClose={() => closeNotification(notif.id)}
            />
            ))}
            {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">
                {editingId ? 'Edit Designation' : 'Add New Designation'}
            </h3>
            <form onSubmit={handleSubmit}>
                <Input
                label="Company ID"
                id="companyId"
                type="number"
                value={formData.companyId}
                onChange={handleChange}
                placeholder="Enter company ID"
                required
                />
                <Input
                label="Designation Name"
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter designation name (e.g., Software Engineer)"
                required
                />
                <Input
                label="Description"
                id="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter designation description"
                />
                <div className="flex space-x-4">
                <Button type="submit">
                    {editingId ? 'Update Designation' : 'Add Designation'}
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
            <h3 className="text-lg font-medium mb-4">Designations</h3>
            {designations.length === 0 ? (
                <p className="text-gray-600">No designations found.</p>
            ) : (
                <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                    <th className="border p-2 text-left">Company ID</th>
                    <th className="border p-2 text-left">Designation Name</th>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {designations.map((designation) => (
                    <tr key={designation.id} className="hover:bg-gray-50">
                        <td className="border p-2">{designation.companyId}</td>
                        <td className="border p-2">{designation.name}</td>
                        <td className="border p-2">{designation.description || 'N/A'}</td>
                        <td className="border p-2">
                        <button
                            className="text-blue-600 hover:underline mr-2"
                            onClick={() => handleEdit(designation)}
                        >
                            Edit
                        </button>
                        <button
                            className="text-red-600 hover:underline mr-2"
                            onClick={() => handleDelete(designation.id, designation.name)}
                        >
                            Delete
                        </button>
                        <a
                            href={`/designations/${designation.id}/qualifications`}
                            className="text-blue-600 hover:underline"
                        >
                            Manage Qualifications
                        </a>
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
                href={userRole === 'Admin' ? '/admin/dashboard' : '/hr/dashboard'}
                className="text-blue-600 hover:underline"
            >
                Dashboard
            </a>
            </p>
        </div>
        </main>
    </div>
    );
};

export default DesignationManagement;