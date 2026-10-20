the import React from 'react';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div>
          <img src="logo.png" alt="Logo" className="h-8" />
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-4">
          <li><a href="#" className="hover:underline">Home</a></li>
          <li><a href="#" className="hover:underline">Services</a></li>
          <li><a href="#" className="hover:underline">Pricing</a></li>
          <li><a href="#" className="hover:underline">News</a></li>
          <li><a href="#" className="text-green-300 hover:underline">+</a></li>
        </ul>

        {/* Contact Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.502l-4.998 2.49a1 1 0 01-1.002 0l-4.998-2.49a1 1 0 01-.502-1.502L7.052 7.686A1 1 0 016.004 7h-3zm10 1a2 2 0 00-2-2h-3.28a1 1 0 00-.948-.684l-1.498-4.493a1 1 0 00.502-1.502l4.998-2.49a1 1 0 001.002 0l4.998 2.49a1 1 0 00.502 1.502L17.948 7.686A1 1 0 0017.996 8h-3z" />
            </svg>
            <span className="ml-1">+1 555-555-5556</span>
          </div>
          <div>
            <input type="text" placeholder="Search..." className="px-2 py-1 rounded-md" />
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0018 14.158V11a2 2 0 00-2-2h-5V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2h-5a2 2 0 00-2 2v4h3.546l1.804 1.804A1.998 1.998 0 013 18v4c0 .386.264.714.7.939.44.224.99.224 1.438 0l1.07-1.07a1 1 0 01.293-.707V18a1 1 0 011-1h5V7a1 1 0 011-1h3.28A1 1 0 0121 7v10" />
            </svg>
          </div>
          <button className="bg-green-500 text-white px-4 py-2 ml-4 rounded-md">CONTACT US</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;