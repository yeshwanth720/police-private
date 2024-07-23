const mongoose = require('mongoose');

// Custom validation function for user_id and confirmPassword
const validation = function (validator) {
    return {
        validator: validator,
        message: props => `${props.value} is not valid!`
    };
};

// User schema definition
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
        // unique: true,
        // validate: validation(function (value) {
        //     // Add custom validation logic for user_id here if needed
        //     return true; // Example: always valid
        // })
    },
    role: {
        type: String,
        required: true,
        enum: ['police', 'public'], // Restrict role to these values
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    Phone_number: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: validation(function (value) {
            // Custom validation to check if confirmPassword matches Password
            return this.Password === value;
        })
    }
});

// Pre-save hook to remove user_id and confirmPassword before saving
userSchema.pre('save', function (next) {
    // this.user_id = undefined;
    this.confirmPassword = undefined;
    next();
});

// Create the user model
const userModel = mongoose.model('ProjectUser', userSchema);

module.exports = { userModel };
