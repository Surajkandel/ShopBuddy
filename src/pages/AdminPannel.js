import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const AdminPannel = () => {
    return (
        <div className='flex'>
            <div class='mx-6'>
                <div>
                    <Link to='./all-users'>All users </Link>
                </div>
                <div>
                    <Link to='./pending-sellers'>Pending sellers </Link>
                </div>
                <div>
                    <Link to='./all-products'>All Products</Link>
                </div>


            </div>

            <div className='bg-blue-600 h-36'>
                <Outlet />

            </div>
        </div>
    )
}

export default AdminPannel
