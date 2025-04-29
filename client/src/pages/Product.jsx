import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../store/productSlice.js"
import { IoSearch } from "react-icons/io5";
import  Loading from "../components/Loading.jsx";
import DeleteProduct from "../components/DeleteProduct.jsx";
import EditProducts from "../components/EditProducts.jsx";

function Product() {
  const dispatch = useDispatch();
  const { products, totalNoPage, totalCount, page, limit, loading } = useSelector((state) => state.product);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openEditProduct,setOpenEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDeleteProduct,setOpenDeleteProduct] = useState(false);

  useEffect(() => {
     const searchHandler = setTimeout(() => {
       setDebouncedSearch(search)
     },1000);

     return () => {
       clearTimeout(searchHandler);
     };
  }, [search])
  
  const handleEditProduct = (product)=>{
    setSelectedProduct(product);
    setOpenEditProduct(true)
  }
  const handleDeleteProduct = (product)=>{
    setSelectedProduct(product);
    setOpenDeleteProduct(true)
  }
 
  const limits = 12
  useEffect(() => {
    dispatch(getProduct({ page: currentPage, limit: 12, search: debouncedSearch }))
  }, [dispatch, currentPage, debouncedSearch]);
  
  return (
    <section className="py-4 md:px-4">
        <div className="flex flex-row justify-between mx-auto shadow items-center p-2">
           <h2 className="font-semibold text-lg">Products</h2>
           <div className="flex items-center justify-center py-1 px-2 border-1 border-neutral-300 cursor-pointer overflow-hidden rounded-lg gap-2 text-neutral-500 group focus-within:border-primary-200">
             <input 
             type="text" 
             className="outline-none text-neutral-700"
             placeholder="Search products..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             />
             <IoSearch  className="size-5 group-focus-within:text-primary-200"/>
           </div>
        </div>
        {loading ? (
         <div className="mt-10 flex items-center justify-center ">
           <Loading/>
         </div>
        ) : (
        <div className="flex flex-wrap items-center justify-center md:gap-6 gap-2 md:mt-4 mt-3">
          { products && products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="p-3 w-40 h-60  rounded-lg shadow flex  flex-col relative">
                  <div className="h-32 w-30">
                     <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-full h-full object-contain rounded"
                     />
                  </div>
                  <p className="text-sm text-ellipsis line-clamp-2 pb-1">{product.name}</p>
                  <p className="text-sm text-gray-600">Price: ₹ {product.price}</p>
                  <div className="absolute bottom-1 left-0 right-0 flex items-center justify-between px-3">
                   <button onClick={() => handleEditProduct(product)} className="bg-green-100 text-green-600 hover:bg-green-200 text-sm cursor-pointer py-0.5 px-2 rounded">Edit</button>
                   <button onClick={() => handleDeleteProduct(product)} className="bg-red-100 text-red-600 hover:bg-red-200 text-sm cursor-pointer py-0.5 px-2 rounded">Delete</button>
                  </div>
                </div>
              ))
          ) : (
            <p>No products found</p>
          )
          }
        </div>
       )}
      <div className="flex items-center flex-col justify-center mt-4 gap-1">
           <p className="text-center mt-2">Total Products: {totalCount}</p>
          <div>
             <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-l cursor-pointer">Prev</button>
             <span className="px-4 py-2">Page {currentPage} of {totalNoPage}</span>
             <button disabled={currentPage === totalNoPage} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 bg-green-700 hover:bg-green-600  rounded-r cursor-pointer">Next</button>
          </div>
      </div>
      { openEditProduct && selectedProduct && (
             <EditProducts 
             product={selectedProduct}
             closeEditProdouct = {()=>setOpenEditProduct(false)}/>
          )
        }
        { openDeleteProduct && selectedProduct && (
             <DeleteProduct 
             product={selectedProduct}
             closeDeleteProduct = {()=>setOpenDeleteProduct(false)}/>
          )
        }
    </section>
  )
}

export default Product