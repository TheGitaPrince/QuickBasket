import React,{ useState, useEffect } from 'react'
import CardLoading from "../components/CardLoading.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../store/productSlice.js"
import { useLocation } from "react-router-dom";
import CardProducts from "../components/CardProducts.jsx";

function SearchPage() {
  const { products, totalNoPage, page, limit, loading } = useSelector((state) => state.product);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch()
  const location = useLocation()


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchValue = params.get("q") || "";
    const decodedValue = decodeURIComponent(searchValue.trim());
    setSearch(decodedValue);

  }, [location.search]);

  useEffect(() => {
    const searchHandler = setTimeout(() => {
      setDebouncedSearch(search)
    },1000);

    return () => {
      clearTimeout(searchHandler);
    };
  }, [search])

  const limits = 12
  useEffect(() => {
    dispatch(getProduct({ page: currentPage, limit: limits , search: debouncedSearch }))
  }, [dispatch, currentPage, debouncedSearch]);
  
  const loadingCard = new Array(14).fill(null)

  const loadMore = () => {
    if (!loading && currentPage < totalNoPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <section className="overflow-y-auto no-scrollbar py-4 bg-white md:min-h-[76vh] min-h-[71vh]">
      <div className="flex flex-wrap justify-center md:gap-8 gap-3">
        {
          loading?(
            loadingCard.map((_,index)=>(
              <CardLoading key={index+1}/>
          ))
          ):(
            products && products.length > 0 ?(
              products.map((product,index)=>(
                <CardProducts key={index+234} product={product}/>
              ))
            ):(
              <div>Product Not Found</div>
            )
          )
        }
      </div>
      {currentPage < totalNoPage && (
        <div className="text-center mt-4">
          <button 
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
      
      {currentPage >= totalNoPage && products?.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          No more products to show
        </div>
      )}
    </section>
  )
}

export default SearchPage