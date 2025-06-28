import React, { useState } from 'react';
import { FileText, Download, User, Car, Calendar, DollarSign, MapPin } from 'lucide-react';

interface ContractData {
  contractNumber: string;
  companyName: string;
  carBrand: string;
  carModel: string;
  licensePlate: string;
  startKm: number;
  rentalDuration: string;
  deliveryDate: string;
  deliveryTime: string;
  returnDate: string;
  returnTime: string;
  radio: 'Avec' | 'Sans';
  fuelLevel: string;
  
  // Driver 1 (Required)
  driver1Name: string;
  driver1Nationality: string;
  driver1Birthdate: string;
  driver1Address: string;
  driver1Phone: string;
  driver1License: string;
  driver1LicenseDate: string;
  driver1LicensePlace: string;
  driver1Cin: string;
  driver1CinDate: string;
  driver1CinPlace: string;
  
  // Driver 2 (Optional)
  driver2Name: string;
  driver2Nationality: string;
  driver2Birthdate: string;
  driver2Address: string;
  driver2Phone: string;
  driver2License: string;
  driver2LicenseDate: string;
  driver2LicensePlace: string;
  driver2Cin: string;
  driver2CinDate: string;
  driver2CinPlace: string;
  
  // Payment
  advancePayment: number;
  restPayment: number;
  tvaRate: number;
  totalTTC: number;
  
  // Store info
  storeAddress: string;
  storeEmail: string;
  storePhone: string;
}

interface ContractGeneratorProps {
  reservationId: string;
  onClose: () => void;
  onGenerate: (contractData: ContractData) => void;
}

