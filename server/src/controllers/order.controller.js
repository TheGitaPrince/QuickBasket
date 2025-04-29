import mongoose  from "mongoose";
import { UserModel } from "../models/user.model.js";
import { CartProductModel } from "../models/cartProduct.model.js";
import { ProductModel } from "../models/product.model.js";
import { AddressModel } from "../models/address.model.js";
import { OrderModel } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const cashOnDelivery = asyncHandler(async (req,res) => {
    const { cartItems, delivery_address } = req.body
    
    if (!delivery_address) {
        throw new ApiError(400, "Delivery address are required.");
    }
    const userId = req.user?._id

    const user = await UserModel.findById(userId)
    if (!user || user.shopping_cart.length === 0) {
        throw new ApiError(400, "Shopping cart is empty.");
    }

    const createdOrders = [];

    for (let item of cartItems) {
        const orderId = `ODR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const product = item.productId;
        const quantity = item.quantity || 1;
        const actualPrice = product.price || 0;
        const discountPercent = product.discount || 0;

        const discountedPrice = actualPrice - (actualPrice * discountPercent / 100);

        const subTotal = discountedPrice * quantity;
        const total = subTotal;

        const newOrder = await OrderModel.create({
          userId,
          orderId,
          productId: product._id,
          product_details: {
            name: product.name,
            image: product.image
          },
          payment_id: "",
          payment_status: "CASH ON DELIVERY",
          delivery_address,
          delivery_status: "Processing",
          subTotalAmt: subTotal,
          totalAmt: total,
          invoice_receipt: ""
        });
        user.order_histroy.push(newOrder._id);
        createdOrders.push(newOrder);
    }

    user.shopping_cart = [];
    await user.save();
    await CartProductModel.deleteMany({ userId })

    res.status(201).json(new ApiResponse(201,createdOrders, "Order placed successfully."));
})

const onlinePaymentOrder = asyncHandler(async (req, res) => {
    const { cartItems, delivery_address } = req.body;
  
    if (!delivery_address) {
      throw new ApiError(400, "Delivery address is required.");
    }

    const userId = req.user?._id;
  
    const simplifiedCartItems = cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        name: item.productId.name,
        price: item.productId.price,
    }));

    const line_items = cartItems.map((item) => {
      const product = item.productId;
      const quantity = item.quantity || 1;
      const actualPrice = product.price || 0;
      const discountPercent = product.discount || 0;
      const discountedPrice = actualPrice - (actualPrice * discountPercent / 100);
  
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
            images: product.image,
            metadata : {
                productId : product._id
            }
          },
          unit_amount: discountedPrice * 100
        },
        quantity,
      };
    });
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CORS_ORIGIN}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CORS_ORIGIN}/order-cancel`,
      metadata: {
        userId: userId.toString(),
        delivery_address: delivery_address.toString(), 
        cartItems: JSON.stringify(simplifiedCartItems),
      },
    });
  
    res.status(200).json(
      new ApiResponse(200, { sessionId: session.id }, "Stripe session created.")
    );
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    throw new ApiError(400, "Session ID is required.");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session || session.payment_status !== 'paid') {
    throw new ApiError(400, "Payment failed or not completed.");
  }

  const userId = session.metadata.userId;
  const cartItems = JSON.parse(session.metadata.cartItems);
  const deliveryAddress = session.metadata.delivery_address;

  const user = await UserModel.findById(userId);

  const createdOrders = [];

  for (let item of cartItems) {
    const orderId = `ODR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const product = await ProductModel.findById(item.productId);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const quantity = item.quantity || 1;
    const actualPrice = product.price || 0;
    const discountPercent = product.discount || 0;

    const discountedPrice = actualPrice - (actualPrice * discountPercent / 100);

    const subTotal = discountedPrice * quantity;
    const total = subTotal;

    const newOrder = await OrderModel.create({
      userId,
      orderId,
      productId: product._id,
      product_details: {
        name: product.name,
        image: product.image
      },
      payment_id: session.id,
      payment_status: "PAID",
      delivery_address: deliveryAddress,
      delivery_status: "Processing",
      subTotalAmt: subTotal,
      totalAmt: total,
      invoice_receipt: session.receipt_url || ""
    });

    user.order_histroy.push(newOrder._id);
    createdOrders.push(newOrder);
  }

  user.shopping_cart = [];
  await user.save();
  await CartProductModel.deleteMany({ userId });

  res.status(200).json(new ApiResponse(200, createdOrders, "Payment verified and order placed successfully."));
});

const getOrderDetails = asyncHandler(async (req,res) => {
    const userId = req.user?._id

    const orderItems = await OrderModel.find({ userId }).sort({ createdAt: -1 }).populate("delivery_address")

    res.status(200).json(new ApiResponse(200, orderItems, "Orders fetched successfully."));

})

export {
    cashOnDelivery,
    onlinePaymentOrder,
    verifyPayment,
    getOrderDetails,
}