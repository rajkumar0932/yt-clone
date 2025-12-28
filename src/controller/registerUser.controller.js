import  asynchr from '../util/asynchronous.js';
import   {ApiError} from '../util/customerror.js';
import  {User} from '../model/user.model.js';
import {uploadOnCloudinary} from '../util/cloudinary.js';
import {ApiResponse} from '../util/customresponse.js';

const registerUser= asynchr(async (req, res)=>{
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
 const {username , email, fullname, password}=req.body;
 if([username , email, fullname, password].some(item=>item.trim()==="")){
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
 const avatarLocalPath = req.files?.avatar[0]?.path;
 const coverImageLocalPath = req.files?.coverImage[0]?.path;
 if(!avatarLocalPath){
      throw new ApiError(400,"Avatar is compulsary");

 }
 //upload to cloudinary avatar and cover photo
 const uploadAvatarCloudinary= await uploadOnCloudinary(avatarLocalPath);
 const uploadcoverImageCloudinary= await uploadOnCloudinary(coverImageLocalPath);
 // in case it fails
 if(!uploadAvatarCloudinary){
    throw new  ApiError(500," unable to upload on clodinary ");
 }
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
    // return success response

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    )



})
export default  registerUser;
