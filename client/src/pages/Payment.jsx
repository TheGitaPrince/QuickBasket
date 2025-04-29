import React,{ useState, useEffect } from 'react'
import AddAddress from "../components/AddAddress.jsx";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, getAddress } from "../store/addressSlice.js"
import { getCartItems } from "../store/cartSlice.js";
import { cashOnDelivery, onlinePaymentOrder } from "../store/orderSlice.js";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

function Payment() {
    const { isLoading, addressList } = useSelector((state) => state.address);
    const { cartItems } = useSelector((state) => state.cart);
    const [openAddAddress, setOpenAddAddress] = useState(false)
    const [selectedAddressId, setSelectedAddressId ] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
     
    useEffect(() => {
      dispatch(getAddress())
      dispatch(getCartItems())
    }, [dispatch])

    const handleCashOnDelivery = async () => {
        const response =  await dispatch(cashOnDelivery({
            cartItems,
            delivery_address: selectedAddressId
        }))
        if (cashOnDelivery.fulfilled.match(response)) {
            await dispatch(getCartItems())
            navigate("/order-success");
        }
    }

    const handleOnlinePayment = async () => {
        const response = await dispatch(onlinePaymentOrder({
          cartItems,
          delivery_address: selectedAddressId,
        }));

        if (onlinePaymentOrder.fulfilled.match(response)) {
          const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
          const sessionId = response?.payload?.data?.sessionId;
          await stripe.redirectToCheckout({ sessionId });
        }
    };

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

  return (
    <section className="md:p-4 p-2 bg-white md:min-h-[76vh] min-h-[71vh]">
        <div className="grid md:grid-cols-6" >
            <div className="md:col-span-4 md:max-w-xl mx-auto w-full">
                 <h2 className="md:text-2xl text-xl font-medium text-neutral-800 px-2 md:py-2 mb-3">Choose your address</h2>
                 <div className="">
                    { addressList && addressList.length > 0 &&(
                      addressList.map((address,index)=>(
                            <div key={index+22} className="flex flex-row items-start gap-3 bg-white p-4 mb-4 rounded shadow-sm">
                               <div className="">
                                  <input 
                                  type="radio"
                                  name="selectedAddress"
                                  value={address._id}
                                  checked={selectedAddressId === address._id}
                                  onChange={() => setSelectedAddressId(address._id)}
                                  className="cursor-pointer h-5 w-5 accent-green-600"
                                  />
                               </div>
                               <div className="flex flex-col justify-center">
                                  <h3 className="text-lg font-medium">{address.address_line}</h3>
                                  <p className="text-sm text-gray-600">{`${address.city}, ${address.state}, ${address.pincode}`}</p>
                                  <p className="text-sm text-gray-600">{address.country}</p>
                                  <p className="text-sm text-gray-600 mt-1">+91{address.mobile}</p>
                               </div> 
                            </div>
                        )))
                    }
                 </div>
                 <div 
                 onClick={()=>setOpenAddAddress(true)} 
                 className="flex items-center justify-center text-md shadow text-gray-800 font-medium p-4 bg-blue-100 border-1 rounded cursor-pointer">
                    Add Address
                 </div>
                 {
                    openAddAddress && (
                        <AddAddress closeAddAddress = {()=> setOpenAddAddress(false)}/>
                    )
                 }
            </div>
            <div className="md:col-span-2 md:px-10 px-1 mx-auto w-full mt-5 md:mt-0">
              <h2 className="md:text-2xl text-xl font-medium text-neutral-800 mb-2 md:px-4">Payment Summary</h2>
              <div className="bg-white rounded md:shadow-none shadow w-full md:p-4">
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
                <div className="flex flex-col gap-2 mt-4">
                   <button
                   onClick={handleOnlinePayment} 
                   className="bg-green-600 rounded py-1 text-neutral-200 cursor-pointer">Online Payment</button>
                   <button 
                   onClick={ handleCashOnDelivery }
                   className="bg-green-600 rounded py-1 text-neutral-200 cursor-pointer">Cash On delivery</button>
                </div>
              </div>
            </div>
        </div>
    </section>
  )
}

export default Payment