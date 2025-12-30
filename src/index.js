import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
  path: path.resolve(process.cwd(), '.env')
})

import express from 'express'
import dbconnect from './db/index.js'
import app from './app.js'



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
