import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwstoken from 'jsonwebtoken';
const userSchema= new mongoose.Schema({
    id:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        index: true
     },
    
    WatchHistory:
    {
        type:  mongoose.Schema.Types.ObjectId,
        ref : 'Video'
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
     },

    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
     },

 fullname:{
     type: String,
     
        required: true,
        trim: true,
     },
     avatar:{
        type: String,
     },
     password:{
         type: String,
         required: true,
     
     },
     refreshtoken:{
          type: String,

     }

},{
    timespans: true
}

)
userSchema.pre('save',async function (next){
    if(!this.isModified("password")) return next();
   this.password= bcrypt.hash(this.password,10);
   next();



})
userSchema.methods.checkPassword= async function(password){
    return bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken =function (){
    return jwstoken.sign({
        id: this.id,
        username:this.username
    },process.env.ACCESS_TOKEN_SECRET,{
        ACCESS_TOKEN_DELAY

    }
)
}
userSchema.methods.generateRefreshToken =function (){
    return jwstoken.sign({
        id: this.id,
        username:this.username
    },process.env.REFRESH_TOKEN_SECRET,{
        REFRESH_TOKEN_DELAY

    }
)
}


export const User =mongoose.model('User',userSchema);
