import { Router } from "express";
import { veriyfyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
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
  getAdminRequests,
  approveAdminAccess,
  requestAdminAccess
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/verify-email").post(verifyEmail);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(veriyfyJWT, logoutUser);
userRouter
  .route("/upload-avatar")
  .patch(veriyfyJWT, upload.single("avatar"), uploadAvatar);
userRouter.route("/update-account").patch(veriyfyJWT, updateAccountDetails);
userRouter.route("/current-user").get(veriyfyJWT, getCurrentUser);
userRouter.route("/forgot-password").post(forgotPassword);
userRouter.route("/verify-otp").post(verifyForgotPasswordOtp);
userRouter.route("/reset-password").patch(changePassword);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/request-admin").post(veriyfyJWT, requestAdminAccess);
userRouter.route("/approve-admin").post(veriyfyJWT, isAdmin, approveAdminAccess);
userRouter.route("/get-admin").get(veriyfyJWT, isAdmin, getAdminRequests);

export default userRouter;
