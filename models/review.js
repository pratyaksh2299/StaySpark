const mongoose=require('mongoose');
const Listing = require('./listing');
const Schema=mongoose.Schema;


const ReviewSchema=Schema({
    comment:{
        type:String
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});


module.exports=mongoose.model('Review',ReviewSchema);
