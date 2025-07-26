import React, { useEffect, useState } from 'react';
import summaryApi from '../common';
import { toast } from 'react-toastify';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.log("Fetched Notifications:", data);
        
        if (data.success && Array.isArray(data.data)) { // Check if data.data exists and is array
          setNotifications(data.data); // Changed from data.notifications to data.data
        } else {
          setNotifications([]); // Set empty array if no data
          toast.error(data.message || "No notifications found");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load notifications");
        setNotifications([]); // Ensure it's always an array
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
        toast.success("Marked as read");
        setNotifications(prev =>
          prev.map(n =>
            n._id === id ? { ...n, read: true } : n
          )
        );
      } else {
        toast.error(data.message || "Failed to mark as read");
      }
    } catch (error) {
      console.error("Mark as read error:", error);
      toast.error("Server error marking notification");
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-6">Loading notifications...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>

      {!notifications || notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className={`p-4 border rounded-lg shadow-md flex justify-between items-center ${
                notification.read ? 'bg-gray-100' : 'bg-yellow-100'
              }`}
            >
              <div>
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification._id)}
                  className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;