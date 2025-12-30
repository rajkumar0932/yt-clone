import {v2 as cloudinary} from "cloudinary"
import fs from "fs"






const uploadOnCloudinary = async (localFilePath) => {
    try {
      
        if (!localFilePath) return null
        cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        // console.error("❌ Cloudinary upload failed");
        // console.error(error);              // FULL error
        // console.error(error.message);      // Clean message
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}