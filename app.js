
const express=require('express');
const engine = require('ejs-mate');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const ExpressError=require('./utils/ExpressError.js');
const session=require('express-session');
const MongoStore = require('connect-mongo');
var methodOverride = require('method-override');
const listingsRouter = require('./routes/listings.js');
const revieRouter=require('./routes/review.js');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');
const UserRouter=require('./routes/user.js');
const dotenv = require('dotenv'); //help to load credential from .env
const wrapAsync = require('./utils/wrapAsync.js');

const db_url=process.env.ATLAS_KEY;
//connect session info with Atlas
const store=  MongoStore.create({
    mongoUrl:db_url,
    crypto: {
        secret :process.env.SECRET,
    } //stores the info for 24hrs
    ,touchAfter: 24*3600,
}) ;

store.on("error",()=>{
    console.log('Error in mongo');
})
//session schema define
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*100,
        maxAge:7*24*60*60*100,
        httpOnly:true
    }
};


app.use(session(sessionOptions,store));
app.use(flash());

//authentication part

app.use(passport.initialize());
//every page that we go passport needs to know the same session for authentication
app.use(passport.session());

//Passport uses the concept of strategies to authenticate requests. Strategies can range from verifying username 
//and password credentials, delegated authentication using OAuth (for example, via Facebook or Twitter), or
// federated authentication using OpenID.
passport.use(new LocalStrategy(User.authenticate()));

//to store user related information into session is known as serialize
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"/public")));



//connect db
async function main(){
    await mongoose.connect(db_url);
}

main().then((res)=>{
    console.log('connect to db');
}).catch((err)=>{
    console.log(err);
});



//recevieves flash request and sent to next page
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    //access the current user who is loggedin and pass in navbar.ejs
    res.locals.currentUser=req.user;
    next();
})

app.use("/hostings",listingsRouter);
app.use('/hostings/:id/reviews',revieRouter);
app.use('/',UserRouter);
//Reviews

//homepage 




//for all invialid requests
app.all('*',(req,res,next)=>{
     next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
    let {status=500,message="Something went Wrong"}=err;
    res.render('alert.ejs',{message});
//  res.status(status).send(message);
});
const PORT=process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log("app is listing to 8080");
})