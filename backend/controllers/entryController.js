
const TransactionModel = require("../models/TransactionModel");
const EntryModel = require("../models/EntryModel");


// Update transaction controller
const updateEntryController = async (req, res) => {
    try {
        const { category, amount, comments } = req.body;
        const EntryId = req.params.id;

        // Update the category, amount, and comments for the transaction
        const updatedEntry = await EntryModel.findByIdAndUpdate(
            { _id: EntryId },
            { category, amount, comments },
            { new: true }
        );

        return res.status(200).send({
            success: true,
            message: "Entry Updated Successfully !!",
            entry: updatedEntry,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in updating  Entry",
            error,
        });
    }
};

// Delete transaction entry controller
const deleteEntryController = async (req, res) => {
    try {
        const { id } = req.params;

        const entry = await EntryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Entry Deleted Successfully",
            entry
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in Delete Entry",
            error,
        });
    }
};

//get all  entries
const GetAllEntryController = async (req, res) => {
    try {
        const entries = await EntryModel.find({});
        res.status(200).send({
            success: true,
            message: "All Entries listed SuccessFully !!",
            entries
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting All Entries Api",
            error
        });
    }
};

module.exports = {
    updateEntryController, deleteEntryController, GetAllEntryController
};