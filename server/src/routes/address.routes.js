import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { addAddress, getAddress, updateAddress, deleteAddress } from "../controllers/address.controller.js";
import { veriyfyJWT } from "../middlewares/auth.middleware.js";

const addressRouter = Router();

addressRouter.route("/add-address").post(veriyfyJWT, addAddress);
addressRouter.route("/get-address").get(veriyfyJWT,getAddress)
addressRouter.route("/update-address").patch(veriyfyJWT, updateAddress)
addressRouter.route("/delete-address").post(veriyfyJWT, deleteAddress)

export default addressRouter;