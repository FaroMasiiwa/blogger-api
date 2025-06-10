// Initialize Express Router and import authentication controller logic
const {Router} = require('express');
const authController = require('../controllers/authControllers');

const router = Router(); 

// Auth routes: handle user sign-up and login requests
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);



// Export the configured router for use in the main app file
module.exports = router