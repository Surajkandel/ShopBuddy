import React from 'react'
import CategoryWiseProduct from '../components/CategoryWiseProduct'
import BannerProduct from '../components/BannerProduct'

const Home = () => {
  return (
    <div className='bg-slate-100'>
      <BannerProduct/>
      <CategoryWiseProduct/>

      

    </div>
  )
}

export default Home
