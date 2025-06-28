import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Users, TrendingUp } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
          <Sparkles className="h-4 w-4 mr-2" />
          Trusted by 500+ Car Rental Agencies
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 animate-fade-in-up">
          Create Your
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> Car Rental </span>
          Website in
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> 3 Minutes</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-100">
          The complete SaaS platform that empowers car rental agencies to build beautiful, 
          branded websites with full booking management - no coding required.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 animate-fade-in-up delay-200">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">10,000+</span>
            <span>Happy Clients</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="font-semibold">300%</span>
            <span>Revenue Growth</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="font-semibold">99.9%</span>
            <span>Uptime</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up delay-300">
          <Link 
            to="/signup" 
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center text-lg font-semibold group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <button className="bg-white text-gray-700 px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 flex items-center text-lg font-semibold group shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Play className="h-5 w-5 mr-2 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
            Watch Demo
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 animate-fade-in-up delay-500">
          <div className="text-sm text-gray-500">Trusted by leading brands:</div>
          <div className="flex items-center space-x-1 font-semibold text-gray-600">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            <span>Enterprise Cars</span>
          </div>
          <div className="flex items-center space-x-1 font-semibold text-gray-600">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full"></div>
            <span>Swift Rentals</span>
          </div>
          <div className="flex items-center space-x-1 font-semibold text-gray-600">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
            <span>Premium Auto</span>
          </div>
        </div>
      </div>
    </section>
  );
};