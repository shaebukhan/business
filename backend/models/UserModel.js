const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
    },

    role: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Users', userSchema);