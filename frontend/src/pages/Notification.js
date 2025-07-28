import React, { useEffect, useState } from 'react';
import summaryApi from '../common';
import { toast } from 'react-toastify';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Sort notifications by createdAt (newest first)
  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(summaryApi.notification_list.url, {
          credentials: 'include',
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        
        if (data.success && Array.isArray(data.data)) {
          setNotifications(data.data);
        } else {
          setNotifications([]);
          toast.error(data.message || "No notifications found");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load notifications");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark as read
  const markAsRead = async (id) => {
    try {
      const res = await fetch(
        summaryApi.notification_mark_read.url.replace(":id", id),
        {
          method: "PUT",
          credentials: 'include',
        }
      );
      
      const data = await res.json();
      if (data.success) {
        setNotifications(prev =>
          prev.map(n =>
            n._id === id ? { ...n, read: true } : n
          )
        );
      }
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
    
    if (!notification.read) {
      markAsRead(notification._id);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-6">Loading notifications...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>

      {sortedNotifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {sortedNotifications.map((notification) => (
            <li
              key={notification._id}
              className={`p-4 border rounded-lg shadow-md cursor-pointer ${
                notification.read ? 'bg-gray-100' : 'bg-yellow-50'
              } hover:shadow-lg transition-shadow`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className={`text-sm ${notification.read ? 'text-gray-700' : 'font-semibold'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Notification Details Modal */}
      {isModalOpen && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">Order Details</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-4">
              <p className={`text-lg ${selectedNotification.read ? 'text-gray-700' : 'font-bold'}`}>
                {selectedNotification.message}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </p>
            </div>

            {selectedNotification.metadata && (
              <div className="space-y-4">
                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-gray-700">Order Summary</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm"><span className="text-gray-600 font-medium">Total Amount:</span> ${selectedNotification.metadata.totalAmount}</p>
                      <p className="text-sm"><span className="text-gray-600 font-medium">Payment Method:</span> {selectedNotification.metadata.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-gray-700">Shipping Information</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm"><span className="text-gray-600">Name:</span> {selectedNotification.metadata.shippingInfo.fullName}</p>
                    <p className="text-sm"><span className="text-gray-600">Email:</span> {selectedNotification.metadata.shippingInfo.email}</p>
                    <p className="text-sm"><span className="text-gray-600">Phone:</span> {selectedNotification.metadata.shippingInfo.phone}</p>
                    <p className="text-sm"><span className="text-gray-600">Address:</span> {selectedNotification.metadata.shippingInfo.address}</p>
                    <p className="text-sm"><span className="text-gray-600">City:</span> {selectedNotification.metadata.shippingInfo.city}</p>
                    <p className="text-sm"><span className="text-gray-600">Zip Code:</span> {selectedNotification.metadata.shippingInfo.zipCode}</p>
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-gray-700">Ordered Items</h4>
                  {selectedNotification.metadata.items.map((item, index) => (
                    <div key={index} className="flex items-start border-b py-3">
                      <div 
                        className="w-16 h-16 mr-3 cursor-pointer"
                        onClick={() => handleImageClick(item.image)}
                      >
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain rounded"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Price: ${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white text-xl hover:text-gray-300"
            >
              &times;
            </button>
            <img 
              src={selectedImage} 
              alt="Product preview" 
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;