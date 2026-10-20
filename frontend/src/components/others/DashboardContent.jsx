import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  UserIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  UsersIcon, 
  ChartBarIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Widget Component
function Widget({ title, value, icon: Icon, delay, trend }) {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md hover:scale-105 transition duration-300 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className="w-8 h-8 text-blue-600 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-2xl text-gray-600">{value}</p>
          </div>
        </div>
        {trend && (
          <span className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}

// Alert Banner Component
function AlertBanner({ message, onDismiss }) {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6 animate-fade-in flex justify-between items-center">
      <p>{message}</p>
      <button onClick={onDismiss} aria-label="Dismiss alert">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

// Trend Chart Component
function TrendChart({ title, data }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-64">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' },
              title: { display: false },
            },
            scales: {
              y: { beginAtZero: true },
            },
          }}
        />
      </div>
    </div>
  );
}

// Organizational Overview Component
function OrgOverview() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Organizational Structure</h3>
      <div className="text-sm text-gray-600">
        <p><strong>CEO:</strong> Jane Doe</p>
        <p><strong>Departments:</strong> 5 (Engineering, HR, Finance, Sales, Operations)</p>
        <p><strong>Employees:</strong> 320</p>
        <Link to="/org-structure" className="text-blue-600 hover:underline mt-2 inline-block">
          View Full Structure
        </Link>
      </div>
    </div>
  );
}

