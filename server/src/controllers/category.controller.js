import mongoose from "mongoose";
import { CategoryModel } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { SubCategoryModel } from "../models/subCategory.model.js";
import { ProductModel } from "../models/product.model.js";


const createCategory = asyncHandler(async (req,res) => {
    const { name } = req.body;
    
    if(!name) {
        throw new ApiError(400, "Category name is required.")
    }

    const existingCategory = await CategoryModel.findOne({ name });

    if (existingCategory) {
        throw new ApiError(400, "Category with this name already exists.");
    }

    const imageLocalPath =  req.file

    if(!imageLocalPath){
        throw new ApiError(400, "Category image is required.");    
    }

    const imageUrl = await uploadOnCloudinary(imageLocalPath);

    if(!imageUrl || !imageUrl.secure_url) {
        throw new ApiError(500, "Image upload failed. Please try again.");
    }

    const category = await CategoryModel.create({
        name,
        image : imageUrl.secure_url
    })
    
    return res.status(201).json(new ApiResponse(201, category, "Category Create Successfully"))
})

const getCategory = asyncHandler(async (req,res) => {
    const categories = await CategoryModel.find().sort({ createdAt : -1 })

    if (!categories || categories.length === 0) {
        throw new ApiError(400, "No categories found.");
    }

    return res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully."));
})

const updateCategory = asyncHandler(async (req,res) => {
    const {categoryId, name } = req.body

    if (!categoryId) {
        throw new ApiError(400, "Category ID is required.");
    }
    const category = await CategoryModel.findById(categoryId)
    
    if (!category) {
        throw new ApiError(400, "Category not found.");
    }
    if (name) {
        const existCategory = await CategoryModel.findOne({ name });
        if (existCategory && existCategory._id.toString() !== categoryId) {
            throw new ApiError(400, "Category with this name already exists.");
        }
        category.name = name;
    }
    
    if (req.file) {
        const imageLocalPath = req.file
        
        const imageUrl = await uploadOnCloudinary(imageLocalPath);

        if (!imageUrl || !imageUrl.secure_url) {
            throw new ApiError(500, "Image upload failed. Please try again.");
        }

        category.image = imageUrl.secure_url;
    }
    await category.save();

    return res.status(200).json(new ApiResponse(200, category, "Category updated successfully."));
})

const deleteCategory = asyncHandler(async (req,res) => {
    const { _id } = req.body

    if (!_id) {
        throw new ApiError(400, "Category ID is required.");
    }
 
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new ApiError(400, "Invalid Category ID.");
    }

    const subCategoryExists = await SubCategoryModel.exists({
        categoryId: _id
    });

    const productExists = await ProductModel.exists({
        categoryId: _id
    });

    if (subCategoryExists || productExists) {
        throw new ApiError(400, "Category is in use. Cannot delete.");
    }

    const deletedCategory = await CategoryModel.findByIdAndDelete(_id);

    if (!deletedCategory) {
        throw new ApiError(404, "Category not found.");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Category deleted successfully."));
})

export {
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
}