const Listing=require('./models/listing');
const Review=require('./models/review');

module.exports.isLoggedIn=async (req,res,next)=>{
    if(!(req.isAuthenticated())){
        //if user try to access some page and not loggedin then after login redirect to it page
        req.session.redirectUrl=req.originalUrl;
        req.flash('error','please login!');
        return res.redirect('/login');
    }
    next();
};

//but after logged in passport forget the session and restar it so wee need to save the sessin in locals
module.exports.saveRedirectUrl=async (req,res,next)=>{
    if( req.session.redirectUrl){
        console.log(req.session.redirectUrl);
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}

//authorization middlware is currentuser or owner is same or not

module.exports.isOwner=async (req,res,next)=>{ 
    let {id}=req.params;
    let listing=await Listing.findById(id);
    //authorization to give peermission to edit b/w currect user and owner
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash('error','You dont have permission!');
        return res.redirect(`/hostings/${id}`);
    }
    next();
}

//isReviewAuthor to delete
module.exports.isReviewOuthor=async (req,res,next)=>{ 
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    //authorization to give peermission to edit b/w currect user and owner
    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash('error','You are not author of this review!');
        return res.redirect(`/hostings/${id}`);
    }
    next();
}