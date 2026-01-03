import mongoose from 'mongoose';

const SubcripSchema = new mongoose.Schema({
     subscriber: 
        
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User'
            }
        ,

     
     subscribeTo :  {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User'
            }

},{
    timestamps: true
})
export const Sub = mongoose.model("Sub",SubcripSchema);