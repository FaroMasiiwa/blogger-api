const blogQueryFunction = require('../utils/blogQueryFunctions')
const Blog = require('../models/Blog');


//Controller Actions
// TODO 1: Create a blog
exports.createBlog = async (req, res) => {
    const { title, description, tags, body } = req.body;

    try {
        const blog = new Blog({ title, description, tags, body, author: req.user.id });

        await blog.save();
        res.status(201).json({
            success: true,
            message: 'Blog created successfully in draft state',
            blog,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


//TODO 02: READ - Get all blogs
exports.getBlogs = async (req, res) => {
    try {
        // Determine if the request is from a logged-in user
        const isUserAuthenticated = req.user && req.user.id;
        const { query, sort, page, limit, skip } = blogQueryFunction(req, isUserAuthenticated);

        // Fetch blogs based on query and pagination parameters
        const blogs = await Blog.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('author', 'first_name last_name email'); 
       
        const total = await Blog.countDocuments(query);

        res.status(200).json({
            success: true,
            count: blogs.length,
            page,
            pages: Math.ceil(total / limit),
            total,
            blogs,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate(
            'author',
            'first_name last_name email'
        );

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // If the blog is not published and the user is not the author, deny access
        if (blog.state === 'draft' && (!req.user || blog.author._id.toString() !== req.user.id)) {
            return res.status(403).json({ message: 'Access denied: Blog is in draft state.' });
        }

        
        blog.read_count += 1;
        await blog.save(); // Save the updated read_count

        res.status(200).json({
            success: true,
            blog,
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Blog not found (Invalid ID format)' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update blog state 
exports.updateBlogState = async (req, res) => {
    const { state } = req.body;

    // Validate state input
    if (!state || !['draft', 'published'].includes(state)) {
        return res.status(400).json({ message: 'Invalid state provided. Must be "draft" or "published".' });
    }

    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if the logged-in user is the author of the blog
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this blog' });
        }

        blog.state = state; // Update the state
        await blog.save(); // Save the updated blog

        res.status(200).json({
            success: true,
            message: `Blog state updated to "${state}"`,
            blog,
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Blog not found (Invalid ID format)' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a blog (content)
exports.updateBlog = async (req, res) => {
    const { title, description, tags, body } = req.body;

    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if the logged-in user is the author of the blog
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this blog' });
        }

        // Update fields if provided
        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.tags = tags || blog.tags;
        blog.body = body || blog.body;


        await blog.save();

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            blog,
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Blog not found (Invalid ID format)' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this blog' });
        }

        await blog.deleteOne(); // Use deleteOne() on the document instance

        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully',
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Blog not found (Invalid ID format)' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all blogs created by the logged-in user (My Blogs)
exports.getMyBlogs = async (req, res) => {
    try {
        const { query, sort, page, limit, skip } = blogQueryFunction(req, true); 

      
        query.author = req.user.id;

        const blogs = await Blog.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('author', 'first_name last_name email');

        const total = await Blog.countDocuments(query);

        res.status(200).json({
            success: true,
            count: blogs.length,
            page,
            pages: Math.ceil(total / limit),
            total,
            blogs,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })    }
};