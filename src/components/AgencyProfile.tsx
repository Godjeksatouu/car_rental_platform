import React, { useState, useEffect } from 'react';
import { Save, Edit, MapPin, Phone, Mail, Globe, Calendar, User } from 'lucide-react';

interface AgencyProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
  description: string;
  contactPerson: string;
  businessRegistration: string;
  taxId: string;
  establishedDate: string;
  operatingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
}

export const AgencyProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [profileData, setProfileData] = useState<AgencyProfileData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    website: '',
    description: '',
    contactPerson: '',
    businessRegistration: '',
    taxId: '',
    establishedDate: '',
    operatingHours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: false }
    }
  });

  const [editData, setEditData] = useState<AgencyProfileData>(profileData);

  // Fetch agency profile data on component mount
  useEffect(() => {
    const fetchAgencyProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (!token) {
          console.error('No access token found');
          setIsLoading(false);
          return;
        }

        // First, try to get the agency profile
        const response = await fetch('http://localhost:3001/api/v1/agencies/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const agencyData = data.agency || data;

          // Map the backend data to our frontend structure
          const mappedData: AgencyProfileData = {
            name: agencyData.name || user.name || '',
            email: agencyData.email || user.email || '',
            phone: agencyData.phone || '',
            address: agencyData.address || '',
            city: agencyData.city || '',
            state: agencyData.state || '',
            country: agencyData.country || '',
            postalCode: agencyData.postal_code || '',
            website: agencyData.website || '',
            description: agencyData.description || '',
            contactPerson: user.name || agencyData.contact_person || '',
            businessRegistration: agencyData.business_registration || '',
            taxId: agencyData.tax_id || '',
            establishedDate: agencyData.established_date || agencyData.created_at?.split('T')[0] || '',
            operatingHours: agencyData.operating_hours || {
              monday: { open: '08:00', close: '18:00', closed: false },
              tuesday: { open: '08:00', close: '18:00', closed: false },
              wednesday: { open: '08:00', close: '18:00', closed: false },
              thursday: { open: '08:00', close: '18:00', closed: false },
              friday: { open: '08:00', close: '18:00', closed: false },
              saturday: { open: '09:00', close: '17:00', closed: false },
              sunday: { open: '10:00', close: '16:00', closed: false }
            }
          };

          setProfileData(mappedData);
          setEditData(mappedData);
        } else {
          console.error('Failed to fetch agency profile:', response.statusText);
          // Fallback to user data from localStorage
          if (user.name) {
            setProfileData(prev => ({
              ...prev,
              name: user.name,
              email: user.email,
              contactPerson: user.name
            }));
            setEditData(prev => ({
              ...prev,
              name: user.name,
              email: user.email,
              contactPerson: user.name
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching agency profile:', error);
        // Fallback to user data from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.name) {
          setProfileData(prev => ({
            ...prev,
            name: user.name,
            email: user.email,
            contactPerson: user.name
          }));
          setEditData(prev => ({
            ...prev,
            name: user.name,
            email: user.email,
            contactPerson: user.name
          }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgencyProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        console.error('No access token found');
        alert('Please log in again.');
        return;
      }

      // Map frontend data to backend format
      const backendData = {
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        address: editData.address,
        city: editData.city,
        state: editData.state,
        country: editData.country,
        postal_code: editData.postalCode,
        website: editData.website,
        description: editData.description,
        contact_person: editData.contactPerson,
        business_registration: editData.businessRegistration,
        tax_id: editData.taxId,
        established_date: editData.establishedDate,
        operating_hours: editData.operatingHours
      };

      const response = await fetch('http://localhost:3001/api/v1/agencies/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(backendData)
      });

      if (response.ok) {
        setProfileData(editData);
        setIsEditing(false);

        // Update user data in localStorage if name or email changed
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.name !== editData.contactPerson || user.email !== editData.email) {
          const updatedUser = {
            ...user,
            name: editData.contactPerson,
            email: editData.email
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        alert('Profile updated successfully!');
      } else {
        console.error('Failed to save agency profile:', response.statusText);
        alert('Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving agency profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const updateOperatingHours = (day: string, field: string, value: string | boolean) => {
    setEditData({
      ...editData,
      operatingHours: {
        ...editData.operatingHours,
        [day]: {
          ...editData.operatingHours[day as keyof typeof editData.operatingHours],
          [field]: value
        }
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Agency Profile</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agency Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profileData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.contactPerson}
                  onChange={(e) => setEditData({...editData, contactPerson: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{profileData.contactPerson}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{profileData.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{profileData.phone}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              {isEditing ? (
                <input
                  type="url"
                  value={editData.website}
                  onChange={(e) => setEditData({...editData, website: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-400 mr-2" />
                  <a href={`https://${profileData.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {profileData.website}
                  </a>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              {isEditing ? (
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.address}
                  onChange={(e) => setEditData({...editData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                  <div>
                    <p className="text-gray-900">{profileData.address}</p>
                    <p className="text-gray-900">{profileData.city}, {profileData.state}</p>
                    <p className="text-gray-900">{profileData.country} {profileData.postalCode}</p>
                  </div>
                </div>
              )}
            </div>

            {isEditing && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={editData.city}
                      onChange={(e) => setEditData({...editData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                    <input
                      type="text"
                      value={editData.state}
                      onChange={(e) => setEditData({...editData, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={editData.country}
                      onChange={(e) => setEditData({...editData, country: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={editData.postalCode}
                      onChange={(e) => setEditData({...editData, postalCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Registration</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.businessRegistration}
                  onChange={(e) => setEditData({...editData, businessRegistration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 font-mono">{profileData.businessRegistration}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.taxId}
                  onChange={(e) => setEditData({...editData, taxId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 font-mono">{profileData.taxId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Established Date</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editData.establishedDate}
                  onChange={(e) => setEditData({...editData, establishedDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{formatDate(profileData.establishedDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h3>
          
          <div className="space-y-3">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize w-20">
                  {day}
                </span>
                
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!editData.operatingHours[day as keyof typeof editData.operatingHours].closed}
                      onChange={(e) => updateOperatingHours(day, 'closed', !e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-500">Open</span>
                    
                    {!editData.operatingHours[day as keyof typeof editData.operatingHours].closed && (
                      <>
                        <input
                          type="time"
                          value={editData.operatingHours[day as keyof typeof editData.operatingHours].open}
                          onChange={(e) => updateOperatingHours(day, 'open', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={editData.operatingHours[day as keyof typeof editData.operatingHours].close}
                          onChange={(e) => updateOperatingHours(day, 'close', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-gray-900">
                    {profileData.operatingHours[day as keyof typeof profileData.operatingHours].closed
                      ? 'Closed'
                      : `${profileData.operatingHours[day as keyof typeof profileData.operatingHours].open} - ${profileData.operatingHours[day as keyof typeof profileData.operatingHours].close}`
                    }
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
