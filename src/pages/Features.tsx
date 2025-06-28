import React from 'react';
import { 
  Car, Users, Calendar, CreditCard, BarChart3, Settings, 
  Smartphone, Globe, Shield, Zap, Palette, FileText,
  Clock, Bell, MapPin, Star, CheckCircle, ArrowRight
} from 'lucide-react';

export const Features: React.FC = () => {
  const mainFeatures = [
    {
      icon: Car,
      title: 'Fleet Management',
      description: 'Complete vehicle inventory management with detailed car profiles, maintenance tracking, and availability status.',
      features: ['Add/Edit/Delete vehicles', 'Real-time availability', 'Maintenance scheduling', 'Photo galleries']
    },
    {
      icon: Calendar,
      title: 'Reservation System',
      description: 'Advanced booking system with calendar integration, conflict prevention, and automated confirmations.',
      features: ['Online booking calendar', 'Conflict detection', 'Automated emails', 'Special requests handling']
    },
    {
      icon: Users,
      title: 'Client Management',
      description: 'Comprehensive customer database with profiles, rental history, and communication tools.',
      features: ['Customer profiles', 'Rental history', 'Document storage', 'Communication logs']
    },
    {
      icon: CreditCard,
      title: 'Payment Processing',
      description: 'Secure payment handling with multiple payment methods, invoicing, and financial reporting.',
      features: ['Multiple payment methods', 'Automated invoicing', 'Payment tracking', 'Financial reports']
    },
    {
      icon: FileText,
      title: 'Contract Generation',
      description: 'Automated rental contract creation with customizable templates and digital signatures.',
      features: ['Auto-generated contracts', 'Digital signatures', 'Custom templates', 'Legal compliance']
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Comprehensive business intelligence with revenue tracking, performance metrics, and insights.',
      features: ['Revenue analytics', 'Performance metrics', 'Custom reports', 'Data export']
    }
  ];

  const additionalFeatures = [
    {
      icon: Palette,
      title: 'White-Label Branding',
      description: 'Customize your platform with your own logo, colors, and branding to match your business identity.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Fully responsive design that works perfectly on desktop, tablet, and mobile devices.'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Support for multiple languages and currencies to serve international customers.'
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Enterprise-grade security with data encryption, secure payments, and GDPR compliance.'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Automated email and SMS notifications for bookings, reminders, and important updates.'
    },
    {
      icon: MapPin,
      title: 'Location Management',
      description: 'Multiple pickup/drop-off locations with GPS integration and route optimization.'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you and your customers whenever needed.'
    },
    {
      icon: Zap,
      title: 'API Integration',
      description: 'RESTful API for integrating with third-party services and custom applications.'
    }
  ];

  const benefits = [
    {
      title: 'Increase Revenue',
      description: 'Optimize pricing, reduce no-shows, and maximize fleet utilization with smart analytics.',
      percentage: '35%',
      metric: 'Average revenue increase'
    },
    {
      title: 'Save Time',
      description: 'Automate manual processes, reduce paperwork, and streamline operations.',
      percentage: '60%',
      metric: 'Time saved on admin tasks'
    },
    {
      title: 'Improve Customer Satisfaction',
      description: 'Provide seamless booking experience and professional service delivery.',
      percentage: '90%',
      metric: 'Customer satisfaction rate'
    },
    {
      title: 'Reduce Costs',
      description: 'Eliminate manual processes, reduce errors, and optimize resource allocation.',
      percentage: '40%',
      metric: 'Operational cost reduction'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Powerful Features for
              <span className="block text-blue-200">Modern Car Rental</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Everything you need to run a successful car rental business, from fleet management to customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
                Start Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Core Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools designed specifically for car rental businesses of all sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">{feature.title}</h3>
              </div>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <ul className="space-y-2">
                {feature.features.map((item, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Features */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Additional Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced capabilities to give you a competitive edge in the market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Proven Results
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our platform helps car rental businesses achieve their goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{benefit.percentage}</div>
                <div className="text-sm text-gray-500 mb-4">{benefit.metric}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
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
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of car rental businesses already using our platform to grow their revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center">
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
