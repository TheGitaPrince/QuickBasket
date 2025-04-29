import React from 'react'
import { BsCart4 } from "react-icons/bs";
import { FaCaretRight } from "react-icons/fa6";
import { Link,  useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function CartMobile() {
    const { cartItems } = useSelector((state)=>state.cart)
    const location = useLocation()

    if (location.pathname === "/cart") return null;

    const displayPrice = (price)=>{
        return new Intl.NumberFormat("en-IN",{
            style: "currency",
            currency: "INR"
        }).format(price)
    }

    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const totalPrice = cartItems.reduce((acc,item)=>{
        const product = item?.productId;
        const price = product.price || 0;
        const discount = product.discount || 0;
       
        const discountedPrice = price - (price * discount) / 100;
        return acc + discountedPrice * item.quantity;
    },0)

  return (
        cartItems && cartItems.length > 0 && (
            <div className="sticky bottom-0">
               <div className="bg-green-700 flex md:hidden justify-between items-center p-2 text-neutral-300">
                  <div className="flex gap-2">
                    <BsCart4 className="size-8"/>
                    <div className="font-semibold text-sm flex flex-col">
                       <span>{totalQuantity} items</span>
                       <span>{displayPrice(totalPrice)}</span>
                    </div>
                  </div>
                  <Link to="/cart" className="flex items-center hover:text-black">
                    <p className="">View Cart</p>
                    <FaCaretRight />
                  </Link>
               </div>
            </div>
        )
  )
}

export default CartMobile