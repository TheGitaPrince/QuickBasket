import React,{ useEffect, useRef } from 'react'
import CardLoading from "./CardLoading.jsx"
import { useDispatch, useSelector } from "react-redux";
import { getProductByCategory } from "../store/productSlice.js";
import { Link, useNavigate } from "react-router-dom";
import CardProducts from "./CardProducts.jsx";
import { MdKeyboardArrowLeft, MdOutlineChevronRight } from "react-icons/md";

function CategoryProduct({id,name}) {
  const {products, loading, productsByCategory} = useSelector((state)=>state.product)
  const { subCategories } = useSelector((state) => state.subCategory);
  const dispatch = useDispatch()
  const scrollRef = useRef()
  const navigate = useNavigate()


  useEffect(() => {
  dispatch(getProductByCategory(id))
  }, [id]);
  
  const scrollLeft = ()=>{
    scrollRef.current.scrollLeft -= 300;
  } 
  const scrollRight = ()=>{
    scrollRef.current.scrollLeft += 300;
  } 

  const categoryProducts = productsByCategory?.[id] || [];
  const loadingCard = new Array(6).fill(null)

  const redirectProductListPage =()=>{
    const subCategory = subCategories.find((sub)=>(sub.categoryId.some((cat)=>cat._id === id))) 
    
    if(subCategory){
     const cleanName = name.toString().replaceAll(",","-").replaceAll("&","-").replaceAll(" ","-");
     const cleanSubName = subCategory.name.toString().replaceAll(",", "-").replaceAll("&","-").replaceAll(" ","-");
     const url = `/${cleanName}-${id}/${cleanSubName}-${subCategory._id}`
     navigate(url)
    }
  }


  return (
    <div className="py-2 px-1">
       <div className="flex items-center justify-between font-semibold text-lg md:xl">
          <p className="">{name}</p>
          <Link onClick={redirectProductListPage} className="text-green-700 hover:text-green-600">See All</Link>
       </div>
       <div className="relative">
          <div ref={scrollRef} className="flex flex-row items-center md:gap-8 gap-4 py-2 overflow-x-scroll scroll-smooth no-scrollbar ">
          {
            loading ? (
              loadingCard.map((_, index) => (
                <CardLoading key={index} />
              ))
            ) : categoryProducts.length ? (
               categoryProducts.map((product) => (
                <CardProducts key={product._id} product={product}/>
              ))
            ) : (
              loadingCard.map((_, index) => (
                <CardLoading key={index} />
              ))
            )
          }
          </div>
          <div className="w-full absolute top-1/2 md:flex hidden justify-between text-2xl text-gray-500  z-10">
             <button onClick={scrollLeft} className="cursor-pointer ">
               <MdKeyboardArrowLeft />
             </button>
             <button onClick={scrollRight} className="cursor-pointer ">
               <MdOutlineChevronRight />
             </button>
          </div>
       </div>
    </div> 
  )
}

export default CategoryProduct