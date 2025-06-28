import React, { useState, useEffect } from 'react';
import {
  Calendar, ChevronLeft, ChevronRight, Car, Filter,
  Search, MapPin, Fuel, Users, Settings, Eye
} from 'lucide-react';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  fuel_type: string;
  transmission: string;
  seats: number;
  daily_rate: number;
  location: string;
  status: 'available' | 'rented' | 'maintenance';
  image_url?: string;
}

interface Reservation {
  id: string;
  car_id: string;
  start_date: string;
  end_date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  client_name: string;
}

export const CarAvailabilityCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cars, setCars] = useState<Car[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    status: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with API calls
  useEffect(() => {
    const mockCars: Car[] = [
      {
        id: '1',
        make: 'BMW',
        model: 'X5',
        year: 2023,
        category: 'SUV',
        fuel_type: 'Gasoline',
        transmission: 'Automatic',
        seats: 5,
        daily_rate: 120,
        location: 'Downtown',
        status: 'available',
        image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=200&fit=crop'
      },
      {
        id: '2',
        make: 'Mercedes',
        model: 'C-Class',
        year: 2023,
        category: 'Sedan',
        fuel_type: 'Gasoline',
        transmission: 'Automatic',
        seats: 5,
        daily_rate: 100,
        location: 'Airport',
        status: 'available',
        image_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&h=200&fit=crop'
      },
      {
        id: '3',
        make: 'Audi',
        model: 'A4',
        year: 2022,
        category: 'Sedan',
        fuel_type: 'Gasoline',
        transmission: 'Automatic',
        seats: 5,
        daily_rate: 90,
        location: 'Downtown',
        status: 'rented',
        image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=300&h=200&fit=crop'
      }
    ];

    const mockReservations: Reservation[] = [
      {
        id: '1',
        car_id: '3',
        start_date: '2024-12-20',
        end_date: '2024-12-25',
        status: 'confirmed',
        client_name: 'John Doe'
      }
    ];

    setCars(mockCars);
    setReservations(mockReservations);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isCarAvailable = (carId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return !reservations.some(reservation => 
      reservation.car_id === carId &&
      reservation.status === 'confirmed' &&
      dateStr >= reservation.start_date &&
      dateStr <= reservation.end_date
    );
  };

  const getAvailableCarsForDate = (date: Date) => {
    return filteredCars.filter(car => 
      car.status !== 'maintenance' && isCarAvailable(car.id, date)
    );
  };

  const filteredCars = cars.filter(car => {
    return (
      (filters.category === '' || car.category === filters.category) &&
      (filters.location === '' || car.location === filters.location) &&
      (filters.status === '' || car.status === filters.status) &&
      (filters.search === '' || 
        car.make.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.model.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const availableCarsForSelectedDate = getAvailableCarsForDate(selectedDate);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Availability Calendar</h1>
          <p className="text-gray-600">View and manage your fleet availability</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cars..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                <option value="Downtown">Downtown</option>
                <option value="Airport">Airport</option>
                <option value="Mall">Mall</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{monthYear}</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="p-2"></div>;
              }
              
              const isSelected = day.toDateString() === selectedDate.toDateString();
              const isToday = day.toDateString() === new Date().toDateString();
              const availableCars = getAvailableCarsForDate(day);
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`p-2 text-sm rounded-lg transition-colors relative ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : isToday
                      ? 'bg-blue-100 text-blue-600'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div>{day.getDate()}</div>
                  <div className="text-xs mt-1">
                    {availableCars.length > 0 && (
                      <span className={`inline-block w-1 h-1 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-green-500'
                      }`}></span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Available Cars for Selected Date */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Available Cars - {formatDate(selectedDate)}
          </h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {availableCarsForSelectedDate.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Car className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No cars available for this date</p>
              </div>
            ) : (
              availableCarsForSelectedDate.map(car => (
                <div key={car.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <img
                      src={car.image_url || '/placeholder-car.jpg'}
                      alt={`${car.make} ${car.model}`}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {car.make} {car.model} ({car.year})
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {car.location}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {car.seats} seats
                        </span>
                        <span className="flex items-center">
                          <Fuel className="h-3 w-3 mr-1" />
                          {car.fuel_type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-blue-600">
                          ${car.daily_rate}/day
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          car.status === 'available' 
                            ? 'bg-green-100 text-green-800'
                            : car.status === 'rented'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {car.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
