import React from 'react';
import { useParams } from 'react-router-dom';
import { Car, Calendar, MapPin, Phone, Mail } from 'lucide-react';

export const AgencyWebsite: React.FC = () => {
  const { agencyId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8" />
              <span className="text-xl font-bold">Premium Auto Rentals</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#cars" className="hover:text-blue-200 transition-colors duration-200">Cars</a>
              <a href="#about" className="hover:text-blue-200 transition-colors duration-200">About</a>
              <a href="#contact" className="hover:text-blue-200 transition-colors duration-200">Contact</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1200)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Premium Car Rentals</h1>
            <p className="text-xl mb-8">Experience luxury and comfort with our premium fleet</p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg font-semibold">
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Car Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Fleet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Toyota Camry</h3>
                <p className="text-gray-600 mb-4">Comfortable sedan perfect for city driving</p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">$89<span className="text-sm text-gray-600">/day</span></div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-6 w-6" />
                <span className="text-lg font-bold">Premium Auto Rentals</span>
              </div>
              <p className="text-gray-400">Your trusted partner for premium car rentals.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@premiumauto.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>123 Main St, City, State 12345</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Business Hours</h4>
              <div className="space-y-1 text-gray-400">
                <p>Mon - Fri: 8:00 AM - 8:00 PM</p>
                <p>Sat - Sun: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Premium Auto Rentals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};