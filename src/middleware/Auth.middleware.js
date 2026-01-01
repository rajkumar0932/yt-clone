import asyncHandler from "../util/asynchronous.js";
import jwt from 'jsonwebtoken';
import {User} from '../model/user.model.js';
import { ApiError }  from "../util/customerror.js";
export const AuthMiddleware = asyncHandler(async (req, res,next)=>{
    try {
        const accessToken =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") || req.body.accessToken;
        console.log("access token in middleware", accessToken);
      
          if (!accessToken) {
                throw new ApiError(401, "Unauthorized request")
            }
            
            const decodedToken =jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decodedToken.id).select("-password -refreshtoken");
            console.log("decoded token", decodedToken.id);
            if(!user){
                 throw new ApiError(401, "Wrong Access token")
    
                }
                req.user=user;
                next();
    } catch (error) {
         throw new ApiError(401, error?.message || "Invalid access token")
        
    }
 })

