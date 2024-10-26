const mongoose = require('mongoose');

// Declare the Schema for the Entry model
const entrySchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    categoryID: {
        type: mongoose.ObjectId,
        ref: "Category",
        required: true
    },
    comments: {
        type: String,
        maxlength: 50,
        required: false
    },

    transactionID: {
        type: mongoose.ObjectId,
        ref: "Transactions",
        required: true
    }
});

// Export the Entry model
module.exports = mongoose.model('Entry', entrySchema);
