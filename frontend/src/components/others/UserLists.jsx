import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  UserIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';


// User Widget Component (Metric Cards)
function UserWidget({ title, value, icon: Icon, delay, trend, link }) {
  return (
    <Link
      to={link}
      className="bg-white p-6 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition duration-300 animate-fade-in cursor-pointer"
      style={{ animationDelay: `${delay}s` }}
      aria-label={`View details for ${title}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className="w-8 h-8 text-blue-600 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-2xl text-gray-600">{value}</p>
          </div>
        </div>
        {trend !== undefined && (
          <span className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </Link>
  );
}

// User Table Component
function UserTable({ users, userRoleMappings, roles, filters, searchQuery, sortKey, setCurrentPage }) {
  const [currentPage, setLocalCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Map user roles
  const getUserRoles = (userId) => {
    const mappings = userRoleMappings.filter((mapping) => mapping.UserId === userId && mapping.Status === 'Active');
    const roleNames = mappings
      .map((mapping) => {
        const role = roles.find((role) => role.RoleId === mapping.RoleId && role.Status === 'Active');
        return role ? role.RoleName : null;
      })
      .filter((name) => name)
      .join(', ');
    return roleNames || 'None';
  };

  // Apply filters and search
  const filteredUsers = users.filter((user) => {
    const roleMatch = filters.role === 'all' || getUserRoles(user.UserId).includes(filters.role);
    const statusMatch = filters.status === 'all' || user.Status === filters.status;
    const searchMatch = !searchQuery ||
      user.UserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchQuery.toLowerCase());
    return roleMatch && statusMatch && searchMatch;
  });

  // Sorting logic
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortKey === 'Role') {
      const roleA = getUserRoles(a.UserId);
      const roleB = getUserRoles(b.UserId);
      return roleA.localeCompare(roleB);
    }
    if (a[sortKey] < b[sortKey]) return -1;
    if (a[sortKey] > b[sortKey]) return 1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setLocalCurrentPage(page);
    setCurrentPage(page);
  };

  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-red-100 text-red-800',
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 animate-fade-in">Users</h2>
      {paginatedUsers.length === 0 ? (
        <p className="text-gray-600 text-center">No users match the selected filters or search query.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Username', 'Email', 'Role', 'Created Date', 'Updated Date', 'Status'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.UserId} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.UserName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.Email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getUserRoles(user.UserId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(user.CreatedDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.UpdatedDate ? new Date(user.UpdatedDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[user.Status]}`}>
                      {user.Status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      to={`/users/${user.UserId}`}
                      className="text-blue-600 hover:underline mr-4"
                      aria-label={`View ${user.UserName}`}
                    >
                      View
                    </Link>
                    <button
                      className="text-blue-600 hover:underline mr-4"
                      onClick={() => alert(`Edit user ${user.UserName}`)}
                      aria-label={`Edit ${user.UserName}`}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => alert(`Deactivate user ${user.UserName}`)}
                      aria-label={`Deactivate ${user.UserName}`}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-between items-center mt-6">
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
  );
}

