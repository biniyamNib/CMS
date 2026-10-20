import { useState } from 'react';
import { Link } from 'react-router-dom';

// Widget Component
function Widget({ title, value, icon, delay }) {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md hover:scale-105 transition duration-300 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center">
        <span className="text-3xl mr-4">{icon}</span>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-2xl text-gray-600">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Recent Activity Table Component
function RecentActivityTable() {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock data
  const activities = [
    { id: 1, date: '2025-04-30', action: 'User Added', user: 'John Doe', details: 'Admin role', link: '/users/1' },
    { id: 2, date: '2025-04-29', action: 'Company Registered', user: 'Jane Smith', details: 'Acme Inc.', link: '/companies/1' },
    { id: 3, date: '2025-04-28', action: 'License Renewed', user: 'Bob Johnson', details: 'License #123', link: '/licenses/123' },
    { id: 4, date: '2025-04-27', action: 'Payroll Processed', user: 'Alice Brown', details: '$50,000', link: '/payroll/2025-04' },
    { id: 5, date: '2025-04-26', action: 'Inventory Updated', user: 'Charlie Davis', details: '100 units', link: '/inventory/456' },
    { id: 6, date: '2025-04-25', action: 'Role Assigned', user: 'Eve Wilson', details: 'Manager role', link: '/roles/2' },
  ];

  // Sorting logic
  const sortedActivities = [...activities].sort((a, b) => {
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
              >
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="p-4 text-left text-sm font-medium text-gray-600 cursor-pointer"
                onClick={() => handleSort('action')}
              >
                Action {sortConfig.key === 'action' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="p-4 text-left text-sm font-medium text-gray-600 cursor-pointer"
                onClick={() => handleSort('user')}
              >
                User {sortConfig.key === 'user' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-600">Details</th>
            </tr>
          </thead>
          <tbody>
            {paginatedActivities.map((activity) => (
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
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-between items-center p-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-300"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Main DashboardContent Component
function Dashboard() {
  // Mock widget data
  const widgets = [
    { title: 'Total Companies', value: '150', icon: '🏢', delay: 0.1 },
    { title: 'Active Users', value: '320', icon: '👤', delay: 0.2 },
    { title: 'Pending Licenses', value: '12', icon: '📜', delay: 0.3 },
    { title: 'Payroll Processed', value: '$1.2M', icon: '💰', delay: 0.4 },
  ];

  return (
    <main className="bg-gray-50 p-6 flex-1">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">
        Admin Dashboard
      </h1>

      {/* Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {widgets.map((widget) => (
          <Widget
            key={widget.title}
            title={widget.title}
            value={widget.value}
            icon={widget.icon}
            delay={widget.delay}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 animate-fade-in">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/users/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Add User
          </Link>
          <Link
            to="/companies/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Register Company
          </Link>
          <Link
            to="/licenses/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Add License
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivityTable />
    </main>
  );
}

export default Dashboard;

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