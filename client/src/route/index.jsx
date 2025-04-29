import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home.jsx";
import Search from "../components/Search.jsx";
import SearchPage from "../pages/SearchPage.jsx";
import Register from "../pages/Register.jsx"
import Login from "../pages/Login.jsx"
import ForgotPassword from "../pages/ForgotPassword.jsx"
import OtpVerification from "../pages/OtpVerification.jsx"
import ResetPassword from "../pages/ResetPassword.jsx"
import VerifyEmail from "../pages/VerifyEmail.jsx"
import UserMenuMobile from "../pages/UserMenuMobile.jsx"
import DashBoard from "../layout/DashBoard.jsx";
import Profile from "../pages/Profile.jsx";
import Address from "../pages/Address.jsx";
import MyOrders from "../pages/MyOrders.jsx";
import Product from "../pages/Product.jsx";
import SubCategoryPage from "../pages/SubCategoryPage.jsx";
import UploadProduct from "../pages/UploadProduct.jsx";
import CategoryPage from "../pages/CategoryPage.jsx";
import ProductList from "../pages/ProductList.jsx";
import ProductDisplay from "../pages/ProductDisplay.jsx";
import CartPage from "../pages/CartPage.jsx";
import Payment from "../pages/Payment.jsx";
import OrderCancel from "../pages/OrderCancel.jsx";
import OrderSuccess from "../pages/OrderSuccess.jsx";
import AdminRoute from "../components/AdminRoute.jsx";
import AdminPage from "../pages/AdminPage.jsx";


export const router = createBrowserRouter([
    {
        path : "/",
        element: <App/>,
        children:[
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "search",
                element: <SearchPage/>
            },
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "register",
                element: <Register/>
            },
            {
                path:"Verify-email",
                element:<VerifyEmail/>
            },
            {
                path:"forgot-password",
                element:<ForgotPassword/>
            },
            {
                path:"otp-verification",
                element:<OtpVerification/>
            },
            {
                path:"reset-password",
                element:<ResetPassword/>
            },
            {
                path:"user",
                element:<UserMenuMobile/>
            },
            {
                path: "dashboard",
                element: <DashBoard/>,
                children:[
                    {
                        path:"myorders",
                        element:<MyOrders/>
                    },
                    {
                        path:"profile",
                        element:<Profile/>
                    },
                    {
                        path:"address",
                        element:<Address/>
                    },
                    {
                        path:"category",
                        element:<AdminRoute><CategoryPage /></AdminRoute>
                    },
                    {
                        path:"sub-category",
                        element:<AdminRoute><SubCategoryPage/></AdminRoute>
                    },
                    {
                        path:"upload-product",
                        element:<AdminRoute><UploadProduct/></AdminRoute>
                    },
                    {
                        path:"product",
                        element:<AdminRoute><Product/></AdminRoute>
                    },
                    {
                        path:"admin-page",
                        element:<AdminRoute><AdminPage/></AdminRoute>
                    },
                ]
            },
            {
              path: ":category",
              children:[
                {
                    path:":subcategory",
                    element: <ProductList/>
                }
              ]
            },
            {
                path: "product/:product",
                element: <ProductDisplay/>
            },
            {
                path: "cart",
                element: <CartPage/>
            },
            {
                path: "payment",
                element: <Payment/>
            },
            {
                path: "order-success",
                element: <OrderSuccess/>
            },
            {
                path: "order-cancel",
                element: <OrderCancel/>
            },             
        ]
    }
])