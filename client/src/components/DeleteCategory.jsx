import React from 'react'
import { deleteCategory, getCategory } from "../store/categorySlice.js"
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";


function DeleteCategory({category,closeDeleteCategory}) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.category);

  const handleDeleteCategory = async() => {
    const response = await dispatch(deleteCategory(category._id))
      
    if(deleteCategory.fulfilled.match(response)){
      await dispatch(getCategory());
      closeDeleteCategory(); 
    }
    
  };

  return (
    <section className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
    <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
      <button
        onClick={closeDeleteCategory}
        className="absolute top-3 right-3 text-gray-500 hover:text-primary-200 cursor-pointer"
      >
        <IoClose size={24} />
      </button>
      <h2 className="text-lg font-semibold text-gray-800">
        Delete Category
      </h2>
      <p className="text-sm text-gray-600 mt-2">
        Are you sure you want to delete <b>{category?.name}</b>? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={closeDeleteCategory}
          className="px-3 py-1 cursor-pointer bg-green-800 text-white border rounded-lg hover:bg-green-700"
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteCategory}
          disabled={isLoading}
          className={`px-3 py-1 text-white rounded-lg cursor-pointer ${
            isLoading ? "bg-red-300" : "bg-red-700 hover:bg-red-600"
          }`}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </section>
);
  
}

export default DeleteCategory