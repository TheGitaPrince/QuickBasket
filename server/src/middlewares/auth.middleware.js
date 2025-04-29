import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";


export const veriyfyJWT = asyncHandler(async (req,res,next) => {
  try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") || req.headers?.authorization?.replace("Bearer ", "");

     if(!token){
      throw new ApiError(401, "Please login to continue.")
     }
  
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
     const user = await UserModel.findById(decodedToken?._id).select("-password -refreshToken")
  
     if(!user){
      throw new ApiError(400,"Session expired. Please login again.")
     }
  
     req.user = user
     next()
  
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Session expired. Please login again.");
    }
    throw new ApiError(401, "Please login to continue.");
  }
})

