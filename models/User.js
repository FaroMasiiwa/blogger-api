const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define of user schema
const userSchema = new mongoose.Schema({
     firstName: {
        type: String,
        required: [true, 'Please enter your first name'],
        trim: true
    },
     lastName: {
        type: String,
        required: [true, 'Please etner your last name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        lowercase: true,
        minLength:6,
        trim: true,
        match: [/.+@.+\..+/, 'Please use a valid email address'],
        unique: true,

    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }
}, 
{ timestamps: true }

);



//Hashes the user's password using bcrypt before saving.
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare a provided password with the stored hashed password for authentication.
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};



// Create the model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;