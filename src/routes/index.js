import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Forgetpassword from '../pages/Forgetpassword'
import AdminPannel from '../pages/AdminPannel'
import AllUsers from '../pages/AllUsers'
import PendingSellers from '../pages/PendingSellers'
import AllProducts from '../pages/AllProducts'

import UpdateUserDetails from '../pages/UpdateUserDetails'
import UserPannel from '../pages/UserPannel'
import SellerPannel from '../pages/SellerPannel'
import CategoryProduct from '../pages/CategoryProduct'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import SearchProduct from '../pages/SearchProduct'
import SignupPage from '../pages/SignupPage'
import SellerSignup from '../pages/SellerSignup'
import Notifications from '../pages/Notification'




const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "signup",
                element: <SignupPage />
            },
            {
                path: "seller-signup/:userId",
                element: <SellerSignup />
            },
            {
                path: "forget-password",
                element: <Forgetpassword />
            },
            {
                path: "search",
                element: <SearchProduct/>

            },
            {
                path: "admin-pannel",
                element: <AdminPannel />,
                children: [
                    {
                        path: "all-users",
                        element: <AllUsers />
                    },
                    {
                        path: "all-products",
                        element: <AllProducts />
                    },
                    {
                        path: "pending-sellers",
                        element: <PendingSellers />
                    }
                ]
            },
            {
                path: "product-category/:categoryName",
                element: <CategoryProduct/>
            },
            {
                path: "product/:productId",
                element : <ProductDetails/>

            },
            {
                path: "cart",
                element : <Cart/>

            },
            {
                path: "notifications",
                element : <Notifications/>

            },
            {
                path: "seller-pannel",
                element: <SellerPannel />,
                children: [
                    {
                        path: "update-details",
                        element: <UpdateUserDetails/>

                    },
                    {
                        path: "all-products",
                        element: <AllProducts />
                    }
                ]
            },
            {
                path: "user-pannel",
                element: <UserPannel />,
                children: [
                    {
                        path: "update-details",
                        element: <UpdateUserDetails/>

                    }
                ]
            }

        ]
    }
])

export default router;