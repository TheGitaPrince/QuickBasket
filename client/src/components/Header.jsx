import React,{useState, useEffect} from "react";
import QuickBasket from "../assets/QuickBasket.png";
import Search from "./Search.jsx";
import { Link,useLocation,useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import useMobile from "../utils/useMobile.jsx";
import { BsCart4 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { VscTriangleDown } from "react-icons/vsc";
import { VscTriangleUp } from "react-icons/vsc";
import { logout } from "../store/userSlice.js"
import { getCartItems } from "../store/cartSlice.js";
import { resetCart } from "../store/cartSlice.js";

function Header() {
  const [isMobile] = useMobile()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [openUserManu,setOpenUserManu] = useState(false);
  const { cartItems } = useSelector((state)=>state.cart)

  const isSearch = location.pathname === "/search"
  
  const redirectToLoginPage = ()=>{
    navigate("/login")
  }
  
  const toggleOpenUserMenu = ()=>{
      setOpenUserManu(!openUserManu);
  }

  const handleMobileUser = ()=>{
    if(!user){
      navigate("/login")
      return
    }
    navigate("/user")
  }

  const handleLogutOut = async()=>{
    await dispatch(logout())
    dispatch(resetCart());
    navigate("/")
  }

  useEffect(() => {
    if (user) {
      dispatch(getCartItems());
    }
  }, [dispatch,  user])
  
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice = cartItems.reduce((acc,item)=>{
     const product = item?.productId;
     const price = product.price || 0;
     const discount = product.discount || 0;
    
     const discountedPrice = price - (price * discount) / 100;
     return acc + discountedPrice * item.quantity;
  },0)

  const displayPrice = (price)=>{
    return new Intl.NumberFormat("en-IN",{
        style: "currency",
        currency: "INR"
    }).format(price)
  }

  return (
    <header className="md:h-20 h-24 flex flex-col md:flex-row justify-center md:justify-between md:items-center bg-white gap-1 sticky top-0 z-50 md:shadow px-3 md:p-5">
      {
        !(isSearch && isMobile) && (
          <div className="flex items-center justify-between w-full ">
              <Link to="/">
                 <div className="md:w-50 w-45">
                    <img
                     className="w-full object-contain rounded-lg"
                     src={QuickBasket}
                     alt="QuickBasket"
                   />
                 </div>
              </Link>
              <div className="hidden md:block">
                <Search/>
              </div>
              <div className="h-full ">
                   <div onClick={handleMobileUser} className="md:hidden relative text-neutral-600 cursor-pointer">
                     <FaRegUserCircle className="size-7"/>
                   </div>
                   <div className="hidden md:flex flex-row items-center gap-7">
                     {
                        user?(
                          <div className="relative">
                             <div onClick={toggleOpenUserMenu} className=" flex items-center text-md hover:text-primary-200 gap-1.5 cursor-pointer">
                               <p>Account</p>
                              { openUserManu?( <VscTriangleUp className="size-5"/> ):( <VscTriangleDown className="size-5"/>) }
                             </div>
                             {openUserManu && (
                              <div className="absolute top-13 right-0">
                                  <div className="rounded-b bg-white w-40 p-2 flex flex-col shadow">
                                        <Link onClick={()=>setOpenUserManu(false)} to="/dashboard/profile" className="hover:bg-neutral-200 transition-all duration-300 p-2 text-sm rounded">Your Information</Link>
                                      <div className="flex flex-col gap-1 cursor-pointer text-neutral-700 text-sm">
                                        <Link onClick={()=>setOpenUserManu(false)} to="/dashboard/myorders" className="hover:bg-neutral-200 transition-all duration-300 p-2 rounded">My Orders</Link>
                                        <Link onClick={()=>setOpenUserManu(false)} to="/dashboard/address" className="hover:bg-neutral-200 transition-all duration-300 p-2 rounded ">Saved Address</Link>
                                        <button onClick={handleLogutOut} className="flex hover:bg-neutral-200 cursor-pointer transition-all duration-300 p-2 rounded">Logout</button>
                                      </div>
                                  </div>
                              </div>
                             )}
                          </div>
                        ):(
                          <button onClick={redirectToLoginPage} className="cursor-pointer font-semibold text-neutral-600">Login</button>
                        )
                     }
                     <Link to="/cart" className="flex flex-row items-center rounded-lg bg-green-800 hover:bg-green-700 cursor-pointer text-white gap-2 px-3 py-2">
                        <div className="animate-bounce p-1">
                           <BsCart4 className="size-6"/>
                        </div>
                           {
                            cartItems.length?(
                              <div className="font-semibold text-sm flex flex-col">
                                  <span>{totalQuantity} items</span>
                                  <span>{displayPrice(totalPrice)}</span>
                              </div>
                            ):(
                              <p className="font-semibold">Cart items</p>
                            )
                           }
                     </Link>
                   </div>
              </div>
          </div>
        )
      }
      <div className="md:hidden px-2">
        <Search/>
      </div>
    </header>
  );
}

export default Header;
