import dotenv from 'dotenv';
import express from 'express';
import dbconnect from './db/index.js'
import app from './app.js'
dotenv.config();

dbconnect()
.then(
    app.listen(process.env.PORT,()=>{
        console.log(`PORT IS running on ${process.env.PORT}`);

    })



)
.catch(
    (e)=>{
       
        console.log("error")

    }
)
