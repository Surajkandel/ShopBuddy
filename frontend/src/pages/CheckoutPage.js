import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Context from '../context';
import displayNEPCurrency from '../helpers/displayCurrency';
import { createOrder, initiateEsewaPayment, clearCart } from '../api/paymentApi';
import summaryApi from '../common/index'; // Add this import

const CheckoutPage = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  
  const context = useContext(Context);
  const navigate = useNavigate();

  // Fetch cart data
  const fetchCartData = async () => {
    setLoading(true);
    try {
      const response = await fetch(summaryApi.viewAddToCartProduct.url, {
        method: summaryApi.viewAddToCartProduct.method,
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
      });

      const responseData = await response.json();

      if (responseData.success) {
        setCartData(responseData.data);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error('Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  // Calculate totals
  const calculateSubtotal = () =>
    cartData.reduce(
      (total, product) =>
        total + (product.productId.selling_price * product.quantity),
      0
    );

  const subtotal = calculateSubtotal();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city'];
    for (let field of required) {
      if (!shippingInfo[field].trim()) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  // Create order and initiate eSewa payment
  const handleEsewaPayment = async () => {
    if (!validateForm()) return;

    if (cartData.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setPaymentLoading(true);

    try {
      // First create order
      const orderData = {
        items: cartData.map(item => ({
          productId: item.productId._id,
          name: item.productId.productName,
          price: item.productId.selling_price,
          quantity: item.quantity,
          image: item.productId.productImage[0]
        })),
        shippingInfo,
        subtotal,
        shipping,
        total,
        paymentMethod: 'esewa'
      };

      // Create order in backend
      const orderResult = await createOrder(orderData);

      if (!orderResult.success) {
        throw new Error(orderResult.message || 'Failed to create order');
      }

      // Initiate eSewa payment
      const paymentData = {
        orderId: orderResult.orderId,
        totalAmount: total
      };

      const paymentResult = await initiateEsewaPayment(paymentData);

      if (paymentResult.success) {
        // Store order info in sessionStorage for later verification
        sessionStorage.setItem('pendingOrder', JSON.stringify({
          orderId: orderResult.orderId,
          transactionUuid: paymentResult.paymentData.transaction_uuid
        }));

        // Redirect to eSewa
        redirectToEsewa(paymentResult.paymentData, paymentResult.paymentUrl);
      } else {
        throw new Error(paymentResult.error || 'Failed to initiate payment');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Redirect to eSewa
  const redirectToEsewa = (paymentData, paymentUrl) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentUrl;

    Object.keys(paymentData).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = paymentData[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order payment */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {cartData.map((item) => (
                <div key={item._id} className="flex items-center space-x-3">
                  <img
                    src={item.productId.productImage[0]}
                    alt={item.productId.productName}
                    className="w-12 h-12 object-contain rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.productId.productName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × {displayNEPCurrency(item.productId.selling_price)}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {displayNEPCurrency(item.productId.selling_price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{displayNEPCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-indigo-600">{displayNEPCurrency(total)}</span>
              </div>
            </div>

            {/* Payment Button */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleEsewaPayment}
                disabled={paymentLoading || cartData.length === 0}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {paymentLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <img src="https://esewa.com.np/common/images/esewa_logo.png" alt="eSewa" className="h-6 mr-2" />
                    Pay with eSewa
                  </>
                )}
              </button>
              
              <button
                onClick={() => navigate('/cart')}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition duration-150"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;