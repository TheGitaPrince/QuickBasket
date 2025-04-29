import mongoose  from "mongoose";
import { UserModel } from "../models/user.model.js";
import { CartProductModel } from "../models/cartProduct.model.js";
import { ProductModel } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addItemToCart = asyncHandler(async (req,res) => {
    const { productId, quantity = 1 } = req.body

    if(!productId){
        throw new ApiError(400, "Product ID is required.")
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
        throw new ApiError(400, "Product not found.");
    }

    const userId = req.user?._id

    const checkItem = await CartProductModel.findOne({
        userId,
        productId
    })

    if(checkItem){
        checkItem.quantity += quantity
        await checkItem.save();
         return res.status(200).json(
            new ApiResponse(200, checkItem, "Item Added successfully.")
        );
    }
    
    const cartItem = await CartProductModel.create({
        productId,
        quantity,
        userId
    })

    await UserModel.findByIdAndUpdate(
        userId,
        {
           $push : { shopping_cart : productId }
        },
        {
            new: true 
        }
    )

    return res.status(201).json(new ApiResponse(201, cartItem, "Item Added successfully."));

})

const getCartItems = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const cartItems = await CartProductModel.find({ userId })
        .populate("productId")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, cartItems, "Cart items fetched successfully.")
    )
});

const updateCartItem = asyncHandler(async (req,res) => {
    const { cartItemId, quantity } = req.body;

    if (!quantity || quantity < 1) {
        throw new ApiError(400, "Quantity must be at least 1.");
    }

    const userId = req.user?._id;

    const cartItem = await CartProductModel.findOne({
        _id: cartItemId,
        userId
    });

    if (!cartItem) {
        throw new ApiError(404, "Cart item not found.");
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return res.status(200).json(
        new ApiResponse(200, cartItem, "Cart item updated successfully.")
    );
})

const deleteCartItem = asyncHandler(async (req,res) => {
    const { cartItemId } = req.body;

    const userId = req.user?._id;

    const cartItem = await CartProductModel.findOneAndDelete({
        _id: cartItemId,
        userId
    });

    if (!cartItem) {
        throw new ApiError(404, "Cart item not found.");
    }

    await UserModel.findByIdAndUpdate(
        userId,
        {
            $pull: { shopping_cart: cartItem.productId }
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, null, "Cart item removed successfully.")
    );
})

export {
    addItemToCart,
    getCartItems,
    updateCartItem,
    deleteCartItem
}