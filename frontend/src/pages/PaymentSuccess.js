import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Context from '../context';
import displayNEPCurrency from '../helpers/displayCurrency';
import { verifyEsewaPayment, clearCart } from '../api/paymentApi';

const PaymentSuccess = () => {
  const [paymentStatus, setPaymentStatus] = useState('verifying');
  const [paymentData, setPaymentData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const context = useContext(Context);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const oid = searchParams.get('oid');
        const amt = searchParams.get('amt');
        const refId = searchParams.get('refId');
        
        if (!oid) {
          setError('Invalid payment response');
          setPaymentStatus('failed');
          return;
        }

        // Verify payment with backend
        const result = await verifyEsewaPayment(oid);
        
        if (result.success) {
          setPaymentStatus('success');
          setPaymentData(result.payment);
          setOrderData(result.order);
          
          // Clear cart after successful payment
          await clearCart();
          
          // Update cart count
          context.fetchUserAddToCart();
          
          toast.success('Payment completed successfully!');
        } else {
          setPaymentStatus('failed');
          setError(result.message || 'Payment verification failed');
        }

      } catch (error) {
        console.error('Verification error:', error);
        setPaymentStatus('failed');
        setError('Payment verification failed');
      }
    };

    verifyPayment();
  }, [searchParams, context]);

  const clearCart = async () => {
    try {
      const { clearCart } = await import('../api/paymentApi');
      await clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  if (paymentStatus === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we verify your payment with eSewa.</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-600 px-6 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-semibold text-white">Payment Successful!</h1>
                  <p className="text-green-100">Thank you for your purchase.</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Transaction ID:</dt>
                      <dd className="text-sm font-medium text-gray-900">{paymentData?.transactionUuid}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Amount:</dt>
                      <dd className="text-sm font-medium text-gray-900">{displayNEPCurrency(paymentData?.totalAmount)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Payment Method:</dt>
                      <dd className="text-sm font-medium text-gray-900">eSewa</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Status:</dt>
                      <dd className="text-sm font-medium text-green-600 capitalize">{paymentData?.status}</dd>
                    </div>
                  </dl>
                </div>

                {orderData && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Order ID:</dt>
                        <dd className="text-sm font-medium text-gray-900">{orderData._id}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Items:</dt>
                        <dd className="text-sm font-medium text-gray-900">{orderData.items?.length} items</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Delivery:</dt>
                        <dd className="text-sm font-medium text-gray-900">3-5 business days</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>

              {/* Order Items */}
              {orderData?.items && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      {orderData.items.map((item, index) => (
                        <div key={index} className="p-4 flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-contain rounded"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {displayNEPCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/orders')}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition duration-150"
                >
                  View My Orders
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50 transition duration-150"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition duration-150"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50 transition duration-150"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;