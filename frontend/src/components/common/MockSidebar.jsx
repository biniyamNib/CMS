import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bars3Icon,
  ChartBarIcon,
  UserIcon,
  FolderIcon,
  BellIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

function MockSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const menuItems = [
    { name: 'Dashboard', icon: ChartBarIcon, path: '/dashboard' },
    { name: 'Profile', icon: UserIcon, path: '/profile', active: true },
    { name: 'Folders', icon: FolderIcon, path: '/folders' },
    { name: 'Notification', icon: BellIcon, path: '/notifications' },
    { name: 'Messages', icon: EnvelopeIcon, path: '/messages' },
    { name: 'Help Center', icon: QuestionMarkCircleIcon, path: '/help' },
    { name: 'Setting', icon: CogIcon, path: '/settings' },
  ];

  return (
    <div
      className={`bg-[#1C2526] text-white h-[calc(100vh-4rem)] flex flex-col transition-all duration-300 ease-in-out fixed top-16 left-0 ${
        isExpanded ? 'w-64' : 'w-16'
      } shadow-lg z-40`}
    >
      {/* Toggle Button */}
      <div className="p-4 flex items-center justify-end">
        <button
          onClick={toggleSidebar}
          className="text-white hover:text-blue-300 focus:outline-none transition-colors duration-300"
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name} className="relative">
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-all duration-300 ${
                  item.active ? 'bg-[#3B82F6]' : ''
                } group`}
              >
                <item.icon
                  className={`w-6 h-6 text-white transition-transform duration-300 ${
                    isExpanded ? 'mr-4' : 'mx-auto'
                  }`}
                />
                {isExpanded && <span className="text-sm font-medium">{item.name}</span>}
                {!isExpanded && (
                  <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <Link
          to="/logout"
          className={`flex items-center p-2 rounded-full bg-[#3B82F6] hover:bg-blue-700 transition-all duration-300 ${
            isExpanded ? 'justify-center' : 'justify-center'
          } group`}
        >
          <ArrowRightOnRectangleIcon
            className={`w-6 h-6 ${isExpanded ? 'mr-2' : ''} text-white`}
          />
          {isExpanded && <span className="text-sm font-medium">LOGOUT</span>}
          {!isExpanded && (
            <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              LOGOUT
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}

export default MockSidebar;