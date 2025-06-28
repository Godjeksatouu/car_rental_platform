import React, { useState, useEffect, useRef } from 'react';
import {
  Car, Calendar, Users, DollarSign, TrendingUp, Plus,
  BarChart3, Settings, Bell, User, LogOut, ChevronDown,
  Menu, X, Home, Tag, CreditCard, Palette, Clock,
  FileText, Shield, Mail
} from 'lucide-react';
import { CarsManagement } from '../components/CarsManagement';
import { AgencyProfile } from '../components/AgencyProfile';
import { BrandSettings } from '../components/BrandSettings';
import { ReservationsManagement } from '../components/ReservationsManagement';

export const AgencyDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const stats = [
    { label: 'Total Vehicles', value: '24', icon: Car, color: 'bg-blue-500' },
    { label: 'Active Bookings', value: '12', icon: Calendar, color: 'bg-green-500' },
    { label: 'Total Customers', value: '156', icon: Users, color: 'bg-purple-500' },
    { label: 'Monthly Revenue', value: '$12,450', icon: DollarSign, color: 'bg-orange-500' }
  ];

  const navigationItems = [
    {
      section: 'main',
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Overview of activity' },
        { id: 'cars', label: 'Cars', icon: Car, description: 'List of cars, add/edit/remove' },
        { id: 'categories', label: 'Categories', icon: Tag, description: 'Manage car categories' },
        { id: 'reservations', label: 'Reservations', icon: Calendar, description: 'View and manage client reservations' },
        { id: 'rentals', label: 'Rentals', icon: BarChart3, description: 'Active and past rental records' },
        { id: 'clients', label: 'Clients', icon: Users, description: 'View and manage registered clients' },
        { id: 'payments', label: 'Payments', icon: CreditCard, description: 'Rental payments and invoices' }
      ]
    },
    {
      section: 'customization',
      title: 'Customization & Settings',
      items: [
        { id: 'profile', label: 'Agency Profile', icon: User, description: 'Update agency info, contact, address' },
        { id: 'branding', label: 'Brand Settings', icon: Palette, description: 'Change logo, colors, fonts' },
        { id: 'business', label: 'Business Hours & Policies', icon: Clock, description: 'Manage terms, privacy, availability' }
      ]
    },
    {
      section: 'communication',
      title: 'Communication',
      items: [
        { id: 'notifications', label: 'Notifications', icon: Bell, description: 'View messages, alerts, and reminders' }
      ]
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboardContent();
      case 'cars':
        return <CarsManagement />;
      case 'categories':
        return <div className="p-6"><h2 className="text-2xl font-bold">Car Categories</h2><p className="text-gray-600">Organize your cars into categories.</p></div>;
      case 'reservations':
        return <ReservationsManagement />;
      case 'rentals':
        return <div className="p-6"><h2 className="text-2xl font-bold">Rentals</h2><p className="text-gray-600">Track active and past rental records.</p></div>;
      case 'clients':
        return <div className="p-6"><h2 className="text-2xl font-bold">Clients</h2><p className="text-gray-600">Manage your registered clients.</p></div>;
      case 'payments':
        return <div className="p-6"><h2 className="text-2xl font-bold">Payments</h2><p className="text-gray-600">View rental payments and invoices.</p></div>;
      case 'profile':
        return <AgencyProfile />;
      case 'branding':
        return <BrandSettings />;
      case 'business':
        return <div className="p-6"><h2 className="text-2xl font-bold">Business Settings</h2><p className="text-gray-600">Manage business hours and policies.</p></div>;
      case 'notifications':
        return <div className="p-6"><h2 className="text-2xl font-bold">Notifications</h2><p className="text-gray-600">View messages and alerts.</p></div>;
      default:
        return renderDashboardContent();
    }
  };

  const renderDashboardContent = () => (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Toyota Camry</p>
                    <p className="text-sm text-gray-600">John Doe • 3 days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">$450</p>
                  <p className="text-sm text-gray-600">Confirmed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => setActiveSection('cars')}
              className="w-full bg-blue-50 text-blue-700 p-3 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-left"
            >
              Add New Vehicle
            </button>
            <button
              onClick={() => setActiveSection('reservations')}
              className="w-full bg-green-50 text-green-700 p-3 rounded-lg hover:bg-green-100 transition-colors duration-200 text-left"
            >
              Create Booking
            </button>
            <button
              onClick={() => setActiveSection('payments')}
              className="w-full bg-purple-50 text-purple-700 p-3 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-left"
            >
              Generate Report
            </button>
            <button
              onClick={() => setActiveSection('clients')}
              className="w-full bg-orange-50 text-orange-700 p-3 rounded-lg hover:bg-orange-100 transition-colors duration-200 text-left"
            >
              Manage Customers
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CA</span>
                </div>
                <span className="font-semibold text-gray-900">Car Agency</span>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {navigationItems.map((section) => (
            <div key={section.section} className="mb-6">
              {isSidebarOpen && (
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              <nav className="space-y-1 px-2">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      activeSection === item.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    title={!isSidebarOpen ? item.label : ''}
                  >
                    <item.icon className={`${isSidebarOpen ? 'mr-3' : 'mx-auto'} h-5 w-5 flex-shrink-0`} />
                    {isSidebarOpen && (
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                      </div>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {navigationItems.flatMap(section => section.items).find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
              {activeSection === 'dashboard' && (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </button>
              )}
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">JD</span>
                  </div>
                  <span className="font-medium">John Doe</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        setActiveSection('profile');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </button>
                    <hr className="my-1" />
                    <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};