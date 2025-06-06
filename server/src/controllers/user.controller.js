import mongoose from "mongoose";
import { UserModel } from "../models/user.model.js";
import { AdminRequestModel } from "../models/adminRequest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail }from "../utils/sendEmail.js";
import { verifyEmailTemplate } from "../utils/verifyEmailTemplate.js";
import { generateAccessAndRefreshTokens } from "../utils/generateToken.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { generateOtp } from "../utils/generateOtp.js";
import { forgotPasswordTemplate } from "../utils/forgotPasswordTemplate.js"
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { adminApprovalTemplate } from "../utils/adminApprovalTemplate.js";


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "all fields are required")
  }

  const existedUser = await UserModel.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const emailVerificationToken = crypto.randomBytes(32).toString("hex");

  const user = await UserModel.create({
    name,
    email,
    password,
    email_verification_token: emailVerificationToken,
  });

  const createdUser = await UserModel.findById(user._id).select("-password -refresh_token");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const verificationLink = `${process.env.CORS_ORIGIN}/verify-email?code=${emailVerificationToken}`;

  const verifyEmail = await sendEmail({
    sendTo: email,
    subject: "verify email from QuickBasket!",
    html: verifyEmailTemplate({
      name,
      url: verificationLink,
    }),
  });
  
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

const verifyEmail = asyncHandler(async (req,res) => {
    const { token } = req.body;

    if (!token) {
        throw new ApiError(400, "Verification token is required.");
    }

    const user = await UserModel.findOne({ email_verification_token: token })

    if(!user){
        throw new ApiError(401,"Invalid or expired verification token.")
    }

    user.verify_email = true;
    user.email_verification_token = undefined;

    await user.save();

    return res
    .status(201)
    .json(new ApiResponse(201,{ email: user.email }, "verify email done"));
})

const loginUser = asyncHandler(async (req,res) => {
    const {email,password} = req.body

    if(!email || !password){
        throw new ApiError(400, "Email and Password are required.")
    }
    
    const user = await UserModel.findOne({email}).select("+password +refreshToken");

    if(!user){
        throw new ApiError(401,"User not registered")
    }

    if(user.status !== "Active"){
        throw new ApiError(400,"Contact admin. Your account is not active.")
    }
    
    if (!user.verify_email) {
        throw new ApiError(403, "Please verify your email before logging in.");
    }
    

    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if(!isPasswordValid){
        throw new ApiError(401,"Check your password")
    }
    
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    user.last_login_date = new Date();
    await user.save({ validateBeforeSave: false });
    
    const loggedInUser = await UserModel.findById(user._id).select("-password -refresh_token")
    
    const cookiesOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
    
})

const logoutUser = asyncHandler(async (req,res) => {
    await UserModel.findByIdAndUpdate(
        req.user._id,
        {
             $unset: { refresh_token: "" }
        },
        {
            new: true
        }
    )

    const cookiesOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }

    return res
    .status(200)
    .clearCookie("accessToken", cookiesOptions)
    .clearCookie("refreshToken", cookiesOptions)
    .json(new ApiResponse(200, {}, "User logged Out Successfully"))
})

const uploadAvatar = asyncHandler(async (req,res) => {
    const avatarLocalPath =  req.file

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")  
    }

    const user = await UserModel.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password -refresh_token")

    return res
            .status(200)
            .json(new ApiResponse(
                    200,
                    user, 
                   "Avatar image updated successfully"
                )
             )
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { name, email, password, mobile } = req.body;
    
    if (!name && !email && !password && !mobile) {
        throw new ApiError(400, "At least one field is required to update.");
    }
    
    const user = await UserModel.findById(req.user?._id);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (password) user.password = password;
    
    await user.save({ validateBeforeSave: false });
    
    const updatedUser = await UserModel.findById(req.user._id).select("-password -refresh_token");
    
    return res.
            status(200)
            .json(new ApiResponse(
                    200,
                    updatedUser, 
                    "Account details updated successfully."
                )
            );
});

const getCurrentUser = asyncHandler(async (req,res) => {
    const user = await UserModel.findById(req.user?._id);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }
    
    const  fetchedUser = await UserModel.findById(req.user._id).select("-password -refresh_token");

    return res
    .status(200)
    .json(new ApiResponse(
         200,
         fetchedUser,
         "User fetched successfully"
   ))
})

const forgotPassword = asyncHandler(async (req,res) => {
    const {email} = req.body

    if(!email){
        throw new ApiError(400,"Email is required.")
    }

    const user = await UserModel.findOne({email})

    if(!user){
        throw new ApiError(400,"user not avaliable")
    }

    const otp = generateOtp();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

        user.forgot_password_otp = otp;
        user.forgot_password_expiry = expires;
        user.can_reset_password = false;

        await user.save();

    await sendEmail({
        sendTo: email,
        subject: "Password Reset OTP - QuickBasket",
        html: forgotPasswordTemplate({
            name: user.name,
            otp
        })
    })

    return res.status(200).json(new ApiResponse(200, {}, "OTP sent successfully. now Check your email."));
})

