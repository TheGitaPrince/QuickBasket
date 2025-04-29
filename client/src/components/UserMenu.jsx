import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/userSlice.js"
import { Link, useNavigate } from "react-router-dom"; 
import { isAdmin } from "../utils/isAdmin.js";
import { getCartItems } from "../store/cartSlice.js";
import { requestAdminAccess } from "../store/userSlice.js"
import { resetCart } from "../store/cartSlice.js";

function UserMenu() {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate()

    const handleLogutOut = async () => {
        await dispatch(logout());
        dispatch(resetCart());
          navigate("/")  
    }

    const handleRequestAccess = async () => {
        await dispatch(requestAdminAccess())
    }
    
    return (
        <div className="flex flex-col text-neutral-600 items-start justify-center cursor-pointer w-full px-4">
            <div className="flex flex-col items-center justify-center mb-4">
               <p className="text-xl text-neutral-800 w-full">Your Information</p>
               {
                isAdmin(user?.role) ?(
                <Link to="/dashboard/admin-page" className=" text-red-700 text-sm font-medium">({user?.role})</Link>
                ):(
                <button  
                onClick={handleRequestAccess}
                className=" text-red-700 text-sm font-medium cursor-pointer">(Request for admin)</button>
               )
               }
            </div>
            <Link to="/dashboard/profile" className="w-full hover:bg-primary-100 rounded p-2 hover:text-white">My Profile</Link>

            {isAdmin(user?.role) && (
              <>
                <Link to="/dashboard/category" className="w-full hover:bg-primary-100 rounded p-2 hover:text-white">Category</Link>
                <Link to="/dashboard/sub-category" className="w-full hover:bg-primary-100 rounded p-2 hover:text-white">Sub Category</Link>
                <Link to="/dashboard/upload-product" className="w-full hover:bg-primary-100 rounded p-2 hover:text-white">Upload Product</Link>
                <Link to="/dashboard/product" className="w-full hover:bg-primary-100 rounded p-2 hover:text-white">Product</Link>
              </>
            )}

            <Link to="/dashboard/myorders" className="w-full hover:bg-primary-100 rounded p-2 hover:text-white">Order History</Link>
            <Link to="/dashboard/address" className="w-full hover:bg-primary-100 rounded p-2 hover:text-white">Saved Address</Link> 
            <Link onClick={handleLogutOut} className="w-full hover:bg-primary-100 rounded p-2 hover:text-white">Logout</Link>
        </div>
    )
}

export default UserMenu
