import React, { useState, useCallback, memo, useMemo } from 'react';
import { ArrowLeft, CreditCard, MapPin, User, Phone, Mail, Upload, CheckCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { createOrder, clearCart, supabase } from '../lib/supabase';
import { formatPrice } from '../utils';
import { ORDER_CONFIG } from '../constants';
const CheckoutPage = memo(({ onBack, onOrderComplete, user }) => {
  const { items: cartItems } = useCart();
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
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

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

  const orderSummary = useMemo(() => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 25000; // Fixed shipping cost
    return { subtotal, shipping, total: subtotal + shipping };
  }, [cartItems]);

  const calculateTotal = useCallback(() => orderSummary, [orderSummary]);



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

  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!orderData.customerInfo.name.trim()) errors.name = 'Name is required';
    if (!orderData.customerInfo.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(orderData.customerInfo.email)) errors.email = 'Email is invalid';
    if (!orderData.customerInfo.phone.trim()) errors.phone = 'Phone number is required';
    if (!orderData.customerInfo.address.trim()) errors.address = 'Address is required';
    if (!orderData.customerInfo.city.trim()) errors.city = 'City is required';
    if (!orderData.customerInfo.postalCode.trim()) errors.postalCode = 'Postal code is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [orderData.customerInfo]);

  const handleSubmitOrder = useCallback(async () => {
    if (!validateForm()) {
      setError('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Generate order number
      const orderNumber = ORDER_CONFIG.orderPrefix + Date.now();
      
      // Calculate totals
      const { subtotal, shipping, total } = calculateTotal();
      
      // Create order data for database
       const dbOrderData = {
         user_id: user?.id,
         order_number: orderNumber,
         status: 'pending_payment',
         total_amount: total,
         shipping_cost: shipping,
         subtotal: subtotal,
         customer_name: orderData.customerInfo.name,
         customer_email: orderData.customerInfo.email,
         customer_phone: orderData.customerInfo.phone,
         shipping_address: orderData.customerInfo.address,
         shipping_city: orderData.customerInfo.city,
         shipping_postal_code: orderData.customerInfo.postalCode,
         notes: orderData.notes,
         payment_method: 'bank_transfer',
         payment_proof_url: null // Will be updated when file is uploaded
       };
      
      // Create order in database
       const { data: order, error: orderError } = await createOrder(dbOrderData);
      
      if (orderError) {
        throw new Error('Failed to create order: ' + orderError.message);
      }
      
      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order[0].id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        throw new Error('Failed to create order items: ' + itemsError.message);
      }
      
      // Upload payment proof if provided
      if (orderData.paymentProof) {
        const fileExt = orderData.paymentProof.name.split('.').pop();
        const fileName = `${order[0].id}/payment_proof.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('order-documents')
          .upload(fileName, orderData.paymentProof);
        
        if (!uploadError) {
          // Update order with payment proof URL
          const { data: { publicUrl } } = supabase.storage
            .from('order-documents')
            .getPublicUrl(fileName);
          
          await supabase
            .from('orders')
            .update({ payment_proof_url: publicUrl })
            .eq('id', order[0].id);
        }
      }
      
      // Clear cart for authenticated users
      if (user) {
        await clearCart();
      }
      
      // Set success state
      setOrderId(order[0].order_number);
      setCurrentStep(4);
      
      // Notify parent component
      if (onOrderComplete) {
        onOrderComplete(order[0].order_number);
      }
      
    } catch (error) {
      console.error('Order submission error:', error);
      setError(error.message || 'Failed to submit order. Please try again.');
      setRetryCount(prev => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  }, [orderData, cartItems, user, onOrderComplete, calculateTotal, validateForm]);

  const retryOrder = () => {
    setError(null);
    setValidationErrors({});
    handleSubmitOrder();
  };

  const { subtotal, shipping, total } = calculateTotal();

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name *
          </label>
          <input
            type="text"
            value={orderData.customerInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              validationErrors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
            required
          />
          {validationErrors.name && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
          )}
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              validationErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="email@example.com"
            required
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={orderData.customerInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              validationErrors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your phone number"
            required
          />
          {validationErrors.phone && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={orderData.customerInfo.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              validationErrors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your city"
            required
          />
          {validationErrors.city && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-2" />
          Full Address *
        </label>
        <textarea
          value={orderData.customerInfo.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            validationErrors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your complete address"
          required
        />
        {validationErrors.address && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Postal Code *
        </label>
        <input
          type="text"
          value={orderData.customerInfo.postalCode}
          onChange={(e) => handleInputChange('postalCode', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            validationErrors.postalCode ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter postal code"
          required
        />
        {validationErrors.postalCode && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.postalCode}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="font-semibold text-blue-900">Bank Transfer</h4>
        </div>
        <p className="text-blue-700 text-sm">
          Please transfer the exact amount to one of the bank accounts below
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
                  Copy Number
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">Transfer Amount:</h4>
        <p className="text-2xl font-bold text-yellow-900">{formatPrice(total)}</p>
        <p className="text-yellow-700 text-sm mt-2">
          Please transfer the exact amount including shipping cost
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Payment Proof</h3>
      
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
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload Payment Proof</h4>
          <p className="text-gray-600 mb-4">
            Click to select or drag and drop your payment proof image
          </p>
          <p className="text-sm text-gray-500">
            Supported formats: JPG, PNG, PDF (Max 5MB)
          </p>
        </label>
      </div>
      
      {orderData.paymentProof && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              File Selected: {orderData.paymentProof.name}
            </span>
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          value={orderData.notes}
          onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Any additional information or special requests"
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
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
        <p className="text-gray-600 mb-4">
          Thank you for your order. We have received your payment proof and will process your order shortly.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Order ID:</h4>
          <p className="text-xl font-mono font-bold text-primary-600">{orderId}</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-semibold text-blue-900">Status: Pending Verification</h4>
          </div>
          <p className="text-blue-700 text-sm">
            We will verify your payment and send a confirmation email within 24 hours.
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
            Back
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

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-red-500 mr-3">⚠️</div>
                    <div>
                      <h4 className="font-semibold text-red-900">Order Submission Failed</h4>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                  <button
                    onClick={retryOrder}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Try Again
                  </button>
                </div>
                {retryCount > 0 && (
                  <p className="text-red-600 text-xs mt-2">Retry attempt: {retryCount}</p>
                )}
              </div>
            )}

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
                  Previous
                </button>
                
                {currentStep < 3 ? (
                  <button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    disabled={!isStepValid()}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
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
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
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
                  <span className="text-gray-600">Shipping</span>
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
});

export default CheckoutPage;