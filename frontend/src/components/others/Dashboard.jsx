import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
//import { getCompanies, getUsers } from '../services/adminService';

const Dashboard = ({ role }) => {
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'Admin') {
      const fetchData = async () => {
        try {
          const companyData = await mockGetCompanies();
          const userData = await mockGetUsers();
          setCompanies(companyData);
          setUsers(userData);
        } catch (err) {
          setError('Failed to load data. Please try again.');
        }
      };
      fetchData();
    }
  }, [role]);

  const mockGetCompanies = async () => {
    return [
      { id: 1, companyName: 'Tech Corp', companyType: 'Corporation', tin: '123456789' },
      { id: 2, companyName: 'Innovate LLC', companyType: 'LLC', tin: '987654321' },
    ];
  };

  const mockGetUsers = async () => {
    return [
      { id: 1, username: 'admin1', email: 'admin@cms.com', role: 'Admin' },
      { id: 2, username: 'hr1', email: 'hr@cms.com', role: 'HR' },
    ];
  };

  const handleRegisterCompany = () => {
    navigate('/company/register');
  };

  const handleManageShareholders = () => {
    navigate('/shareholders');
  };

  const handleViewOrgStructure = (companyId) => {
    navigate(`/org-structure/${companyId}`);
  };

  const handleManageEmployees = () => {
    navigate('/employees');
  };

  const handleManageCustomers = () => {
    navigate('/crm');
  };

  const handleManagePayroll = () => {
    navigate('/payroll');
  };

  const handleManageLicenses = () => {
    navigate('/licenses');
  };

  const handleManageInventory = () => {
    navigate('/inventory');
  };

  const handleManageRoles = () => {
    navigate('/roles');
  };

  const handleManageDesignations = () => {
    navigate('/designations');
  };

  if (role === 'HR') {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">CMS Dashboard - HR</h1>
        </header>
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Welcome, HR!</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-2">HR Actions</h3>
              <p>Manage employees, payroll, licenses, inventory, and designations.</p>
              <Button
                className="mt-4 mr-4"
                onClick={() => handleViewOrgStructure(1)}
              >
                View Organizational Structure (Tech Corp)
              </Button>
              <Button className="mt-4 mr-4" onClick={handleManageEmployees}>
                Manage Employees
              </Button>
              <Button className="mt-4 mr-4" onClick={handleManagePayroll}>
                Manage Payroll
              </Button>
              <Button className="mt-4 mr-4" onClick={handleManageLicenses}>
                Manage Licenses
              </Button>
              <Button className="mt-4 mr-4" onClick={handleManageInventory}>
                Manage Inventory
              </Button>
              <Button className="mt-4" onClick={handleManageDesignations}>
                Manage Designations
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (role === 'Sales') {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">CMS Dashboard - Sales</h1>
        </header>
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Welcome, Sales!</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-2">Sales Actions</h3>
              <p>Manage customer relationships.</p>
              <Button className="mt-4" onClick={handleManageCustomers}>
                Manage Customers
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (role === 'Customer Support') {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">CMS Dashboard - Customer Support</h1>
        </header>
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Welcome, Customer Support!</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-2">Support Actions</h3>
              <p>Manage customer relationships.</p>
              <Button className="mt-4" onClick={handleManageCustomers}>
                Manage Customers
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (role !== 'Admin') {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">CMS Dashboard - {role}</h1>
        </header>
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Welcome, {role}!</h2>
            {role === 'Shareholder' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Shareholder Actions</h3>
                <p>View shares and financial reports.</p>
                <Button className="mt-4">View Shares</Button>
              </div>
            )}
            {role === 'Default' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">General Dashboard</h3>
                <p>Overview of your account.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Welcome, Admin!</h2>
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Company Management</h3>
            <Button onClick={handleRegisterCompany} className="mb-4">
              Register New Company
            </Button>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-md font-medium mb-2">Registered Companies</h4>
              {companies.length === 0 ? (
                <p className="text-gray-600">No companies registered.</p>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2 text-left">Company Name</th>
                      <th className="border p-2 text-left">Type</th>
                      <th className="border p-2 text-left">TIN</th>
                      <th className="border p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((company) => (
                      <tr key={company.id} className="hover:bg-gray-50">
                        <td className="border p-2">{company.companyName}</td>
                        <td className="border p-2">{company.companyType}</td>
                        <td className="border p-2">{company.tin}</td>
                        <td className="border p-2">
                          <button
                            className="text-blue-600 hover:underline mr-2"
                            onClick={() => handleViewOrgStructure(company.id)}
                          >
                            View Org
                          </button>
                          <button className="text-blue-600 hover:underline">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Shareholder Management</h3>
            <Button onClick={handleManageShareholders} className="mb-4">
              Manage Shareholders
            </Button>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Customer Management</h3>
            <Button onClick={handleManageCustomers} className="mb-4">
              Manage Customers
            </Button>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Payroll Management</h3>
            <Button onClick={handleManagePayroll} className="mb-4">
              Manage Payroll
            </Button>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">License Management</h3>
            <Button onClick={handleManageLicenses} className="mb-4">
              Manage Licenses
            </Button>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Inventory Management</h3>
            <Button onClick={handleManageInventory} className="mb-4">
              Manage Inventory
            </Button>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Role Management</h3>
            <Button onClick={handleManageRoles} className="mb-4">
              Manage Roles
            </Button>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Designation Management</h3>
            <Button onClick={handleManageDesignations} className="mb-4">
              Manage Designations
            </Button>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">User Management</h3>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-md font-medium mb-2">System Users</h4>
              {users.length === 0 ? (
                <p className="text-gray-600">No users found.</p>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2 text-left">Username</th>
                      <th className="border p-2 text-left">Email</th>
                      <th className="border p-2 text-left">Role</th>
                      <th className="border p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="border p-2">{user.username}</td>
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">{user.role}</td>
                        <td className="border p-2">
                          <button className="text-blue-600 hover:underline">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;