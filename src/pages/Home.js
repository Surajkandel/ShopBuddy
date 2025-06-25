import React from 'react'
import CategoryWiseProduct from '../components/CategoryWiseProduct'
import BannerProduct from '../components/BannerProduct'
import AllProductShow from '../components/AllProductshow'

const Home = () => {
  return (
    <div className='bg-slate-100'>
      <BannerProduct/>
      <CategoryWiseProduct/>
      <AllProductShow/>

      

    </div>
  )
}

export default Home
