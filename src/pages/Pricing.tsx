import React, { useState } from 'react';
import { Check, X, Star, ArrowRight, Zap, Shield, Headphones } from 'lucide-react';

export const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small car rental businesses just getting started',
      monthlyPrice: 29,
      yearlyPrice: 290,
      popular: false,
      features: [
        'Up to 10 vehicles',
        'Basic reservation system',
        'Client management',
        'Basic reporting',
        'Email support',
        'Mobile responsive',
        'Basic branding',
        '1 location'
      ],
      limitations: [
        'No advanced analytics',
        'No API access',
        'No custom integrations',
        'No priority support'
      ]
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses with advanced needs',
      monthlyPrice: 79,
      yearlyPrice: 790,
      popular: true,
      features: [
        'Up to 50 vehicles',
        'Advanced reservation system',
        'Complete client management',
        'Advanced analytics & reports',
        'Contract generation',
        'Payment processing',
        'Custom branding',
        'Multiple locations (up to 5)',
        'SMS notifications',
        'Priority email support',
        'API access',
        'Third-party integrations'
      ],
      limitations: [
        'No white-label solution',
        'No dedicated support'
      ]
    },
    {
      name: 'Enterprise',
      description: 'For large operations requiring maximum flexibility',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      popular: false,
      features: [
        'Unlimited vehicles',
        'Full-featured platform',
        'Advanced client management',
        'Comprehensive analytics',
        'Custom contract templates',
        'Advanced payment processing',
        'Complete white-label solution',
        'Unlimited locations',
        'SMS & email notifications',
        'Dedicated account manager',
        'Phone & chat support',
        'Full API access',
        'Custom integrations',
        'Advanced security features',
        'Data backup & recovery',
        'Custom training'
      ],
      limitations: []
    }
  ];

  const addOns = [
    {
      name: 'Additional Vehicles',
      description: 'Add more vehicles to your plan',
      price: 2,
      unit: 'per vehicle/month'
    },
    {
      name: 'Extra Locations',
      description: 'Add more pickup/drop-off locations',
      price: 15,
      unit: 'per location/month'
    },
    {
      name: 'Advanced Analytics',
      description: 'Detailed business intelligence and reporting',
      price: 25,
      unit: 'per month'
    },
    {
      name: 'Custom Integrations',
      description: 'Connect with your existing business tools',
      price: 50,
      unit: 'per integration/month'
    }
  ];

  const faqs = [
    {
      question: 'Can I change my plan at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a 14-day free trial for all plans. No credit card required to start.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade security with SSL encryption, regular backups, and GDPR compliance.'
    },
    {
      question: 'Do you offer custom solutions?',
      answer: 'Yes, for Enterprise customers, we can create custom solutions tailored to your specific business needs.'
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice;
    return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Simple, Transparent
              <span className="block text-blue-200">Pricing</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Choose the perfect plan for your car rental business. Start free, scale as you grow.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-white' : 'text-blue-200'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-white' : 'text-blue-200'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Save up to 20%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-sm border-2 p-8 ${
                plan.popular
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${getPrice(plan)}
                  </span>
                  <span className="text-gray-600">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                
                {billingCycle === 'yearly' && (
                  <div className="text-green-600 text-sm font-semibold">
                    Save {getSavings(plan)}% annually
                  </div>
                )}
              </div>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 mb-8 ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Start Free Trial
              </button>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Not included:</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="flex items-start">
                          <X className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-500 text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Add-ons & Extensions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enhance your plan with additional features and capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{addon.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{addon.description}</p>
                <div className="text-2xl font-bold text-blue-600 mb-1">${addon.price}</div>
                <div className="text-gray-500 text-sm">{addon.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Setup</h3>
              <p className="text-gray-600">
                Get your car rental business online in minutes, not weeks. Our intuitive setup wizard guides you through every step.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Enterprise-grade security with 99.9% uptime guarantee. Your data and your customers' information are always protected.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our dedicated support team is here to help you succeed. Get assistance whenever you need it, day or night.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of car rental businesses already growing with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center">
                Start 14-Day Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
                Contact Sales
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-4">No credit card required • Cancel anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
};
