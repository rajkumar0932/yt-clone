
import { Router } from 'express';
import { upload }  from  '../middleware/multer.middleware.js'
import {registerUser,loginUser} from '../controller/User.controller.js'
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


export default userRouter;


