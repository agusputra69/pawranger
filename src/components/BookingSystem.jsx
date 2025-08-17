import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, Check, X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { createBooking, supabase } from '../lib/supabase';

const BookingSystem = ({ user, onLogin }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookingStep, setBookingStep] = useState(1); // 1: Service, 2: DateTime, 3: Details, 4: Confirmation
  const [bookingData, setBookingData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    petName: '',
    petType: '',
    petBreed: '',
    petAge: '',
    specialNotes: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  // const [loading, setLoading] = useState(false); // Removed unused state
  const [error, setError] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  const services = [
    {
      id: 'grooming-basic',
      name: 'Grooming Basic',
      description: 'Mandi, potong kuku, bersihkan telinga',
      duration: '1-2 jam',
      price: 75000,
      icon: '🛁',
      category: 'grooming',
      features: ['Mandi dengan shampo khusus', 'Potong kuku', 'Bersihkan telinga', 'Blow dry']
    },
    {
      id: 'grooming-premium',
      name: 'Grooming Premium',
      description: 'Grooming lengkap + styling + perawatan bulu',
      duration: '2-3 jam',
      price: 150000,
      icon: '✨',
      category: 'grooming',
      features: ['Semua layanan basic', 'Styling & trimming', 'Perawatan bulu khusus', 'Parfum pet', 'Foto hasil grooming']
    },
    {
      id: 'vet-checkup',
      name: 'Pemeriksaan Kesehatan',
      description: 'Pemeriksaan rutin oleh dokter hewan',
      duration: '30-45 menit',
      price: 100000,
      icon: '🩺',
      category: 'veterinary',
      features: ['Pemeriksaan fisik lengkap', 'Konsultasi kesehatan', 'Saran perawatan', 'Resep obat jika diperlukan']
    },
    {
      id: 'vaccination',
      name: 'Vaksinasi',
      description: 'Vaksinasi lengkap sesuai jadwal',
      duration: '30 menit',
      price: 200000,
      icon: '💉',
      category: 'veterinary',
      features: ['Vaksin berkualitas tinggi', 'Pemeriksaan pre-vaksin', 'Sertifikat vaksinasi', 'Jadwal vaksin berikutnya']
    },
    {
      id: 'dental-care',
      name: 'Perawatan Gigi',
      description: 'Pembersihan dan perawatan gigi profesional',
      duration: '1-1.5 jam',
      price: 250000,
      icon: '🦷',
      category: 'veterinary',
      features: ['Scaling gigi profesional', 'Pemeriksaan mulut', 'Pembersihan karang gigi', 'Konsultasi dental']
    },
    {
      id: 'spa-treatment',
      name: 'Spa Treatment',
      description: 'Perawatan relaksasi dan kecantikan premium',
      duration: '2-3 jam',
      price: 300000,
      icon: '🧖‍♀️',
      category: 'spa',
      features: ['Aromatherapy bath', 'Massage therapy', 'Masker bulu', 'Manicure & pedicure', 'Relaxation session']
    }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  // Fetch booked slots for a specific date
  const fetchBookedSlots = async (date) => {
    if (!date) return;
    
    try {
      const dateString = date.toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('bookings')
        .select('appointment_time')
        .eq('appointment_date', dateString)
        .in('status', ['confirmed', 'pending']);
      
      if (error) {
        console.error('Error fetching booked slots:', error);
        return;
      }
      
      setBookedSlots(data.map(booking => booking.appointment_time));
    } catch (err) {
      console.error('Error fetching booked slots:', err);
    }
  };

  // Check if a time slot is available
  const isTimeSlotAvailable = (time) => {
    return !bookedSlots.includes(time);
  };

  // Load booked slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getDaysInMonth = (date) => {
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
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateAvailable = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && date.getDay() !== 0; // Not Sunday and not in the past
  };

  const handleDateSelect = (date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
    }
  };

  const validateField = (field, value) => {
    const errors = {};
    
    switch (field) {
      case 'customerName':
        if (!value.trim()) {
          errors.customerName = 'Nama lengkap wajib diisi';
        } else if (value.trim().length < 2) {
          errors.customerName = 'Nama minimal 2 karakter';
        }
        break;
      case 'customerPhone':
        if (!value.trim()) {
          errors.customerPhone = 'Nomor telepon wajib diisi';
        } else if (!/^[0-9+\-\s()]{10,15}$/.test(value.replace(/\s/g, ''))) {
          errors.customerPhone = 'Format nomor telepon tidak valid';
        }
        break;
      case 'customerEmail':
        if (!value.trim()) {
          errors.customerEmail = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.customerEmail = 'Format email tidak valid';
        }
        break;
      case 'petName':
        if (!value.trim()) {
          errors.petName = 'Nama hewan peliharaan wajib diisi';
        }
        break;
      case 'petType':
        if (!value.trim()) {
          errors.petType = 'Jenis hewan peliharaan wajib diisi';
        }
        break;
      case 'petAge':
        if (value && (isNaN(value) || parseInt(value) < 0 || parseInt(value) > 30)) {
          errors.petAge = 'Umur harus berupa angka antara 0-30 tahun';
        }
        break;
    }
    
    return errors;
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Validate field on blur (when user moves to next field)
    const fieldErrors = validateField(field, value);
    if (Object.keys(fieldErrors).length > 0) {
      setValidationErrors(prev => ({ ...prev, ...fieldErrors }));
    }
  };

  const handleSubmitBooking = async () => {
    if (!user) {
      setError('Please login to make a booking');
      if (onLogin) onLogin();
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const bookingPayload = {
        user_id: user.id,
        service_type: selectedService.name,
        appointment_date: selectedDate.toISOString().split('T')[0],
        appointment_time: selectedTime,
        customer_name: bookingData.customerName,
        customer_phone: bookingData.customerPhone,
        customer_email: bookingData.customerEmail,
        pet_name: bookingData.petName,
        pet_type: bookingData.petType,
        pet_breed: bookingData.petBreed,
        pet_age: parseInt(bookingData.petAge),
        special_notes: bookingData.specialNotes,
        total_price: selectedService.price,
        status: 'pending'
      };

      const result = await createBooking(bookingPayload);
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      setBookingId(result.data.id);
      setBookingComplete(true);
      setBookingStep(4);
      
      // Refresh booked slots after successful booking
      await fetchBookedSlots(selectedDate);
      
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBooking = () => {
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingStep(1);
    setBookingData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      petName: '',
      petType: '',
      petBreed: '',
      petAge: '',
      specialNotes: ''
    });
    setBookingComplete(false);
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 3) {
      // Validate all required fields for step 3
      const requiredFields = ['customerName', 'customerPhone', 'customerEmail', 'petName', 'petType'];
      
      requiredFields.forEach(field => {
        const fieldErrors = validateField(field, bookingData[field]);
        Object.assign(errors, fieldErrors);
      });
      
      // Validate pet age if provided
      if (bookingData.petAge) {
        const ageErrors = validateField('petAge', bookingData.petAge);
        Object.assign(errors, ageErrors);
      }
    }
    
    return errors;
  };

  const canProceedToNext = () => {
    switch (bookingStep) {
      case 1:
        return selectedService !== null;
      case 2:
        return selectedDate !== null && selectedTime !== null;
      case 3: {
         const errors = validateStep(3);
         return Object.keys(errors).length === 0;
       }
      default:
        return false;
    }
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Booking Berhasil!
          </h2>
          
          <p className="text-gray-600 mb-2">
            Terima kasih {bookingData.customerName}! Booking Anda untuk {selectedService?.name} 
            pada {selectedDate?.toLocaleDateString('id-ID')} pukul {selectedTime} telah dikonfirmasi.
          </p>
          
          {bookingId && (
            <p className="text-sm text-gray-500 mb-6">Booking ID: <span className="font-mono font-medium">{bookingId}</span></p>
          )}
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Detail Booking:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Layanan:</strong> {selectedService?.name}</p>
              <p><strong>Tanggal:</strong> {selectedDate?.toLocaleDateString('id-ID')}</p>
              <p><strong>Waktu:</strong> {selectedTime}</p>
              <p><strong>Pet:</strong> {bookingData.petName} ({bookingData.petType})</p>
              <p><strong>Status:</strong> <span className="text-yellow-600">Pending Confirmation</span></p>
              <p><strong>Total:</strong> {formatPrice(selectedService?.price)}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Kami akan mengirim konfirmasi via WhatsApp ke {bookingData.customerPhone}
            </p>
            
            <button
              onClick={resetBooking}
              className="w-full bg-primary-600 text-white py-3 rounded-full hover:bg-primary-700 transition-colors font-semibold"
            >
              Booking Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Booking Layanan Pet Care
          </h1>
          <p className="text-xl text-gray-600">
            Jadwalkan layanan terbaik untuk hewan peliharaan Anda
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <X className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: 1, title: 'Pilih Layanan' },
              { step: 2, title: 'Tanggal & Waktu' },
              { step: 3, title: 'Detail Booking' },
              { step: 4, title: 'Konfirmasi' }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  bookingStep >= item.step 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {bookingStep > item.step ? <Check className="w-5 h-5" /> : item.step}
                </div>
                <span className={`ml-2 font-medium ${
                  bookingStep >= item.step ? 'text-primary-600' : 'text-gray-600'
                }`}>
                  {item.title}
                </span>
                {index < 3 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    bookingStep > item.step ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Service Selection */}
          {bookingStep === 1 && (
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Pilih Layanan
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedService?.id === service.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{service.icon}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration}</span>
                        </div>
                        <div className="font-bold text-primary-600">
                          {formatPrice(service.price)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm">Termasuk:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-center space-x-2">
                            <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {bookingStep === 2 && (
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Pilih Tanggal & Waktu
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-lg font-semibold">
                      {currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(currentMonth).map((date, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(date)}
                        disabled={!isDateAvailable(date)}
                        className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                          !date
                            ? 'invisible'
                            : !isDateAvailable(date)
                            ? 'text-gray-300 cursor-not-allowed'
                            : selectedDate && date.toDateString() === selectedDate.toDateString()
                            ? 'bg-primary-600 text-white'
                            : 'hover:bg-primary-100 text-gray-700'
                        }`}
                      >
                        {date?.getDate()}
                      </button>
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-4">
                    * Layanan tidak tersedia pada hari Minggu
                  </p>
                </div>
                
                {/* Time Slots */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Pilih Waktu</h3>
                  
                  {selectedDate ? (
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map((time) => {
                        const isAvailable = isTimeSlotAvailable(time);
                        return (
                          <button
                            key={time}
                            onClick={() => isAvailable && setSelectedTime(time)}
                            disabled={!isAvailable}
                            className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                              !isAvailable
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : selectedTime === time
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-primary-100'
                            }`}
                          >
                            {time}
                            {!isAvailable && (
                              <div className="text-xs mt-1 text-gray-400">Booked</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Pilih tanggal terlebih dahulu</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Booking Details */}
          {bookingStep === 3 && (
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Detail Booking
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informasi Pemilik</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        value={bookingData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          validationErrors.customerName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Masukkan nama lengkap"
                      />
                      {validationErrors.customerName && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.customerName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={bookingData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          validationErrors.customerPhone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="08xxxxxxxxxx"
                      />
                      {validationErrors.customerPhone && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.customerPhone}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={bookingData.customerEmail}
                        onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          validationErrors.customerEmail ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="email@example.com"
                      />
                      {validationErrors.customerEmail && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.customerEmail}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Pet Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informasi Pet</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Pet *
                      </label>
                      <input
                        type="text"
                        value={bookingData.petName}
                        onChange={(e) => handleInputChange('petName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          validationErrors.petName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Nama hewan peliharaan"
                      />
                      {validationErrors.petName && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.petName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jenis Hewan *
                      </label>
                      <select
                        value={bookingData.petType}
                        onChange={(e) => handleInputChange('petType', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          validationErrors.petType ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Pilih jenis hewan</option>
                        <option value="Anjing">Anjing</option>
                        <option value="Kucing">Kucing</option>
                        <option value="Kelinci">Kelinci</option>
                        <option value="Hamster">Hamster</option>
                        <option value="Burung">Burung</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      {validationErrors.petType && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.petType}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ras/Breed
                      </label>
                      <input
                        type="text"
                        value={bookingData.petBreed}
                        onChange={(e) => handleInputChange('petBreed', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Contoh: Golden Retriever, Persian"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Umur (tahun)
                      </label>
                      <input
                        type="number"
                        value={bookingData.petAge}
                        onChange={(e) => handleInputChange('petAge', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          validationErrors.petAge ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Contoh: 2"
                        min="0"
                        max="30"
                      />
                      {validationErrors.petAge && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.petAge}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Special Notes */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Khusus
                </label>
                <textarea
                  value={bookingData.specialNotes}
                  onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Kondisi khusus, alergi, atau permintaan khusus lainnya..."
                />
              </div>
              
              {/* Booking Summary */}
              <div className="mt-6 bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Booking</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Layanan:</span>
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal:</span>
                    <span className="font-medium">{selectedDate?.toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waktu:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durasi:</span>
                    <span className="font-medium">{selectedService?.duration}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary-600">{formatPrice(selectedService?.price)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setBookingStep(prev => Math.max(prev - 1, 1))}
              disabled={bookingStep === 1}
              className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Kembali
            </button>
            
            {bookingStep < 3 ? (
              <button
                onClick={() => setBookingStep(prev => prev + 1)}
                disabled={!canProceedToNext()}
                className="px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Lanjut
              </button>
            ) : (
              <button
                onClick={handleSubmitBooking}
                disabled={!canProceedToNext() || isSubmitting}
                className="px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Konfirmasi Booking</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;