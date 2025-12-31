import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import userRouter from './router/user.router.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app= express();
app.use(cors({
    origin:process.env.ALLOWEDSITE,
    credentials: true
}
   
))
app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended:"true", limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// router be here
app.use('/user',userRouter)


export default app;
