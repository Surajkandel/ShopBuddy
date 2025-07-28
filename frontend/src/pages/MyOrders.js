import React, { useEffect, useState, useContext } from 'react';
import summaryApi from '../common';
import Context from '../context';
import { toast } from 'react-toastify';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(Context);

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(summaryApi.myOrders.url, {
                method: summaryApi.myOrders.method,
                credentials: 'include'
            });
            
            const response = await res.json();
            
            if (!res.ok) {
                throw new Error(response.message || 'Failed to fetch orders');
            }

            // Handle both array and object responses
            const ordersData = Array.isArray(response) 
                ? response 
                : (response.orders || []);
            
            setOrders(ordersData);
        } catch (err) {
            toast.error(err.message || 'Failed to fetch orders');
            setOrders([]); // Ensure orders is always an array
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (orderId) => {
        try {
            const res = await fetch(`${summaryApi.completeOrder.url}/${orderId}`, {
                method: summaryApi.completeOrder.method,
                credentials: 'include'
            });
            
            const data = await res.json();
            
            if (res.ok) {
                toast.success('Order marked as completed');
                fetchMyOrders(); // Refresh the orders list
            } else {
                throw new Error(data.message || 'Failed to complete order');
            }
        } catch (err) {
            toast.error(err.message || 'Error updating order');
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold mb-4">
                    {user?.role === 'SELLER' ? 'Orders to Deliver' : 'My Orders'}
                </h2>
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">
                {user?.role === 'SELLER' ? 'Orders to Deliver' : 'My Orders'}
            </h2>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className="bg-white shadow rounded-lg p-4 mb-4">
                        <div className="flex justify-between mb-2">
                            <h3 className="text-lg font-semibold">Order ID: {order._id}</h3>
                            <span className={`text-sm px-2 py-1 rounded-full ${
                                order.status === 'delivered' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="mb-2">
                            {order.items?.map((item) => (
                                <div key={item.productId} className="flex items-center gap-4 border-b py-2">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-12 h-12 object-cover rounded" 
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/48'; // Fallback image
                                        }}
                                    />
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity} × Rs. {item.price}
                                        </p>
                                       
                                        {user?.role === 'SELLER' && (
                                            <p className="text-xs text-gray-400"> 
                                                Buyer: {order.shippingInfo?.fullName }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between mt-4 text-sm text-gray-600">
                            <div>
                                <p><strong>Total:</strong> Rs. {order.total || '0'}</p>
                                <p><strong>Payment:</strong> {order.paymentMethod || 'N/A'} - {order.paymentStatus || 'N/A'}</p>
                            </div>

                            {order.status !== 'delivered'  && (
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={() => handleComplete(order._id)}
                                >
                                    Mark as Completed
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyOrders;