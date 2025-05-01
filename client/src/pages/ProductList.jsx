import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getProductByCategoryAndSubCategory } from "../store/productSlice.js";
import { getSubCategories } from "../store/subCategoryslice.js"
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
      <div className="grid grid-cols-10 h-full">
        <div className="col-span-2 bg-white md:rounded-t-md md:px-6 px-3  py-3 md:mr-3 flex flex-col overflow-y-auto no-scrollbar gap-2 h-full">
          <h2 className="text-lg font-semibold p-2 md:flex hidden">Sub Categories</h2>
            {filterSubCategories.map((sub, index) => { 
            const cleanName = sub.categoryId[0]?.name?.toString().replaceAll(",","-").replaceAll("&","-").replaceAll(" ","-");
            const cleanSubName = sub.name.toString().replaceAll(",","-").replaceAll("&","-").replaceAll(" ","-")
            const url = `/${cleanName}-${categoryId}/${cleanSubName}-${sub._id}`;
            return (
            <Link
              key={index}
              to={url}
              className={`flex md:flex-row flex-col items-center p-2 shadow cursor-pointer hover:bg-gray-100 rounded ${subCategoryId === sub._id ? "bg-gray-200" : ""}`}>
              <div className="w-12 h-12">
                <img className="w-full h-full object-contain" src={sub.image} alt={sub.name} />
              </div>
              <h2 className="text-xs text-ellipsis">{sub.name}</h2>
            </Link>
            );
            })}
        </div>
        <div className="bg-white col-span-8 overflow-y-auto no-scrollbar md:rounded-t-md h-full">
          <h2 className="text-lg font-semibold md:mb-2 capitalize md:shadow md:pl-3 md:py-2 py-1 px-2">{correctSubCategoryName}</h2>
          <div className="flex flex-wrap flex-row gap-4 md:p-3 items-center justify-center ">
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