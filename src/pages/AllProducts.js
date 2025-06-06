import React, { useEffect, useState } from 'react'
import AddProduct from '../components/AddProduct'
import summaryApi from '../common'
import { useSelector } from 'react-redux'

const AllProducts = () => {
  const currentUser = useSelector(state => state?.user?.user)
  const [openAddProduct, setOpenAddProduct] = useState(false)
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
      
      // Filter products by current user
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
          <div>
            <h2 className='font-bold text-xl'>
              My Products
            </h2>
          </div>
          <button 
            className='border bg-slate-100 p-1 rounded-md ml-auto text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            onClick={() => setOpenAddProduct(true)}
          >
            Add product
          </button>
        </div>

        {/* User's products show */}
        <div className='flex gap-2 flex-wrap mt-4'>
          {userProducts.length > 0 ? (
            userProducts.map((product) => (
              <div key={product._id} className="p-2">
  <div className="bg-white border rounded-lg shadow-md overflow-hidden w-[320px] h-[450px] flex flex-col">
    {/* Image container with fixed aspect ratio */}
    <div className="relative w-full h-[300px] overflow-hidden">
      <img
        src={product?.productImage[0] || '/default-product.png'}
        alt={product?.productName}
        className="w-full h-full object-contain p-4"
        loading="lazy"
        onError={(e) => {
          e.target.src = '/default-product.png';
          e.target.className = 'w-full h-full object-contain p-4 bg-gray-100';
        }}
      />
    </div>
    
    {/* Product info */}
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
        {product?.productName}
      </h3>
      
      {/* Price and other details */}
      <div className="mt-auto">
        <p className="text-gray-600 font-medium">
          ${product?.price?.toFixed(2) || '0.00'}
        </p>
        {product?.stock !== undefined && (
          <p className={`text-sm mt-1 ${
            product.stock > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        )}
      </div>
    </div>
  </div>
</div>
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

      {/* Add product modal */}
      {openAddProduct && (
        <AddProduct 
          onClose={() => {
            setOpenAddProduct(false)
            fetchAllProduct() // Refresh the list
          }} 
        />
      )}
    </div>
  )
}

export default AllProducts