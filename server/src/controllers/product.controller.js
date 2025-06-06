import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { CategoryModel } from "../models/category.model.js";
import { SubCategoryModel } from "../models/subCategory.model.js";
import { ProductModel } from "../models/product.model.js";


const createProduct = asyncHandler(async (req,res) => {
    const { name, 
            categoryId, 
            sub_categoryId, 
            unit, 
            stock, 
            price, 
            discount, 
            description, 
            more_details, 
            publish
        } = req.body

    let parsedMoreDetails = {};

    try {
        parsedMoreDetails = JSON.parse(more_details || "{}");
    } catch (error) {
        throw new ApiError(400, "Invalid more_details format. Must be valid JSON.");
    }

    if(!name || 
       !categoryId || 
       !sub_categoryId || 
       !unit || 
       !price || 
       !stock ||
       !description ||  
       !publish 
    ){
        throw new ApiError(400, "All fields are required.")
    }
    
    const categoryExists = await CategoryModel.findById(categoryId)

    if(!categoryExists){
        throw new ApiError(400, "Category does not exist.")
    }

    const subCategoryExists = await SubCategoryModel.findById(sub_categoryId)
    
    if(!subCategoryExists){
        throw new ApiError(400, "Sub Category does not exist.")
    }

    let imageUrls = []
       
    if(req.files && req.files.image && req.files.image.length > 0){
        const uploadPromise = req.files.image.map((file)=> uploadOnCloudinary(file))
        const uploadedImages = await Promise.all(uploadPromise)

        imageUrls = uploadedImages
                    .filter((img)=>img?.secure_url)
                    .map((img) => img.secure_url)

        if (imageUrls.length === 0) {
            throw new ApiError(500, "Image upload failed.");
        }            
    }

    const product = await ProductModel.create({
        name,
        image: imageUrls,
        categoryId,
        sub_categoryId,
        unit,
        stock,
        price,
        discount,
        description,
        more_details : parsedMoreDetails,
        publish
    })

    res.status(201).json(new ApiResponse(200, product, "Product created successfully."))
})

const getProduct = asyncHandler(async (req,res) => {
    const { page = 1 , limit = 10, search } = req.query;
     
    const filter = search? { name: { $regex: search, $options: "i" } } : {};

    const skip = (page - 1) * limit
     
    const products = await ProductModel.find(filter)
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .populate("categoryId sub_categoryId");

    const totalCount = await ProductModel.countDocuments(filter);

    const totalNoPage = Math.ceil(totalCount / limit);

    res.status(200).json(new ApiResponse(200, { products, totalCount, totalNoPage, page, limit }, "Products fetched successfully."));
})

const getProductByCategory = asyncHandler(async (req,res) => {
     const {id} = req.query
     
     if(!id){
        throw new ApiError(400, "Category ID is required.")
     }

     const Products = await ProductModel.find({categoryId: id}).limit(15)

     return res.status(200).json(
        new ApiResponse(200,{Products}, "Products by category fetched successfully.")
     )
})

const getProductByCategoryAndSubCategory = asyncHandler(async (req,res) => {
    const { categoryId, subCategoryId, page = 1, limit = 10 } = req.query
    
    if (!categoryId || !subCategoryId) {
        throw new ApiError(400, "Both category ID and sub-category ID are required.");
    }

    const skip = (page - 1) * limit;

    const filter = { 
        categoryId, 
        sub_categoryId: subCategoryId 
    }

    const products = await ProductModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

    const totalCount = await ProductModel.countDocuments(filter);

    res.status(200).json(new ApiResponse(200, { products, totalCount, page, limit }, "Products fetched successfully."));
})

const getProductDetails = asyncHandler(async (req,res) => {
    const { productId } = req.query 

    if (!productId) {
        throw new ApiError(400, "Product ID are required.");
    }

    const product = await ProductModel.findById({_id: productId})

    if (!product) {
        throw new ApiError(400, "Product not found.");
    }

    res.status(200).json(
        new ApiResponse(200, product, "Product details fetched successfully.")
    );
})

const updateProduct = asyncHandler(async (req,res) => {
    const { 
        _id,
        name, 
        categoryId, 
        sub_categoryId, 
        unit, 
        stock, 
        price, 
        discount, 
        description, 
        more_details, 
        publish 
     } = req.body 

    if(!_id){
        throw new ApiError(400,"Product ID is required.")
    }

    const product = await ProductModel.findById(_id);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    if (stock < 0) {
        throw new ApiError(400, "Stock cannot be negative.");
    }

    let parsedMoreDetails = {};

    try {
        parsedMoreDetails = JSON.parse(more_details || "{}");
    } catch (error) {
        throw new ApiError(400, "Invalid more_details format. Must be valid JSON.");
    }

    const categoryExists = await CategoryModel.findById(categoryId);
    if (!categoryExists) {
        throw new ApiError(400, "Category does not exist.");
    }

    const subCategoryExists = await SubCategoryModel.findById(sub_categoryId);
    if (!subCategoryExists) {
        throw new ApiError(400, "Sub Category does not exist.");
    }

    let imageUrls = product.image;

    if(req.files && req.files.image && req.files.image.length > 0){
        const uploadPromise = req.files.image.map((file)=> uploadOnCloudinary(file))
        const uploadedImages = await Promise.all(uploadPromise)

        const newImageUrls = uploadedImages
                    .filter((img)=>img?.secure_url)
                    .map((img) => img.secure_url)

        if (newImageUrls.length === 0) {
            throw new ApiError(500, "Image upload failed.");
        }
        
        product.image = [...product.image, ...newImageUrls];
    }

    product.name = name;
    product.categoryId = categoryId;
    product.sub_categoryId = sub_categoryId;
    product.unit = unit;
    product.stock = stock;
    product.price = price;
    product.discount = discount;
    product.description = description;
    product.more_details = parsedMoreDetails;
    product.publish = publish;
    product.image = imageUrls;

    await product.save();

    res.status(200).json(new ApiResponse(200, product, "Product updated successfully."));
})

const deleteProduct = asyncHandler(async (req,res) => {
    const { _id } = req.body 
    
    if(!_id){
        throw new ApiError(400, "Product ID is required.")
    }

    await ProductModel.findByIdAndDelete(_id)

    res.status(200).json(
        new ApiResponse(200, {}, "Product Delete successfully.")
    );
})

export {
    createProduct,
    getProduct,
    getProductByCategoryAndSubCategory,
    getProductByCategory,
    getProductDetails,
    updateProduct,
    deleteProduct
}