import { useState } from 'react';
import { Camera, Play, X } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const galleryItems = [
    {
      id: 1,
      type: 'image',
      category: 'grooming',
      title: 'Grooming Golden Retriever',
      description: 'Proses grooming lengkap untuk Golden Retriever',
      emoji: '🐕'
    },
    {
      id: 2,
      type: 'image',
      category: 'grooming',
      title: 'Cat Grooming Session',
      description: 'Perawatan grooming untuk kucing Persia',
      emoji: '🐱'
    },
    {
      id: 3,
      type: 'image',
      category: 'facility',
      title: 'Ruang Grooming Modern',
      description: 'Fasilitas grooming dengan peralatan terkini',
      emoji: '🏥'
    },
    {
      id: 4,
      type: 'video',
      category: 'grooming',
      title: 'Proses Grooming Lengkap',
      description: 'Video tutorial grooming step by step',
      emoji: '🎬'
    },
    {
      id: 5,
      type: 'image',
      category: 'before-after',
      title: 'Before & After Grooming',
      description: 'Transformasi luar biasa setelah grooming',
      emoji: '✨'
    },
    {
      id: 6,
      type: 'image',
      category: 'facility',
      title: 'Pet Hotel Rooms',
      description: 'Kamar nyaman untuk pet hotel',
      emoji: '🏨'
    },
    {
      id: 7,
      type: 'image',
      category: 'before-after',
      title: 'Nail Trimming Results',
      description: 'Hasil potong kuku yang rapi dan aman',
      emoji: '💅'
    },
    {
      id: 8,
      type: 'image',
      category: 'grooming',
      title: 'Spa Treatment',
      description: 'Sesi spa relaksasi untuk hewan peliharaan',
      emoji: '🛁'
    },
    {
      id: 9,
      type: 'image',
      category: 'facility',
      title: 'Play Area',
      description: 'Area bermain yang aman dan menyenangkan',
      emoji: '🎾'
    }
  ];

  const filters = [
    { id: 'all', label: 'Semua', count: galleryItems.length },
    { id: 'grooming', label: 'Grooming', count: galleryItems.filter(item => item.category === 'grooming').length },
    { id: 'facility', label: 'Fasilitas', count: galleryItems.filter(item => item.category === 'facility').length },
    { id: 'before-after', label: 'Before & After', count: galleryItems.filter(item => item.category === 'before-after').length }
  ];

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  const openModal = (item) => {
    setSelectedImage(item);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Camera className="w-4 h-4 mr-2" />
            Galeri Kami
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Lihat Hasil Kerja
            <span className="text-primary-600 block">Profesional Kami</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dokumentasi layanan grooming dan fasilitas terbaik yang telah kami berikan 
            kepada ribuan hewan peliharaan di Jakarta.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {filter.label}
              <span className="ml-2 text-sm opacity-75">({filter.count})</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => openModal(item)}
            >
              {/* Image Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                  {item.emoji}
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.type === 'video' ? (
                      <Play className="w-12 h-12 text-white" />
                    ) : (
                      <Camera className="w-12 h-12 text-white" />
                    )}
                  </div>
                </div>
                
                {/* Type Badge */}
                {item.type === 'video' && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Play className="w-3 h-3 mr-1" />
                    Video
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition-colors font-semibold">
            Lihat Lebih Banyak
          </button>
        </div>

        {/* Stats */}
        <div className="mt-20 bg-white rounded-3xl p-8 lg:p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600">Foto & Video Dokumentasi</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Before & After Transformasi</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
              <div className="text-gray-600">Kepuasan Pelanggan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedImage.title}</h3>
                <p className="text-gray-600">{selectedImage.description}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                <div className="text-8xl">{selectedImage.emoji}</div>
              </div>
              
              {selectedImage.type === 'video' && (
                <div className="mt-4 text-center">
                  <button className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors font-semibold flex items-center mx-auto">
                    <Play className="w-5 h-5 mr-2" />
                    Putar Video
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;