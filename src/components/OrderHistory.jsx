import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Eye, Truck, CreditCard } from 'lucide-react';

const OrderHistory = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock order data
  useEffect(() => {
    const mockOrders = [
      {
        id: 'PWR1735063175001',
        date: '2024-12-24',
        status: 'pending_payment',
        total: 310000,
        items: [
          {
            id: 1,
            name: 'Royal Canin Adult Dog Food',
            price: 285000,
            quantity: 1,
            image: '🐕'
          }
        ],
        shipping: 25000,
        paymentMethod: 'Bank Transfer',
        shippingAddress: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110'
      },
      {
        id: 'PWR1735063175002',
        date: '2024-12-23',
        status: 'confirmed',
        total: 97000,
        items: [
          {
            id: 2,
            name: 'Whiskas Adult Cat Food',
            price: 45000,
            quantity: 1,
            image: '🐱'
          },
          {
            id: 3,
            name: 'Premium Dog Treats',
            price: 27000,
            quantity: 1,
            image: '🦴'
          }
        ],
        shipping: 25000,
        paymentMethod: 'Bank Transfer',
        shippingAddress: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110'
      },
      {
        id: 'PWR1735063175003',
        date: '2024-12-22',
        status: 'shipped',
        total: 72000,
        items: [
          {
            id: 4,
            name: 'Cat Vitamin Supplement',
            price: 47000,
            quantity: 1,
            image: '💊'
          }
        ],
        shipping: 25000,
        paymentMethod: 'Bank Transfer',
        shippingAddress: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110',
        trackingNumber: 'JNE123456789'
      },
      {
        id: 'PWR1735063175004',
        date: '2024-12-20',
        status: 'delivered',
        total: 135000,
        items: [
          {
            id: 5,
            name: 'Premium Cat Food',
            price: 85000,
            quantity: 1,
            image: '🐱'
          },
          {
            id: 6,
            name: 'Dog Toy Set',
            price: 25000,
            quantity: 1,
            image: '🎾'
          }
        ],
        shipping: 25000,
        paymentMethod: 'Bank Transfer',
        shippingAddress: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110',
        deliveredDate: '2024-12-21'
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending_payment':
        return {
          label: 'Menunggu Pembayaran',
          color: 'text-yellow-600 bg-yellow-100',
          icon: Clock
        };
      case 'confirmed':
        return {
          label: 'Dikonfirmasi',
          color: 'text-blue-600 bg-blue-100',
          icon: CheckCircle
        };
      case 'shipped':
        return {
          label: 'Dikirim',
          color: 'text-purple-600 bg-purple-100',
          icon: Truck
        };
      case 'delivered':
        return {
          label: 'Terkirim',
          color: 'text-green-600 bg-green-100',
          icon: Package
        };
      case 'cancelled':
        return {
          label: 'Dibatalkan',
          color: 'text-red-600 bg-red-100',
          icon: XCircle
        };
      default:
        return {
          label: 'Unknown',
          color: 'text-gray-600 bg-gray-100',
          icon: Clock
        };
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    const statusInfo = getStatusInfo(selectedOrder.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-primary-600 hover:text-primary-700 mr-4"
            >
              ← Kembali ke Riwayat
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Detail Pesanan</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Pesanan #{selectedOrder.id}</h2>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${statusInfo.color}`}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {statusInfo.label}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Tanggal Pesanan:</span>
                    <p className="font-medium">{formatDate(selectedOrder.date)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Metode Pembayaran:</span>
                    <p className="font-medium">{selectedOrder.paymentMethod}</p>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div>
                      <span className="text-gray-600">Nomor Resi:</span>
                      <p className="font-medium">{selectedOrder.trackingNumber}</p>
                    </div>
                  )}
                  {selectedOrder.deliveredDate && (
                    <div>
                      <span className="text-gray-600">Tanggal Terkirim:</span>
                      <p className="font-medium">{formatDate(selectedOrder.deliveredDate)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Produk yang Dipesan</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="text-4xl">{item.image}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        <p className="text-sm text-gray-600">{formatPrice(item.price)} / item</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Alamat Pengiriman</h3>
                <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pesanan</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(selectedOrder.total - selectedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ongkos Kirim</span>
                    <span>{formatPrice(selectedOrder.shipping)}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {selectedOrder.status === 'pending_payment' && (
                    <button className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
                      Upload Bukti Pembayaran
                    </button>
                  )}
                  
                  {selectedOrder.status === 'shipped' && (
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                      Lacak Paket
                    </button>
                  )}
                  
                  {selectedOrder.status === 'delivered' && (
                    <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                      Beli Lagi
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Pesanan</h1>
          <p className="text-gray-600">Kelola dan lacak pesanan Anda</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Pesanan</h3>
            <p className="text-gray-600 mb-6">Anda belum memiliki riwayat pesanan</p>
            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Pesanan #{order.id}</h3>
                      <p className="text-gray-600">{formatDate(order.date)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${statusInfo.color}`}>
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {statusInfo.label}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white text-lg">
                          {item.image}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white text-xs font-medium text-gray-600">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                      <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      {order.status === 'pending_payment' && (
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                          <CreditCard className="w-4 h-4 mr-1" />
                          Upload Pembayaran
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                          <Truck className="w-4 h-4 mr-1" />
                          Lacak Paket
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat Detail
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;