// User Activity Log Component
function UserActivityLog({ activities }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 animate-fade-in">Recent User Activity</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        {activities.length === 0 ? (
          <p className="text-gray-600">No recent user activity.</p>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="text-sm text-gray-600">
                <span className="font-medium">{activity.date}</span>: {activity.action} by {activity.user} ({activity.details})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Users Page Component
function UsersPage() {
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('UserName');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock user data (based on User table)
  const users = [
    {
      UserId: 'U1',
      UserName: 'admin1',
      Email: 'admin1@cms.com',
      CreatedDate: '2024-01-10T08:00:00Z',
      UpdatedDate: '2025-04-15T10:00:00Z',
      Status: 'Active',
    },
    {
      UserId: 'U2',
      UserName: 'hr1',
      Email: 'hr1@cms.com',
      CreatedDate: '2024-03-05T09:00:00Z',
      UpdatedDate: null,
      Status: 'Active',
    },
    {
      UserId: 'U3',
      UserName: 'finance1',
      Email: 'finance1@cms.com',
      CreatedDate: '2024-06-20T11:00:00Z',
      UpdatedDate: '2025-03-20T12:00:00Z',
      Status: 'Inactive',
    },
    {
      UserId: 'U4',
      UserName: 'legal1',
      Email: 'legal1@cms.com',
      CreatedDate: '2024-09-15T14:00:00Z',
      UpdatedDate: '2025-04-30T15:00:00Z',
      Status: 'Active',
    },
  ];

  // Mock role data (based on Role table)
  const roles = [
    { RoleId: 'R1', RoleName: 'Admin', Status: 'Active' },
    { RoleId: 'R2', RoleName: 'HR', Status: 'Active' },
    { RoleId: 'R3', RoleName: 'Finance', Status: 'Active' },
    { RoleId: 'R4', RoleName: 'Legal', Status: 'Active' },
  ];

  // Mock user-role mapping data
  const userRoleMappings = [
    { UserRoleMappingId: 'UR1', UserId: 'U1', RoleId: 'R1', Status: 'Active' },
    { UserRoleMappingId: 'UR2', UserId: 'U2', RoleId: 'R2', Status: 'Active' },
    { UserRoleMappingId: 'UR3', UserId: 'U3', RoleId: 'R3', Status: 'Active' },
    { UserRoleMappingId: 'UR4', UserId: 'U4', RoleId: 'R4', Status: 'Active' },
    { UserRoleMappingId: 'UR5', UserId: 'U1', RoleId: 'R2', Status: 'Active' }, // Admin with HR role
  ];

  // Mock user activity data
  const userActivities = [
    {
      id: 1,
      date: '2025-04-30',
      action: 'User Created',
      user: 'System',
      details: 'legal1 added',
    },
    {
      id: 2,
      date: '2025-04-29',
      action: 'Role Assigned',
      user: 'Admin',
      details: 'HR role assigned to admin1',
    },
    {
      id: 3,
      date: '2025-04-28',
      action: 'User Deactivated',
      user: 'Admin',
      details: 'finance1 deactivated',
    },
  ];

  // Mock user widget data
  const userWidgets = [
    {
      title: 'Total Users',
      value: users.length,
      icon: UserGroupIcon,
      delay: 0.1,
      trend: 4,
      link: '/users',
    },
    {
      title: 'Active Users',
      value: users.filter((u) => u.Status === 'Active').length,
      icon: UserIcon,
      delay: 0.2,
      trend: 2,
      link: '/users?status=Active',
    },
    {
      title: 'Admin Users',
      value: userRoleMappings.filter((m) => m.RoleId === 'R1' && m.Status === 'Active').length,
      icon: ShieldCheckIcon,
      delay: 0.3,
      trend: 1,
      link: '/users?role=Admin',
    },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortKey(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar placeholder - assumes Sidebar.jsx is rendered by parent */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 pt-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">
            User Management
          </h1>

          {/* User Widgets (Metric Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {userWidgets.map((widget) => (
              <UserWidget
                key={widget.title}
                title={widget.title}
                value={widget.value}
                icon={widget.icon}
                delay={widget.delay}
                trend={widget.trend}
                link={widget.link}
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
                onClick={() => alert('Open Edit User modal')}
                aria-label="Edit User"
              >
                Edit User
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
                onClick={() => alert('Deactivate selected users')}
                aria-label="Deactivate Users"
              >
                Deactivate Users
              </button>
            </div>
          </div>

          {/* Filters, Search, and Sort */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 animate-fade-in">
              Filter Users
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={filters.role}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Filter by Role"
                >
                  <option value="all">All Roles</option>
                  {roles.map((role) => (
                    <option key={role.RoleId} value={role.RoleName}>{role.RoleName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Filter by Status"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by username or email"
                    className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Search users"
                  />
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-2 top-2.5" />
                </div>
              </div>
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  id="sort"
                  name="sort"
                  value={sortKey}
                  onChange={handleSortChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Sort users"
                >
                  <option value="UserName">Username</option>
                  <option value="Email">Email</option>
                  <option value="Role">Role</option>
                  <option value="CreatedDate">Created Date</option>
                  <option value="Status">Status</option>
                </select>
              </div>
            </div>
          </div>

          {/* User Table */}
          <UserTable
            users={users}
            userRoleMappings={userRoleMappings}
            roles={roles}
            filters={filters}
            searchQuery={searchQuery}
            sortKey={sortKey}
            setCurrentPage={setCurrentPage}
          />

          {/* User Activity Log */}
          <UserActivityLog activities={userActivities} />
        </main>
      </div>
    </div>
  );
}

export default UsersPage;

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