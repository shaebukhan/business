const mongoose = require('mongoose');

// Declare the Schema for the Transaction model
const transactionSchema = new mongoose.Schema({
    accountID: {
        type: mongoose.ObjectId,
        ref: "Accounts",
        required: true
    },
    date: {
        type: Date,
        required: true
    }, name: {
        type: String,
        maxlength: 50
    },
    reconciliationID: {
        type: String
    },
    pending: {
        type: Boolean
    },
    marked: {
        type: Boolean
    }
});

// Export the Transaction model
module.exports = mongoose.model('Transactions', transactionSchema);
