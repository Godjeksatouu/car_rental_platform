import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Menu, X, ArrowRight, LogIn } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-200">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">RentMaster</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
              Features
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
              Pricing
            </Link>
            <Link to="/demo" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
              Demo
            </Link>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center">
              <LogIn className="h-4 w-4 mr-1" />
              Login
            </Link>
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center group"
            >
              Get Started
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-4">
              <Link to="/features" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                Pricing
              </Link>
              <Link to="/demo" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                Demo
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center">
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center group"
              >
                Get Started
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};