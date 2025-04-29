import React from 'react'
import { addItemToCart, getCartItems , updateCartItem, deleteCartItem} from "../store/cartSlice.js";
import { useDispatch, useSelector } from "react-redux";

function AddToCart({_id}) {
    const { cartItems } = useSelector((state)=>state.cart)
    const dispatch = useDispatch()


    const handleCartItem = async(e)=>{
        e.preventDefault();
        e.stopPropagation();
        await dispatch(addItemToCart({ productId: _id }))
        await dispatch(getCartItems());
    }
   
    const cartItem = cartItems.find(item => item?.productId?._id === _id);
   
    const handleIncrease = async(e) => {
           e.preventDefault();
           e.stopPropagation();
           await dispatch(updateCartItem({ cartItemId: cartItem._id, quantity: cartItem.quantity + 1 }));
           await dispatch(getCartItems());
    };
   
    const handleDecrease = async (e) => {
          e.preventDefault();
          e.stopPropagation();
          if(cartItem.quantity > 1){
           await dispatch(updateCartItem({ cartItemId: cartItem._id, quantity: cartItem.quantity - 1 }));
          }else{
           await dispatch(deleteCartItem({ cartItemId: cartItem._id }));
          }
          await dispatch(getCartItems());
    };
   
    const stopPropagation = (e) => {
      e.preventDefault();
      e.stopPropagation();
    }
  return (
    <div onClick={stopPropagation}>
        {cartItem && cartItem.quantity > 0 ? (
            <div className="flex w-fit gap-1 px-2  text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded">
              <button onClick={handleDecrease} className="p-1  cursor-pointer" >-</button>
              <span className="p-1 ">{cartItem.quantity}</span>
              <button  onClick={handleIncrease} className="p-1  cursor-pointer">+</button>
            </div>
           ) : (
            <button 
              onClick={handleCartItem}
              className="hover:bg-green-700 text-white hover:text-white bg-green-600  border-green-500 font-medium border px-4 py-0.5 rounded cursor-pointer">
              ADD
            </button>
           )
        }
    </div>
  )
}

export default AddToCart