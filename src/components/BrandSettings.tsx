import React, { useState, useRef } from 'react';
import { Save, Upload, Palette, Type, Eye, Download } from 'lucide-react';

interface BrandSettingsData {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  customCss: string;
  brandName: string;
  tagline: string;
  favicon: string;
}

export const BrandSettings: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  
  const [brandData, setBrandData] = useState<BrandSettingsData>({
    logoUrl: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#1F2937',
    accentColor: '#10B981',
    fontFamily: 'Inter',
    customCss: '',
    brandName: 'CALABRIA LUXURY CAR',
    tagline: 'Premium Car Rental Experience',
    favicon: ''
  });

  const [editData, setEditData] = useState<BrandSettingsData>(brandData);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Modern & Clean)' },
    { value: 'Poppins', label: 'Poppins (Friendly & Rounded)' },
    { value: 'Roboto', label: 'Roboto (Professional)' },
    { value: 'Open Sans', label: 'Open Sans (Readable)' },
    { value: 'Montserrat', label: 'Montserrat (Elegant)' },
    { value: 'Lato', label: 'Lato (Humanist)' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro (Clean)' },
    { value: 'Nunito', label: 'Nunito (Soft & Rounded)' }
  ];

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setEditData({...editData, logoUrl: result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 1 * 1024 * 1024) {
        alert('Favicon size must be less than 1MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFaviconPreview(result);
        setEditData({...editData, favicon: result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBrandData(editData);
      setIsEditing(false);
      alert('Brand settings updated successfully!');
    } catch (error) {
      alert('Failed to update brand settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(brandData);
    setLogoPreview(brandData.logoUrl);
    setFaviconPreview(brandData.favicon);
    setIsEditing(false);
  };

  const generatePreviewCSS = () => {
    return `
      :root {
        --primary-color: ${editData.primaryColor};
        --secondary-color: ${editData.secondaryColor};
        --accent-color: ${editData.accentColor};
        --font-family: '${editData.fontFamily}', sans-serif;
      }
      
      .preview-container {
        font-family: var(--font-family);
        color: var(--secondary-color);
      }
      
      .preview-header {
        background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
        color: white;
      }
      
      .preview-button {
        background-color: var(--primary-color);
        color: white;
      }
      
      .preview-accent {
        color: var(--accent-color);
      }
      
      ${editData.customCss}
    `;
  };

  const downloadBrandKit = () => {
    const brandKit = {
      colors: {
        primary: editData.primaryColor,
        secondary: editData.secondaryColor,
        accent: editData.accentColor
      },
      fonts: {
        primary: editData.fontFamily
      },
      assets: {
        logo: editData.logoUrl,
        favicon: editData.favicon
      },
      css: generatePreviewCSS()
    };

    const dataStr = JSON.stringify(brandKit, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'brand-kit.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Brand Settings</h2>
        <div className="flex space-x-2">
          <button
            onClick={downloadBrandKit}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Brand Kit
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              <Palette className="h-4 w-4 mr-2" />
              Edit Branding
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brand Assets */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Assets</h3>
            
            <div className="space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    {(logoPreview || brandData.logoUrl) ? (
                      <img 
                        src={logoPreview || brandData.logoUrl} 
                        alt="Logo" 
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <div>
                      <button
                        onClick={() => logoInputRef.current?.click()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </button>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Favicon Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50">
                    {(faviconPreview || brandData.favicon) ? (
                      <img 
                        src={faviconPreview || brandData.favicon} 
                        alt="Favicon" 
                        className="w-full h-full object-contain rounded"
                      />
                    ) : (
                      <Upload className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <div>
                      <button
                        onClick={() => faviconInputRef.current?.click()}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors duration-200"
                      >
                        Upload Favicon
                      </button>
                      <p className="text-xs text-gray-500 mt-1">16x16 or 32x32 px</p>
                      <input
                        ref={faviconInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFaviconUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Brand Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.brandName}
                    onChange={(e) => setEditData({...editData, brandName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold text-lg">{brandData.brandName}</p>
                )}
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.tagline}
                    onChange={(e) => setEditData({...editData, tagline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-600">{brandData.tagline}</p>
                )}
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Palette</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={isEditing ? editData.primaryColor : brandData.primaryColor}
                    onChange={(e) => isEditing && setEditData({...editData, primaryColor: e.target.value})}
                    disabled={!isEditing}
                    className="w-16 h-16 border-2 border-gray-300 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div>
                    <input
                      type="text"
                      value={isEditing ? editData.primaryColor : brandData.primaryColor}
                      onChange={(e) => isEditing && setEditData({...editData, primaryColor: e.target.value})}
                      disabled={!isEditing}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Main brand color</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={isEditing ? editData.secondaryColor : brandData.secondaryColor}
                    onChange={(e) => isEditing && setEditData({...editData, secondaryColor: e.target.value})}
                    disabled={!isEditing}
                    className="w-16 h-16 border-2 border-gray-300 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div>
                    <input
                      type="text"
                      value={isEditing ? editData.secondaryColor : brandData.secondaryColor}
                      onChange={(e) => isEditing && setEditData({...editData, secondaryColor: e.target.value})}
                      disabled={!isEditing}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Text and backgrounds</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={isEditing ? editData.accentColor : brandData.accentColor}
                    onChange={(e) => isEditing && setEditData({...editData, accentColor: e.target.value})}
                    disabled={!isEditing}
                    className="w-16 h-16 border-2 border-gray-300 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div>
                    <input
                      type="text"
                      value={isEditing ? editData.accentColor : brandData.accentColor}
                      onChange={(e) => isEditing && setEditData({...editData, accentColor: e.target.value})}
                      disabled={!isEditing}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Highlights and CTAs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Typography</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Font</label>
              {isEditing ? (
                <select
                  value={editData.fontFamily}
                  onChange={(e) => setEditData({...editData, fontFamily: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center">
                  <Type className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900" style={{ fontFamily: brandData.fontFamily }}>
                    {fontOptions.find(f => f.value === brandData.fontFamily)?.label || brandData.fontFamily}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Custom CSS */}
          {isEditing && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom CSS</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Styles</label>
                <textarea
                  value={editData.customCss}
                  onChange={(e) => setEditData({...editData, customCss: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="/* Add your custom CSS here */"
                />
                <p className="text-xs text-gray-500 mt-1">Advanced styling options</p>
              </div>
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <style dangerouslySetInnerHTML={{ __html: generatePreviewCSS() }} />
            
            <div className="preview-container">
              {/* Header */}
              <div className="preview-header p-4">
                <div className="flex items-center space-x-3">
                  {(logoPreview || brandData.logoUrl) && (
                    <img 
                      src={logoPreview || brandData.logoUrl} 
                      alt="Logo" 
                      className="h-8 w-8 object-contain bg-white bg-opacity-20 rounded"
                    />
                  )}
                  <div>
                    <h4 className="font-bold text-lg">{editData.brandName}</h4>
                    <p className="text-sm opacity-90">{editData.tagline}</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h5 className="text-lg font-semibold mb-2">Welcome to Our Car Rental Service</h5>
                <p className="text-sm text-gray-600 mb-4">
                  Experience premium car rental with our extensive fleet of vehicles.
                </p>
                
                <div className="flex space-x-2 mb-4">
                  <button className="preview-button px-4 py-2 rounded text-sm font-medium">
                    Book Now
                  </button>
                  <button className="border border-gray-300 px-4 py-2 rounded text-sm">
                    Learn More
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded p-3">
                    <h6 className="font-medium text-sm">Economy Cars</h6>
                    <p className="preview-accent text-sm font-bold">From $29/day</p>
                  </div>
                  <div className="border border-gray-200 rounded p-3">
                    <h6 className="font-medium text-sm">Luxury Cars</h6>
                    <p className="preview-accent text-sm font-bold">From $99/day</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Preview Note:</strong> This shows how your branding will appear on your car rental website. 
              Changes are applied in real-time as you edit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
