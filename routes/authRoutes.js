// Initialize Express Router and import authentication controller logic
const {Router} = require('express');
const authController = require('../controllers/authControllers');

const router = Router(); 

// Auth routes: handle user sign-up and login requests
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);


// Export the configured router for use in the main app file
module.exports = router