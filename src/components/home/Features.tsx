import React from 'react';
import { 
  Smartphone, 
  Palette, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Shield,
  Zap,
  Users,
  FileText,
  Globe,
  Headphones,
  Sparkles
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Fully responsive websites that look stunning on any device.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Palette,
      title: "Complete Branding",
      description: "Customize colors, fonts, logo, and design to match your brand.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Calendar,
      title: "Smart Booking System",
      description: "Advanced reservation system with real-time availability.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Built-in payment processing with multiple gateway options.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights and reporting for your business.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SSL encryption and data protection.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed with global CDN and caching.",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Complete CRM system to manage your clients and bookings.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: FileText,
      title: "Contract Generation",
      description: "Auto-generate rental agreements and legal documents.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Support for multiple languages and currencies.",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support and technical assistance.",
      color: "from-violet-500 to-violet-600"
    },
    {
      icon: Sparkles,
      title: "Regular Updates",
      description: "Continuous feature updates and improvements at no extra cost.",
      color: "from-emerald-500 to-emerald-600"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed specifically for car rental businesses. Built by industry experts.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
            >
              {/* Icon */}
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Still not convinced? Try it risk-free!
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Start with our 14-day free trial. No credit card required. Cancel anytime.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};