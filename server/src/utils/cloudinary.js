import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// export const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if(!localFilePath) return null
//    const response =  await cloudinary.uploader.upload(localFilePath, {
//         resource_type: "auto"
//     })
//     fs.unlinkSync(localFilePath)
//     return response;
//   } catch (error) {
//     fs.unlinkSync(localFilePath)
//     return null;
//   }
// }

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new ApiError(400, "No file provided");
    }
    const buffer = localFilePath.buffer || Buffer.from(await localFilePath.arrayBuffer?.())

    const response = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
          if (error) return reject(error);
          resolve(result)
      })
      stream.end(buffer)
    })
    return response;
  } catch (error) {
    console.error("Upload Error: ", error);
    return null;
  }
};
