import React from 'react';
import { Check, Zap, Crown, Rocket } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      description: "Perfect for small car rental businesses",
      icon: Zap,
      color: "from-blue-500 to-blue-600",
      features: [
        "Up to 25 vehicles",
        "Basic website customization",
        "Online booking system",
        "Payment processing",
        "Email support",
        "Mobile responsive design"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$79",
      description: "Ideal for growing rental agencies",
      icon: Crown,
      color: "from-purple-500 to-purple-600",
      features: [
        "Up to 100 vehicles",
        "Advanced customization",
        "Multi-location support",
        "Analytics dashboard",
        "Priority support",
        "Customer management CRM",
        "Contract generation",
        "Multi-language support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$199",
      description: "For large-scale rental operations",
      icon: Rocket,
      color: "from-gradient-to-r from-orange-500 to-red-500",
      features: [
        "Unlimited vehicles",
        "White-label solution",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "Advanced analytics",
        "Custom reporting",
        "Multi-currency support"
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your business size. All plans include 14-day free trial with no setup fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button 
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h4>
              <p className="text-gray-600">No, there are no setup fees or hidden charges. You only pay the monthly subscription.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. No long-term contracts required.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600">We offer a 30-day money-back guarantee if you're not completely satisfied.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Is training included?</h4>
              <p className="text-gray-600">Yes, we provide comprehensive onboarding and training for all plans.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};