export const ContractGenerator: React.FC<ContractGeneratorProps> = ({
  reservationId,
  onClose,
  onGenerate
}) => {
  const [activeTab, setActiveTab] = useState('vehicle');
  const [includeDriver2, setIncludeDriver2] = useState(false);
  
  const [contractData, setContractData] = useState<ContractData>({
    contractNumber: `CR-${Date.now()}`,
    companyName: 'CALABRIA LUXURY CAR',
    carBrand: '',
    carModel: '',
    licensePlate: '',
    startKm: 0,
    rentalDuration: '',
    deliveryDate: '',
    deliveryTime: '09:00',
    returnDate: '',
    returnTime: '18:00',
    radio: 'Avec',
    fuelLevel: 'Full',
    
    driver1Name: '',
    driver1Nationality: 'Marocaine',
    driver1Birthdate: '',
    driver1Address: '',
    driver1Phone: '',
    driver1License: '',
    driver1LicenseDate: '',
    driver1LicensePlace: '',
    driver1Cin: '',
    driver1CinDate: '',
    driver1CinPlace: '',
    
    driver2Name: '',
    driver2Nationality: 'Marocaine',
    driver2Birthdate: '',
    driver2Address: '',
    driver2Phone: '',
    driver2License: '',
    driver2LicenseDate: '',
    driver2LicensePlace: '',
    driver2Cin: '',
    driver2CinDate: '',
    driver2CinPlace: '',
    
    advancePayment: 0,
    restPayment: 0,
    tvaRate: 20,
    totalTTC: 0,
    
    storeAddress: 'Magasin N°04, Al Khouzama 3 Lissasfa – Casablanca',
    storeEmail: 'calabrialuxurycar@gmail.com',
    storePhone: '06 61 555 765'
  });

  const updateField = (field: keyof ContractData, value: any) => {
    setContractData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate total TTC when payment fields change
      if (field === 'advancePayment' || field === 'restPayment' || field === 'tvaRate') {
        const subtotal = updated.advancePayment + updated.restPayment;
        const tva = subtotal * (updated.tvaRate / 100);
        updated.totalTTC = subtotal + tva;
      }
      
      return updated;
    });
  };

  const calculateDuration = () => {
    if (contractData.deliveryDate && contractData.returnDate) {
      const start = new Date(contractData.deliveryDate);
      const end = new Date(contractData.returnDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      updateField('rentalDuration', `${diffDays}.0 jours`);
    }
  };

  const validateForm = () => {
    const required = [
      'carBrand', 'carModel', 'licensePlate', 'deliveryDate', 'returnDate',
      'driver1Name', 'driver1Nationality', 'driver1Birthdate', 'driver1Address',
      'driver1Phone', 'driver1License', 'driver1Cin'
    ];
    
    return required.every(field => contractData[field as keyof ContractData]);
  };

  const handleGenerate = () => {
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }
    
    onGenerate(contractData);
  };

  const tabs = [
    { id: 'vehicle', label: 'Vehicle Info', icon: Car },
    { id: 'driver1', label: 'Driver 1', icon: User },
    { id: 'driver2', label: 'Driver 2', icon: User },
    { id: 'payment', label: 'Payment', icon: DollarSign }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Generate Rental Contract</h2>
              <p className="text-gray-600">Reservation ID: {reservationId}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Vehicle Information Tab */}
          {activeTab === 'vehicle' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contract Number</label>
                  <input
                    type="text"
                    value={contractData.contractNumber}
                    onChange={(e) => updateField('contractNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={contractData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Car Brand *</label>
                  <input
                    type="text"
                    value={contractData.carBrand}
                    onChange={(e) => updateField('carBrand', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Peugeot"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Car Model *</label>
                  <input
                    type="text"
                    value={contractData.carModel}
                    onChange={(e) => updateField('carModel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 208"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Plate *</label>
                  <input
                    type="text"
                    value={contractData.licensePlate}
                    onChange={(e) => updateField('licensePlate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2915-7-09"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Starting Kilometers</label>
                  <input
                    type="number"
                    value={contractData.startKm}
                    onChange={(e) => updateField('startKm', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date *</label>
                  <input
                    type="date"
                    value={contractData.deliveryDate}
                    onChange={(e) => {
                      updateField('deliveryDate', e.target.value);
                      setTimeout(calculateDuration, 100);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                  <input
                    type="time"
                    value={contractData.deliveryTime}
                    onChange={(e) => updateField('deliveryTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return Date *</label>
                  <input
                    type="date"
                    value={contractData.returnDate}
                    onChange={(e) => {
                      updateField('returnDate', e.target.value);
                      setTimeout(calculateDuration, 100);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return Time</label>
                  <input
                    type="time"
                    value={contractData.returnTime}
                    onChange={(e) => updateField('returnTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={contractData.rentalDuration}
                    onChange={(e) => updateField('rentalDuration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Auto-calculated"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Radio Option</label>
                  <select
                    value={contractData.radio}
                    onChange={(e) => updateField('radio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Avec">Avec (With)</option>
                    <option value="Sans">Sans (Without)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Level</label>
                  <select
                    value={contractData.fuelLevel}
                    onChange={(e) => updateField('fuelLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Full">Full</option>
                    <option value="3/4">3/4</option>
                    <option value="1/2">1/2</option>
                    <option value="1/4">1/4</option>
                    <option value="Empty">Empty</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Driver 1 Tab */}
          {activeTab === 'driver1' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Primary Driver Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={contractData.driver1Name}
                    onChange={(e) => updateField('driver1Name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Idriss Bennij"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
                  <input
                    type="text"
                    value={contractData.driver1Nationality}
                    onChange={(e) => updateField('driver1Nationality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date *</label>
                  <input
                    type="date"
                    value={contractData.driver1Birthdate}
                    onChange={(e) => updateField('driver1Birthdate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={contractData.driver1Phone}
                    onChange={(e) => updateField('driver1Phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address in Morocco *</label>
                  <textarea
                    value={contractData.driver1Address}
                    onChange={(e) => updateField('driver1Address', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Rue 200 N°306 S.R.K Oufa Casablanca"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Driving License No *</label>
                  <input
                    type="text"
                    value={contractData.driver1License}
                    onChange={(e) => updateField('driver1License', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Issue Date</label>
                  <input
                    type="date"
                    value={contractData.driver1LicenseDate}
                    onChange={(e) => updateField('driver1LicenseDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Issue Place</label>
                  <input
                    type="text"
                    value={contractData.driver1LicensePlace}
                    onChange={(e) => updateField('driver1LicensePlace', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passport or CIN *</label>
                  <input
                    type="text"
                    value={contractData.driver1Cin}
                    onChange={(e) => updateField('driver1Cin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., BK650210"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CIN Issue Date</label>
                  <input
                    type="date"
                    value={contractData.driver1CinDate}
                    onChange={(e) => updateField('driver1CinDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CIN Issue Place</label>
                  <input
                    type="text"
                    value={contractData.driver1CinPlace}
                    onChange={(e) => updateField('driver1CinPlace', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Driver 2 Tab */}
          {activeTab === 'driver2' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Secondary Driver Information</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeDriver2}
                    onChange={(e) => setIncludeDriver2(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include second driver</span>
                </label>
              </div>
              
              {includeDriver2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Similar fields as Driver 1 but for driver2 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={contractData.driver2Name}
                      onChange={(e) => updateField('driver2Name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                    <input
                      type="text"
                      value={contractData.driver2Nationality}
                      onChange={(e) => updateField('driver2Nationality', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Add more driver2 fields as needed */}
                </div>
              )}
              
              {!includeDriver2 && (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Check the box above to add a second driver to the contract.</p>
                </div>
              )}
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advance Paid (DH)</label>
                  <input
                    type="number"
                    value={contractData.advancePayment}
                    onChange={(e) => updateField('advancePayment', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 3000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remaining Amount (DH)</label>
                  <input
                    type="number"
                    value={contractData.restPayment}
                    onChange={(e) => updateField('restPayment', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 3500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">TVA Rate (%)</label>
                  <input
                    type="number"
                    value={contractData.tvaRate}
                    onChange={(e) => updateField('tvaRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total TTC (DH)</label>
                  <input
                    type="number"
                    value={contractData.totalTTC}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Payment Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Advance Payment:</span>
                    <span>{contractData.advancePayment.toLocaleString()} DH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining Amount:</span>
                    <span>{contractData.restPayment.toLocaleString()} DH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{(contractData.advancePayment + contractData.restPayment).toLocaleString()} DH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA ({contractData.tvaRate}%):</span>
                    <span>{((contractData.advancePayment + contractData.restPayment) * (contractData.tvaRate / 100)).toLocaleString()} DH</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-1">
                    <span>Total TTC:</span>
                    <span>{contractData.totalTTC.toLocaleString()} DH</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>* Required fields must be completed</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={!validateForm()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Contract
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
