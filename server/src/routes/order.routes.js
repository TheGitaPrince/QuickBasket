import { Router } from "express";
import { veriyfyJWT } from "../middlewares/auth.middleware.js";
import { cashOnDelivery, onlinePaymentOrder, verifyPayment, getOrderDetails, } from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.route("/cash-on-delivery").post(veriyfyJWT, cashOnDelivery);
orderRouter.route("/create-stripe-session").post(veriyfyJWT, onlinePaymentOrder)
orderRouter.route("/verify-payment").post(veriyfyJWT, verifyPayment)
orderRouter.route("/get-order-details").get(veriyfyJWT, getOrderDetails )


export default orderRouter;