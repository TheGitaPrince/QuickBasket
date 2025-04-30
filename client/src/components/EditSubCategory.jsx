import React,{useState,useEffect} from 'react'
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateSubCategory, getSubCategories } from "../store/subCategoryslice.js"
import { IoClose } from "react-icons/io5";
import { getCategory } from "../store/categorySlice.js"

function EditSubCategory({closeEditSubCategory, subCategory}) {
  const dispatch = useDispatch();
  const { register, handleSubmit, watch} = useForm();
  const { isLoading  } = useSelector((state) => state.subCategory);
  const [selectedImage, setSelectedImage] = useState(null);
  const { categories } = useSelector((state) => state.category);

  const imageURL = watch("image");
  
  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    if (imageURL?.[0]) {
      const newSelectedImage = URL.createObjectURL(imageURL[0]);
      setSelectedImage(newSelectedImage);
      
      return () => URL.revokeObjectURL(newSelectedImage);
    }
  }, [imageURL])

  const onSubmit = async (data) => {
    const formdata = new FormData();
    formdata.append("subCategoryId", subCategory._id);
    formdata.append("name",  data.name || subCategory.name);

    const categoryId = data.category && data.category !== "" ? data.category : subCategory.categoryId;

    formdata.append("categoryId", categoryId || subCategory.categoryId[0]._id);
    if(data.image[0]) formdata.append('image', data.image[0]);
    
    const response = await dispatch(updateSubCategory(formdata));

    if(updateSubCategory.fulfilled.match(response)) {
      await dispatch(getSubCategories());
      closeEditSubCategory()
    }
  };
  
  return (
    <section className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-3">
       <div className="bg-white w-full max-w-3xl p-4 rounded-lg shadow-lg">
         <div className="flex justify-between items-center">
             <h2 className="font-semibold"> Edit Sub Category</h2>
             <button onClick={closeEditSubCategory} className="cursor-pointer hover:text-primary-200">
               <IoClose className="size-6" />
             </button>
         </div>
         <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-3">
                 <div className="relative w-35 h-45 mx-auto m-8">
                    {selectedImage ? (
                      <img
                        className="w-full h-full object-cover rounded p-2 shadow-lg"
                        src={ selectedImage }
                        alt="Category preview"
                      /> ) : subCategory.image ? (
                        <img
                          className="w-full h-full object-cover rounded p-2 shadow-lg"
                          src={subCategory.image}
                          alt="Category preview"
                        />
                      ) : (
                      <div className="w-full h-full bg-gray-300  shadow rounded flex items-center justify-center ">
                        <p className="font-semibold text-sm p-2 text-center text-neutral-700">Select Image</p>
                      </div>
                    )}
                      <label htmlFor="avatarInput" className="absolute inset-0 flex items-center justify-center rounded cursor-pointer bg-gray-400/70 opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-5xl text-white  font-semibold ">+</p>
                        <input
                          type="file"
                          id="avatarInput"
                          accept="image/png, image/jpg, image/jpeg, image/webp"
                          className="hidden"
                          {...register("image")}
                        />
                      </label>
                  </div>
                  <div className="space-y-8">
                    <input
                     type="text"
                     className="w-full pl-3 py-2 rounded-lg font-semibold text-neutral-800 bg-gray-300 outline-none placeholder:text-sm placeholder:font-semibold placeholder:text-neutral-700  border-neutral-400 border focus-within:border focus-within:border-primary-200"
                     placeholder={subCategory.name}
                     {...register("name")}
                    />
                     <select
                      className="w-full pl-3 pr-6 py-2 rounded-lg cursor-pointer font-semibold text-neutral-800 bg-gray-300 outline-none placeholder:text-sm placeholder:font-semibold placeholder:text-neutral-700 focus-within:border border-neutral-400 border focus-within:border-primary-200"
                      {...register("category")}
                      >
                        <option className="text-neutral-700 font-semibold">{subCategory.categoryId[0].name }</option>
                        {categories.map((category) => (
                          <option  key={category._id} value={category._id} className="bg-white text-gray-800 hover:bg-green-200">
                            {category.name}
                          </option>
                        ))}
                    </select>
                    <button
                       type="submit"
                       className="w-full rounded-lg px-4 py-2 font-semibold cursor-pointer transition-all duration-200 bg-green-600 hover:bg-green-700 "
                     >
                       {isLoading ? "Updating..." : "Update Sub Category"}
                     </button>
                  </div>
            </div>
         </form>
       </div>
    </section>
  )
}

export default EditSubCategory;