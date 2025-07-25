import React, { useContext, useEffect, useState } from 'react';
import summaryApi from '../common';
import Context from '../context';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import displayNEPCurrency from '../helpers/displayCurrency';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();

  const loadingCart = new Array(context.cartProductCount).fill(null);

  const fetchData = async () => {
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
        setData(responseData.data);
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
    fetchData();
  }, []);

  const updateQuantity = async (id, newQty) => {
    try {
      const response = await fetch(summaryApi.updateCartProduct.url, {
        method: summaryApi.updateCartProduct.method,
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          _id: id,
          quantity: newQty,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        setData((prevData) =>
          prevData.map((item) =>
            item._id === id ? { ...item, quantity: newQty } : item
          )
        );
        context.fetchUserAddToCart();
        toast.success('Quantity updated successfully');
      } else {
        toast.error(responseData.message);
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to update quantity');
      fetchData();
    }
  };

  const increaseQty = (id, qty) => updateQuantity(id, qty + 1);
  const decreaseQty = (id, qty) => qty > 1 && updateQuantity(id, qty - 1);

  const deleteCartProduct = async (id) => {
    try {
      const response = await fetch(summaryApi.removeFromCart.url, {
        method: summaryApi.removeFromCart.method,
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ _id: id }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success(responseData.message);
        setData((prevData) => prevData.filter((item) => item._id !== id));
        context.fetchUserAddToCart();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const calculateItemTotal = (price, quantity) => price * quantity;
  const calculateSubtotal = () =>
    data.reduce(
      (total, product) =>
        total + calculateItemTotal(product.productId.selling_price, product.quantity),
      0
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {data.length === 0 && !loading && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <button
                  onClick={() => navigate('/products')}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                  Continue Shopping
                </button>
              </div>
            )}

            {loading ? (
              loadingCart.map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4 mb-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              data.map((product) => (
                <div key={product?._id} className="bg-white rounded-lg shadow p-4 mb-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-24 h-24 flex-shrink-0">
                      <img
                        src={product?.productId?.productImage[0]}
                        alt={product?.productId?.productName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            {product.productId.productName}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {product.productId.subcategory}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteCartProduct(product?._id)}
                          className="text-red-500 hover:text-red-700 transition"
                          aria-label="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Unit Price</p>
                          <p className="font-medium">
                            {displayNEPCurrency(product?.productId?.selling_price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-medium text-indigo-600">
                            {displayNEPCurrency(
                              calculateItemTotal(
                                product.productId.selling_price,
                                product.quantity
                              )
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decreaseQty(product._id, product.quantity)}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition disabled:opacity-50"
                            disabled={product.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="w-8 text-center">{product.quantity}</span>
                          <button
                            onClick={() => increaseQty(product._id, product.quantity)}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                            aria-label="Increase quantity"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              {loading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal ({data.reduce((acc, item) => acc + item.quantity, 0)} items)
                    </span>
                    <span className="font-medium">{displayNEPCurrency(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold text-indigo-600">
                      {displayNEPCurrency(calculateSubtotal())}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate('/checkoutPage')}
                className="mt-4 w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-3 px-4 rounded-md font-medium transition duration-150"
              >
                Esewa
              </button>

              {data.length > 0 && (
                <button
                  onClick={() => navigate('/products')}
                  className="mt-4 w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-3 px-4 rounded-md font-medium transition duration-150"
                >
                  Continue Shopping
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
