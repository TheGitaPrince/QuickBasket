import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getProductByCategoryAndSubCategory } from "../store/productSlice.js";
import { getSubCategories } from "../store/subCategorySlice.js"
import CardProducts from "../components/CardProducts.jsx";
import CardLoading from "../components/CardLoading.jsx";

function ProductList() {
  const dispatch = useDispatch()
  const params = useParams()
  const { loading, limit, productsBySubCategory } = useSelector((state)=> state.product)
  const { subCategories } = useSelector((state) => state.subCategory);
  const [currentPage, setCurrentPage] = useState(1);

  const categoryId = params.category.split("-").pop()
  const subCategoryId = params.subcategory.split("-").pop()

  useEffect(() => {
    dispatch(getProductByCategoryAndSubCategory(
     { categoryId,
       subCategoryId,
       page: currentPage,
       limit: 10
     }
    ))
    dispatch(getSubCategories())
  }, [params])

  const filterSubCategories= subCategories.filter((subCategory)=>(subCategory.categoryId.some((sub)=> sub._id === categoryId))) 

  const subCategoryName = params.subcategory.substring(0,params.subcategory.lastIndexOf("-"))
  const correctSubCategoryName = subCategoryName.replace(/-/g, " ").replace(/\s+/g," ");

  const loadingCard = new Array(10).fill(null)

  return (
    <section className="bg-blue-50 md:pt-5 md:px-4 md:h-[76vh] h-[71vh] ">
      <div className="grid md:grid-cols-10 h-full">
      <h2 className="text-lg font-semibold md:p-2 px-5 py-2  flex md:hidden bg-white">Sub Categories</h2>
      <div className="md:col-span-2 bg-white md:rounded-t-md md:h-full md:px-6 md:mr-3 flex md:flex-col flex-row overflow-x-auto md:overflow-y-auto no-scrollbar md:p-2 gap-2">
          <h2 className="text-lg font-semibold md:mb-2 p-2 hidden md:flex">Sub Categories</h2>
          {filterSubCategories.map((sub, index) => { 
          const cleanName = sub.categoryId[0]?.name?.toString().replaceAll(",","-").replaceAll("&","-").replaceAll(" ","-");
          const cleanSubName = sub.name.toString().replaceAll(",","-").replaceAll("&","-").replaceAll(" ","-")
          const url = `/${cleanName}-${categoryId}/${cleanSubName}-${sub._id}`;
          return (
            <Link
              key={index}
              to={url}
              className={`shrink-0 md:h-16 h-18 flex md:flex-row items-center cursor-pointer p-2 hover:bg-gray-100 rounded ${subCategoryId === sub._id ? "bg-gray-200" : ""}`}>
              <div className="w-12 h-12">
                <img className="w-full h-full object-contain" src={sub.image} alt={sub.name} />
              </div>
              <h2 className="text-sm">{sub.name}</h2>
            </Link>
          );
          })}
        </div>
        <div className="bg-white md:col-span-8 md:overflow-y-auto overflow-x-auto no-scrollbar rounded-t-md h-full">
          <h2 className="text-lg font-semibold md:mb-4 ml-3 md:ml-0 capitalize md:shadow pl-3 py-2">{correctSubCategoryName}</h2>
          <div className="flex md:flex-wrap flex-row gap-4 p-3 md:items-center md:justify-center ">
            {loading 
              ? loadingCard.map((_, index) => <CardLoading key={index} />)
              : productsBySubCategory.map((product) => (
                <CardProducts key={product._id} product={product} />
              ))
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductList