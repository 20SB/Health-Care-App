const express = require('express');
const router = express.Router();

// Import the home controller
const homeController = require('../controllers/home_controller');

// Route for the home page
router.get('/', homeController.home);

// Use the users router for handling user-related routes
router.use('/users', require('./users.js'));
router.use('/emergency', require('./emergency.js'));

// Export the main router to be used in your application
module.exports = router;