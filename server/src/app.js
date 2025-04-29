import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import errorHandler from "./middlewares/errorHandler.middleware.js";
import dotenv  from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config({
    path: "./.env"
})

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(helmet());
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
}

import userRouter from "./routes/user.routes.js"
import categoryRouter from "./routes/category.routes.js"
import subCategoryRouter from "./routes/subCategory.routes.js"
import productRouter from "./routes/product.routes.js"
import cartRouter from "./routes/cart.routes.js"
import addressRouter from "./routes/address.routes.js"
import orderRouter from "./routes/order.routes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/subcategory", subCategoryRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/address", addressRouter)
app.use("/api/v1/order", orderRouter)

app.use(errorHandler);

export { app }