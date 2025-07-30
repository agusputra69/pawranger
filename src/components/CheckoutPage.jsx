import { useState } from 'react';
import { ArrowLeft, Upload, Check, Clock, CreditCard, User, MapPin, Phone, Mail } from 'lucide-react';

const CheckoutPage = ({ cartItems, onBack, onOrderComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: ''
    },
    paymentProof: null,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const bankAccounts = [
    {
      bank: 'Bank BCA',
      accountNumber: '1234567890',
      accountName: 'PT Pawranger Indonesia',
      logo: '🏦'
    },
    {
      bank: 'Bank Mandiri',
      accountNumber: '0987654321',
      accountName: 'PT Pawranger Indonesia',
      logo: '🏛️'
    },
    {
      bank: 'Bank BNI',
      accountNumber: '1122334455',
      accountName: 'PT Pawranger Indonesia',
      logo: '🏢'
    }
  ];

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 25000; // Fixed shipping cost
    return { subtotal, shipping, total: subtotal + shipping };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        [field]: value
      }
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setOrderData(prev => ({
        ...prev,
        paymentProof: file
      }));
    }
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    
    // Simulate order submission
    setTimeout(() => {
      const newOrderId = 'PWR' + Date.now();
      setOrderId(newOrderId);
      setCurrentStep(4);
      setIsSubmitting(false);
      
      // Clear cart and notify parent
      if (onOrderComplete) {
        onOrderComplete(newOrderId);
      }
    }, 2000);
  };

  const { subtotal, shipping, total } = calculateTotal();

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Informasi Pengiriman</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Nama Lengkap *
          </label>
          <input
            type="text"
            value={orderData.customerInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email *
          </label>
          <input
            type="email"
            value={orderData.customerInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="email@example.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Nomor Telepon *
          </label>
          <input
            type="tel"
            value={orderData.customerInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="08xxxxxxxxxx"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kota *
          </label>
          <input
            type="text"
            value={orderData.customerInfo.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Nama kota"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-2" />
          Alamat Lengkap *
        </label>
        <textarea
          value={orderData.customerInfo.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kode Pos *
        </label>
        <input
          type="text"
          value={orderData.customerInfo.postalCode}
          onChange={(e) => handleInputChange('postalCode', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="12345"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Metode Pembayaran</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="font-semibold text-blue-900">Transfer Bank Manual</h4>
        </div>
        <p className="text-blue-700 text-sm">
          Silakan transfer ke salah satu rekening di bawah ini, lalu upload bukti transfer.
        </p>
      </div>
      
      <div className="space-y-4">
        {bankAccounts.map((bank, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{bank.logo}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{bank.bank}</h4>
                  <p className="text-gray-600">{bank.accountName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-lg font-bold text-gray-900">{bank.accountNumber}</p>
                <button 
                  onClick={() => navigator.clipboard.writeText(bank.accountNumber)}
                  className="text-primary-600 text-sm hover:text-primary-700"
                >
                  Salin Nomor
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">Jumlah yang harus ditransfer:</h4>
        <p className="text-2xl font-bold text-yellow-900">{formatPrice(total)}</p>
        <p className="text-yellow-700 text-sm mt-2">
          Pastikan nominal transfer sesuai dengan jumlah di atas untuk mempercepat verifikasi.
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Bukti Transfer</h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="payment-proof"
        />
        <label htmlFor="payment-proof" className="cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload Bukti Transfer</h4>
          <p className="text-gray-600 mb-4">
            Klik untuk memilih file atau drag & drop
          </p>
          <p className="text-sm text-gray-500">
            Format: JPG, PNG, PDF (Max 5MB)
          </p>
        </label>
      </div>
      
      {orderData.paymentProof && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              File berhasil dipilih: {orderData.paymentProof.name}
            </span>
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catatan (Opsional)
        </label>
        <textarea
          value={orderData.notes}
          onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Tambahkan catatan untuk pesanan Anda..."
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Berhasil Dibuat!</h3>
        <p className="text-gray-600 mb-4">
          Terima kasih atas pesanan Anda. Kami akan memverifikasi pembayaran dalam 1x24 jam.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">ID Pesanan:</h4>
          <p className="text-xl font-mono font-bold text-primary-600">{orderId}</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-semibold text-blue-900">Status: Menunggu Verifikasi</h4>
          </div>
          <p className="text-blue-700 text-sm">
            Kami akan mengirim konfirmasi melalui email setelah pembayaran terverifikasi.
          </p>
        </div>
      </div>
    </div>
  );

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return orderData.customerInfo.name && 
               orderData.customerInfo.email && 
               orderData.customerInfo.phone && 
               orderData.customerInfo.address && 
               orderData.customerInfo.city && 
               orderData.customerInfo.postalCode;
      case 2:
        return true; // Payment method selection is automatic
      case 3:
        return orderData.paymentProof;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center mb-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-primary-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </div>

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>
                
                {currentStep < 3 ? (
                  <button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    disabled={!isStepValid()}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Selanjutnya
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitOrder}
                    disabled={!isStepValid() || isSubmitting}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Memproses...
                      </>
                    ) : (
                      'Buat Pesanan'
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pesanan</h3>
              
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ongkos Kirim</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;