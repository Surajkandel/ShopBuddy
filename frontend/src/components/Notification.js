// import React, { useEffect, useState } from 'react';
// import summaryApi from '../common'; // Your API helper
// import { toast } from 'react-toastify';

// const Notification = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [selectedNotification, setSelectedNotification] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const res = await fetch(summaryApi.notification.url, {
//         method: summaryApi.notification.method,
//         headers: {
//           Authorization: localStorage.getItem('token')
//         }
//       });

//       const data = await res.json();
//       if (data.success) {
//         setNotifications(data.notifications);
//       }
//     } catch (error) {
//       toast.error('Error loading notifications');
//     }
//   };

//   const handleNotificationClick = (notification) => {
//     setSelectedNotification(notification);
//     setIsModalOpen(true);
    
//     // Optional: Mark as read when clicked
//     if (!notification.read) {
//       markAsRead(notification._id);
//     }
//   };

//   const markAsRead = async (notificationId) => {
//     try {
//       const res = await fetch(summaryApi.markNotificationRead.url, {
//         method: summaryApi.markNotificationRead.method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: localStorage.getItem('token')
//         },
//         body: JSON.stringify({ notificationId })
//       });

//       const data = await res.json();
//       if (data.success) {
//         fetchNotifications(); // Refresh notifications
//       }
//     } catch (error) {
//       toast.error('Error marking notification as read');
//     }
//   };

//   return (
//     <div className='p-4'>
//       <h2 className='text-xl font-bold mb-4'>Notifications</h2>
//       {notifications.length === 0 ? (
//         <p>No notifications yet.</p>
//       ) : (
//         <div className='space-y-2'>
//           {notifications.map((note, i) => (
//             <div 
//               key={i} 
//               className={`p-3 rounded mb-2 cursor-pointer ${note.read ? 'bg-gray-100' : 'bg-white shadow'}`}
//               onClick={() => handleNotificationClick(note)}
//             >
//               <p className={note.read ? 'text-gray-600' : 'font-medium'}>{note.message}</p>
//               <span className='text-sm text-gray-400'>{new Date(note.createdAt).toLocaleString()}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal for showing notification details */}
//       {isModalOpen && selectedNotification && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-start mb-4">
//               <h3 className="text-lg font-bold">Order Details</h3>
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ✕
//               </button>
//             </div>
            
//             <div className="mb-4">
//               <p className="font-medium">{selectedNotification.message}</p>
//               <p className="text-sm text-gray-500">
//                 {new Date(selectedNotification.createdAt).toLocaleString()}
//               </p>
//             </div>

//             {selectedNotification.metadata && (
//               <div className="space-y-4">
//                 <div>
//                   <h4 className="font-medium mb-2">Order Information</h4>
//                   <div className="grid grid-cols-2 gap-2 text-sm">
//                     <p><span className="text-gray-600">Order ID:</span> {selectedNotification.metadata.orderId}</p>
//                     <p><span className="text-gray-600">Total Amount:</span> ${selectedNotification.metadata.totalAmount}</p>
//                     <p><span className="text-gray-600">Payment Method:</span> {selectedNotification.metadata.paymentMethod}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="font-medium mb-2">Shipping Information</h4>
//                   <div className="bg-gray-50 p-3 rounded text-sm">
//                     {Object.entries(selectedNotification.metadata.shippingInfo).map(([key, value]) => (
//                       <p key={key}><span className="text-gray-600">{key}:</span> {value}</p>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="font-medium mb-2">Order Items</h4>
//                   <div className="space-y-3">
//                     {selectedNotification.metadata.items.map((item, index) => (
//                       <div key={index} className="flex items-start border-b pb-2">
//                         <img 
//                           src={item.image} 
//                           alt={item.name} 
//                           className="w-16 h-16 object-cover rounded mr-3"
//                         />
//                         <div>
//                           <p className="font-medium">{item.name}</p>
//                           <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                           <p className="text-sm text-gray-600">Price: ${item.price}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notification;