const Blog = require('../models/Blog');
const User = require('../models/User');

// Initialize Express Router and import authentication controller logic
const {Router} = require('express');
const blogController = require('../controllers/blogControllers');
const { protectRoutes } = require('../middleware/authentication');

const router = Router(); 

//Routes to publically accesible blogs
router.get('/blogs', blogController.getBlogs); 
router.get('/blogs/:id', protectRoutes, blogController.getBlogById);

// Protected routes
router.post('/blogs', protectRoutes, blogController.createBlog);
router.put('/blogs/:id/state', protectRoutes, blogController.updateBlogState);
router.put('/blogs/:id', protectRoutes, blogController.updateBlog);
router.delete('/blogs/:id', protectRoutes, blogController.deleteBlog);
router.get('/my-blogs', protectRoutes, blogController.getMyBlogs); 


// Export the configured router for use in the main app file
module.exports = router


