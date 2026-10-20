import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import Notification from '../common/Notification';

const DesignationQualificationManagement = () => {
    const [qualifications, setQualifications] = useState([]);
    const [formData, setFormData] = useState({
    qualificationType: '',
    details: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const { designationId } = useParams();

    // Mock user role (replace with auth context)
    const userRole = 'Admin';

    useEffect(() => {
    if (['Admin', 'HR'].includes(userRole)) {
        const fetchQualifications = async () => {
        try {
            const data = await mockGetDesignationQualifications();
            setQualifications(data);
        } catch (err) {
            setError('Failed to load qualifications.');
        }
        };
        fetchQualifications();
    } else {
        setError('Unauthorized access.');
        navigate('/dashboard');
    }
    }, [navigate]);

    // Mock data fetching function
    const mockGetDesignationQualifications = async () => {
    return [
        { id: 1, designationId: designationId, qualificationType: 'Degree', details: 'Bachelor’s in Computer Science' },
        { id: 2, designationId: designationId, qualificationType: 'Experience', details: '3 years in software development' },
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

    if (!formData.qualificationType.trim()) {
        setError('Qualification type is required.');
        return;
    }
    if (!formData.details.trim()) {
        setError('Details are required.');
        return;
    }

    try {
        const newQualification = { ...formData };
        if (editingId) {
        // Mock update
        setQualifications((prev) =>
            prev.map((q) => (q.id === editingId ? { ...newQualification, id: editingId, designationId } : q))
        );
        setNotifications([...notifications, {
            id: Date.now(),
            message: `Qualification "${newQualification.qualificationType}" updated successfully.`,
            type: 'success',
        }]);
        setEditingId(null);
        } else {
        // Mock add
        setQualifications((prev) => [...prev, { ...newQualification, id: prev.length + 1, designationId }]);
        setNotifications([...notifications, {
            id: Date.now(),
            message: `Qualification "${newQualification.qualificationType}" added successfully.`,
            type: 'success',
        }]);
        }
        setFormData({ qualificationType: '', details: '' });
    } catch (err) {
        setError('An error occurred. Please try again.');
    }
    };

    const handleEdit = (qualification) => {
    setFormData({
        qualificationType: qualification.qualificationType,
        details: qualification.details,
    });
    setEditingId(qualification.id);
    };

    const handleDelete = async (id, qualificationType) => {
    if (!['Admin', 'HR'].includes(userRole)) {
        setError('You are not authorized to perform this action.');
        return;
    }
    try {
        setQualifications((prev) => prev.filter((q) => q.id !== id));
        setNotifications([...notifications, {
        id: Date.now(),
        message: `Qualification "${qualificationType}" deleted successfully.`,
        type: 'success',
        }]);
    } catch (err) {
        setError('Failed to delete qualification.');
    }
    };

    const handleCancelEdit = () => {
    setFormData({ qualificationType: '', details: '' });
    setEditingId(null);
    };

    const closeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    return (
    <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Designation Qualification Management</h1>
        </header>
        <main className="p-6">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Manage Qualifications for Designation ID: {designationId}</h2>
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
                {editingId ? 'Edit Qualification' : 'Add New Qualification'}
            </h3>
            <form onSubmit={handleSubmit}>
                <Input
                label="Qualification Type"
                id="qualificationType"
                type="text"
                value={formData.qualificationType}
                onChange={handleChange}
                placeholder="Enter type (e.g., Degree, Experience)"
                required
                />
                <Input
                label="Details"
                id="details"
                type="text"
                value={formData.details}
                onChange={handleChange}
                placeholder="Enter details (e.g., Bachelor’s in Computer Science)"
                required
                />
                <div className="flex space-x-4">
                <Button type="submit">
                    {editingId ? 'Update Qualification' : 'Add Qualification'}
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
            <h3 className="text-lg font-medium mb-4">Qualifications</h3>
            {qualifications.length === 0 ? (
                <p className="text-gray-600">No qualifications found.</p>
            ) : (
                <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                    <th className="border p-2 text-left">Qualification Type</th>
                    <th className="border p-2 text-left">Details</th>
                    <th className="border p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {qualifications.map((qualification) => (
                    <tr key={qualification.id} className="hover:bg-gray-50">
                        <td className="border p-2">{qualification.qualificationType}</td>
                        <td className="border p-2">{qualification.details}</td>
                        <td className="border p-2">
                        <button
                            className="text-blue-600 hover:underline mr-2"
                            onClick={() => handleEdit(qualification)}
                        >
                            Edit
                        </button>
                        <button
                            className="text-red-600 hover:underline"
                            onClick={() => handleDelete(qualification.id, qualification.qualificationType)}
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
                href="/designations"
                className="text-blue-600 hover:underline"
            >
                Designation Management
            </a>
            {' '}or{' '}
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

export default DesignationQualificationManagement;