import mongoose from 'mongoose';
import mongooseAggregatePaginate from  'mongooseAggregatePaginate';

 const videoSchema= new mongoose.Schema({
    id:{
        type: String,
        unique:true,
        required: true,
        lowercase: true

    },
    videocall:{
        type: String,
       
    },
    thumbnail:{
        type: String,

    },
    owner:{
        type: Schema.Type.ObjectId,
        ref: 'User'
    },
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String, 
        required: true,
     },
     duration:{
        type: Number
     },
     views:{
          type: Number
     },
     isboolean:{
        type: Boolena
     }


 }
,
{
    timespans: true
})
videoSchema.plugin(mongooseAggregatePaginate);
export const Video= mongoose.model('Video',videoSchema)