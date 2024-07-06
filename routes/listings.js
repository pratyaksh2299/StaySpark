const express=require('express');
const router=express.Router();
const Listing=require('../models/listing.js');
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {ValidateListing}=require('../ListingValidation.js');
const {isLoggedIn,isOwner}=require('../MiddleWare.js');
const listingController=require('../controller/listing.js');
const { route } = require('./user.js');
const multer  = require('multer'); //used to store the local files in local storage
 //creates  folder to save file
const {storage}=require('../CloudConfig.js');
const upload = multer({storage});


//validate client side joi validation
function ValidateListings(req,res,next){
    let ans = ValidateListing.validate(req.body);
    
    if (ans.error) {
        throw new ExpressError(400, ans.error.message); 
    }
    else{
        next();
    }
}

//The router.route() method returns the instance of a single route which can be used to handle the HTTP 
//verbs further with the optional middleware. This method can be used to avoid duplicate route naming and 
//therefore the typing errors.

router.get('/home',(req,res)=>{
    res.render('listings/home.ejs');
});


//search
router.post('/find',wrapAsync(listingController.search));

// slash route

router.get("/",wrapAsync(listingController.index)); //index route

//new route
router.get("/new",isLoggedIn,listingController.newRoute);
router.post("/", isLoggedIn,upload.single('image'),ValidateListings,wrapAsync(listingController.newListing)); //create nrew route




// /:id route
router.route("/:id")
.get(wrapAsync(listingController.showListing)) //Show route
.put(isLoggedIn,isOwner,upload.single('image'),ValidateListings,wrapAsync(listingController.updateListing)) //update listings
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));//deleteListening




//Edit Listening route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));





module.exports=router;