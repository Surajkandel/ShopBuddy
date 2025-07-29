import React, { useContext, useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import summaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import logo from '../assest/logo.jpg';
import Context from '../context';

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state?.user?.user);
  const context = useContext(Context);
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = async () => {
    const fetchData = await fetch(summaryApi.logout_user.url, {
      method: summaryApi.logout_user.method,
      credentials: 'include'
    });

    const data = await fetchData.json();
    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate('/', { replace: true });
    } else {
      toast.error(data.message);
    }
  };

  const handleSearchSubmit = () => {
    if (searchValue.trim()) {
      navigate(`/search?q=${searchValue.trim()}`);
    } else {
      navigate(`/recommendation`);
    }
  };

  // Fetch unread notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {

        const res = await fetch(summaryApi.notification_count.url, {
          method: summaryApi.notification_count.method,
          credentials: 'include'
        });
        const data = await res.json();
        console.log("🔔 Notification Count API Response:", data);
        if (data.success) {
          setUnreadCount(data.count);
        }
      } catch (err) {
        console.error('Error fetching notification count:', err);
      }
    };
    

    if (user?._id) {
      fetchNotificationCount();
    }
  }, [user]);


  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40'>
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        {/* Logo */}
        <div className="flex items-center h-full">
          <Link to="/" className="inline-block">
            <img
              src={logo}
              alt="ShopBuddy Logo"
              className="h-16 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Search Box */}
        <div className="hidden lg:flex items-center">
          <input
            type="text"
            placeholder='Search here'
            className='w-full h-10 outline-none border rounded-l-full pl-3'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
          />
          <div
            onClick={handleSearchSubmit}
            className="text-2xl text-white min-w-[50px] h-10 flex items-center justify-center bg-blue-500 rounded-r-full cursor-pointer hover:bg-blue-600"
          >
            <FaSearch />
          </div>
        </div>

        {/* User / Cart / Notification / Logout */}
        <div className="flex items-center gap-6">
          {user?._id && user?.role === 'GENERAL' &&(
            <div>
              <Link to={`/seller-signup/${user._id}`}>
                <button className='px-3 py-1 rounded-full text-white bg-green-500 hover:bg-green-700'>
                  Register as Seller
                </button>
              </Link>
            </div>
          )}
          {user?._id && user?.role === 'SELLER' && user?.status ==='PENDING' &&(
            <div>
              <Link to={`/check-status/${user.status}`}>
                <button className='px-3 py-1 rounded-full text-white bg-green-500 hover:bg-green-700'>
                  Check My Status
                </button>
              </Link>
            </div>
          )}

          {/* Notification Bell */}
          {user?._id && user?.role === 'SELLER'&& (
            <div className="relative">
              <Link to="/notifications" className="relative inline-flex items-center">
                {/* Notification Icon with hover effect */}
                <IoMdNotificationsOutline className="text-2xl text-gray-600 hover:text-blue-600 transition-colors duration-200" />

                {/* Notification Badge */}
                {unreadCount > 0 && (
                  <>
                    {/* Ping animation for attention */}
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                      </span>
                    )}

                    {/* Badge with dynamic sizing */}
                    <span className={`
            absolute -top-2 -right-2 
            ${unreadCount > 9 ? 'min-w-5 h-5 text-xs -right-2.5' : 'min-w-4 h-4 text-[0.6rem]'} 
            bg-blue-600 text-white rounded-full 
            flex items-center justify-center 
            transform transition-all duration-300
            hover:scale-110
            shadow-sm
          `}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </>
                )}
              </Link>
            </div>
          )}

          {/* User Profile */}
          <div>
            <Link to="./myorders">
              <FaRegUserCircle className='text-2xl cursor-pointer' />
            </Link>
          </div>

          {/* Cart */}
          {user?._id ? (
            <Link to="/Cart" className="relative inline-block">
              <FiShoppingCart className="text-2xl cursor-pointer" />
              <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center z-10">
                <p className="text-xs">{context.cartProductCount}</p>
              </div>
            </Link>
          ) : (
            <div className="relative inline-block opacity-50 cursor-not-allowed">
              <FiShoppingCart className="text-2xl" />
              <div className="absolute -top-3 -right-3 bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center z-10">
                <p className="text-xs">0</p>
              </div>
            </div>
          )}

          {/* Login / Logout */}
          <div className='ml-3'>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className='px-3 py-1 rounded-full text-white bg-blue-500 hover:bg-blue-700'
              >
                Logout
              </button>
            ) : (
              <Link to={"/login"}>
                <button className='px-3 py-1 rounded-full text-white bg-blue-500 hover:bg-blue-700'>
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;