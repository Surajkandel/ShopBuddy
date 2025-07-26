import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const SellerPannel = () => {
  return (
     <div className='flex min-h-screen bg-gray-100'>
            {/* Sidebar */}
            <div className='w-64 bg-white shadow-md p-6'>
                <h1 className='text-2xl font-bold text-gray-800 mb-8 border-b pb-4'>Seller Dashboard</h1>
                
                <nav className='space-y-4'>
                    <div>
                        
                    </div>
                    <div>
                        
                    </div>
                    <div>
                        <Link
                            to='./all-products' 
                            className='block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200'
                        >
                            All Products
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className='flex-1 p-4'>
                <div className=' '>
                    <Outlet />
                </div>
            </div>
        </div>
  )
}

export default SellerPannel
