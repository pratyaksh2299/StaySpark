const User=require('../models/user.js');


//signup
module.exports.signUp=(req,res)=>{
    res.render('./user/signup.ejs');
  }

//singup post
module.exports.signUpRequest=async (req,res,next)=>{
    try {
        let {username,email,password}=req.body;
        // console.log(req.body);
       const newUser=new User({
            username,
            email
        });
        const registedrdUser=await User.register(newUser,password);
        // console.log(registedrdUser);

        //auto metically login middleware
       req.login(registedrdUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash('success','welcome to the StaySpark');
            res.redirect('/hostings');
        })
       
    } catch (error) {
        req.flash('error',error.message);
        res.redirect('/signup');
    }
}

//Render Login
module.exports.loginRender=async (req,res)=>{
    res.render('./user/login.ejs');
}

module.exports.authenticate=async  function(req,res){
 req.flash('success',"Welcome to the StaySpark");
 res.redirect(res.locals.redirectUrl||"/hostings");
}

//logout
module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You Logged Out Successfully!');
        res.redirect('/hostings');
    })
}