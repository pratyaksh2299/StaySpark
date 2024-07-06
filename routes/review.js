// Import necessary modules and middleware
const express = require('express');
const router = express.Router({ mergeParams: true });
const { ValidateReview } = require('../ListingValidation.js'); // Import validation function
const Review = require('../models/review.js'); // Import Review model
const wrapAsync = require('../utils/wrapAsync.js'); // Import utility function for error handling
const Listing = require('../models/listing.js'); // Import Listing model
const { isLoggedIn, isOwner,isReviewOuthor } = require('../MiddleWare.js'); // Import middleware functions
const reviewController=require('../controller/review.js');
const ExpressError=require('../utils/ExpressError.js');
// Validation middleware for reviews
function ValidateReviews(req, res, next) {
    let ans = ValidateReview.validate(req.body); // Validate the incoming review data
    console.log(ans); // Log validation result (for debugging)
    if (ans.error) { // If validation fails
        throw new ExpressError(400, ans.error.message); // Throw an error with a 400 status and the validation message
    } else { // If validation passes
        next(); // Proceed to the next middleware or route handler
    }
}

// POST route to add a new review
router.post('/', isLoggedIn, ValidateReviews, wrapAsync(reviewController.addReview));

// DELETE route to delete a review
router.delete('/:reviewId' ,isLoggedIn,isReviewOuthor, wrapAsync(reviewController.deleteReview));

module.exports = router; // Export the router module
