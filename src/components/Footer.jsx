import { Heart, Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Beranda', href: '#home' },
    { name: 'Layanan', href: '#services' },
    { name: 'Tentang Kami', href: '#about' },
    { name: 'Galeri', href: '#gallery' },
    { name: 'Kontak', href: '#contact' }
  ];

  const services = [
    { name: 'Pet Grooming', href: '#services' },
    { name: 'Pet Shop', href: '#services' },
    { name: 'Konsultasi Kesehatan', href: '#services' },
    { name: 'Pet Hotel', href: '#services' },
    { name: 'Antar Jemput', href: '#services' },
    { name: 'Spa Treatment', href: '#services' }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', name: 'Facebook' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', name: 'Instagram' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', name: 'Twitter' },
    { icon: <Youtube className="w-5 h-5" />, href: '#', name: 'YouTube' }
  ];

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      text: '+62 812-3456-7890'
    },
    {
      icon: <Mail className="w-5 h-5" />,
      text: 'info@pawranger.com'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      text: 'Jl. Kemang Raya No. 123, Jakarta Selatan'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      text: 'Senin - Minggu: 08:00 - 20:00'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center mr-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Pawranger</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Pawranger adalah pusat perawatan hewan terpercaya dengan pengalaman lebih dari 10 tahun. 
              Kami berkomitmen memberikan layanan terbaik untuk hewan kesayangan Anda.
            </p>
            
            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-4">Ikuti Kami</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors group"
                    aria-label={social.name}
                  >
                    <span className="text-gray-400 group-hover:text-white transition-colors">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Menu Utama</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group"
                  >
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Layanan Kami</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group"
                  >
                    <span className="w-2 h-2 bg-secondary-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Hubungi Kami</h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-primary-400">{info.icon}</span>
                  </div>
                  <span className="text-gray-400 text-sm leading-relaxed">{info.text}</span>
                </div>
              ))}
            </div>

            {/* Emergency Contact */}
            <div className="mt-6 p-4 bg-primary-600 rounded-xl">
              <h4 className="font-semibold mb-2">Emergency 24/7</h4>
              <p className="text-sm opacity-90 mb-3">
                Untuk keadaan darurat, hubungi hotline kami kapan saja.
              </p>
              <a
                href="tel:+628123456789"
                className="inline-flex items-center bg-white text-primary-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                +62 812-3456-7890
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <h3 className="text-xl font-semibold mb-2">Dapatkan Tips Perawatan Hewan</h3>
              <p className="text-gray-400">
                Berlangganan newsletter kami untuk mendapatkan tips dan promo terbaru.
              </p>
            </div>
            <div className="flex w-full lg:w-auto max-w-md">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-white placeholder-gray-400"
              />
              <button className="bg-primary-600 text-white px-6 py-3 rounded-r-xl hover:bg-primary-700 transition-colors font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © 2024 Pawranger Pet Care. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Sitemap
              </a>
            </div>
          </div>
          
          {/* Made with Love */}
          <div className="text-center mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-sm flex items-center justify-center">
              Made with 
              <Heart className="w-4 h-4 text-red-500 mx-1" /> 
              for pets and their humans
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;