const verifyForgotPasswordOtp = asyncHandler(async (req,res) => {
    const {email,otp} = req.body
   
    if(!email || !otp){
        throw new ApiError(400,"Email and OTP are required.")
    }

    const user = await UserModel.findOne({email})

    if(!user){
        throw new ApiError(400,"No account found with this email.")
    }

    if (!user.forgot_password_otp || !user.forgot_password_expiry) {
        throw new ApiError(400, "OTP not found. Please request a new one.");
    }
    
    const currentTime = new Date().toISOString()

    if (user.forgot_password_expiry < currentTime ) {

        user.forgot_password_otp = undefined;
        user.forgot_password_expiry = undefined;
        user.can_reset_password = false;
        await user.save();
        throw new ApiError(400, "OTP has expired. Please request a new one.");
    }

    if (otp !== user.forgot_password_otp) {
        throw new ApiError(400, "Incorrect OTP. Please try again.");
    }

    user.forgot_password_otp = undefined;
    user.forgot_password_expiry = undefined;
    user.can_reset_password = true;
    
    await user.save({ validateBeforeSave: false });

    return res.
            status(200)
            .json(new ApiResponse(
                    200,
                    {}, 
                    "OTP verified successfully. You can now reset your password."
                )
            );

})

const changePassword = asyncHandler(async (req,res) => {
    const {email,newPassword,confirmPassword} = req.body

    if(!email || !newPassword || !confirmPassword){
        throw new ApiError(400,"Please provide all required fields.")
    }
    
    const user = await UserModel.findOne({email})

    if(!user){
        throw new ApiError(400,"user not avaliable")
    }
    
    if (!user.can_reset_password) {
        throw new ApiError(400, "OTP not verified. Please verify OTP before changing password.");
    }
    
    if (newPassword !== confirmPassword) {
        throw new ApiError(400,"newPassword and confirmPassword must be same.")
     }
 
    user.password = newPassword;
    user.can_reset_password = false;

    await user.save(); 

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
})

const refreshAccessToken = asyncHandler(async (req,res, next) => {
    const  incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken || 
          (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    
    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }
    
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await UserModel.findById(decodedToken?._id)
        
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken.trim() !== user.refresh_token?.trim()) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const {accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
        
        const cookiesOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        }
        
        return res
               .status(200)
               .cookie("accessToken", accessToken ,cookiesOptions)
               .cookie("refreshToken", refreshToken ,cookiesOptions)
               .json(new ApiResponse(200, {accessToken, refreshToken }, "Access token refreshed" ))
    }catch (error) {
       return next( new ApiError(401, error?.message || "Invalid refresh token"))
    }

})

const requestAdminAccess = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const existingRequest = await AdminRequestModel.findOne({ user: userId });
    if (existingRequest) {
        throw new ApiError(400, "Request already submitted");
    }

    await AdminRequestModel.create({ user: userId });

    return res.status(200).json(new ApiResponse(200, null, "Admin access request submitted"));
});

const approveAdminAccess = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Target user's email is required");
    }

    const adminUser = req.user;
    if (adminUser.role !== "ADMIN") {
        throw new ApiError(403, "Only admins can approve admin requests");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.role === "ADMIN") {
        throw new ApiError(400, "User is already an admin");
    }

    const request = await AdminRequestModel.findOne({ user: user._id });
    if (!request) {
        throw new ApiError(400, "No admin request found for this user");
    }

    user.role = "ADMIN";
    await user.save();

    await request.deleteOne();

    await sendEmail({
        sendTo: email,
        subject: "You are now an Admin - QuickBasket",
        html: adminApprovalTemplate({
            name: user.name
        })
    })

    return res.status(200).json(new ApiResponse(200, null, "User promoted to admin"));
});

const getAdminRequests = asyncHandler( async (req, res) => {
    const adminUser = req.user;

    if (adminUser.role !== "ADMIN") {
        throw new ApiError(403, "Only admins can view admin access requests");
    }
    const adminRequestList = await AdminRequestModel.find().populate("user", "name email");

    return res.status(200).json(new ApiResponse(200, adminRequestList, "Fetched admin access requests"));
});

export { 
    registerUser,
    verifyEmail,
    loginUser,
    logoutUser,
    uploadAvatar,
    updateAccountDetails,
    getCurrentUser,
    forgotPassword,
    verifyForgotPasswordOtp,
    changePassword,
    refreshAccessToken,
    requestAdminAccess,
    approveAdminAccess,
    getAdminRequests
};