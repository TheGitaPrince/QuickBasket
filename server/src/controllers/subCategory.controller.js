import mongoose from "mongoose";
import { CategoryModel } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { SubCategoryModel } from "../models/subCategory.model.js";
import { ProductModel } from "../models/product.model.js";


const createSubCategory = asyncHandler(async (req,res) => {
    const { name, categoryId  } = req.body;
    
    if(!name || !categoryId) {
        throw new ApiError(400, "Sub-category name and category ID are required.")
    }
   
    const existingSubCategory = await SubCategoryModel.findOne({ name });

    if (existingSubCategory) {
        throw new ApiError(400, "Sub-category with this name already exists.");
    }

    const categoryExists = await CategoryModel.findById(categoryId);

    if (!categoryExists) {
        throw new ApiError(400, "Parent category not found.");
    }

    const imageLocalPath =  req.file?.path

    if(!imageLocalPath){
        throw new ApiError(400, "Sub-category image is required.");    
    }

    const imageUrl = await uploadOnCloudinary(imageLocalPath);

    if(!imageUrl || !imageUrl.secure_url) {
        throw new ApiError(500, "Image upload failed. Please try again.");
    }

    const subCategory = await SubCategoryModel.create({
        name,
        image: imageUrl.secure_url,
        categoryId,
    });
    
    return res.status(201).json(new ApiResponse(201, subCategory, "Sub-category created successfully."));
})

const getSubCategory = asyncHandler(async (req,res) => {
    const { search } = req.query;

    const filter = search? { name: { $regex: search, $options: "i" } } : {};

    const subCategories = await SubCategoryModel.find(filter).populate("categoryId", "name image").sort({ createdAt: -1 })

    if (!subCategories.length) {
        throw new ApiError(404, "No sub-categories found.");
    }

    return res.status(200).json(new ApiResponse(200, subCategories, "Sub-categories fetched successfully."));
})

const updateSubCategory = asyncHandler(async (req,res) => {
    const { subCategoryId, name, categoryId } = req.body;

    if (!subCategoryId) {
        throw new ApiError(400, "Sub-category ID is required.");
    }

    const subCategory = await SubCategoryModel.findById(subCategoryId);
    if (!subCategory) {
        throw new ApiError(404, "Sub-category not found.");
    }

    if (name && name !== subCategory.name) {
        const existingSubCategory = await SubCategoryModel.findOne({ name });
        if (existingSubCategory && existingSubCategory._id.toString() !== subCategoryId) {
            throw new ApiError(400, "SubCategory with this name already exists.");
        }
        subCategory.name = name;
    }

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
        const categoryExists = await CategoryModel.findById(categoryId);
        if (!categoryExists) {
            throw new ApiError(404, "Category not found.");
        }
        subCategory.categoryId = categoryId;
    }

    const imageLocalPath =  req.file?.path

    // if(!imageLocalPath){
    //     throw new ApiError(400, "Sub-category image is required.");    
    // }

    if(imageLocalPath){
        const imageUrl = await uploadOnCloudinary(imageLocalPath);

        if(!imageUrl || !imageUrl.secure_url) {
          throw new ApiError(500, "Image upload failed. Please try again.");
        }

        subCategory.image = imageUrl.secure_url;
    }
    
    await subCategory.save();

    return res.status(200).json(new ApiResponse(200, subCategory, "SubCategory updated successfully."));
})

const deleteSubCategory = asyncHandler(async (req,res) => {
    const { subCategoryId } = req.body;

    if (!subCategoryId) {
        throw new ApiError(400, "SubCategory ID is required.");
    }

    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
        throw new ApiError(400, "Invalid SubCategory ID.");
    }

    const subCategory = await SubCategoryModel.findById(subCategoryId);

    if (!subCategory) {
        throw new ApiError(404, "SubCategory not found.");
    }
   
    const productExists = await ProductModel.exists({ sub_categoryId: subCategoryId });

    if (productExists) {
        throw new ApiError(400, "SubCategory is in use by a product. Cannot delete.");
    }

    await SubCategoryModel.findByIdAndDelete(subCategoryId);

    return res.status(200).json(new ApiResponse(200, {}, "SubCategory deleted successfully."));
})

export {
    createSubCategory,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory
}