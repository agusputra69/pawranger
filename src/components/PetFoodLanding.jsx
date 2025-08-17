import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Star, Truck, Shield, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { ORDER_CONFIG } from '../constants';

const PetFoodLanding = ({ onNavigateToEcommerce }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Kualitas Terjamin',
      description: 'Semua produk telah tersertifikasi dan aman untuk hewan peliharaan Anda'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Pengiriman Cepat',
      description: `Gratis ongkir untuk pembelian di atas Rp ${ORDER_CONFIG.freeShippingThreshold.toLocaleString('id-ID')} ke seluruh Indonesia`
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Brand Terpercaya',
      description: 'Menyediakan produk dari brand-brand ternama dan terpercaya dunia'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Wijaya',
      pet: 'Golden Retriever - Max',
      rating: 5,
      comment: 'Makanan anjingnya berkualitas tinggi, Max jadi lebih sehat dan aktif!',
      image: '👩‍💼'
    },
    {
      name: 'Budi Santoso',
      pet: 'Persian Cat - Luna',
      rating: 5,
      comment: 'Pelayanan sangat memuaskan, pengiriman cepat dan produk original.',
      image: '👨‍💻'
    },
    {
      name: 'Maya Putri',
      pet: 'Labrador - Rocky',
      rating: 5,
      comment: 'Harga terjangkau dengan kualitas premium. Sangat recommended!',
      image: '👩‍🎨'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Pelanggan Puas' },
    { number: '500+', label: 'Produk Berkualitas' },
    { number: '50+', label: 'Brand Terpercaya' },
    { number: '99%', label: 'Tingkat Kepuasan' }
  ];



  return (
    <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent-200 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Hero Section */}
        <div className={`text-center mb-20 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="inline-flex items-center bg-primary-100 text-primary-800 px-6 py-3 rounded-full text-sm font-medium mb-6 animate-bounce">
            <Heart className="w-4 h-4 mr-2 text-red-500" />
            Nutrisi Terbaik untuk Sahabat Anda
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Toko Online
            <span className="text-primary-600 block">Makanan Pet</span>
            <span className="text-secondary-600">Terlengkap</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Berikan yang terbaik untuk hewan peliharaan kesayangan Anda. 
            Ribuan produk berkualitas tinggi dari brand terpercaya dunia 
            dengan harga terjangkau dan pengiriman ke seluruh Indonesia.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onNavigateToEcommerce}
              className="bg-primary-600 text-white px-8 py-4 rounded-full hover:bg-primary-700 transition-all duration-300 font-semibold text-lg flex items-center space-x-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="w-6 h-6" />
              <span>Mulai Belanja</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="bg-white text-primary-600 px-8 py-4 rounded-full hover:bg-primary-50 transition-all duration-300 font-semibold text-lg border-2 border-primary-600 transform hover:scale-105"
            >
              Konsultasi Gratis
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className={`mb-20 transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
            Mengapa Memilih <span className="text-primary-600">Pawranger?</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className={`mb-20 transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
            Apa Kata <span className="text-primary-600">Pelanggan Kami?</span>
          </h2>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="text-6xl mb-4">{testimonials[currentSlide].image}</div>
              
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                "{testimonials[currentSlide].comment}"
              </blockquote>
              
              <div className="border-t pt-6">
                <div className="font-bold text-gray-900 text-lg">
                  {testimonials[currentSlide].name}
                </div>
                <div className="text-primary-600 font-medium">
                  Pemilik {testimonials[currentSlide].pet}
                </div>
              </div>
            </div>
            
            {/* Carousel Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Categories Preview */}
        <div className={`mb-20 transform transition-all duration-1000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
            Kategori <span className="text-primary-600">Produk Kami</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: '🐕', name: 'Makanan Anjing', count: '150+' },
              { icon: '🐱', name: 'Makanan Kucing', count: '120+' },
              { icon: '🦴', name: 'Snack & Treats', count: '80+' },
              { icon: '💊', name: 'Vitamin', count: '45+' },
              { icon: '🎾', name: 'Mainan', count: '60+' },
              { icon: '🏠', name: 'Aksesoris', count: '90+' }
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group transform hover:-translate-y-2 cursor-pointer"
                   onClick={onNavigateToEcommerce}>
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">
                  {category.name}
                </h3>
                <p className="text-primary-600 font-semibold text-xs">
                  {category.count} produk
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center transform transition-all duration-1000 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Siap Memberikan yang Terbaik untuk Pet Anda?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Bergabunglah dengan ribuan pet owner yang sudah mempercayai Pawranger 
              untuk kebutuhan nutrisi hewan peliharaan mereka.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={onNavigateToEcommerce}
                className="bg-white text-primary-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 font-semibold text-lg flex items-center space-x-2 transform hover:scale-105 shadow-lg"
              >
                <ShoppingBag className="w-6 h-6" />
                <span>Jelajahi Produk</span>
              </button>
              
              <div className="flex items-center space-x-2 text-white">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Gratis konsultasi nutrisi pet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetFoodLanding;