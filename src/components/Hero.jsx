import React, { memo } from 'react';
import { ArrowRight, Star, Users, Award, Heart } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';

const Hero = ({ onNavigateToBooking }) => {
  return (
    <section id="home" className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">🐕</div>
        <div className="absolute top-32 right-20 text-4xl">🐱</div>
        <div className="absolute bottom-20 left-20 text-5xl">🐾</div>
        <div className="absolute bottom-32 right-10 text-3xl">❤️</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 mr-2 fill-current" />
                {BUSINESS_INFO.tagline}
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Perawatan Terbaik untuk
                <span className="text-primary-600 block">Sahabat Berbulu</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Pawranger menyediakan layanan petshop dan grooming profesional dengan 
                fasilitas modern dan tim berpengalaman untuk memberikan perawatan terbaik 
                bagi hewan kesayangan Anda.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mx-auto mb-2">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">5000+</div>
                <div className="text-sm text-gray-600">Pelanggan Puas</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-full mx-auto mb-2">
                  <Award className="w-6 h-6 text-secondary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">10+</div>
                <div className="text-sm text-gray-600">Tahun Pengalaman</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Layanan Darurat</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onNavigateToBooking}
                className="bg-primary-600 text-white px-8 py-4 rounded-full hover:bg-primary-700 transition-all duration-300 font-semibold text-lg flex items-center justify-center group"
              >
                Booking Sekarang
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('services');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-full hover:bg-primary-600 hover:text-white transition-all duration-300 font-semibold text-lg"
              >
                Lihat Layanan
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">4.9/5 dari 1000+ review</span>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Image Placeholder */}
              <div className="bg-gradient-to-br from-primary-200 to-secondary-200 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 text-center">
                  <div className="text-8xl mb-4">🐕‍🦺</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Grooming Profesional</h3>
                  <p className="text-gray-600">Dengan peralatan modern dan tim berpengalaman</p>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Sertifikat Resmi</div>
                    <div className="text-sm text-gray-600">Groomer Bersertifikat</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Award Winner</div>
                    <div className="text-sm text-gray-600">Best Pet Care 2024</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-300 to-secondary-300 rounded-3xl transform rotate-6 scale-105 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Hero);