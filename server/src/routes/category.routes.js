import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createCategory, getCategory ,updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { veriyfyJWT } from "../middlewares/auth.middleware.js";

const categoryRouter = Router();

categoryRouter
  .route("/create-category")
  .post(veriyfyJWT,upload.single("image"), createCategory);
  
categoryRouter.route("/get-category").get(getCategory)
categoryRouter.route("/update-category").patch(veriyfyJWT,upload.single("image"), updateCategory)
categoryRouter.route("/delete-category").post(veriyfyJWT, deleteCategory)

export default categoryRouter;