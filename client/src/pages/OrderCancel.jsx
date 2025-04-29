import React from 'react'
import { Link } from 'react-router-dom'
import { XCircle } from 'lucide-react'

function OrderCancel() {
  return (
    <div className="flex flex-col items-center justify-center md:min-h-[76vh] min-h-[73vh] bg-red-50 px-4">
      <XCircle className="text-red-600 w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold text-red-700 mb-2">Order Cancelled</h1>
      <p className="text-neutral-700 mb-6 text-center max-w-md">
        It seems your payment was not completed, and the order has been cancelled. You can try again or contact support if needed.
      </p>

      <div className="flex gap-4">
        <Link to="/" className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
          Return Home
        </Link>
        <Link to="/cart" className="border border-red-600 text-red-700 font-medium py-2 px-4 rounded-lg hover:bg-red-100 transition duration-300">
          Try Again
        </Link>
      </div>
    </div>
  )
}

export default OrderCancel
