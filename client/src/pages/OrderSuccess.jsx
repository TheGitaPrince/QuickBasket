import React, { useEffect }  from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { verifyPayment } from "../store/orderSlice.js";
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getCartItems } from "../store/cartSlice.js";

function OrderSuccess() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    if (sessionId) {
      dispatch(verifyPayment({ sessionId }))
      .unwrap()
      .then(() => {
        dispatch(getCartItems());
      })
    }
  }, [location.search, dispatch ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[76vh] bg-green-50 px-4">
      <CheckCircle2 className="text-green-600 w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold text-green-700 mb-2">Order Successfully!</h1>
      <p className="text-neutral-700 mb-6 text-center max-w-md">
        Thank you for your purchase. Your order has been confirmed and will be processed shortly.
      </p>
      <div className="flex gap-4">
        <Link to="/" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
          Continue Shopping
        </Link>
        <Link to="/dashboard/myorders" className="border border-green-600 text-green-700 font-medium py-2 px-4 rounded-lg hover:bg-green-100 transition duration-300">
          View Orders
        </Link>
      </div>
    </div>
  )
}

export default OrderSuccess
