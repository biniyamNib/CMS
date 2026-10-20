import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Logo from '../../assets/logo.jpg'

const Navbar = () => {
const navigate = useNavigate();
const userRole = 'Admin'; // Mock; replace with auth context
const isAuthenticated = !!userRole; // Mock; replace with auth state check
const [isMenuOpen, setIsMenuOpen] = useState(false);

const navLinks = [
  { name: 'Home', path: '#home' },
  { name: 'About', path: '#about' },
  { name: 'Features', path: '#features' },
  { name: 'Industries', path: '#industries' },
  { name: 'Companies', path: '#companies' },
  { name: 'Contact Us', path: '#contact' },
];

const handleDashboardNavigation = () => {
  navigate(
    userRole === 'Admin'
      ? '/dashboard'
      : userRole === 'HR'
      ? '/hr/dashboard'
      : userRole === 'Sales'
      ? '/sales/dashboard'
      : userRole === 'Customer Support'
      ? '/support/dashboard'
      : userRole === 'Shareholder'
      ? '/shareholder/dashboard'
      : '/dashboard'
  );
};

const handleNavClick = (path) => {
  if (path.startsWith('#')) {
    const sectionId = path.slice(1);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Ensure we're on the home page
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  } else {
    navigate(path);
  }
};

return (
  <nav className="bg-gray-800 shadow-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <button
            onClick={() => handleNavClick('#home')}
            className="text-2xl font-bold "
          >
            <img src={Logo} alt="Logo" className='w-12 rounded-full'/>
          </button>
        </div>

        {/* Desktop Navlinks */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.path)}
              className="text-white hover:text-blue-600 transition"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <Button
              onClick={handleDashboardNavigation}
              className="bg-green-500 p-4 text-white hover:bg-green-600"
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                onClick={() => navigate('/login')}
                className="bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    {/* Mobile Menu */}
    {isMenuOpen && (
      <div className="md:hidden bg-white border-t">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                handleNavClick(link.path);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              {link.name}
            </button>
          ))}
          {isAuthenticated ? (
            <Button
              onClick={() => {
                handleDashboardNavigation();
                setIsMenuOpen(false);
              }}
              className="w-full text-center px-3 py-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50"
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  navigate('/signup');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 bg-blue-500 text-white hover:bg-blue-600"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    )}
  </nav>
);
};

export default Navbar;