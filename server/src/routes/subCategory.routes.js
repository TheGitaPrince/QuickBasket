import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createSubCategory, getSubCategory, updateSubCategory, deleteSubCategory } from "../controllers/subCategory.controller.js";
import { veriyfyJWT } from "../middlewares/auth.middleware.js";

const subCategoryRouter = Router();

subCategoryRouter
  .route("/create-subcategory")
  .post(veriyfyJWT,upload.single("image"), createSubCategory);
  
subCategoryRouter.route("/get-subcategory").get(getSubCategory)
subCategoryRouter.route("/update-subcategory").patch(veriyfyJWT,upload.single("image"), updateSubCategory)
subCategoryRouter.route("/delete-subcategory").post(veriyfyJWT, deleteSubCategory)

export default subCategoryRouter;