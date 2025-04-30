import React from 'react'
import { useSelector } from "react-redux";
import AddToCart from "../components/addToCart.jsx"
import { useNavigate } from "react-router-dom";
import emptyCart from "../assets/pngwing.com.png";

function CartPage() {
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const displayPrice = (price)=>{
    return new Intl.NumberFormat("en-IN",{
        style: "currency",
        currency: "INR"
    }).format(price)
  }

  const totalPrice = cartItems.reduce((acc,item)=>{
    const product = item?.productId;
    const price = product.price || 0;
    const discount = product.discount || 0;
   
    const discountedPrice = price - (price * discount) / 100;

    return acc + discountedPrice * item.quantity;
  },0)

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const actualPrice = cartItems.reduce((acc,item)=>{
      const product = item?.productId;
      const price = product.price || 0;
     
      return acc + price * item.quantity;
  },0)
  
  const totalSavings = actualPrice - totalPrice;

  const handleProceedToPayment = () => {
    navigate('/payment');
  };

  return (
    <section className="bg-white">
      <div className = "max-w-xl mx-auto  md:min-h-[76vh] min-h-[71vh] px-4 py-2">
        <h2 className="font-semibold shadow p-2 w-full ">My Cart</h2>
        <div className="flex gap-4 flex-col my-4">
           {cartItems && cartItems.length?(
            cartItems.map((item)=>(
              <div key={item._id} className="shadow rounded p-2 flex flex-row justify-between items-center w-full">
                 <div className="flex flex-row gap-2">
                    <div className="md:h-20 h-18 md:w-20 w-18">
                      <img 
                      className="h-full w-full object-contain"
                      src={item.productId.image[0]} alt={item.productId.name} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-neutral-800">{item.productId.name}</p>
                      <span className="text-sm text-gray-600 font-sans">Quantity: {item.quantity}</span>
                      <div className="flex gap-2 items-center">
                        <span className="font-stretch-105%">{displayPrice(item.productId.price -(item.productId.price*item.productId.discount)/100)}</span>
                        <div className="flex text-sm text-gray-500 gap-0.5 font-stretch-extra-condensed"> 
                           <span>MRP</span>
                           <span className="line-through">{displayPrice(item.productId.price)}</span>
                        </div>
                      </div>
                    </div>
                 </div>
                 <div>
                    <AddToCart key={item.productId.name} _id={item.productId._id}/>
                 </div>
              </div>
            ))
           ):(
            <div className="flex flex-col items-center justify-center gap-4 py-5">
            <img 
              src={emptyCart} 
              alt="Empty Cart" 
              className="md:w-45 w-24 md:h-45 h-24 opacity-70"
            />
            <h3 className="text-xl font-semibold text-gray-700">Your cart is empty</h3>
            <p className="text-gray-500 text-sm">Looks like you haven't added anything yet.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded font-medium cursor-pointer"
            >
              Go to Home
            </button>
          </div>
            )
           }
        </div>
        {cartItems.length > 0 && (
        <div className="p-6 flex flex-col gap-2">
          <hr className="my-2" />
          <h2 className="text-lg font-semibold text-gray-800">Price Details</h2>
          <div className="flex justify-between text-sm text-gray-700">
            <span>Price ({totalQuantity} items)</span>
            <span>{displayPrice(actualPrice)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span>Discount</span>
            <span className="text-green-600">- {displayPrice(totalSavings)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span>Delivery Charges</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-800">
            <span>Total Amount</span>
            <span>{displayPrice(totalPrice)}</span>
          </div>
          <button 
            onClick={handleProceedToPayment}
            className="mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded cursor-pointer">
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  </section>
  )
}

export default CartPage