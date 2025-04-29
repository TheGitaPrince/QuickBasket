import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) throw new ApiError(404, "User not found.");

    const accessToken = user.generateAccessToken();
    const refreshToken =await user.generateRefreshToken();

    user.refresh_token = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating access and refresh tokens.");
  }
};


