const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var accountsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50
    },
    hidden: {
        type: Boolean,
        default: false // Assuming by default an account is not hidden
    }
});

// Export the model
module.exports = mongoose.model('Accounts', accountsSchema);
