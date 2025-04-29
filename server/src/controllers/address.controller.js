import mongoose  from "mongoose";
import { UserModel } from "../models/user.model.js";
import { AddressModel } from "../models/address.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addAddress = asyncHandler(async (req,res) => {
    const { address_line, city, state, pincode, country, mobile } = req.body

    if( !address_line || !city || !state || !pincode || !country || !mobile){
        throw new Error(400, "all details are required.");
    } 
    
    const userId = req.user?._id
    
    const newAddress = await AddressModel.create({
        address_line,
        city,
        state,
        pincode,
        country,
        mobile,
        userId
    });

    await UserModel.findByIdAndUpdate(
        userId,
        { $push: { address_details: newAddress._id } }, 
        { new: true }
    );

    return res.status(201).json(new ApiResponse(201, newAddress, "Address added successfully."));
        
})

const getAddress= asyncHandler(async (req,res) => {
    const userId = req.user?._id;

    const addresses = await AddressModel.find({ userId, status: true }).sort({ createdAt : -1})

    return res.status(201).json(new ApiResponse(200, addresses, "Fetched user addresses."))

})

const updateAddress = asyncHandler(async (req, res) => {
    const { _id, address_line, city, state, pincode, country, mobile } = req.body;
  
    const userId = req.user?._id;

    const address = await AddressModel.findOne({
      _id,
      userId,
      status: true,
    });
  
    if (!address) {
      throw new ApiError(404, "Address not found.");
    }
  
    address.address_line = address_line || address.address_line;
    address.city = city || address.city;
    address.state = state || address.state;
    address.pincode = pincode || address.pincode;
    address.country = country || address.country;
    address.mobile = mobile || address.mobile;
  
    await address.save();
  
    return res.status(200).json(new ApiResponse(200, address, "Address updated successfully."));
});

const deleteAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.body;
  
    const userId = req.user?._id;
    const address = await AddressModel.findOne({
      _id: addressId,
      userId,
      status: true,
    });
  
    if (!address) {
      throw new ApiError(404, "Address not found or already deleted.");
    }
  
    address.status = false;
    await address.save();
  
    return res.status(200).json(new ApiResponse(200, null, "Address deleted successfully delete."));
});
  
export {
    addAddress,
    getAddress,
    updateAddress,
    deleteAddress
}

