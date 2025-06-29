import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Check, Upload, Palette, Settings, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    agencyName: '',
    phone: '',
    address: '',
    logo: null as File | null,
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    fontFamily: 'Inter'
  });

  const steps = [
    { id: 1, title: "Account Setup", icon: Settings },
    { id: 2, title: "Agency Info", icon: Settings },
    { id: 3, title: "Branding", icon: Palette },
    { id: 4, title: "Launch", icon: Rocket }
  ];

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.email && formData.password && formData.password.length >= 6;
      case 2:
        return formData.agencyName && formData.phone;
      case 3:
        return true; // Branding is optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else if (!validateCurrentStep()) {
      alert('Please fill in all required fields before continuing.');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      setFormData(prev => ({ ...prev, logo: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      console.log('Submitting agency data:', formData);

      // Generate slug from agency name
      const slug = formData.agencyName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();

      // Prepare data for backend API
      const registrationData = {
        name: formData.agencyName,
        slug: slug,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        city: '', // You might want to add city field to the form
        state: '', // You might want to add state field to the form
        country: '', // You might want to add country field to the form
        postal_code: '' // You might want to add postal code field to the form
      };

      // Call the backend registration API
      const response = await fetch('http://localhost:3001/api/v1/auth/register/agency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        console.log('Agency registered successfully:', data);

        // Store tokens and user data
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        // Registration failed
        console.error('Registration failed:', data);
        alert(data.error?.message || 'Failed to create agency. Please try again.');
      }
    } catch (error) {
      console.error('Error creating agency:', error);
      alert('Network error. Please check if the backend server is running and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter strong password (min 6 characters)"
                required
                minLength={6}
              />
              {formData.password && formData.password.length < 6 && (
                <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agency Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.agencyName}
                onChange={(e) => handleInputChange('agencyName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Car Rental Agency"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Main St, City, State 12345"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo Upload</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer"
              >
                {logoPreview ? (
                  <div className="space-y-4">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-20 w-20 object-contain mx-auto rounded-lg"
                    />
                    <p className="text-green-600 font-medium">Logo uploaded successfully!</p>
                    <p className="text-sm text-gray-500">Click to change</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Click to upload your logo</p>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 2MB</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="w-16 h-16 border-2 border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    className="w-16 h-16 border-2 border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="#10B981"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
              <select
                value={formData.fontFamily}
                onChange={(e) => handleInputChange('fontFamily', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Congratulations! 🎉
            </h3>
            <p className="text-gray-600 mb-6">
              Your car rental website is ready to launch. You can now start adding your vehicles and accepting bookings.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Your website URL:</p>
              <p className="font-medium text-blue-600">
                {formData.agencyName.toLowerCase().replace(/\s+/g, '-')}.rentmaster.com
              </p>
            </div>
            <button
              onClick={handleComplete}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Setting up...' : 'Go to Dashboard'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Live Preview Sidebar */}
      <div className="hidden lg:block w-1/2 bg-white border-r border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
        <div className="bg-gray-100 rounded-lg p-4 h-full">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Preview Header */}
            <div 
              className="p-4 text-white"
              style={{ 
                background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})` 
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold">
                        {formData.agencyName ? formData.agencyName.charAt(0).toUpperCase() : 'L'}
                      </span>
                    )}
                  </div>
                  <span className="font-bold">{formData.agencyName || 'Your Agency'}</span>
                </div>
              </div>
            </div>
            
            {/* Preview Content */}
            <div className="p-4">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Premium Car Rentals</h4>
                <p className="text-sm text-gray-600">Book your perfect ride today</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="bg-gray-200 h-20 rounded-lg mb-2"></div>
                    <div className="text-xs font-medium text-gray-800">Car Model</div>
                    <div className="text-xs text-gray-600">$99/day</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Set Up Your Agency</h1>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= step.id ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-6">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {steps[currentStep - 1].title}
            </h2>
            
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
              
              {currentStep === steps.length ? (
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-200 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Complete Setup'}
                  <Check className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!validateCurrentStep()}
                  className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    validateCurrentStep()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};