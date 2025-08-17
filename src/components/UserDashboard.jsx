import React, { useState } from 'react';
import { User, Package, Heart, Settings, LogOut, Calendar, CreditCard, MapPin, Phone, Mail, Edit2, Save, X } from 'lucide-react';
import { formatPrice } from '../utils';
import OrderHistory from './OrderHistory';

const UserDashboard = ({ user, onLogout, onNavigateToEcommerce, onNavigateToBooking }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: 'Royal Canin Adult Dog Food',
      price: 285000,
      originalPrice: 320000,
      image: '🐕',
      inStock: true
    },
    {
      id: 2,
      name: 'Premium Cat Treats',
      price: 45000,
      originalPrice: 52000,
      image: '🐱',
      inStock: true
    },
    {
      id: 3,
      name: 'Dog Vitamin Supplement',
      price: 67000,
      originalPrice: 78000,
      image: '💊',
      inStock: false
    }
  ]);



  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: User,
      description: 'Ringkasan akun Anda'
    },
    {
      id: 'orders',
      label: 'Pesanan Saya',
      icon: Package,
      description: 'Riwayat dan status pesanan'
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      description: 'Produk favorit Anda'
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: Settings,
      description: 'Kelola informasi akun'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Selamat datang, {user.name}! 👋</h2>
        <p className="text-primary-100 mb-6">
          Kelola pesanan, wishlist, dan profil Anda dengan mudah
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={onNavigateToEcommerce}
            className="bg-white text-primary-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Belanja Sekarang
          </button>
          <button
            onClick={onNavigateToBooking}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-400 transition-colors font-semibold flex items-center"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Booking Layanan
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">4</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Total Pesanan</h3>
          <p className="text-gray-600 text-sm">Semua pesanan Anda</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{wishlist.length}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Wishlist</h3>
          <p className="text-gray-600 text-sm">Produk favorit</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">2</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Booking Aktif</h3>
          <p className="text-gray-600 text-sm">Layanan terjadwal</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Pesanan #PWR1735063175001 dikonfirmasi</p>
              <p className="text-gray-600 text-sm">2 jam yang lalu</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Booking grooming berhasil dibuat</p>
              <p className="text-gray-600 text-sm">1 hari yang lalu</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Menambahkan produk ke wishlist</p>
              <p className="text-gray-600 text-sm">3 hari yang lalu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Wishlist Saya</h2>
        <p className="text-gray-600">{wishlist.length} produk</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Wishlist Kosong</h3>
          <p className="text-gray-600 mb-6">Belum ada produk di wishlist Anda</p>
          <button
            onClick={onNavigateToEcommerce}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            Jelajahi Produk
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-4">{item.image}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
                </div>
                
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-xl font-bold text-primary-600">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    item.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.inStock ? 'Tersedia' : 'Stok Habis'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    disabled={!item.inStock}
                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                      item.inStock
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {item.inStock ? 'Tambah ke Keranjang' : 'Stok Habis'}
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Hapus dari Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Profil Saya</h2>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Pribadi</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
            <input
              type="text"
              defaultValue={user.name}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
            <input
              type="tel"
              defaultValue={user.phone || ''}
              placeholder="08xxxxxxxxxx"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
          <textarea
            rows={3}
            placeholder="Alamat lengkap Anda"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
            Simpan Perubahan
          </button>
        </div>
      </div>
      
      {/* Change Password */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Ubah Password</h3>
        
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Lama</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
            Ubah Password
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'orders':
        return <OrderHistory user={user} />;
      case 'wishlist':
        return renderWishlist();
      case 'profile':
        return renderProfile();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900">{user.name}</h3>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
              
              {/* Menu */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-primary-50 text-primary-600 border border-primary-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
                
                <button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Keluar</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;