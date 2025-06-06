import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import ROLE from '../common/role'

const AdminPannel = () => {
    const user = useSelector(state => state?.user?.user)
    const isLoading = useSelector(state => state?.user?.isLoading);
    const navigate = useNavigate()
    console.log("role ", ROLE.ADMIN)
    console.log("role GIE ", user?.role)

     useEffect(() => {
        if (!isLoading && user) {
            if (user.role !== ROLE.ADMIN) {
                navigate("/");
            }
        }
    }, [user, isLoading, navigate])

    

    return (
        <div className='flex min-h-screen bg-gray-100'>
            {/* Sidebar */}
            <div className='w-64 bg-white shadow-md p-6'>
                <h1 className='text-2xl font-bold text-gray-800 mb-8 border-b pb-4'>Admin Dashboard</h1>
                
                <nav className='space-y-4'>
                    <div>
                        <Link 
                            to='./all-users' 
                            className='block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200'
                        >
                            All Users
                        </Link>
                    </div>
                    <div>
                        <Link 
                            to='./pending-sellers' 
                            className='block px-4 py-2 text-black-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200'
                        >
                            Pending Sellers
                        </Link>
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
            <div className='flex-1 p-8'>
                <div className='bg-white rounded-lg shadow-md p-6'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminPannel