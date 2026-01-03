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
// console.log("🔥 Cover Image Local Path:", coverImageLocalPath);
 if(coverImageLocalPath){
 uploadcoverImageCloudinary=await uploadOnCloudinary(coverImageLocalPath);
 }
 // in case it fails
 //console.log("🔥 cloudinary location ", uploadAvatarCloudinary);
 if(!uploadAvatarCloudinary){
    throw new  ApiError(500," unable to upload on clodinary ");
 }
 //console.log("success avatar upload");
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
    //console.log("success user created");
    // return success response

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    )



})
const generateAccessAndRefreshToken = async (userId)=>{
 try{
   const user= await User.findById(userId);
 //  console.log("user in generate token", user);
   const refreshtoken= await user.generateRefreshToken();
    const accessshtoken=await  user.generateAccessToken();
    user.refreshtoken=refreshtoken;
  //  console.log("refreshtoken and accessshtoken", refreshtoken, accessshtoken);
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
   const decoded=  jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
   
   const user =await User.findById(decoded.id);
   if(!user){
       throw new ApiError(400,"refresh Token is wrong");

   }
   if(user.refreshtoken!==refreshToken){
        throw new ApiError(400,"refresh Token is expired");

   }
   const {refreshtoken, accessshtoken} = await generateAccessAndRefreshToken (user.id);
   const options ={
      secure: true,
        httpOnly: true,

   }
   console.log("refreshtoken and accessshtoken", refreshtoken, accessshtoken);
   return res.status(200).cookie("refreshToken",refreshtoken,options).cookie("accessToken",accessshtoken,options).json( new ApiResponse (200,{refreshtoken, accessshtoken},"accessToken refreshed") );
})
const changePassword =asynchr (async (req, res, next)=>{
   // we have to extract password from body
   const {oldPassword, newPassword}= req.body;
   if(!oldPassword || !newPassword){
         throw new ApiError(400,"Both old and new password required");
   }

 // console.log(req.user);
   const user = await User.findById(req.user.id);
   const matchPassword= user.checkPassword(oldPassword);
   if(!matchPassword){
       throw new ApiError(400,"ENTER CORRECT PASSWORD");
   }
        user.password = newPassword;
       await user.save({validateBeforeSave: false})
        return res.status(200).json(new ApiResponse(200,{},"Password changed Successfully"));





})
const displayUser=asynchr (async (req, res, next)=>{
   return res.status(200).json(new ApiResponse(200,req.user,"User Profile Sent"));

})
const updateAvtar=asynchr (async (req, res, next)=>{
   const avatarLoc= req.files.avatar?.[0];
 
   const savedAvatar= await User.findByIdAndUpdate(req.user.id,{
      $set:{
         avatar: avatarLoc.path
      }

   },{
      new: true
   }).select(" -password ");
   if(!savedAvatar){
      throw new ApiError(500,"unable to update avatar");
   }

   return res.status(200).json(new ApiResponse(200,savedAvatar,"Avatar updated Successfully"));

})
const updateCoverImage = asynchr(async (req, res) => {
  const coverImageLoc = req.files?.coverImage?.[0];

  if (!coverImageLoc) {
    throw new ApiError(400, "Cover image is required");
  }

  const savedCoverImage = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        coverImage: coverImageLoc.path,
      },
    },
    { new: true }
  ).select("-password");

  if (!savedCoverImage) {
    throw new ApiError(500, "Unable to update cover image");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, savedCoverImage, "Cover image updated successfully")
    );
});

const updateProfileInfo =asynchr (async (req, res, next)=>{
   const {username , email }= req.body;
   if(!username || !email) {
      throw new ApiError(400, "Give both field");
   }
   console.log("req.user.id", req.user.id);
   const updatedUser = await User.findByIdAndUpdate(req.user.id,{
      $set:{
         username :username,
         email : email
       }
   }).select("-password");
   return res.status(200).json(new ApiResponse(200,updatedUser,"User profile Updated"))

})

const getUserproile =asynchr ( async (req, res, next)=>{
 const {username} =req.params;
 if(!username){
   throw ApiError(400, "no user presemt")
 }


 const details = await User.aggregate([
   {$match: {
      username: username
   }},
   {
      $lookup: {
         from : "subs",
         localField :"_id",
         foreignField : "subscribeTo",
         as: "subscribers"

      }
   },
   {
       $lookup: {
         from : "subs",
         localField :"_id",
         foreignField : "subscriber",
         as: "subscribeTo"

      }
   },
   {
      $addFields:
      { 
         subscriberCount :{
            $size :"$subscribers"
         },
          subscribedToCount : {
            $size : "$subscribeTo"
          },
         isSubscribed: {
  $cond: {
    if: {
      $in: [
        req.user?._id,
        {
          $map: {
            input: "$subscribers",
            as: "sub",
            in: "$$sub.subscriber"
          }
        }
      ]
    },
    then: true,
    else: false
  }
}

   }


   },
   {
     
         $project : {
             fullName: 1,
                username: 1,
                subscriberCount: 1,
                subscribedToCount : 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1


         }
      
   }
]);
console.log("details", details);
if(!details || details.length ===0){
   throw new ApiError(400, "user not found")

}
return res.status(200).json(new ApiResponse(200, details[0], "User Profile fetched"));

})
export { registerUser, loginUser, logout,regenerateAccessToken ,changePassword,displayUser,updateAvtar,updateCoverImage,updateProfileInfo,getUserproile};