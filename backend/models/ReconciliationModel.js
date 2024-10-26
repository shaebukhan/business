const mongoose = require('mongoose');

// Declare the Schema for the Reconciliation model
const reconciliationSchema = new mongoose.Schema({
    accountID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accounts', // Reference to the 'Accounts' model
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    statementDate: {
        type: Date,
        required: true
    },
    statementStartAmount: {
        type: Number,
        required: true
    },
    statementEndAmount: {
        type: Number,
        required: true
    }
});

// Export the Reconciliation model
module.exports = mongoose.model('Reconciliation', reconciliationSchema);
