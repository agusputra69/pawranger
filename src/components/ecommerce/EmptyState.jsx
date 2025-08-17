import React from 'react';

const EmptyState = ({
  searchTerm,
  selectedBrands,
  priceRange,
  clearFilters,
  setSearchTerm,
  setCurrentPage,
  setPriceRange
}) => {
  const hasFilters = searchTerm || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000000;

  return (
    <div className="text-center py-20">
      <div className="max-w-lg mx-auto">
        {/* Enhanced Visual Design */}
        <div className="relative mb-8">
          <div className="w-36 h-36 mx-auto bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <div className="text-7xl animate-pulse">🛍️</div>
          </div>
          <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center shadow-md">
            <div className="text-3xl">🔍</div>
          </div>
        </div>
        
        {/* Context-Aware Messaging */}
        {hasFilters ? (
          <>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Tidak Ada Produk Ditemukan</h3>
            <div className="text-gray-600 mb-8 space-y-2">
              <p>Kami tidak menemukan produk yang sesuai dengan kriteria:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {searchTerm && (
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                    🔍 \"{searchTerm}\"
                  </span>
                )}
                {selectedBrands.length > 0 && (
                  <span className="bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm font-medium">
                    🏷️ {selectedBrands.length} brand dipilih
                  </span>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
                  <span className="bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-sm font-medium">
                    💰 Rp {priceRange[0].toLocaleString()} - Rp {priceRange[1].toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            
            {/* Actionable Solutions */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                   onClick={clearFilters}
                   className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3 rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg"
                 >
                   🔄 Reset Semua Filter
                 </button>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-full hover:bg-primary-50 transition-all duration-300 font-semibold shadow-md"
                >
                  🗑️ Hapus Pencarian
                </button>
              </div>
              
              {/* Smart Suggestions */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mt-8">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center justify-center">
                  <span className="text-xl mr-2">💡</span>
                  Saran Pencarian
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Coba kata kunci yang lebih umum</p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {['makanan', 'mainan', 'perawatan'].map((keyword) => (
                        <button
                          key={keyword}
                          onClick={() => {
                            setSearchTerm(keyword);
                            clearFilters();
                          }}
                          className="bg-white text-gray-700 px-3 py-1 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors text-xs font-medium border"
                        >
                          {keyword}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Perluas rentang harga</p>
                    <button
                      onClick={() => {
                        setPriceRange([0, 1000000]);
                        setCurrentPage(1);
                      }}
                      className="bg-green-100 text-green-700 px-4 py-2 rounded-full hover:bg-green-200 transition-colors text-sm font-medium"
                    >
                      💰 Semua Harga
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Toko Sedang Kosong</h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Kami sedang mempersiapkan koleksi produk terbaik untuk hewan peliharaan kesayangan Anda.
              Mohon bersabar dan kembali lagi segera!
            </p>
            
            {/* Engagement Actions */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3 rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg"
                >
                  🔄 Muat Ulang Halaman
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-full hover:bg-primary-50 transition-all duration-300 font-semibold shadow-md"
                >
                  📞 Hubungi Tim Kami
                </button>
              </div>
              
              {/* Newsletter & Updates */}
              <div className="bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 rounded-2xl p-8 mt-8 shadow-inner">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">📬</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Jadilah Yang Pertama Tahu!</h4>
                  <p className="text-gray-600">Dapatkan notifikasi saat produk baru tersedia dan penawaran eksklusif lainnya.</p>
                </div>
                
                <div className="max-w-md mx-auto">
                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="Masukkan email Anda"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                    />
                    <button className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105">
                      Daftar
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="text-green-500 mr-1">✓</span>
                      Gratis
                    </span>
                    <span className="flex items-center">
                      <span className="text-green-500 mr-1">✓</span>
                      Tanpa Spam
                    </span>
                    <span className="flex items-center">
                      <span className="text-green-500 mr-1">✓</span>
                      Bisa Berhenti Kapan Saja
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmptyState;