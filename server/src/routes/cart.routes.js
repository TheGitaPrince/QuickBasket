import { Router } from "express";
import { veriyfyJWT } from "../middlewares/auth.middleware.js";
import { addItemToCart, getCartItems, updateCartItem, deleteCartItem } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.route("/add-cart-item").post(veriyfyJWT, addItemToCart);
cartRouter.route("/get-cart-items").get(veriyfyJWT, getCartItems)
cartRouter.route("/update-cart-item").patch(veriyfyJWT, updateCartItem)
cartRouter.route("/delete-cart-item").post(veriyfyJWT, deleteCartItem)

export default cartRouter;