const Listing=require('../models/listing');
const Review=require('../models/review');
const User=require('../models/user');

module.exports.addReview=async (req, res) => {
    const listingId = req.params.id; // Extract listing ID from request parameters
    const { rating, comment } = req.body; // Extract rating and comment from request body
     console.log(rating);
    let findListing = await Listing.findById(listingId); // Find the listing by ID in the database

    let addReview = new Review(req.body); // Create a new Review instance with the request body
    addReview.author = req.user._id; // Assign the current user's ID as the author of the review
    console.log(addReview);

    findListing.reviews.push(addReview); // Add the newly created review to the listing's reviews array

    await addReview.save(); // Save the review to the database
    await findListing.save(); // Save the updated listing (with the new review) to the database

    req.flash('success', 'Review created Successfully!'); // Flash a success message
    // console.log('Review created'); // Log success message (for debugging)

    res.redirect(`/hostings/${listingId}`); // Redirect back to the listing page
}


module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params; // Extract listing ID and review ID from request parameters

    // Delete the review from the Reviews collection
    let deletedReview = await Review.findByIdAndDelete(reviewId);

    // Remove the reviewId from the reviews array in the Listing document
    let updatedListing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    req.flash('success', 'Review Deleted Successfully!'); // Flash a success message
    //console.log('Review deleted:', deletedReview); // Log deleted review details (for debugging)
    //console.log('Listing updated:', updatedListing); // Log updated listing details (for debugging)

    res.redirect(`/hostings/${id}`); // Redirect back to the listing page
}
