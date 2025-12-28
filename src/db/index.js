import mongoose from 'mongoose';


const  dbconnect= async ()=>
{
    try{
        await mongoose.connect(process.env.DATABASE_URL);

    }
    catch{

    (e)=>
        {
         throw new Error("not connected")
        }

    }

   

}
export default dbconnect;