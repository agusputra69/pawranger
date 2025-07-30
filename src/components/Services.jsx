import { Scissors, ShoppingBag, Stethoscope, Home, Car, Heart } from 'lucide-react';

const Services = ({ onNavigateToBooking }) => {
  const services = [
    {
      icon: <Scissors className="w-8 h-8" />,
      title: "Pet Grooming",
      description: "Layanan grooming lengkap dengan peralatan modern dan groomer berpengalaman",
      features: ["Mandi & Blow Dry", "Potong Kuku", "Pembersihan Telinga", "Styling Bulu"],
      price: "Mulai dari Rp 75.000",
      popular: true
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Pet Shop",
      description: "Toko lengkap dengan berbagai kebutuhan hewan peliharaan berkualitas tinggi",
      features: ["Makanan Premium", "Mainan & Aksesoris", "Vitamin & Suplemen", "Peralatan Grooming"],
      price: "Harga Terjangkau",
      popular: false
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Konsultasi Kesehatan",
      description: "Konsultasi dengan dokter hewan berpengalaman untuk kesehatan optimal",
      features: ["Pemeriksaan Rutin", "Vaksinasi", "Konsultasi Online", "Emergency Care"],
      price: "Mulai dari Rp 100.000",
      popular: false
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Pet Hotel",
      description: "Tempat penitipan yang aman dan nyaman dengan fasilitas lengkap",
      features: ["Kamar AC", "Area Bermain", "Makanan Teratur", "CCTV 24 Jam"],
      price: "Mulai dari Rp 50.000/hari",
      popular: false
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Antar Jemput",
      description: "Layanan antar jemput untuk kemudahan dan kenyamanan Anda",
      features: ["Mobil Ber-AC", "Kandang Aman", "Area Jakarta", "Jadwal Fleksibel"],
      price: "Mulai dari Rp 25.000",
      popular: false
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Spa Treatment",
      description: "Perawatan spa khusus untuk relaksasi dan kesehatan kulit hewan",
      features: ["Aromaterapi", "Massage", "Masker Alami", "Perawatan Kulit"],
      price: "Mulai dari Rp 150.000",
      popular: false
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Scissors className="w-4 h-4 mr-2" />
            Layanan Kami
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Layanan Terlengkap untuk
            <span className="text-primary-600 block">Hewan Kesayangan</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kami menyediakan berbagai layanan profesional dengan standar internasional 
            untuk memastikan hewan peliharaan Anda mendapatkan perawatan terbaik.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group ${
                service.popular ? 'ring-2 ring-primary-500 transform scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Paling Populer
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                service.popular ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-600'
              } group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                
                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {/* Price */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-lg font-semibold text-primary-600">{service.price}</div>
                </div>
                
                {/* CTA Button */}
                <button 
                  onClick={onNavigateToBooking}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    service.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-primary-600 hover:text-white'
                  }`}
                >
                  Booking Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Butuh Konsultasi Khusus?
            </h3>
            <p className="text-gray-600 mb-6">
              Tim ahli kami siap membantu Anda menentukan layanan terbaik 
              sesuai kebutuhan hewan peliharaan Anda.
            </p>
            <button 
              onClick={onNavigateToBooking}
              className="bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition-colors font-semibold"
            >
              Booking Konsultasi
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;