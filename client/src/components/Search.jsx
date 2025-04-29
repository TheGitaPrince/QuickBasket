import React,{useState,useEffect} from "react";
import { IoSearchSharp } from "react-icons/io5";
import { TypeAnimation } from "react-type-animation";
import { Link,useNavigate,useLocation} from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import useMobile from "../utils/useMobile.jsx"

function Search() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobile] = useMobile()
  const [isSearchPage,setIsSearchPage] = useState(false)

  useEffect(() => {
    const isSearch = location.pathname === "/search"
    setIsSearchPage(isSearch)
  }, [location])
  
  const redirectToSearchPage = ()=>{
    navigate("/search")
  }

  const handleSearch = (e)=>{
     const searchValue = e.target.value
     const url = `/search?q=${searchValue}`

     navigate(url)
  }

  return (
    <div className="w-full min-w-75 md:min-w-110 md:h-11 h-10 flex flex-row items-center border-1 border-neutral-300 cursor-pointer overflow-hidden rounded-lg gap-2 text-neutral-500 group focus-within:border-primary-200">
      {
        (isSearchPage && isMobile)?(
          <Link to = "/" className="px-1 group-focus-within:text-primary-200">
            <IoMdArrowRoundBack className="size-6"/>
          </Link>
        ):(
          <button className="px-1 group-focus-within:text-primary-200">
            <IoSearchSharp className="size-6" />
          </button>
        )
      }

      <div className="w-full h-full">
          {
            !isSearchPage?(
              <div className="w-full h-full flex items-center" onClick = {redirectToSearchPage} >
              <TypeAnimation
                sequence={[
                  'Search for "banana"',
                  1000, 
                  'Search for "curd"',
                  1000,
                  'Search for "guava"',
                  1000,
                  'Search for "coconut"',
                  1000,
                  'Search for "onion"',
                  1000, 
                  'Search for "oil"',
                  1000,
                  'Search for "pineapple"',
                  1000,
                  'Search and many "more.."',
                  1000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </div>
            ):(
            <div className="w-full h-full pr-1">
                <input 
                onChange={handleSearch}
                className="outline-none w-full h-full" type="text" placeholder="Search for grocery item.. " />
            </div>
          )
          }
      </div>
    </div>
  );
}

export default Search;
