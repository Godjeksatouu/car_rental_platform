import React, { useState } from 'react';
import { 
  Play, Monitor, Smartphone, Tablet, Car, Calendar, 
  Users, BarChart3, Settings, CreditCard, FileText,
  ArrowRight, CheckCircle, Clock, Star
} from 'lucide-react';

export const Demo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState('dashboard');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const demoSections = [
    {
      id: 'dashboard',
      title: 'Agency Dashboard',
      description: 'Complete overview of your business with real-time analytics',
      icon: BarChart3,
      features: ['Real-time statistics', 'Revenue tracking', 'Quick actions', 'Recent activity']
    },
    {
      id: 'fleet',
      title: 'Fleet Management',
      description: 'Manage your entire vehicle inventory with ease',
      icon: Car,
      features: ['Vehicle profiles', 'Maintenance tracking', 'Availability status', 'Photo galleries']
    },
    {
      id: 'reservations',
      title: 'Booking System',
      description: 'Advanced reservation management with calendar integration',
      icon: Calendar,
      features: ['Online booking', 'Calendar view', 'Conflict prevention', 'Automated confirmations']
    },
    {
      id: 'clients',
      title: 'Client Management',
      description: 'Comprehensive customer database and communication tools',
      icon: Users,
      features: ['Customer profiles', 'Rental history', 'Communication logs', 'Document storage']
    },
    {
      id: 'contracts',
      title: 'Contract Generation',
      description: 'Automated contract creation with digital signatures',
      icon: FileText,
      features: ['Auto-generated contracts', 'Custom templates', 'Digital signatures', 'Legal compliance']
    },
    {
      id: 'payments',
      title: 'Payment Processing',
      description: 'Secure payment handling and financial reporting',
      icon: CreditCard,
      features: ['Multiple payment methods', 'Automated invoicing', 'Payment tracking', 'Financial reports']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'Premium Car Rentals',
      role: 'Owner',
      content: 'This platform transformed our business. We increased our revenue by 40% in just 6 months.',
      rating: 5,
      image: '/api/placeholder/64/64'
    },
    {
      name: 'Michael Chen',
      company: 'City Auto Rental',
      role: 'Operations Manager',
      content: 'The automation features saved us 20 hours per week. Our customers love the seamless booking experience.',
      rating: 5,
      image: '/api/placeholder/64/64'
    },
    {
      name: 'Emma Rodriguez',
      company: 'Luxury Fleet Services',
      role: 'CEO',
      content: 'Professional, reliable, and feature-rich. Exactly what we needed to scale our operations.',
      rating: 5,
      image: '/api/placeholder/64/64'
    }
  ];

  const stats = [
    { label: 'Active Businesses', value: '2,500+' },
    { label: 'Vehicles Managed', value: '50,000+' },
    { label: 'Bookings Processed', value: '1M+' },
    { label: 'Customer Satisfaction', value: '98%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              See It In Action
              <span className="block text-blue-200">Interactive Demo</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Explore our platform with a hands-on demo. See how easy it is to manage your car rental business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center">
                <Play className="h-5 w-5 mr-2" />
                Watch Video Demo
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
                Try Live Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Interactive Platform Demo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Click through different sections to see how our platform works for your business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore Features</h3>
              <div className="space-y-2">
                {demoSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveDemo(section.id)}
                    className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${
                      activeDemo === section.id
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-3 ${
                        activeDemo === section.id ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <section.icon className={`h-5 w-5 ${
                          activeDemo === section.id ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{section.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {section.features.slice(0, 2).map((feature, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Demo Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Device Toggle */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {demoSections.find(s => s.id === activeDemo)?.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setDeviceView('desktop')}
                    className={`p-2 rounded-lg ${deviceView === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Monitor className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setDeviceView('tablet')}
                    className={`p-2 rounded-lg ${deviceView === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Tablet className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setDeviceView('mobile')}
                    className={`p-2 rounded-lg ${deviceView === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Smartphone className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Demo Content */}
              <div className={`bg-gray-100 rounded-lg overflow-hidden ${
                deviceView === 'desktop' ? 'aspect-video' :
                deviceView === 'tablet' ? 'aspect-[4/3]' : 'aspect-[9/16] max-w-sm mx-auto'
              }`}>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {React.createElement(demoSections.find(s => s.id === activeDemo)?.icon || Car, {
                        className: "h-8 w-8 text-blue-600"
                      })}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {demoSections.find(s => s.id === activeDemo)?.title} Demo
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {demoSections.find(s => s.id === activeDemo)?.description}
                    </p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      Try Interactive Demo
                    </button>
                  </div>
                </div>
              </div>

              {/* Feature List */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Key Features:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {demoSections.find(s => s.id === activeDemo)?.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Demo Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Watch Our Platform in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See a complete walkthrough of our car rental management platform.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video">
              <div className="w-full h-full flex items-center justify-center">
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-6 transition-all duration-200">
                  <Play className="h-12 w-12 text-white ml-1" />
                </button>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-gray-600 mb-4">5-minute overview of all features</p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  5:32 duration
                </div>
                <div className="flex items-center">
                  <Play className="h-4 w-4 mr-1" />
                  25,000+ views
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  4.9/5 rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what real businesses say about our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Try It Yourself?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start your free trial today and see how our platform can transform your car rental business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center">
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
                Schedule Live Demo
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-4">No credit card required • Full access for 14 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};
