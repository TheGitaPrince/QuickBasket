import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const isAdmin = asyncHandler(async (req,res,next) => {
    try {
        const user = req.user; 
    
        if (!user) {
          throw new ApiError(401, "Unauthorized access");
        }
    
        if (user.role !== "ADMIN") {
          throw new ApiError(403, "Access denied: Admins only");
        }
    
        next();
      } catch (error) {
        next(error);
    }
})
