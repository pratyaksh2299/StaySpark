const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { saveRedirectUrl } = require('../MiddleWare.js');
const userController = require('../controller/user.js');
const passport = require('passport');

//signUp page
router.get('/signup', userController.signUp);


router.post('/signup', wrapAsync(userController.signUpRequest));

//Login Page
router.get('/login', wrapAsync(userController.loginRender));

//authenticate 
router.post('/login', saveRedirectUrl,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),
userController.authenticate
);

//logout 
router.get('/logout', userController.logout);
module.exports = router;