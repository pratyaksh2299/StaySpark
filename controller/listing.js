const Listing=require('../models/listing');
const ExpressError=require('../utils/ExpressError.js');

module.exports.index=async (req,res)=>{
    let data=await Listing.find({});
    // console.log(data);
     res.render("./listings/index.ejs",{data});
}


module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    // console.log(id);
    //fetch data of related review and owner throw populate and review author
    let data =await Listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner'); 
    if(!data){
        req.flash('error','hosting no more exist!');
        res.redirect('/hostings');
    }
    else{
    console.log(data);
     res.render("listings/show.ejs",{data});
    }
}

//create new listing
module.exports.newListing=async (req, res, next) => {
    let data = req.body;
    console.log(data.title);
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(req.file);
    let newdata = new Listing(data);
    newdata.image={url,filename};
    req.flash('success','hosting created SuccessFully!');
    //add owner also 
    newdata.owner=req.user._id;
    await newdata.save();
    res.redirect('/hostings');
}

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    if(!data){
       req.flash('error','Hosting no more exist!');
       res.redirect('/hostings');
   }
   else{
    req.flash('success','Listing updated SuccessFully!');
    res.render('./listings/edit.ejs',{data});
   }
   }

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let data=req.body;
    let updated=await Listing.findByIdAndUpdate(id,data);
    // for image updation
    if (typeof req.file !== 'undefined') {
        let url=req.file.path;
        let filename=req.file.filename;
        updated.image = {
           url,filename,
        };
        updated.save();
    }
    req.flash('sucess','Updated SucessFully!');
    res.redirect(`/hostings/${id}`);
}

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    req.flash('success','hosting deleted SuccessFully!');
   //  console.log(deleted);
    res.redirect("/hostings");
   }


//new route
module.exports.newRoute=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.search=async (req,res,next)=>{
    let city=req.body.city;
    console.log(city);
     let data=await Listing.find({location:city});
     console.log(data);
     if(data.length){
     
     res.render('./listings/search.ejs',{data});
     }
     else{
        throw new ExpressError(404, 'Destination  not found');
     }
 }