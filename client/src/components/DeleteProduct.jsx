import React from 'react'
import { getProduct, deleteProduct } from "../store/productSlice.js"
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";


function DeleteProduct({product,closeDeleteProduct}) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.product);

  const handleDeleteProduct = async() => {
    const response = await dispatch(deleteProduct({_id: product._id}))
      
    if(deleteProduct.fulfilled.match(response)){
      await dispatch(getProduct());
      closeDeleteProduct(); 
    }
  };

  return (
    <section className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
    <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
      <button
        onClick={closeDeleteProduct}
        className="absolute top-3 right-3 text-gray-500 hover:text-primary-200 cursor-pointer"
      >
        <IoClose size={24} />
      </button>
      <h2 className="text-lg font-semibold text-gray-800">
        Delete Product
      </h2>
      <p className="text-sm text-gray-600 mt-2">
        Are you sure you want to delete <b>{product?.name}</b>? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={closeDeleteProduct}
          className="px-3 py-1 cursor-pointer bg-green-800 text-white border rounded-lg hover:bg-green-700"
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteProduct}
          disabled={loading}
          className={`px-3 py-1 text-white rounded-lg cursor-pointer ${
            loading ? "bg-red-300" : "bg-red-700 hover:bg-red-600"
          }`}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </section>
);
  
}

export default DeleteProduct