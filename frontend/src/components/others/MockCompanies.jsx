import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';


function CompanyWidget({ title, value, icon: Icon, delay, trend, link }) {
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

// Company Card Component
function CompanyCard({ company }) {
  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Inactive: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        <Link to={`/companies/${company.id}`} className="hover:text-blue-600">
          {company.name}
        </Link>
      </h3>
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <span className="font-medium">Industry:</span> {company.industry}
        </p>
        <p>
          <span className="font-medium">Status:</span>{' '}
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[company.status]}`}>
            {company.status}
          </span>
        </p>
        <p>
          <span className="font-medium">Location:</span> {company.location}
        </p>
        <p>
          <span className="font-medium">Registered:</span> {company.registrationDate}
        </p>
        <p>
          <span className="font-medium">Revenue:</span> {company.revenue}
        </p>
      </div>
      <div className="mt-4 flex space-x-2">
        <Link
          to={`/companies/${company.id}`}
          className="text-blue-600 hover:underline text-sm"
          aria-label={`View ${company.name}`}
        >
          View
        </Link>
        <button
          className="text-blue-600 hover:underline text-sm"
          onClick={() => alert(`Edit company ${company.name}`)}
          aria-label={`Edit ${company.name}`}
        >
          Edit
        </button>
        <button
          className="text-red-600 hover:underline text-sm"
          onClick={() => alert(`Delete company ${company.name}`)}
          aria-label={`Delete ${company.name}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// Company Cards Component
function CompanyCards({ companies, filters, searchQuery, sortKey, setCurrentPage }) {
  const [currentPage, setLocalCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Apply filters and search
  const filteredCompanies = companies.filter((company) => {
    const industryMatch = filters.industry === 'all' || company.industry === filters.industry;
    const statusMatch = filters.status === 'all' || company.status === filters.status;
    const locationMatch = filters.location === 'all' || company.location === filters.location;
    const searchMatch = !searchQuery || company.name.toLowerCase().includes(searchQuery.toLowerCase());
    return industryMatch && statusMatch && locationMatch && searchMatch;
  });

  // Sorting logic
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return -1;
    if (a[sortKey] > b[sortKey]) return 1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedCompanies.length / itemsPerPage);
  const paginatedCompanies = sortedCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setLocalCurrentPage(page);
    setCurrentPage(page);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 animate-fade-in">Companies</h2>
      {paginatedCompanies.length === 0 ? (
        <p className="text-gray-600 text-center">No companies match the selected filters or search query.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
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

// Company Activity Log Component
function CompanyActivityLog({ activities }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 animate-fade-in">Recent Company Activity</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        {activities.length === 0 ? (
          <p className="text-gray-600">No recent company activity.</p>
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

// Companies Page Component
function MockCompanies() {
  const [filters, setFilters] = useState({
    industry: 'all',
    status: 'all',
    location: 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock company data
  const companies = [
    {
      id: 1,
      name: 'Acme Inc.',
      industry: 'Technology',
      status: 'Active',
      location: 'San Francisco, CA',
      registrationDate: '2024-01-15',
      revenue: '$5.2M',
    },
    {
      id: 2,
      name: 'HealthCorp',
      industry: 'Healthcare',
      status: 'Active',
      location: 'Boston, MA',
      registrationDate: '2023-06-20',
      revenue: '$3.8M',
    },
    {
      id: 3,
      name: 'BuildTech',
      industry: 'Construction',
      status: 'Pending',
      location: 'Chicago, IL',
      registrationDate: '2025-04-10',
      revenue: '$0',
    },
    {
      id: 4,
      name: 'RetailRiser',
      industry: 'Retail',
      status: 'Active',
      location: 'New York, NY',
      registrationDate: '2022-11-05',
      revenue: '$2.1M',
    },
    {
      id: 5,
      name: 'LogiFreight',
      industry: 'Logistics',
      status: 'Inactive',
      location: 'Houston, TX',
      registrationDate: '2021-09-12',
      revenue: '$1.5M',
    },
    {
      id: 6,
      name: 'EduLearn',
      industry: 'Education',
      status: 'Active',
      location: 'Seattle, WA',
      registrationDate: '2023-03-25',
      revenue: '$900K',
    },
    {
      id: 7,
      name: 'GreenEnergy',
      industry: 'Energy',
      status: 'Pending',
      location: 'Denver, CO',
      registrationDate: '2025-04-20',
      revenue: '$0',
    },
  ];

  // Mock company activity data
  const companyActivities = [
    {
      id: 1,
      date: '2025-04-30',
      action: 'Company Registered',
      user: 'John Doe',
      details: 'GreenEnergy added',
    },
    {
      id: 2,
      date: '2025-04-29',
      action: 'Status Updated',
      user: 'Jane Smith',
      details: 'BuildTech set to Pending',
    },
    {
      id: 3,
      date: '2025-04-28',
      action: 'Company Approved',
      user: 'Bob Johnson',
      details: 'EduLearn activated',
    },
    {
      id: 4,
      date: '2025-04-27',
      action: 'Details Updated',
      user: 'Alice Brown',
      details: 'Acme Inc. revenue updated',
    },
    {
      id: 5,
      date: '2025-04-26',
      action: 'Company Deactivated',
      user: 'Charlie Davis',
      details: 'LogiFreight set to Inactive',
    },
  ];

  // Mock company widget data
  const companyWidgets = [
    {
      title: 'Total Companies',
      value: '150',
      icon: BuildingOfficeIcon,
      delay: 0.1,
      trend: 5,
      link: '/companies',
    },
    {
      title: 'Active Companies',
      value: '120',
      icon: BuildingOfficeIcon,
      delay: 0.2,
      trend: 3,
      link: '/companies?status=active',
    },
    {
      title: 'Pending Registrations',
      value: '10',
      icon: DocumentTextIcon,
      delay: 0.3,
      trend: -1,
      link: '/companies?status=pending',
    },
    {
      title: 'Industry Distribution',
      value: '8',
      icon: GlobeAltIcon,
      delay: 0.4,
      trend: 2,
      link: '/industries',
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
    <div className="min-h-screen flex-col bg-gray-50 flex">
      {/* Sidebar placeholder - assumes Sidebar.jsx is rendered by parent */}
     <div className='flex'>     
          <main className="flex-1 p-6 pt-20">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">
              Company Management
            </h1>

            {/* Company Widgets (Metric Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {companyWidgets.map((widget) => (
                <CompanyWidget
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
                  onClick={() => alert('Open Register Company modal')}
                  aria-label="Register New Company"
                >
                  Register Company
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                  onClick={() => alert('Open Approve Company modal')}
                  aria-label="Approve Company"
                >
                  Approve Company
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                  onClick={() => alert('Open Edit Details modal')}
                  aria-label="Edit Details"
                >
                  Edit Details
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                  onClick={() => alert('Open Bulk Actions modal')}
                  aria-label="Bulk Actions"
                >
                  Bulk Actions
                </button>
              </div>
            </div>

            {/* Filters, Search, and Sort */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 animate-fade-in">
                Filter Companies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                    <option value="Energy">Energy</option>
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
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filter by Location"
                  >
                    <option value="all">All Locations</option>
                    <option value="San Francisco, CA">San Francisco, CA</option>
                    <option value="Boston, MA">Boston, MA</option>
                    <option value="Chicago, IL">Chicago, IL</option>
                    <option value="New York, NY">New York, NY</option>
                    <option value="Houston, TX">Houston, TX</option>
                    <option value="Seattle, WA">Seattle, WA</option>
                    <option value="Denver, CO">Denver, CO</option>
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
                      placeholder="Search by company name"
                      className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Search companies"
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
                    aria-label="Sort companies"
                  >
                    <option value="name">Name</option>
                    <option value="industry">Industry</option>
                    <option value="status">Status</option>
                    <option value="registrationDate">Registration Date</option>
                    <option value="revenue">Revenue</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Company Cards */}
            <CompanyCards
              companies={companies}
              filters={filters}
              searchQuery={searchQuery}
              sortKey={sortKey}
              setCurrentPage={setCurrentPage}
            />

            {/* Company Activity Log */}
            <CompanyActivityLog activities={companyActivities} />
          </main>
      </div> 
    </div>
  );
}

export default MockCompanies;

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