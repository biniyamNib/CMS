import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Input from '../common/Input';
import Button from '../common/Button';
import Notification from '../common/Notification';
import { checkLicenseExpiry } from '../../utils/notifications';
import {
    getLicenseRecords,
    addLicenseRecord,
    updateLicenseRecord,
    deleteLicenseRecord,
} from '../../services/licenseService';

const LicenseManagement = () => {
    const [licenseRecords, setLicenseRecords] = useState([]);
    const [formData, setFormData] = useState({
    companyId: '',
    licenseType: '',
    issueDate: '',
    expiryDate: '',
    status: 'Active',
    document: null,
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    // Mock user role (replace with auth context)
    const userRole = 'Admin';

    useEffect(() => {
    if (['Admin', 'HR'].includes(userRole)) {
        const fetchLicenseRecords = async () => {
        try {
            const data = await mockGetLicenseRecords();
            setLicenseRecords(data);
            setNotifications(checkLicenseExpiry(data));
        } catch (err) {
            setError('Failed to load license records.');
        }
        };
        fetchLicenseRecords();
    } else {
        setError('Unauthorized access.');
    }
    }, []);

    // Mock data fetching function
    const mockGetLicenseRecords = async () => {
    return [
        {
        id: 1,
        companyId: 1,
        licenseType: 'Business Permit',
        issueDate: '2024-01-01',
        expiryDate: '2025-05-01', // Within 30 days for testing
        status: 'Active',
        document: 'business_permit.pdf',
        },
        {
        id: 2,
        companyId: 1,
        licenseType: 'Environmental Compliance',
        issueDate: '2024-06-01',
        expiryDate: '2026-05-31',
        status: 'Active',
        document: 'env_compliance.pdf',
        },
    ];
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
        setFormData((prev) => ({ ...prev, document: acceptedFiles[0] }));
    },
    });

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
    if (!formData.licenseType.trim()) {
        setError('License type is required.');
        return;
    }
    if (!formData.issueDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        setError('Issue date must be in format YYYY-MM-DD.');
        return;
    }
    if (!formData.expiryDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        setError('Expiry date must be in format YYYY-MM-DD.');
        return;
    }
    if (new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
        setError('Expiry date must be after issue date.');
        return;
    }
    if (!['Active', 'Expired', 'Suspended'].includes(formData.status)) {
        setError('Status must be Active, Expired, or Suspended.');
        return;
    }
    if (!editingId && !formData.document) {
        setError('Please upload a license document.');
        return;
    }

    try {
        const newRecord = {
        ...formData,
        document: formData.document ? formData.document.name : formData.document,
        };
        if (editingId) {
        // Mock update
        setLicenseRecords((prev) =>
            prev.map((rec) => (rec.id === editingId ? { ...newRecord, id: editingId } : rec))
        );
        setEditingId(null);
        } else {
        // Mock add
        setLicenseRecords((prev) => [...prev, { ...newRecord, id: prev.length + 1 }]);
        }
        setNotifications(checkLicenseExpiry([...licenseRecords, newRecord]));
        setFormData({
        companyId: '',
        licenseType: '',
        issueDate: '',
        expiryDate: '',
        status: 'Active',
        document: null,
        });
    } catch (err) {
        setError('An error occurred. Please try again.');
    }
    };

    const handleEdit = (record) => {
    setFormData({
        companyId: record.companyId,
        licenseType: record.licenseType,
        issueDate: record.issueDate,
        expiryDate: record.expiryDate,
        status: record.status,
        document: record.document,
    });
    setEditingId(record.id);
    };

    const handleDelete = async (id) => {
    if (!['Admin', 'HR'].includes(userRole)) {
        setError('You are not authorized to perform this action.');
        return;
    }
    try {
        setLicenseRecords((prev) => prev.filter((rec) => rec.id !== id));
        setNotifications(checkLicenseExpiry(licenseRecords.filter((rec) => rec.id !== id)));
    } catch (err) {
        setError('Failed to delete license record.');
    }
    };

    const handleCancelEdit = () => {
    setFormData({
        companyId: '',
        licenseType: '',
        issueDate: '',
        expiryDate: '',
        status: 'Active',
        document: null,
    });
    setEditingId(null);
    };

    const closeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    const complianceStatus = () => {
    const active = licenseRecords.filter((rec) => rec.status === 'Active').length;
    const expired = licenseRecords.filter((rec) => rec.status === 'Expired').length;
    const suspended = licenseRecords.filter((rec) => rec.status === 'Suspended').length;
    return { active, expired, suspended, total: licenseRecords.length };
    };

    const { active, expired, suspended, total } = complianceStatus();

    return (
    <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">License Management</h1>
        </header>
        <main className="p-6">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Manage Licenses</h2>
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
            <h3 className="text-lg font-medium mb-4">Compliance Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-green-100 rounded-lg text-center">
                <p className="text-sm font-medium text-green-800">Active Licenses</p>
                <p className="text-2xl font-bold">{active}</p>
                </div>
                <div className="p-4 bg-red-100 rounded-lg text-center">
                <p className="text-sm font-medium text-red-800">Expired Licenses</p>
                <p className="text-2xl font-bold">{expired}</p>
                </div>
                <div className="p-4 bg-yellow-100 rounded-lg text-center">
                <p className="text-sm font-medium text-yellow-800">Suspended Licenses</p>
                <p className="text-2xl font-bold">{suspended}</p>
                </div>
                <div className="p-4 bg-blue-100 rounded-lg text-center">
                <p className="text-sm font-medium text-blue-800">Total Licenses</p>
                <p className="text-2xl font-bold">{total}</p>
                </div>
            </div>
            </div>
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">
                {editingId ? 'Edit License Record' : 'Add New License Record'}
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
                label="License Type"
                id="licenseType"
                type="text"
                value={formData.licenseType}
                onChange={handleChange}
                placeholder="Enter license type (e.g., Business Permit)"
                required
                />
                <Input
                label="Issue Date"
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={handleChange}
                placeholder="Enter issue date (YYYY-MM-DD)"
                required
                />
                <Input
                label="Expiry Date"
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="Enter expiry date (YYYY-MM-DD)"
                required
                />
                <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                </label>
                <select
                    id="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Suspended">Suspended</option>
                </select>
                </div>
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    License Document (PDF, max 5MB)
                </label>
                <div
                    {...getRootProps()}
                    className={`mt-1 p-4 border-2 border-dashed rounded-md text-center ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                >
                    <input {...getInputProps()} />
                    {formData.document ? (
                    <p className="text-sm text-gray-600">
                        Selected: {typeof formData.document === 'string' ? formData.document : formData.document.name}
                    </p>
                    ) : (
                    <p className="text-sm text-gray-600">
                        Drag & drop a PDF file here, or click to select
                    </p>
                    )}
                </div>
                </div>
                <div className="flex space-x-4">
                <Button type="submit">
                    {editingId ? 'Update License' : 'Add License'}
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
            <h3 className="text-lg font-medium mb-4">License Records</h3>
            {licenseRecords.length === 0 ? (
                <p className="text-gray-600">No license records found.</p>
            ) : (
                <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                    <th className="border p-2 text-left">Company ID</th>
                    <th className="border p-2 text-left">License Type</th>
                    <th className="border p-2 text-left">Issue Date</th>
                    <th className="border p-2 text-left">Expiry Date</th>
                    <th className="border p-2 text-left">Status</th>
                    <th className="border p-2 text-left">Document</th>
                    <th className="border p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {licenseRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                        <td className="border p-2">{record.companyId}</td>
                        <td className="border p-2">{record.licenseType}</td>
                        <td className="border p-2">{record.issueDate}</td>
                        <td className="border p-2">{record.expiryDate}</td>
                        <td className="border p-2">{record.status}</td>
                        <td className="border p-2">
                        {record.document ? (
                            <a
                            href="#"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => {
                                e.preventDefault();
                                alert(`Download ${record.document}`);
                            }}
                            >
                            {record.document}
                            </a>
                        ) : (
                            'No document'
                        )}
                        </td>
                        <td className="border p-2">
                        <button
                            className="text-blue-600 hover:underline mr-2"
                            onClick={() => handleEdit(record)}
                        >
                            Edit
                        </button>
                        <button
                            className="text-red-600 hover:underline"
                            onClick={() => handleDelete(record.id)}
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

export default LicenseManagement;
