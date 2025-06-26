// npm run tailwind:watch
// npx tailwindcss -i ./src/styles/tailwind.css -o ./src/styles/output.css --watch
import './index.css';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import summaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {

  const dispatch = useDispatch()
  const [cartProductCount, setCartProductCount]= useState(0)

  const fetchUserDetails = async () => {
    const dataResponce = await fetch(summaryApi.current_user.url, {
      method: summaryApi.current_user.method,
      credentials: 'include'

    })

    const dataApi = await dataResponce.json()

    // console.log("data-user", dataResponce)


    if (dataApi.success) {
      dispatch(setUserDetails(dataApi.data))

    }
  }

  const fetchUserAddToCart = async () => {
    const dataResponce = await fetch(summaryApi.countAddToCartProduct.url, {
      method: summaryApi.countAddToCartProduct.method,
      credentials: 'include'

    })

    const dataApi = await dataResponce.json()

    console.log("cartproduct", dataApi?.data?.count)
    setCartProductCount(dataApi?.data?.count)

  }





  useEffect(() => {
    // user details
    fetchUserDetails()
    // user cart product 
    fetchUserAddToCart()

  })
  return (
    <>
      <Context.Provider value={{
        fetchUserDetails,  //user details fetch
        cartProductCount, //current user add to cart product count
        fetchUserAddToCart


      }}>


        <ToastContainer />
        <Header />
        <main className='pt-16'></main>
        <Outlet />
        <Footer />

      </Context.Provider>
    </>

  );
}

export default App;

