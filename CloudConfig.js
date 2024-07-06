const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Load environment variables
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET_KEY,
});

// Create the Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'myproject', // The name of the folder in your Cloudinary account
        allowedFormats: ['png', 'jpg', 'jpeg'], // Specify the allowed file formats
    },
});

// Configure multer to use the Cloudinary storage
module.exports = {
    cloudinary,
    storage
};
