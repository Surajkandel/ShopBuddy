import React, { useEffect, useState } from 'react'
import AddProduct from '../components/AddProduct'
import summaryApi from '../common'
import { useSelector } from 'react-redux'
import SellerProductCard from '../components/SellerProductCard'

const AllProducts = () => {
  const currentUser = useSelector(state => state?.user?.user)
  const [openAddProduct, setOpenAddProduct] = useState(false)
  const [productToEdit, setProductToEdit] = useState(null)
  const [allProduct, setAllProduct] = useState([])
  const [userProducts, setUserProducts] = useState([])

  const fetchAllProduct = async () => {
    try {
      const response = await fetch(summaryApi.allProduct.url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const dataResponse = await response.json()
      setAllProduct(dataResponse?.data || [])

      if (currentUser?._id) {
        const filteredProducts = dataResponse?.data?.filter(
          product => product?.userId === currentUser._id
        ) || []
        setUserProducts(filteredProducts)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  useEffect(() => {
    fetchAllProduct()
  }, [currentUser?._id]) 


  return (
    <div className=''>
      <div>
        <div className='flex bg-white rounded-lg shadow-md p-6'>
          <h2 className='font-bold text-xl'>My Products</h2>
          <button 
            className='border bg-slate-100 p-1 rounded-md ml-auto text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            onClick={() => {
              setProductToEdit(null)
              setOpenAddProduct(true)
            }}
          >
            Add product
          </button>
        </div>

        {/* User's products show */}
        <div className='flex gap-2 flex-wrap mt-4'>
          {userProducts.length > 0 ? (
            userProducts.map((product) => (
              <SellerProductCard 
                key={product._id} 
                product={product} 
                onEdit={(product) => {
                  setProductToEdit(product)
                  setOpenAddProduct(true)
                }} 
              />
            ))
          ) : (
            <div className="w-full text-center py-8">
              <p className="text-gray-500">You haven't added any products yet</p>
              <button 
                className="mt-4 text-blue-600 hover:text-blue-800"
                onClick={() => setOpenAddProduct(true)}
              >
                Add your first product
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add product modal (Add/Edit) */}
      {openAddProduct && (
        <AddProduct 
          onClose={() => {
            setOpenAddProduct(false)
            setProductToEdit(null)
            fetchAllProduct()
          }}
          productData={productToEdit} // pass to modal
        />
      )}
    </div>
  )
}

export default AllProducts
