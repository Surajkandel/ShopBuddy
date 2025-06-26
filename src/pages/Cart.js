import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import displayNEPCurrency from '../helpers/displayCurrency';
import summaryApi from '../common';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCartProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(summaryApi.viewAddToCartProduct.url, {
        method: summaryApi.viewAddToCartProduct.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send cookie with token
      });

      const data = await response.json();

      if (data?.success) {
        setCartProducts(data.data || []);
      } else {
        setError(data?.message || 'Failed to fetch cart items');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch(summaryApi.removeFromCart.url, {
        method: summaryApi.removeFromCart.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (data?.success) {
        toast.success('Item removed from cart');
        fetchCartProducts(); // Refresh cart
      } else {
        toast.error(data?.message || 'Failed to remove item');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to remove item');
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(summaryApi.updateCartProduct.url, {
        method: summaryApi.updateCartProduct.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      const data = await response.json();

      if (data?.success) {
        fetchCartProducts(); // Refresh cart
      } else {
        toast.error(data?.message || 'Failed to update quantity');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update quantity');
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  const calculateTotal = () => {
    return cartProducts.reduce((total, item) => {
      return total + (item.productId?.selling_price || item.productId?.price || 0) * item.quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>

      {cartProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="hidden md:grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-700">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {cartProducts.map((item) => (
                <div key={item._id} className="grid grid-cols-12 p-4 border-b items-center">
                  <div className="col-span-12 md:col-span-5 flex items-center gap-4 mb-4 md:mb-0">
                    <img
                      src={item.productId?.productImage?.[0] || '/default-product.png'}
                      alt={item.productId?.productName}
                      className="w-20 h-20 object-contain"
                    />
                    <div>
                      <h3 className="font-medium">{item.productId?.productName}</h3>
                      <button
                        onClick={() => handleRemoveItem(item.productId._id)}
                        className="text-red-500 text-sm flex items-center gap-1 mt-1"
                      >
                        <FaTrash size={12} /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-4 md:col-span-2 text-gray-600 text-center">
                    {displayNEPCurrency(item.productId?.selling_price || item.productId?.price || 0)}
                  </div>

                  <div className="col-span-4 md:col-span-3 flex justify-center">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="px-4 py-1">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-4 md:col-span-2 text-right font-medium">
                    {displayNEPCurrency(
                      (item.productId?.selling_price || item.productId?.price || 0) * item.quantity
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{displayNEPCurrency(calculateTotal())}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{displayNEPCurrency(calculateTotal())}</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-md mt-6 hover:bg-blue-700 transition">
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block text-center text-blue-600 mt-4 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
