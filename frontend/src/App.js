import './index.css';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import summaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);

  const fetchUserDetails = async () => {
    const response = await fetch(summaryApi.current_user.url, {
      method: summaryApi.current_user.method,
      credentials: 'include',
    });
    const data = await response.json();
    if (data.success) {
      dispatch(setUserDetails(data.data));
    }
  };

  const fetchUserAddToCart = async () => {
    const response = await fetch(summaryApi.countAddToCartProduct.url, {
      method: summaryApi.countAddToCartProduct.method,
      credentials: 'include',
    });
    const data = await response.json();
    setCartProductCount(data?.data?.count || 0);
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserAddToCart();
  }, []);

  return (
    <Context.Provider
      value={{
        fetchUserDetails,
        cartProductCount,
        fetchUserAddToCart,
      }}
    >
      <ToastContainer />
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </Context.Provider>
  );
}

export default App;
