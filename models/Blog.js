const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title can not be more than 100 characters'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters'],
    },
    tags: {
        type: [String],
        default: [],
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    state: {
        type: String,
        enum: ['draft', 'published'], 
        default: 'draft', 
    },
    read_count: {
        type: Number,
        default: 0,
    },
    reading_time: {
        type: Number, 
        default: 0,
    },
    body: {
        type: String,
        required: [true, 'Please add blog content'],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save middleware to calculate reading time before saving
BlogSchema.pre('save', function (next) {
    if (this.isModified('body') || this.isNew) { 
        const wordsPerMinute = 200;
        const wordCount = this.body.split(/\s+/g).length; // Split by one or more whitespace characters
        this.reading_time = Math.ceil(wordCount / wordsPerMinute);
    }
    next();
});

module.exports = mongoose.model('Blog', BlogSchema);