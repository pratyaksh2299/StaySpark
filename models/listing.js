const mongoose =require('mongoose');
const Schema=mongoose.Schema;
const Review =require('./review.js');
const listingSchema=new Schema({
    title:{
        type:String,
    },
    description:{ 
        type:String,
     },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }],
    //defining owner for authorization person so that no other person cant access the data
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
});

// delete all rviews with listing
listingSchema.post('findOneAndDelete',async (listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
const Listing=mongoose.model('Listing',listingSchema);

module.exports=Listing;