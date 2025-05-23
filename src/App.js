// npm run tailwind:watch
// npx tailwindcss -i ./src/styles/tailwind.css -o ./src/styles/output.css --watch
import './index.css';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import summaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {

  const dispatch = useDispatch()

  const fetchUserDetails = async () => {
    const dataResponce = await fetch(summaryApi.current_user.url, {
      method: summaryApi.current_user.method,
      credentials: 'include'

    })

    const dataApi = await dataResponce.json()


    if(dataApi.success){
      dispatch(setUserDetails(dataApi.data))

    }

    // console.log("data-user", dataResponce)

  }

  useEffect(() => {
    // user details
    fetchUserDetails()

  })
  return (
    <>
      <Context.Provider value={{
        fetchUserDetails  //user details fetch


      }}>


        <ToastContainer />
        <Header />
        <Outlet />
        <Footer />

      </Context.Provider>
    </>

  );
}

export default App;

