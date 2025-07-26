import React, { useEffect, useState } from 'react';
import summaryApi from '../common'; // Your API helper
import { toast } from 'react-toastify';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(summaryApi.notification.url, {
        method: summaryApi.notification.method,
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });

      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      toast.error('Error loading notifications');
    }
  };

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-2'>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((note, i) => (
          <div key={i} className='bg-white shadow p-3 rounded mb-2'>
            <p>{note.message}</p>
            <span className='text-sm text-gray-400'>{new Date(note.createdAt).toLocaleString()}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;
