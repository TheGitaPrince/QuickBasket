import React,{useState,useEffect} from 'react'
import UploadCategory from "../components/UploadCategory.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../store/categorySlice.js"
import  Loading from "../components/Loading.jsx";
import EditCategory from "../components/EditCategory.jsx"
import DeleteCategory from "../components/DeleteCategory.jsx"

function CategoryPage() {
  const [openCategory, setOpenCategory] = useState(false);
  const { categories, isLoading  } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const [openEditCategory,setOpenEditCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDeleteCategory,setOpenDeleteCategory] = useState(false);

  const toggleOpenCategory = ()=>{
     setOpenCategory(!openCategory)
  }
 
  const handleEditCategory = (category)=>{
    setSelectedCategory(category);
    setOpenEditCategory(true)
  }
  const handleDeleteCategory = (category)=>{
    setSelectedCategory(category);
    setOpenDeleteCategory(true)
  }

  useEffect(() => {
   dispatch(getCategory());
  }, [dispatch]);

  return (
    <section className="">
       <div className="flex  justify-between shadow items-center rounded p-2">
          <h2 className="font-semibold "> Category </h2>
          <button onClick = {toggleOpenCategory} className="px-2 py-2 border border-primary-100 rounded-lg text-sm  bg-green-600 hover:bg-green-700 cursor-pointer">Add Category</button>
       </div>
       {isLoading ? (
         <div className="mt-10 flex items-center justify-center ">
           <Loading/>
         </div>
       ) : (
        <div className="flex flex-wrap items-center justify-center md:gap-8 gap-3 md:mt-4 mt-2">
          {categories && categories.length > 0? 
          (categories.map((category) => (
            <div key={category._id} className="relative px-2 pt-1 pb-4 md:w-40 md:h-60 h-50 w-35  rounded-lg shadow hover:cursor-pointer ">
                 <img
                   src={category.image}
                   alt={category.name}
                   className="w-full h-full object-contain rounded"
                 />
                 <div className="absolute bottom-1 left-0 right-0 flex items-center justify-between px-3">
                   <button onClick={() => handleEditCategory(category)} className="bg-green-100 text-green-600 hover:bg-green-200 text-sm cursor-pointer py-0.5 px-2 rounded">Edit</button>
                   <button onClick={() => handleDeleteCategory(category)} className="bg-red-100 text-red-600 hover:bg-red-200 text-sm cursor-pointer py-0.5 px-2 rounded">Delete</button>
                 </div>
            </div>
          ))):(<div>Category Not Found</div> )}
        </div>
      )}
        { openCategory && (<UploadCategory closeCategory={()=>setOpenCategory(false)}/>) }

        { openEditCategory && selectedCategory && (
             <EditCategory 
             category={selectedCategory}
             closeEditCategory = {()=>setOpenEditCategory(false)}/>
          )
        }
        { openDeleteCategory && selectedCategory && (
             <DeleteCategory 
             category={selectedCategory}
             closeDeleteCategory = {()=>setOpenDeleteCategory(false)}/>
          )
        }
    </section>
  )
}

export default CategoryPage