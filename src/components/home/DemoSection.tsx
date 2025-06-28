import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, ExternalLink, Eye, Car } from 'lucide-react';

export const DemoSection: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState(0);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const demos = [
    {
      name: "Luxury Car Rentals",
      domain: "luxury-cars.rentmaster.com",
      primaryColor: "#8B5CF6",
      secondaryColor: "#A855F7",
      image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Premium luxury vehicle rentals with elegant design"
    },
    {
      name: "City Drive Rentals", 
      domain: "city-drive.rentmaster.com",
      primaryColor: "#10B981",
      secondaryColor: "#059669",
      image: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Urban-focused car rental with modern aesthetics"
    },
    {
      name: "Adventure Rentals",
      domain: "adventure-co.rentmaster.com", 
      primaryColor: "#F59E0B",
      secondaryColor: "#D97706",
      image: "https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Off-road and adventure vehicle specialists"
    }
  ];

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-80 h-96';
      case 'tablet':
        return 'w-96 h-80';
      default:
        return 'w-full h-96';
    }
  };

  return (
    <section id="demo" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore real customer websites built with RentMaster. Each one uniquely branded and fully functional.
          </p>
        </div>

        {/* Demo Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {demos.map((demo, index) => (
            <button
              key={index}
              onClick={() => setActiveDemo(index)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeDemo === index
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {demo.name}
            </button>
          ))}
        </div>

        {/* Viewport Controls */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-3 rounded-lg transition-all duration-300 ${
              viewMode === 'desktop'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Monitor className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className={`p-3 rounded-lg transition-all duration-300 ${
              viewMode === 'tablet'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Tablet className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-3 rounded-lg transition-all duration-300 ${
              viewMode === 'mobile'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Smartphone className="h-5 w-5" />
          </button>
        </div>

        {/* Demo Display */}
        <div className="bg-gray-100 rounded-2xl p-8 mb-8">
          <div className={`mx-auto ${getViewportClass()} bg-white rounded-lg shadow-2xl overflow-hidden`}>
            {/* Browser Header */}
            <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm">
                  {demos[activeDemo].domain}
                </div>
              </div>
            </div>

            {/* Website Content */}
            <div className="h-full bg-white overflow-hidden">
              {/* Header */}
              <div 
                className="p-4 text-white"
                style={{ 
                  background: `linear-gradient(135deg, ${demos[activeDemo].primaryColor}, ${demos[activeDemo].secondaryColor})` 
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Car className="h-6 w-6" />
                    <span className="font-bold">{demos[activeDemo].name}</span>
                  </div>
                  <div className="hidden sm:flex space-x-4 text-sm">
                    <span>Cars</span>
                    <span>Book</span>
                    <span>Contact</span>
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <div className="relative h-32 bg-cover bg-center" style={{ backgroundImage: `url(${demos[activeDemo].image})` }}>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-lg font-bold mb-1">Premium Car Rentals</h3>
                    <p className="text-sm opacity-90">Book your perfect ride today</p>
                  </div>
                </div>
              </div>

              {/* Car Grid */}
              <div className="p-4 grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="bg-gray-200 h-16 rounded-lg mb-2"></div>
                    <div className="text-xs font-medium text-gray-800">Luxury Sedan</div>
                    <div className="text-xs text-gray-600">$99/day</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Demo Info */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {demos[activeDemo].name}
          </h3>
          <p className="text-gray-600 mb-6">
            {demos[activeDemo].description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 group">
              <Eye className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              View Full Demo
            </button>
            <button className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 group">
              <ExternalLink className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Visit Live Site
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};