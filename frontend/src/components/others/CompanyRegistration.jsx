import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';

const CompanyRegistration = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: '',
    tin: '',
    registrationNumber: '',
    capital: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Mock user role (replace with actual auth context)
  const userRole = 'Admin'; // Example: Retrieved from auth context

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Role-based access control
    if (!['Admin'].includes(userRole)) {
      setError('You are not authorized to register a company.');
      return;
    }

    // Client-side validation
    if (!formData.companyName.match(/^[a-zA-Z0-9\s]{3,}$/)) {
      setError('Company name must be at least 3 characters and alphanumeric.');
      return;
    }
    if (!['Corporation', 'LLC', 'Partnership'].includes(formData.companyType)) {
      setError('Please select a valid company type.');
      return;
    }
    if (!formData.tin.match(/^\d{9}$/)) {
      setError('TIN must be a 9-digit number.');
      return;
    }
    if (!formData.registrationNumber.match(/^[a-zA-Z0-9]{6,}$/)) {
      setError('Registration number must be at least 6 characters and alphanumeric.');
      return;
    }
    if (isNaN(formData.capital) || Number(formData.capital) <= 0) {
      setError('Capital must be a positive number.');
      return;
    }
    if (!formData.address.match(/^[a-zA-Z0-9\s,.-]{10,}$/)) {
      setError('Address must be at least 10 characters.');
      return;
    }
    if (!formData.contactEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid contact email.');
      return;
    }
    if (!formData.contactPhone.match(/^\+?\d{10,15}$/)) {
      setError('Contact phone must be a valid phone number (10-15 digits).');
      return;
    }

    try {
      // Mock API call
      const response = await mockRegisterCompany(formData);
      if (response.success) {
        navigate('/admin/dashboard');
      } else {
        setError('Company registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  // Mock registration function
  const mockRegisterCompany = async (data) => {
    return { success: true };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Register a Company
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <Input
            label="Company Name"
            id="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
            required
          />
          <div className="mb-4">
            <label
              htmlFor="companyType"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Company Type
            </label>
            <select
              id="companyType"
              value={formData.companyType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a company type</option>
              <option value="Corporation">Corporation</option>
              <option value="LLC">LLC</option>
              <option value="Partnership">Partnership</option>
            </select>
          </div>
          <Input
            label="TIN (Tax Identification Number)"
            id="tin"
            value={formData.tin}
            onChange={handleChange}
            placeholder="Enter 9-digit TIN"
            required
          />
          <Input
            label="Registration Number"
            id="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            placeholder="Enter registration number"
            required
          />
          <Input
            label="Capital (in USD)"
            id="capital"
            type="number"
            value={formData.capital}
            onChange={handleChange}
            placeholder="Enter capital amount"
            required
          />
          <Input
            label="Address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter company address"
            required
          />
          <Input
            label="Contact Email"
            id="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="Enter contact email"
            required
          />
          <Input
            label="Contact Phone"
            id="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="Enter contact phone (e.g., +1234567890)"
            required
          />
          <Button type="submit">Register Company</Button>
        </form>
        <p className="text-gray-600 text-sm text-center mt-4">
          Return to{' '}
          <a href="/admin/dashboard" className="text-blue-600 hover:underline">
            Dashboard
          </a>
        </p>
      </div>
    </div>
  );
};

export default CompanyRegistration;