import React, { useState } from 'react'
import AddProduct from '../components/AddProduct'

const AllProducts = () => {

  const [openAddProduct, setOpenAddProduct] = useState(false) 
  return (
    <div className=''>
    <div className='flex '>
      <div>
        <h2 className='font-bold text-xl'>
          All products
        </h2>
      </div>
     <button className='border bg-slate-100  p-1 rounded-md ml-auto text-gray-700 hover:bg-blue-50 hover:text-blue-600 ' onClick={()=>setOpenAddProduct(true)}>Add product</button>

     </div>


     {/* add product */}
     {
        openAddProduct &&
         (<AddProduct onClose ={()=> setOpenAddProduct(false)} />)
        

     }
    </div>

  )
}

export default AllProducts
