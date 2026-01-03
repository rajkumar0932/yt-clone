
import { Router } from 'express';
import { upload }  from  '../middleware/multer.middleware.js';
import {registerUser,loginUser,logout,regenerateAccessToken,changePassword,displayUser,updateAvtar,updateCoverImage,updateProfileInfo,getUserproile} from '../controller/User.controller.js';
import  { AuthMiddleware } from '../middleware/Auth.middleware.js';
const userRouter= Router();
userRouter.route('/register').post(
     (req, res, next) => {
    console.log('🔥 ROUTE HIT')
    next()
  },
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').post(AuthMiddleware,logout);
userRouter.route('/renewAccessToken').post(regenerateAccessToken);
userRouter.route('/changePassword').post(AuthMiddleware,changePassword);
userRouter.route('/displayUser').post(AuthMiddleware,displayUser);
userRouter.route('/updateAvatar').post(AuthMiddleware, upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
      
    ]),updateAvtar);
userRouter.route("/updateCoverImage").post(
  AuthMiddleware,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  updateCoverImage
);
userRouter.route('/updateProfile').post(AuthMiddleware,updateProfileInfo);
userRouter.route("/users/:username").post(AuthMiddleware,getUserproile);

export default userRouter;


