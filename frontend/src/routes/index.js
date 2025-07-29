import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Forgetpassword from '../pages/Forgetpassword';
import AdminPannel from '../pages/AdminPannel';
import AllUsers from '../pages/AllUsers';
import PendingSellers from '../pages/PendingSellers';
import AllProducts from '../pages/AllProducts';
import SellerSignup from '../pages/SellerSignup';
import SignupPage from '../pages/SignupPage';
import UpdateUserDetails from '../pages/UpdateUserDetails';
import UserPannel from '../pages/UserPannel';
import SellerPannel from '../pages/SellerPannel';
import CategoryProduct from '../pages/CategoryProduct';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import SearchProduct from '../pages/SearchProduct';
import Notifications from '../pages/Notification'

// ✅ NEW IMPORTS
import CheckoutPage from '../pages/CheckoutPage';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentFailure from '../pages/PaymentFailure';
import ViewReview from '../pages/ViewReview';
import WriteReview from '../pages/WriteReview';
import MyOrdersPage from '../pages/MyOrders';
import CheckStatus from '../components/CheckStatus';
import Recommendation from '../components/Recommendation';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: "notifications",
        element: <Notifications />

      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path : 'write-review/:productId',
        element: <WriteReview/>
      },
      {
        path : 'view-review/:productId',
        element: <ViewReview/>
      },
      {
        path: 'seller-signup/:userId',
        element: <SellerSignup />,
      },
      {
        path: 'forget-password',
        element: <Forgetpassword />,
      },
      {
        path: 'search',
        element: <SearchProduct />,
      },
      {
        path: 'admin-pannel',
        element: <AdminPannel />,
        children: [
          {
            path: 'all-users',
            element: <AllUsers />,
          },
          {
            path: 'all-products',
            element: <AllProducts />,
          },
          {
            path: 'pending-sellers',
            element: <PendingSellers />,
          },
        ],
      },
      {
        path: 'product-category/:categoryName',
        element: <CategoryProduct />,
      },
      {
        path: 'product/:productId',
        element: <ProductDetails />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },

      // ✅ NEW ROUTES FOR ESEWA
      {
        path: 'checkoutPage',
        element: <CheckoutPage />,
      },
      {
        path: 'payment/success',
        element: <PaymentSuccess />,
      },
      {
        path: 'payment/failure',
        element: <PaymentFailure />,
      },
      {
        path:'myorders',
        element : <MyOrdersPage/>

      },
      {
        path: '/check-status/:status',
        element: <CheckStatus />

      },

      {
        path: 'seller-pannel',
        element: <SellerPannel />,
        children: [
          {
            path: 'update-details',
            element: <UpdateUserDetails />,
          },
          {
            path: 'all-products',
            element: <AllProducts />,
          },
        ],
      },
      {
        path: 'recommendation',
        element: <Recommendation/>
      },
      {
        path: 'user-pannel',
        element: <UserPannel />,
        children: [
          {
            path: 'update-details',
            element: <UpdateUserDetails />,
          },
        ],
      },
    ],
  },
]);

export default router;
