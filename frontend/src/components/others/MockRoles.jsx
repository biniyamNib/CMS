import React from 'react'; // Added to fix "React is not defined"
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  UserGroupIcon,
  CogIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';


// Role Widget Component (Metric Cards)
function RoleWidget({ title, value, icon: Icon, delay, trend, link }) {
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

// Role Modal Component (Create/Edit/View)
function RoleModal({ isOpen, closeModal, role, mode, onSave, errors }) {
  const [formData, setFormData] = useState({
    RoleName: role?.RoleName || '',
    Description: role?.Description || '',
    Status: role?.Status || 'Active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.RoleName.trim()) {
      alert('Role Name is required');
      return;
    }
    onSave({ ...role, ...formData });
    closeModal();
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
                  {mode === 'create' ? 'Create Role' : mode === 'edit' ? 'Edit Role' : 'View Role'}
                </Dialog.Title>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="RoleName" className="block text-sm font-medium text-gray-700">
                      Role Name
                    </label>
                    <input
                      id="RoleName"
                      name="RoleName"
                      type="text"
                      value={formData.RoleName}
                      onChange={handleChange}
                      disabled={mode === 'view'}
                      className={`w-full p-2 border ${errors.RoleName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100`}
                      aria-label="Role Name"
                    />
                    {errors.RoleName && <p className="text-red-500 text-xs mt-1">{errors.RoleName}</p>}
                  </div>
                  <div>
                    <label htmlFor="Description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="Description"
                      name="Description"
                      value={formData.Description}
                      onChange={handleChange}
                      disabled={mode === 'view'}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      rows="4"
                      aria-label="Description"
                    />
                  </div>
                  <div>
                    <label htmlFor="Status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="Status"
                      name="Status"
                      value={formData.Status}
                      onChange={handleChange}
                      disabled={mode === 'view'}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      aria-label="Status"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300"
                    aria-label="Close modal"
                  >
                    {mode === 'view' ? 'Close' : 'Cancel'}
                  </button>
                  {mode !== 'view' && (
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      aria-label={mode === 'create' ? 'Create Role' : 'Save Role'}
                    >
                      {mode === 'create' ? 'Create' : 'Save'}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// Deactivate Modal Component
function DeactivateModal({ isOpen, closeModal, role, onDeactivate }) {
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
                  Deactivate Role
                </Dialog.Title>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to deactivate the role <strong>{role?.RoleName}</strong>? This will also deactivate associated user-role mappings.
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300"
                    aria-label="Cancel deactivation"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onDeactivate(role);
                      closeModal();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    aria-label="Confirm deactivation"
                  >
                    Deactivate
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// Role Table Component
function RoleTable({ roles, userRoleMappings, users, filters, searchQuery, sortKey, setCurrentPage, onEdit, onDeactivate, onView }) {
  const [currentPage, setLocalCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock permissions data (since SDD doesn’t specify a Permissions table)
  const rolePermissions = {
    R1: ['View Companies', 'Edit Users', 'Manage Roles'],
    R2: ['View Employees', 'Edit HR Records'],
    R3: ['View Financials', 'Edit Shareholders'],
    R4: ['View Compliance', 'Edit Licenses'],
  };

  // Get user count per role
  const getUserCount = (roleId) => {
    return userRoleMappings.filter((mapping) => mapping.RoleId === roleId && mapping.Status === 'Active').length;
  };

  // Get creator username
  const getCreatedBy = (createdByUserId) => {
    const user = users.find((u) => u.UserId === createdByUserId);
    return user ? user.UserName : 'Unknown';
  };

  // Get permissions
  const getPermissions = (roleId) => {
    return rolePermissions[roleId]?.join(', ') || 'None';
  };

  // Apply filters and search
  const filteredRoles = roles.filter((role) => {
    const statusMatch = filters.status === 'all' || role.Status === filters.status;
    const searchMatch = !searchQuery ||
      role.RoleName.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Sorting logic
  const sortedRoles = [...filteredRoles].sort((a, b) => {
    if (sortKey === 'UsersAssigned') {
      const countA = getUserCount(a.RoleId);
      const countB = getUserCount(b.RoleId);
      return countA - countB;
    }
    if (sortKey === 'CreatedBy') {
      const creatorA = getCreatedBy(a.CreatedByUserId);
      const creatorB = getCreatedBy(b.CreatedByUserId);
      return creatorA.localeCompare(creatorB);
    }
    if (sortKey === 'Permissions') {
      const permsA = getPermissions(a.RoleId);
      const permsB = getPermissions(b.RoleId);
      return permsA.localeCompare(permsB);
    }
    if (a[sortKey] < b[sortKey]) return -1;
    if (a[sortKey] > b[sortKey]) return 1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedRoles.length / itemsPerPage);
  const paginatedRoles = sortedRoles.slice(
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
      <h2 className="text-xl font-semibold text-gray-800 mb-4 animate-fade-in">Roles</h2>
      {paginatedRoles.length === 0 ? (
        <p className="text-gray-600 text-center">No roles match the selected filters or search query.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Role Name', 'Description', 'Users Assigned', 'Permissions', 'Created By', 'Created Date', 'Updated Date', 'Status'].map((header) => (
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
              {paginatedRoles.map((role) => (
                <tr key={role.RoleId} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{role.RoleName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="truncate max-w-xs" title={role.Description || 'No description'}>
                      {role.Description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getUserCount(role.RoleId)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="truncate max-w-xs" title={getPermissions(role.RoleId)}>
                      {getPermissions(role.RoleId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getCreatedBy(role.CreatedByUserId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(role.CreatedDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {role.UpdatedDate ? new Date(role.CreatedDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[role.Status]}`}>
                      {role.Status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => onView(role)}
                      className="text-blue-600 hover:underline mr-4"
                      aria-label={`View ${role.RoleName}`}
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(role)}
                      className="text-blue-600 hover:underline mr-4"
                      aria-label={`Edit ${role.RoleName}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeactivate(role)}
                      className="text-red-600 hover:underline"
                      aria-label={`Deactivate ${role.RoleName}`}
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

// Role Activity Log Component
function RoleActivityLog({ activities }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 animate-fade-in">Recent Role Activity</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        {activities.length === 0 ? (
          <p className="text-gray-600">No recent role activity.</p>
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

// Roles Page Component
function RolesPage() {
  const [filters, setFilters] = useState({
    status: 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('RoleName');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [formErrors, setFormErrors] = useState({});

  // Mock role data (based on Role table)
  const [roles, setRoles] = useState([
    {
      RoleId: 'R1',
      RoleName: 'Admin',
      Description: 'Full system access and management privileges',
      CreatedByUserId: 'U1',
      CreatedDate: '2024-01-10T08:00:00Z',
      UpdatedDate: '2025-04-15T10:00:00Z',
      Status: 'Active',
    },
    {
      RoleId: 'R2',
      RoleName: 'HR',
      Description: 'Manages employee records and organizational roles',
      CreatedByUserId: 'U1',
      CreatedDate: '2024-03-05T09:00:00Z',
      UpdatedDate: null,
      Status: 'Active',
    },
    {
      RoleId: 'R3',
      RoleName: 'Finance',
      Description: 'Handles financial data and shareholder information',
      CreatedByUserId: 'U2',
      CreatedDate: '2024-06-20T11:00:00Z',
      UpdatedDate: '2025-03-20T12:00:00Z',
      Status: 'Inactive',
    },
    {
      RoleId: 'R4',
      RoleName: 'Legal',
      Description: 'Ensures compliance with legal requirements',
      CreatedByUserId: 'U1',
      CreatedDate: '2024-09-15T14:00:00Z',
      UpdatedDate: '2025-04-30T15:00:00Z',
      Status: 'Active',
    },
  ]);

  // Mock user-role mapping data
  const [userRoleMappings, setUserRoleMappings] = useState([
    { UserRoleMappingId: 'UR1', UserId: 'U1', RoleId: 'R1', Status: 'Active' },
    { UserRoleMappingId: 'UR2', UserId: 'U2', RoleId: 'R2', Status: 'Active' },
    { UserRoleMappingId: 'UR3', UserId: 'U3', RoleId: 'R3', Status: 'Active' },
    { UserRoleMappingId: 'UR4', UserId: 'U4', RoleId: 'R4', Status: 'Active' },
    { UserRoleMappingId: 'UR5', UserId: 'U1', RoleId: 'R2', Status: 'Active' },
  ]);

  // Mock user data (for CreatedByUserId)
  const users = [
    { UserId: 'U1', UserName: 'admin1' },
    { UserId: 'U2', UserName: 'hr1' },
    { UserId: 'U3', UserName: 'finance1' },
    { UserId: 'U4', UserName: 'legal1' },
  ];

  // Mock role activity data
  const roleActivities = [
    {
      id: 1,
      date: '2025-04-30',
      action: 'Role Created',
      user: 'admin1',
      details: 'Legal role added',
    },
    {
      id: 2,
      date: '2025-04-29',
      action: 'Role Updated',
      user: 'admin1',
      details: 'Admin role description updated',
    },
    {
      id: 3,
      date: '2025-04-28',
      action: 'Role Deactivated',
      user: 'admin1',
      details: 'Finance role deactivated',
    },
  ];

  // Mock role widget data
  const roleWidgets = [
    {
      title: 'Total Roles',
      value: roles.length,
      icon: ShieldCheckIcon,
      delay: 0.1,
      trend: 3,
      link: '/roles',
    },
    {
      title: 'Active Roles',
      value: roles.filter((r) => r.Status === 'Active').length,
      icon: CogIcon,
      delay: 0.2,
      trend: 2,
      link: '/roles?status=Active',
    },
    {
      title: 'Roles with Users',
      value: roles.filter((r) => userRoleMappings.some((m) => m.RoleId === r.RoleId && m.Status === 'Active')).length,
      icon: UserGroupIcon,
      delay: 0.3,
      trend: 1,
      link: '/roles',
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

  const openModal = (role, mode) => {
    setSelectedRole(role);
    setModalMode(mode);
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRole(null);
  };

  const openDeactivateModal = (role) => {
    setSelectedRole(role);
    setDeactivateModalOpen(true);
  };

  const closeDeactivateModal = () => {
    setDeactivateModalOpen(false);
    setSelectedRole(null);
  };

  const handleSaveRole = (updatedRole) => {
    // Validate unique RoleName
    if (modalMode === 'create' && roles.some((r) => r.RoleName === updatedRole.RoleName)) {
      setFormErrors({ RoleName: 'Role name must be unique' });
      return;
    }
    if (modalMode === 'create') {
      const newRole = {
        RoleId: `R${roles.length + 1}`,
        CreatedByUserId: 'U1', // Mock admin user
        CreatedDate: new Date().toISOString(),
        ...updatedRole,
      };
      setRoles([...roles, newRole]);
      setRoleActivities([
        ...roleActivities,
        {
          id: roleActivities.length + 1,
          date: new Date().toISOString().split('T')[0],
          action: 'Role Created',
          user: 'admin1',
          details: `${updatedRole.RoleName} role added`,
        },
      ]);
    } else {
      setRoles(roles.map((r) => (r.RoleId === updatedRole.RoleId ? { ...r, ...updatedRole, UpdatedDate: new Date().toISOString() } : r)));
      setRoleActivities([
        ...roleActivities,
        {
          id: roleActivities.length + 1,
          date: new Date().toISOString().split('T')[0],
          action: 'Role Updated',
          user: 'admin1',
          details: `${updatedRole.RoleName} role updated`,
        },
      ]);
    }
  };

  const handleDeactivateRole = (role) => {
    setRoles(roles.map((r) => (r.RoleId === role.RoleId ? { ...r, Status: 'Inactive' } : r)));
    setUserRoleMappings(
      userRoleMappings.map((m) => (m.RoleId === role.RoleId ? { ...m, Status: 'Inactive' } : m))
    );
    setRoleActivities([
      ...roleActivities,
      {
        id: roleActivities.length + 1,
        date: new Date().toISOString().split('T')[0],
        action: 'Role Deactivated',
        user: 'admin1',
        details: `${role.RoleName} role deactivated`,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar placeholder - assumes Sidebar.jsx is rendered by parent */}
      <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 pt-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">
            Role Management
          </h1>

          {/* Role Widgets (Metric Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {roleWidgets.map((widget) => (
              <RoleWidget
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
                onClick={() => openModal(null, 'create')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                aria-label="Add New Role"
              >
                Add Role
              </button>
              <button
                onClick={() => alert('Open Manage Users modal')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                aria-label="Manage Users"
              >
                Manage Users
              </button>
            </div>
          </div>

          {/* Filters, Search, and Sort */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 animate-fade-in">
              Filter Roles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    placeholder="Search by role name"
                    className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Search roles"
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
                  aria-label="Sort roles"
                >
                  <option value="RoleName">Role Name</option>
                  <option value="CreatedDate">Created Date</option>
                  <option value="UsersAssigned">Users Assigned</option>
                  <option value="Permissions">Permissions</option>
                  <option value="CreatedBy">Created By</option>
                  <option value="Status">Status</option>
                </select>
              </div>
            </div>
          </div>

          {/* Role Table */}
          <RoleTable
            roles={roles}
            userRoleMappings={userRoleMappings}
            users={users}
            filters={filters}
            searchQuery={searchQuery}
            sortKey={sortKey}
            setCurrentPage={setCurrentPage}
            onEdit={(role) => openModal(role, 'edit')}
            onDeactivate={openDeactivateModal}
            onView={(role) => openModal(role, 'view')}
          />

          {/* Role Activity Log */}
          <RoleActivityLog activities={roleActivities} />

          {/* Modals */}
          <RoleModal
            isOpen={modalOpen}
            closeModal={closeModal}
            role={selectedRole}
            mode={modalMode}
            onSave={handleSaveRole}
            errors={formErrors}
          />
          <DeactivateModal
            isOpen={deactivateModalOpen}
            closeModal={closeDeactivateModal}
            role={selectedRole}
            onDeactivate={handleDeactivateRole}
          />
        </main>
      </div>
    </div>
  );
}

export default RolesPage;

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