import { Award, Users, Clock, Shield, Heart, Star } from 'lucide-react';

const About = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      number: "5000+",
      label: "Pelanggan Puas",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: "10+",
      label: "Tahun Pengalaman",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      number: "24/7",
      label: "Layanan Darurat",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <Star className="w-8 h-8" />,
      number: "4.9/5",
      label: "Rating Pelanggan",
      color: "bg-yellow-100 text-yellow-600"
    }
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Cinta Hewan",
      description: "Kami mencintai hewan dan berkomitmen memberikan perawatan terbaik dengan penuh kasih sayang."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Keamanan Terjamin",
      description: "Fasilitas modern dengan standar keamanan tinggi untuk kenyamanan hewan peliharaan Anda."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Profesional",
      description: "Tim groomer dan dokter hewan bersertifikat dengan pengalaman bertahun-tahun."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Pelayanan Prima",
      description: "Komitmen memberikan pelayanan terbaik dengan pendekatan personal untuk setiap klien."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Heart className="w-4 h-4 mr-2" />
            Tentang Kami
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Mengapa Memilih
            <span className="text-primary-600 block">Pawranger?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dengan pengalaman lebih dari 10 tahun, Pawranger telah menjadi pilihan utama 
            para pemilik hewan peliharaan di Jakarta untuk perawatan berkualitas tinggi.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">
                Dedikasi Penuh untuk Kesehatan dan Kebahagiaan Hewan Peliharaan
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Pawranger didirikan dengan misi sederhana namun mulia: memberikan perawatan 
                terbaik untuk hewan peliharaan dengan standar internasional. Kami memahami 
                bahwa hewan peliharaan adalah bagian dari keluarga, sehingga mereka berhak 
                mendapatkan perawatan terbaik.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Fasilitas modern kami dilengkapi dengan peralatan grooming terkini dan 
                ruang perawatan yang higienis. Tim profesional kami terdiri dari groomer 
                bersertifikat dan dokter hewan berpengalaman yang siap memberikan layanan 
                terbaik 24/7.
              </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                      {value.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Image Placeholder */}
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl p-8">
                <div className="bg-white rounded-2xl p-8 text-center">
                  <div className="text-6xl mb-4">🏥</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Fasilitas Modern</h4>
                  <p className="text-gray-600">Peralatan grooming terkini dan ruang perawatan higienis</p>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-lg">
                <div className="text-2xl">🏆</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-lg">
                <div className="text-2xl">❤️</div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-3xl transform -rotate-6 scale-105 opacity-30"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Pencapaian Kami
            </h3>
            <p className="text-lg text-gray-600">
              Angka-angka yang membuktikan kepercayaan pelanggan terhadap layanan kami
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Tim Profesional Kami
          </h3>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Didukung oleh tim groomer bersertifikat dan dokter hewan berpengalaman 
            yang berdedikasi memberikan perawatan terbaik.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Team Member Placeholders */}
            {[1, 2, 3].map((member) => (
              <div key={member} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                  👨‍⚕️
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Dr. {member === 1 ? 'Ahmad' : member === 2 ? 'Sarah' : 'Budi'} Veteriner
                </h4>
                <p className="text-primary-600 font-medium mb-2">
                  {member === 1 ? 'Dokter Hewan Senior' : member === 2 ? 'Groomer Specialist' : 'Pet Care Expert'}
                </p>
                <p className="text-gray-600 text-sm">
                  {member === 1 ? '15+ tahun pengalaman' : member === 2 ? 'Certified Groomer' : '10+ tahun pengalaman'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;