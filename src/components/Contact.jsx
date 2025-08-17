import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Calendar, User } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    petName: '',
    petType: '',
    service: '',
    date: '',
    message: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Nama lengkap wajib diisi';
        } else if (value.trim().length < 2) {
          errors.name = 'Nama harus minimal 2 karakter';
        }
        break;
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Format email tidak valid';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          errors.phone = 'Nomor telepon wajib diisi';
        } else if (!/^[+]?[0-9\s-()]{10,}$/.test(value)) {
          errors.phone = 'Format nomor telepon tidak valid';
        }
        break;
      case 'service':
        if (!value) {
          errors.service = 'Pilih layanan yang diinginkan';
        }
        break;
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear existing error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Validate field on change
    const fieldErrors = validateField(name, value);
    if (Object.keys(fieldErrors).length > 0) {
      setValidationErrors(prev => ({ ...prev, ...fieldErrors }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate required fields
    const nameErrors = validateField('name', formData.name);
    const emailErrors = validateField('email', formData.email);
    const phoneErrors = validateField('phone', formData.phone);
    const serviceErrors = validateField('service', formData.service);
    
    Object.assign(errors, nameErrors, emailErrors, phoneErrors, serviceErrors);
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Terima kasih! Kami akan menghubungi Anda segera.');
    
    // Reset form and errors
    setFormData({
      name: '',
      email: '',
      phone: '',
      petName: '',
      petType: '',
      service: '',
      date: '',
      message: ''
    });
    setValidationErrors({});
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Telepon",
      details: ["+62 812-3456-7890", "+62 21-1234-5678"],
      action: "Hubungi Sekarang"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["info@pawranger.com", "booking@pawranger.com"],
      action: "Kirim Email"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Alamat",
      details: ["Jl. Kemang Raya No. 123", "Jakarta Selatan 12560"],
      action: "Lihat Peta"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Jam Operasional",
      details: ["Senin - Minggu: 08:00 - 20:00", "Emergency: 24/7"],
      action: "Booking Online"
    }
  ];

  const services = [
    "Pet Grooming",
    "Pet Shop",
    "Konsultasi Kesehatan",
    "Pet Hotel",
    "Antar Jemput",
    "Spa Treatment"
  ];

  const petTypes = [
    "Anjing",
    "Kucing",
    "Kelinci",
    "Hamster",
    "Burung",
    "Lainnya"
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MessageCircle className="w-4 h-4 mr-2" />
            Hubungi Kami
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Siap Melayani
            <span className="text-primary-600 block">Hewan Kesayangan Anda</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hubungi kami untuk konsultasi gratis atau booking layanan. 
            Tim profesional kami siap membantu 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Informasi Kontak
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Kami siap membantu Anda dengan berbagai cara. Pilih metode komunikasi 
                yang paling nyaman untuk Anda.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:bg-primary-50 transition-colors group">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        {info.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h4>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-600 mb-1">{detail}</p>
                      ))}
                      <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors mt-2">
                        {info.action} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-primary-600 rounded-2xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">Butuh Bantuan Segera?</h4>
              <p className="mb-6 opacity-90">
                Untuk emergency atau konsultasi mendesak, hubungi hotline 24/7 kami.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Hotline 24/7
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-600 transition-colors flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-gray-50 rounded-3xl p-8">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Booking Online
              </h3>
              <p className="text-gray-600">
                Isi form di bawah untuk booking layanan atau konsultasi gratis.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                        validationErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                        validationErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="email@example.com"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+62 812-3456-7890"
                  />
                </div>
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
              </div>

              {/* Pet Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Hewan Peliharaan
                  </label>
                  <input
                    type="text"
                    name="petName"
                    value={formData.petName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Nama pet Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Hewan
                  </label>
                  <select
                    name="petType"
                    value={formData.petType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Pilih jenis hewan</option>
                    {petTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {validationErrors.service && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.service}</p>
                  )}
                </div>
              </div>

              {/* Service and Date */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Layanan yang Diinginkan *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      validationErrors.service ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Pilih layanan</option>
                    {services.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Diinginkan
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan Tambahan
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Ceritakan kebutuhan khusus atau pertanyaan Anda..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-4 rounded-xl hover:bg-primary-700 transition-colors font-semibold text-lg flex items-center justify-center group"
              >
                <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Kirim Booking Request
              </button>

              <p className="text-sm text-gray-600 text-center">
                * Kami akan menghubungi Anda dalam 1-2 jam untuk konfirmasi booking
              </p>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <div className="bg-gray-100 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Lokasi Kami
            </h3>
            <p className="text-gray-600 mb-8">
              Kunjungi langsung toko kami di Kemang, Jakarta Selatan
            </p>
            
            {/* Map Placeholder */}
            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-800">Pawranger Pet Care</p>
                <p className="text-gray-600">Jl. Kemang Raya No. 123, Jakarta Selatan</p>
                <button className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition-colors">
                  Buka di Google Maps
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;