// Recent Activity Table Component
function RecentActivityTable({ activities, filters }) {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Apply filters
  const filteredActivities = activities.filter((activity) => {
    const moduleMatch = filters.module === 'all' || activity.module === filters.module;
    const industryMatch = filters.industry === 'all' || activity.industry === filters.industry;
    const dateMatch = !filters.date || activity.date.startsWith(filters.date);
    return moduleMatch && industryMatch && dateMatch;
  });

  // Sorting logic
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedActivities.length / itemsPerPage);
  const paginatedActivities = sortedActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1); // Reset to first page on sort
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th
                className="p-4 text-left text-sm font-medium text-gray-600 cursor-pointer"
                onClick={() => handleSort('date')}
                aria-label="Sort by Date"
              >
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="p-4 text-left text-sm font-medium text-gray-600 cursor-pointer"
                onClick={() => handleSort('action')}
                aria-label="Sort by Action"
              >
                Action {sortConfig.key === 'action' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="p-4 text-left text-sm font-medium text-gray-600 cursor-pointer"
                onClick={() => handleSort('user')}
                aria-label="Sort by User"
              >
                User {sortConfig.key === 'user' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="p-4 text-left text-sm font-medium text-gray-600 cursor-pointer"
                onClick={() => handleSort('details')}
                aria-label="Sort by Details"
              >
                Details {sortConfig.key === 'details' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-600">Module</th>
              <th className="p-4 text-left text-sm font-medium text-gray-600">Industry</th>
            </tr>
          </thead>
          <tbody>
            {paginatedActivities.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-600">
                  No activities match the selected filters.
                </td>
              </tr>
            ) : (
              paginatedActivities.map((activity) => (
                <tr
                  key={activity.id}
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4 text-sm text-gray-600">
                    <Link to={activity.link} className="hover:text-blue-600">
                      {activity.date}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <Link to={activity.link} className="hover:text-blue-600">
                      {activity.action}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <Link to={activity.link} className="hover:text-blue-600">
                      {activity.user}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <Link to={activity.link} className="hover:text-blue-600">
                      {activity.details}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{activity.module}</td>
                  <td className="p-4 text-sm text-gray-600">{activity.industry}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-between items-center p-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-300"
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-300"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Main DashboardContent Component
function DashboardContent() {
  const [alerts, setAlerts] = useState([
    { id: 1, message: 'License #123 expires in 3 days.' },
    { id: 2, message: '2 new user requests pending approval.' },
  ]);
  const [filters, setFilters] = useState({
    module: 'all',
    industry: 'all',
    date: '',
  });

  // Mock data
  const widgets = [
    { title: 'Total Companies', value: '150', icon: BuildingOfficeIcon, delay: 0.1, trend: 5 },
    { title: 'Active Users', value: '320', icon: UserIcon, delay: 0.2, trend: 2 },
    { title: 'Pending Licenses', value: '12', icon: DocumentTextIcon, delay: 0.3, trend: -1 },
    { title: 'Payroll Processed', value: '$1.2M', icon: CurrencyDollarIcon, delay: 0.4, trend: 8 },
    { title: 'Employees', value: '450', icon: UsersIcon, delay: 0.5, trend: 3 },
    { title: 'Inventory Items', value: '1,200', icon: ChartBarIcon, delay: 0.6, trend: 0 },
  ];

  const activities = [
    {
      id: 1,
      date: '2025-04-30',
      action: 'User Added',
      user: 'John Doe',
      details: 'Admin role',
      module: 'User Management',
      industry: 'Technology',
      link: '/users/1',
    },
    {
      id: 2,
      date: '2025-04-29',
      action: 'Company Registered',
      user: 'Jane Smith',
      details: 'Acme Inc.',
      module: 'Company Management',
      industry: 'Healthcare',
      link: '/companies/1',
    },
    {
      id: 3,
      date: '2025-04-28',
      action: 'License Renewed',
      user: 'Bob Johnson',
      details: 'License #123',
      module: 'License Management',
      industry: 'Construction',
      link: '/licenses/123',
    },
    {
      id: 4,
      date: '2025-04-27',
      action: 'Payroll Processed',
      user: 'Alice Brown',
      details: '$50,000',
      module: 'Payroll Processing',
      industry: 'Retail',
      link: '/payroll/2025-04',
    },
    {
      id: 5,
      date: '2025-04-26',
      action: 'Inventory Updated',
      user: 'Charlie Davis',
      details: '100 units',
      module: 'Inventory Management',
      industry: 'Logistics',
      link: '/inventory/456',
    },
    {
      id: 6,
      date: '2025-04-25',
      action: 'Role Assigned',
      user: 'Eve Wilson',
      details: 'Manager role',
      module: 'Role Management',
      industry: 'Education',
      link: '/roles/2',
    },
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Company Registrations',
        data: [10, 15, 20, 25, 30, 35],
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Payroll Processed ($M)',
        data: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const handleDismissAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset pagination on filter change
  };

  // Simulate API call for dynamic data
  useEffect(() => {
    // Placeholder for API integration
    // fetch('/api/dashboard').then((res) => res.json()).then((data) => setWidgets(data.widgets));
  }, []);

  return (
    <main className="bg-gray-50 p-6 flex-1">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 animate-fade-in">
          Welcome, Admin
        </h1>
        <p className="text-gray-600 mt-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Your centralized hub for managing companies, users, and operations.
        </p>
      </div>

      {/* Alerts */}
      {alerts.map((alert) => (
        <AlertBanner
          key={alert.id}
          message={alert.message}
          onDismiss={() => handleDismissAlert(alert.id)}
        />
      ))}

      {/* Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {widgets.map((widget) => (
          <Widget
            key={widget.title}
            title={widget.title}
            value={widget.value}
            icon={widget.icon}
            delay={widget.delay}
            trend={widget.trend}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 animate-fade-in">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            onClick={() => alert('Open Add User modal')}
            aria-label="Add New User"
          >
            Add User
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            onClick={() => alert('Open Register Company modal')}
            aria-label="Register New Company"
          >
            Register Company
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            onClick={() => alert('Open Add License modal')}
            aria-label="Add New License"
          >
            Add License
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            onClick={() => alert('Open Process Payroll modal')}
            aria-label="Process Payroll"
          >
            Process Payroll
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 animate-fade-in">
          Performance Trends
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendChart title="Company Registrations & Payroll" data={chartData} />
          <OrgOverview />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 animate-fade-in">
          Filter Activities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-1">
              Module
            </label>
            <select
              id="module"
              name="module"
              value={filters.module}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by Module"
            >
              <option value="all">All Modules</option>
              <option value="User Management">User Management</option>
              <option value="Company Management">Company Management</option>
              <option value="License Management">License Management</option>
              <option value="Payroll Processing">Payroll Processing</option>
              <option value="Inventory Management">Inventory Management</option>
              <option value="Role Management">Role Management</option>
            </select>
          </div>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <select
              id="industry"
              name="industry"
              value={filters.industry}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by Industry"
            >
              <option value="all">All Industries</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Construction">Construction</option>
              <option value="Retail">Retail</option>
              <option value="Logistics">Logistics</option>
              <option value="Education">Education</option>
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by Date"
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivityTable activities={activities} filters={filters} />
    </main>
  );
}

export default DashboardContent;

<style>
{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
  }
`}
</style>