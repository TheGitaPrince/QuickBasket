import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../store/productSlice.js"
import { getCategory } from "../store/categorySlice.js"
import { getSubCategories } from "../store/subCategoryslice.js"
import Loading from "../components/Loading.jsx";
import { useForm } from "react-hook-form";
import { FaCloudUploadAlt, FaTrash, FaPlus } from "react-icons/fa";

function UploadProduct() {
  const { loading } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const { subCategories } = useSelector((state) => state.subCategory);
  const { register, handleSubmit, watch, setValue ,reset } = useForm({ defaultValues: { publish: true } });
  const dispatch = useDispatch();
  const [selectedImages, setSelectedImages] = useState([]);
  const [openAddField, setOpenAddField] = useState(false);
  const [newField, setNewField] = useState({ key: '', value: '' });
  const [additionalFields, setAdditionalFields] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    dispatch(getCategory())
    dispatch(getSubCategories())
  }, [dispatch]) 

  const handleImageChange = (event) => {
   const files = Array.from(event.target.files);
   setImageFiles(prev => [...prev, ...files]);
   const newSelectedImages = files.map(file => URL.createObjectURL(file));
   setSelectedImages(prev => [...prev, ...newSelectedImages]);
 };


  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAddField = () => {
    if (newField.key && newField.value) {
      setAdditionalFields([...additionalFields, newField]);
      setNewField({ key: '', value: '' });
      setOpenAddField(false);
    }
  };

  const toggleRemoveField = (index) => {
   setAdditionalFields(additionalFields.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
   
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('unit', data.unit);
    formData.append('stock', data.stock);
    formData.append('price', data.price);
    formData.append('discount', data.discount);
    formData.append('categoryId', data.categoryId);
    formData.append('sub_categoryId', data.sub_categoryId);
    formData.append('publish', data.publish || false);
    
    const moreDetails = {};
    additionalFields.forEach(field => {
      moreDetails[field.key] = field.value;
    });
    formData.append('more_details', JSON.stringify(moreDetails));
    
    imageFiles.forEach(file => {
      formData.append('image', file);
    });
    
    const response = await dispatch(createProduct(formData));

    if (createProduct.fulfilled.match(response)) {
      reset();
      setSelectedImages([]); 
      setImageFiles([]); 
      setAdditionalFields([]); 
    }
    
  };

  return (
    <section className="md:py-4 py-2 md:px-16">
      <div className="flex flex-row justify-center mx-auto shadow items-center p-2">
        <h2 className="font-semibold text-lg">Upload Product</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="px-2 py-4">
        <div className="md:space-y-5 space-y-3">
          <label htmlFor="" className="text-neutral-700 text-sm font-medium">Name:</label>
          <input
            type="text"
            placeholder="Enter product name:"
            className="w-full pl-3 py-2 border border-neutral-300 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200"
            {...register("name")}
          />
          <label htmlFor="" className="text-neutral-700 text-sm font-medium">Description:</label>
          <textarea
            type="text"
            placeholder="Enter product description:"
            rows={3}
            className="w-full pl-3 py-2 border border-neutral-300 resize-none rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200"
            {...register("description", { required: "Description is required" })}
          />
          <label htmlFor="" className="text-neutral-700 text-sm font-medium">Unit:</label>
          <input
            type="text"
            placeholder="Enter product unit:"
            className="w-full pl-3 py-2 border border-neutral-300 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200"
            {...register("unit", { required: "Unit is required" })}
          />
          <label htmlFor="" className="text-neutral-700 text-sm font-medium">stock:</label>
          <input
            type="number"
            placeholder="Enter product stock:"
            className="w-full pl-3 py-2 border border-neutral-300 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200"
            {...register("stock")}
          />
          <label htmlFor="" className="text-neutral-700 text-sm font-medium">Price:</label>
          <input
            type="number"
            placeholder="Enter product price:"
            className="w-full pl-3 py-2 border border-neutral-300 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200"
            {...register("price", { required: "Price is required" })}
          />
          <label htmlFor="" className="text-neutral-700 text-sm font-medium">Discount:</label>
          <input
            type="number"
            placeholder="Enter product discount:"
            className="w-full pl-3 py-2 border border-neutral-300 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200"
            {...register("discount", { required: "Discount is required" })}
          />
          <label htmlFor="" className="text-neutral-700 text-sm font-medium">Category:</label>
          <select
            className="w-full pl-3 py-2 border border-neutral-300 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200"
            {...register("categoryId", { required: "Category is required" })}
          >
            <option value="">Select Category</option>
            {categories && categories.length > 0 && categories.map((category) => (
              <option key={category._id} value={category._id} className="bg-white text-gray-800 hover:bg-green-200">
                {category.name}
              </option>
            ))}
          </select>
          <label htmlFor="" className="text-neutral-700 text-sm font-medium">Sub Category:</label>
          <select
            className="w-full pl-3 py-2 border border-neutral-300 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200"
            {...register("sub_categoryId", { required: "Sub Category is required" })}
          >
            <option value="">Select Sub Category</option>
            {subCategories && subCategories.length > 0 && subCategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id} className="bg-white text-gray-800 hover:bg-green-200">
                {subcategory.name}
              </option>
            ))}
          </select>
          <label htmlFor="" className="text-neutral-700 text-sm font-medium">Upload Images:</label>
          <div>
            <label htmlFor="image" className="w-full border border-neutral-300 rounded-lg bg-blue-50 h-20 flex flex-col justify-center items-center cursor-pointer hover:border hover:border-primary-200">
              <FaCloudUploadAlt className="size-6 text-neutral-700" />
              <span className="text-sm mt-1">Upload Images (Multiple)</span>
              <input
                type="file"
                id="image"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange} 
              />
            </label>
            <div className="flex items-center flex-wrap gap-4 mt-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    className="w-full h-50 object-cover rounded shadow"
                    src={image}
                    alt={`Product preview ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute bottom-1 right-1  text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <FaTrash className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-4 items-center">
              <h3 className="font-medium">Additional Details</h3>
              <button
                type="button"
                onClick={() => setOpenAddField(true)}
                className="flex items-center gap-1 text-sm text-white px-3 py-1 rounded bg-green-600 hover:bg-green-700 cursor-pointer"
              >
                <FaPlus /> Add Field
              </button>
            </div>

            {openAddField && (
              <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Field name"
                    className="w-full pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 border border-neutral-300 focus-within:border focus-within:border-primary-200"
                    value={newField.key}
                    onChange={(e) => setNewField({ ...newField, key: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Field value"
                    className="w-full pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 border border-neutral-300 focus-within:border focus-within:border-primary-200"
                    value={newField.value}
                    onChange={(e) => setNewField({ ...newField, value: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setOpenAddField(false)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={toggleAddField}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
            {additionalFields.map((field, index) => (
              <div key={index} className="flex items-center gap-2 bg-blue-50 border border-neutral-300 px-2 py-3 rounded-lg">
                <span className="font-medium text-neutral-700">{field.key}:</span>
                <span className="flex-1 text-neutral-900 text-sm">{field.value}</span>
                <button
                  type="button"
                  onClick={() => toggleRemoveField(index)}
                  className="text-red-500 hover:text-red-600 cursor-pointer"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
             <input
               type="checkbox"
               id="publish"
               className="hidden"
               {...register("publish")}
             />
             <div className={`w-10 h-6 rounded-full flex items-center transition-colors duration-200 ${watch("publish") ? 'bg-green-500' : 'bg-gray-300'}`}>
               <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${watch("publish") ? 'translate-x-5' : 'translate-x-1'}`}></div>
             </div>
             <span className="font-medium">Publish Product</span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg px-4 py-2 font-semibold cursor-pointer transition-all duration-200 bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </section>
  )
}

export default UploadProduct