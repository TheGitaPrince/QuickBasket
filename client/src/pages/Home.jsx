import React, { useState, useEffect } from 'react'
import desktopImage from "../assets/desktop.png";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../store/categorySlice.js"
import { getSubCategories } from "../store/subCategoryslice.js"
import Loading from "../components/Loading.jsx";
import CategoryProduct from "../components/CategoryProduct.jsx"
import { useNavigate } from "react-router-dom";


function Home() {
  const { categories, isLoading} = useSelector((state) => state.category);
  const { subCategories } = useSelector((state) => state.subCategory);
  const {products, loading} = useSelector((state)=>state.product)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCategory());
    dispatch(getSubCategories());
   }, [dispatch]);

  const redirectProductListPage =(_id,name)=>{
     const subCategory = subCategories.find((sub)=>(sub.categoryId.some((cat)=>cat._id === _id))) 
     
     if(subCategory){
      const cleanName = name.toString().replaceAll(",","-").replaceAll("&","-").replaceAll(" ","-");
      const cleanSubName = subCategory.name.toString().replaceAll(",", "-").replaceAll("&","-").replaceAll(" ","-");
      const url = `/${cleanName}-${_id}/${cleanSubName}-${subCategory._id}`
      navigate(url)
     }
  }


  return (
    <section className="bg-white md:min-h-[76vh] min-h-[71vh] md:py-5 py-2 md:px-4 px-2">
        <div className="hidden md:block">
            <img src={desktopImage} alt="" />
        </div>
        <div>
          <h2 className="font-bold text-lg px-4 py-2">Shop By Category</h2>
        </div>
        {isLoading ? (
         <div className="mt-10 flex items-center justify-center ">
           <Loading/>
         </div>
        ) : (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
          {categories && categories.length > 0? 
          (categories.map((category) => (
            <div key={category._id} onClick={() => redirectProductListPage(category._id,category.name)} className="w-20 md:w-31 md:h-40 h-30 py-2  rounded-lg shadow hover:cursor-pointer ">
                 <img
                   src={category.image}
                   alt={category.name}
                   className="w-full h-full object-cover rounded"
                 />
            </div>
          ))):(<div>Category Not Found</div> )}
        </div>
        )}
        {
          categories && categories.length > 0 && (
            categories.map((category)=>( <CategoryProduct key={category._id} id={category._id} name={category.name}/>))
          )
        }
    </section>
  )
}

export default Home