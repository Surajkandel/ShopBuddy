import {createBrowserRouter} from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Forgetpassword from '../pages/Forgetpassword'
import AdminPannel from '../pages/AdminPannel'
import AllUsers from '../pages/AllUsers'
import PendingSellers from '../pages/PendingSellers'
import AllProducts from '../pages/AllProducts'




const router = createBrowserRouter([
    {
        path : '/',
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "login",
                element : <Login/>
            },
            {
                path : "signup",
                element : <Signup/>
            },
            {
                path : "forget-password",
                element : <Forgetpassword/>
            },
            {
                path : "admin-pannel",
                element : <AdminPannel/>,
                children :[
                    {
                        path: "all-users",
                        element: <AllUsers/>
                    },
                    {
                        path: "all-products",
                        element: <AllProducts/>
                    },
                    {
                        path: "pending-sellers",
                        element: <PendingSellers/>
                    }
                ]
            }

        ]
    }
])

export default router;