import React, { useState } from 'react'
import AddProduct from '../components/AddProduct'

const AllProducts = () => {

  const [openAddProduct, setAddProduct] = useState(false) 
  return (
    <div className='flex'>
      <div>
        <h2 className='font-bold text-xl'>
          All products
        </h2>
      </div>
     <button className='border bg-slate-100  p-1 rounded-md ml-auto text-gray-700 hover:bg-blue-50 hover:text-blue-600 ' onClick={handleAddProduct}>Add product</button>


     {/* add product */}
     <AddProduct/>
    </div>

  )
}

export default AllProducts
