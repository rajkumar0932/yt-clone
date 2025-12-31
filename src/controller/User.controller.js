import  asynchr from '../util/asynchronous.js';
import   {ApiError} from '../util/customerror.js';
import  {User} from '../model/user.model.js';
import {uploadOnCloudinary} from '../util/cloudinary.js';
import {ApiResponse} from '../util/customresponse.js';
import jwt from 'jsonwebtoken';

const registerUser= asynchr (async (req, res)=>{
  // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


// checkinging if no field is vacant
 //console.log(req.body);

 const { username , email, fullname, password } = req.body;
 if([ username , email , fullname , password ].some(item=>item.trim() === "")){
    throw new ApiError(400,"All field are compulsary");
 }
 // check for existing email or  user
 const checkexisting= await User.findOne({
    $or :[{username}, {email}]
 })
 // return error in case when it exist 
 if(checkexisting){
      throw new ApiError(400,"User already Exist");

 }
 // get location of image or file stored in local file or server through multer middleware
 const avatarLocalPath = req.files?.avatar?.[0]?.path;
 const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
 if(!avatarLocalPath){
      throw new ApiError(400,"Avatar is compulsary");

 }
 //console.log("🔥 Avatar Local Path:", avatarLocalPath);
 //upload to cloudinary avatar and cover photo
 const uploadAvatarCloudinary= await uploadOnCloudinary(avatarLocalPath);
 const uploadcoverImageCloudinary= null;
 console.log("🔥 Cover Image Local Path:", coverImageLocalPath);
 if(coverImageLocalPath){
 uploadcoverImageCloudinary=await uploadOnCloudinary(coverImageLocalPath);
 }
 // in case it fails
 //console.log("🔥 cloudinary location ", uploadAvatarCloudinary);
 if(!uploadAvatarCloudinary){
    throw new  ApiError(500," unable to upload on clodinary ");
 }
 console.log("success avatar upload");
 // create user Object
 const ObjectCreate= await User.create({
        username,
        avatar: uploadAvatarCloudinary.url,
        coverImage: uploadcoverImageCloudinary?.url || "",
        email, 
        password,
       fullname: fullname.toLowerCase()
 })
 // check if user is  created on db
 const createdUser=  await User.findById(ObjectCreate._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
          throw new  ApiError(500,"unable to update user info on db");

    }
    console.log("success user created");
    // return success response

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    )



})
const generateAccessAndRefreshToken = async (userId)=>{
 try{
   const user= await User.findById(userId);
   const refreshtoken= await user.generateRefreshToken();
    const accessshtoken=await  user.generateAccessToken();
    user.refreshtoken=refreshtoken;
    await user.save({ validateBeforeSave: false });
    return {refreshtoken, accessshtoken};




 }
 catch(error){
   throw new ApiError(500, " somthing went wrong while forming access token");

 }



}
const loginUser = asynchr (async (req, res) => {
   // take input from pstman
  
   // verify if username and password is in correct format
   // verify if username and password matches with one in mongo db
   // if not matches give error that user is not found
   // provide both access and refresh token
   // if send the cookies
   const {username, email, password }= req.body;
   if(!username && !email){
      throw new ApiError(400,"give username or email");
   }
    if(!password){
      throw new ApiError(400,"give password");
   }
   const checkExistence= await User.findOne(
   {
      $or : [{username},{email}]
   }
   )
   if(!checkExistence){
        throw new ApiError(400,"User Not Found");
       }
       const options = {
        httpOnly: true,
        secure: true
    }
   
   // console.log("user", checkExistence);
    const checkPassword =  await checkExistence.checkPassword(password);
    if(!checkPassword){
      throw new ApiError(400,"Invalid Credentials");
    }
     const {refreshtoken, accessshtoken} = await generateAccessAndRefreshToken(checkExistence._id);
   

   return   res.status(200).cookie("accessToken",accessshtoken,options).cookie("refreshToken",refreshtoken,options).json(
       new ApiResponse(200, {accessToken: accessshtoken, refreshToken: refreshtoken}, "User logged In")
)  
})
const logout = asynchr (async (req, res, next)=>{
   await User.findByIdAndUpdate(req.user._id, {refreshtoken: ""}, {validateBeforeSave: false});
   const options ={
      httpOnly: true,
      secure: true
   }
   return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options) .json(new ApiResponse(200,{},"UserLogout Successfully"));
})
const regenerateAccessToken = asynchr (async (req, res, next)=>{
   const refreshToken=req.cookies?.refreshToken || req.body.refreshToken || req.header("x-refresh-Token");
   if(!refreshToken){
        throw new ApiError(400,"refresh Token not available");
   }
   const decoded= jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
   
   const user =await User.findById(decoded.id);
   if(!user){
       throw new ApiError(400,"refresh Token is wrong");

   }
   if(user.refreshtoken!==refreshToken){
        throw new ApiError(400,"refresh Token is expired");

   }
   const {refreshTokens, accessTokens} = generateAccessAndRefreshToken (user.id);
   const options ={
      secure: true,
        httpOnly: true,

   }
   return res.status(200).cookie("refreshToken",refreshTokens,options).cookie("accessToken",accessTokens,options).json( new ApiResponse (200,{},"accessToken refreshed") );


})
export { registerUser, loginUser, logout,regenerateAccessToken };