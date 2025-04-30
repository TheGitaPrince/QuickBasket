import React, { useState, useEffect } from 'react'
import UploadSubCategory from "../components/UploadSubCategory.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getSubCategories } from "../store/subCategoryslice.js"
import Loading from "../components/Loading.jsx";
import EditSubCategory from "../components/EditSubCategory.jsx"
import DeleteSubCategory from "../components/DeleteSubCategory.jsx"
import { IoSearch } from "react-icons/io5";

function SubCategoryPage() {
  const [openSubCategory, setOpenSubCategory] = useState(false);
  const { subCategories, isLoading } = useSelector((state) => state.subCategory);
  const dispatch = useDispatch();
  const [openEditSubCategory, setOpenEditSubCategory] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [openDeleteSubCategory, setOpenDeleteSubCategory] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const toggleOpenSubCategory = () => {
    setOpenSubCategory(!openSubCategory)
  }

  const handleEditSubCategory = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setOpenEditSubCategory(true)
  }

  const handleDeleteSubCategory = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setOpenDeleteSubCategory(true)
  }

  useEffect(() => {
    const searchHandler = setTimeout(() => {
      setDebouncedSearch(search)
    },1000);

    return () => {
      clearTimeout(searchHandler);
    };
 }, [search])

  useEffect(() => {
    dispatch(getSubCategories({search: debouncedSearch}));
  }, [dispatch,debouncedSearch]);

  return (
    <section className="py-4 px-2">
      <div className="flex md:flex-row flex-col gap-3 justify-between mx-auto shadow items-center p-2 mb-4">
        <h2 className="font-semibold">Sub Category</h2>
        <div className="flex items-center justify-center py-1 px-2 border-1 border-neutral-300 cursor-pointer overflow-hidden rounded-lg gap-2 text-neutral-500 group focus-within:border-primary-200">
             <input 
             type="text" 
             className="outline-none text-neutral-700"
             placeholder="Search subcategory..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             />
             <IoSearch  className="size-5 group-focus-within:text-primary-200"/>
        </div>
        <button onClick={toggleOpenSubCategory} className="px-2 py-2 border border-primary-100 rounded-lg text-sm bg-green-600 hover:bg-green-700 cursor-pointer text-white">
          Add Sub Category
        </button>
      </div>
      
      {isLoading ? (
        <div className="mt-10 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="overflow-x-auto ">
          <div className="hidden md:block">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden ">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Sr.No</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {subCategories.map((subCategory, index) => (
                  <tr key={subCategory._id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">{subCategory.name}</td>
                    <td className="py-3 px-4">
                      {subCategory.image ? (
                        <img 
                          src={subCategory.image} 
                          alt={subCategory.name} 
                          className="w-16 h-16 object-contain"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{subCategory.categoryId?.length > 0 ? subCategory.categoryId[0].name : "NO Name"}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => handleEditSubCategory(subCategory)} 
                          className="bg-green-100 text-green-600 hover:bg-green-200 text-sm px-3 py-1 rounded cursor-pointer"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteSubCategory(subCategory)} 
                          className="bg-red-100 text-red-600 hover:bg-red-200 text-sm px-3 py-1 rounded cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">
            {subCategories.map((subCategory, index) => (
              <div key={subCategory._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">#{index + 1}</p>
                    <h3 className="font-medium">{subCategory.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold">Category:</span> {subCategory.categoryId?.length > 0 ? subCategory.categoryId[0].name : "NO Name"}
                    </p>
                  </div>
                  {subCategory.image && (
                    <img 
                      src={subCategory.image} 
                      alt={subCategory.name} 
                      className="w-16 h-16 object-contain"
                    />
                  )}
                </div>
                <div className="flex justify-end space-x-2 mt-3">
                  <button 
                    onClick={() => handleEditSubCategory(subCategory)} 
                    className="bg-green-100 text-green-600 hover:bg-green-200 text-sm px-3 py-1 rounded cursor-pointer"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteSubCategory(subCategory)} 
                    className="bg-red-100 text-red-600 hover:bg-red-200 text-sm px-3 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {openSubCategory && (
        <UploadSubCategory closeSubCategory={() => setOpenSubCategory(false)} />
      )}

      {openEditSubCategory && selectedSubCategory && (
        <EditSubCategory
          subCategory={selectedSubCategory}
          closeEditSubCategory={() => setOpenEditSubCategory(false)}
        />
      )}

      {openDeleteSubCategory && selectedSubCategory && (
        <DeleteSubCategory
          subCategory={selectedSubCategory}
          closeDeleteSubCategory={() => setOpenDeleteSubCategory(false)}
        />
      )}
    </section>
  )
}

export default SubCategoryPage