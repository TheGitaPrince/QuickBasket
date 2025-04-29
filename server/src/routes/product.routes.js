import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct, 
         getProduct, 
         getProductByCategory,
         getProductByCategoryAndSubCategory, 
         getProductDetails, 
         updateProduct, 
         deleteProduct
        } from "../controllers/product.controller.js";
import { veriyfyJWT } from "../middlewares/auth.middleware.js";

const productRouter = Router();

productRouter
  .route("/create-product")
  .post(veriyfyJWT,upload.fields([{name: "image", maxCount: 5}]), createProduct);

productRouter.route("/get-product").get(getProduct);
productRouter.route("/get-product-category").get(getProductByCategory);
productRouter.route("/get-product-category-subcategory").get(getProductByCategoryAndSubCategory);
productRouter.route("/get-product-details").get(getProductDetails);
productRouter.route("/update-product").patch(veriyfyJWT,upload.fields([{name: "image", maxCount: 5}]),updateProduct);
productRouter.route("/delete-product").post(veriyfyJWT,deleteProduct);

export default productRouter;