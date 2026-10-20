import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import MockSidebar from './MockSidebar';

function MockNavbar() {
  return (
    <div>
        <nav className="bg-[#1C2526] text-white w-full h-16 flex items-center justify-between px-6 fixed top-0 left-0 z-50 shadow-lg">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold">
        CMS
      </Link>

      {/* User Profile */}
      <div className="flex items-center space-x-3">
        <UserCircleIcon className="w-8 h-8 text-white" />
        <span className="text-sm font-medium">Robert William</span>
        <ChevronDownIcon className="w-5 h-5 text-white" />
      </div>
    </nav>
    <MockSidebar />
    </div>
   );   
}

export default MockNavbar;