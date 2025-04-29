import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { getOrderDetails } from "../store/orderSlice";
import emptyOrder from "../assets/pngwing.com.png";

function MyOrders() {
  const { orderItems } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrderDetails())
  }, [dispatch])

  return (
    <section className="px-2 max-w-xl mx-auto">
       <div className="flex  shadow items-center rounded p-2 mb-5">
         <h2 className="font-semibold">My Orders </h2>
       </div>
       <div className="flex flex-col gap-3">
         { orderItems && orderItems.length >0 ?(
            orderItems.map((item) => (
              <div key={item._id} className="bg-white shadow rounded flex md:flex-row flex-col items-center md:items-start p-2 md:gap-3 gap-1">
                 <div className="w-30 h-30 rounded ">
                   <img
                   src={item.product_details?.image[0]}
                   alt={item.product_details?.name}
                   className="w-full h-full object-contain"
                   />
                 </div>
                <div className="flex flex-col w-full px-2">
                   <h2 className="md:text-lg font-semibold text-gray-800">{item.product_details?.name}</h2>
                   <div className="mt-1"> 
                     <p className="text-sm text-gray-600">Payment: <span className="font-medium">{item.payment_status}</span></p>
                     <p className="text-sm text-gray-600">Delivery Status: <span className="font-medium">{item.delivery_status}</span></p>
                     <p className="text-sm text-gray-600">Amount: ₹{item.totalAmt}</p>
                   </div>
                   <div className="flex md:flex-row flex-col md:items-center md:justify-between w-full text-xs gap-1 py-1 ">
                     <p className=" text-gray-500"><span className="text-gray-500">{item.orderId}</span></p>
                     <p className=" text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                   </div>
                </div>
                <div className="text-sm text-gray-700 flex flex-col w-full px-2 ">
                   <p className="font-semibold mb-1">Delivery Address:</p>
                   <p>{item.delivery_address?.address_line}</p>
                   <p>{item.delivery_address?.city}, {item.delivery_address?.state} - {item.delivery_address?.pincode}</p>
               </div>
            </div>
            ))):(
              <div className="flex flex-col items-center justify-center gap-4 py-5">
              <img 
                src={emptyOrder} 
                alt="emptyOrder" 
                className="md:w-45 w-24 md:h-45 h-24 opacity-70"
              />
              <h3 className="text-xl font-semibold text-gray-700">No Orders Yet</h3>
              <p className="text-gray-500 text-sm">Looks like you haven't placed any orders yet.</p>
              <button
                onClick={() => navigate("/")}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded font-medium cursor-pointer"
              >
                Go to Home
              </button>
            </div>
            )}
       </div>
    </section>
  )
}

export default MyOrders