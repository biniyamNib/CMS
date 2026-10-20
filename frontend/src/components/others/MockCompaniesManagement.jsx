import React from 'react';
import { Link } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  SitemapIcon,
  UsersIcon,
  DocumentTextIcon,
  BadgeCheckIcon,
} from '@heroicons/react/24/outline';

function MockCompaniesManagement() {
  const cards = [
    {
      title: 'Companies',
      value: '25',
      icon: BuildingOfficeIcon,
      link: '/companies',
      description: 'Manage company profiles and details',
    },
    {
      title: 'Organizational Structure',
      value: '15',
      icon: SitemapIcon,
      link: '/org-structure',
      description: 'View and edit organizational hierarchy',
    },
    {
      title: 'Shareholders',
      value: '120',
      icon: UsersIcon,
      link: '/shareholders',
      description: 'Track shareholder information',
    },
    {
      title: 'Licenses',
      value: '40',
      icon: DocumentTextIcon,
      link: '/licenses',
      description: 'Manage company licenses and compliance',
    },
    {
      title: 'Designations',
      value: '10',
      icon: BadgeCheckIcon,
      link: '/designations',
      description: 'Handle job titles and roles',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">
        Companies Management
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link
            to={card.link}
            key={card.title}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer"
            aria-label={`View ${card.title}`}
          >
            <div className="flex items-center space-x-4">
              <card.icon className="w-8 h-8 text-[#3B82F6] flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
                <p className="text-2xl font-medium text-gray-700 mt-2">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Animation style
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

export default MockCompaniesManagement;