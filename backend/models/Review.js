import mongoose from "mongoose";

const ReviewSchema=new mongoose.Schema({

    productId:String,
    userId:String,
    username:String,
    reviewMessage:String,
    reviewValue:Number,
    

},{timestamps:true})

export default mongoose.model("Review",ReviewSchema)