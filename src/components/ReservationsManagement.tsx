import React, { useState } from 'react';
import { Calendar, User, Car, Clock, DollarSign, FileText, Check, X, Eye } from 'lucide-react';
import { ContractGenerator } from './ContractGenerator';

interface Reservation {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  carBrand: string;
  carModel: string;
  licensePlate: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  specialRequests?: string;
}

export const ReservationsManagement: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 'RES-001',
      clientName: 'Idriss Bennij',
      clientEmail: 'idriss@example.com',
      clientPhone: '+212 6 12 34 56 78',
      carBrand: 'Peugeot',
      carModel: '208',
      licensePlate: '2915-7-09',
      startDate: '2024-01-15',
      endDate: '2024-01-18',
      totalDays: 3,
      dailyRate: 150,
      totalAmount: 450,
      status: 'pending',
      createdAt: '2024-01-10T10:30:00Z',
      specialRequests: 'Need GPS navigation system'
    },
    {
      id: 'RES-002',
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah@example.com',
      clientPhone: '+212 6 98 76 54 32',
      carBrand: 'BMW',
      carModel: 'X5',
      licensePlate: 'ABC-123',
      startDate: '2024-01-20',
      endDate: '2024-01-25',
      totalDays: 5,
      dailyRate: 300,
      totalAmount: 1500,
      status: 'confirmed',
      createdAt: '2024-01-12T14:15:00Z'
    }
  ]);

  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showContractGenerator, setShowContractGenerator] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const handleApproveReservation = (reservationId: string) => {
    setReservations(prev => 
      prev.map(res => 
        res.id === reservationId 
          ? { ...res, status: 'confirmed' as const }
          : res
      )
    );
    
    // Show contract generator
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
      setSelectedReservation(reservation);
      setShowContractGenerator(true);
    }
  };

  const handleRejectReservation = (reservationId: string) => {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      setReservations(prev => 
        prev.map(res => 
          res.id === reservationId 
            ? { ...res, status: 'cancelled' as const }
            : res
        )
      );
    }
  };

  const handleGenerateContract = (contractData: any) => {
    console.log('Generating contract with data:', contractData);
    
    // Here you would typically:
    // 1. Send data to backend to generate PDF
    // 2. Save contract information
    // 3. Update reservation status
    
    alert('Contract generated successfully! (This would normally download a PDF)');
    setShowContractGenerator(false);
    setSelectedReservation(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReservations = reservations.filter(reservation => 
    statusFilter === 'all' || reservation.status === statusFilter
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reservations Management</h2>
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Reservations</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">
                {reservations.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">
                {reservations.filter(r => r.status === 'confirmed').length}
              </p>
            </div>
            <Check className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-600">
                ${reservations.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reservations</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{reservation.clientName}</div>
                        <div className="text-sm text-gray-500">{reservation.clientEmail}</div>
                        <div className="text-sm text-gray-500">{reservation.clientPhone}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Car className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.carBrand} {reservation.carModel}
                        </div>
                        <div className="text-sm text-gray-500">{reservation.licensePlate}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                    </div>
                    <div className="text-sm text-gray-500">{reservation.totalDays} days</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${reservation.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${reservation.dailyRate}/day
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {reservation.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveReservation(reservation.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Approve & Generate Contract"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectReservation(reservation.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      {reservation.status === 'confirmed' && (
                        <button
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowContractGenerator(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Generate Contract"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? 'No reservations have been made yet.' 
                : `No ${statusFilter} reservations found.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Contract Generator Modal */}
      {showContractGenerator && selectedReservation && (
        <ContractGenerator
          reservationId={selectedReservation.id}
          onClose={() => {
            setShowContractGenerator(false);
            setSelectedReservation(null);
          }}
          onGenerate={handleGenerateContract}
        />
      )}
    </div>
  );
};
