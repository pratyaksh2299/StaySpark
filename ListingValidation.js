const Joi = require('joi');
//server side validation 
// Define Joi schema for listing validation
const ValidateListing = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    country: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow('', null) // Allow empty string or null for image
});

// Define Joi schema for review validation
const ValidateReview = Joi.object({
   
    rating: Joi.number().required().min(1).max(5) ,
    comment: Joi.string().required(),
});

module.exports = {
    ValidateListing,
    ValidateReview
};