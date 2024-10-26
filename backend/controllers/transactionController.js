
const TransactionModel = require("../models/TransactionModel");
const EntryModel = require("../models/EntryModel");

// Create transaction controller
const createTransactionController = async (req, res) => {
    try {
        const { date, account, name, rows } = req.body;

        const formattedDate = new Date(date).toISOString().split('T')[0];
        // Create a new transaction
        const transaction = await TransactionModel.create({
            date: formattedDate,
            accountID: account,
            name
        });

        // Create entries for the transaction
        const entries = await Promise.all(rows.map(async (row) => {
            const { category, amount, comments } = row;
            const entry = await EntryModel.create({
                categoryID: category,
                amount,
                comments,
                transactionID: transaction._id,
            });
            return entry;
        }));

        return res.status(201).send({
            success: true,
            message: "Transaction and entries created successfully",
            transaction,
            entries,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in creating transaction and entries",
            error,
        });
    }
};


// Update transaction controller
const updateTransactionController = async (req, res) => {
    try {
        const { date, account, name, rows } = req.body;
        const transactionId = req.params.id;

        const formattedDate = new Date(date).toISOString().split('T')[0];

        // Update the transaction
        const updatedTransaction = await TransactionModel.findByIdAndUpdate(transactionId, {
            date: formattedDate,
            accountID: account,
            name
        }, { new: true }); // Set { new: true } to return the updated document

        // Delete existing entries for the transaction
        await EntryModel.deleteMany({ transactionID: transactionId });

        // Create new entries for the transaction
        const entries = await Promise.all(rows.map(async (row) => {
            const { category, amount, comments } = row;
            const entry = await EntryModel.create({
                categoryID: category,
                amount,
                comments,
                transactionID: transactionId,
            });
            return entry;
        }));

        return res.status(200).send({
            success: true,
            message: "Transaction and entries updated successfully",
            transaction: updatedTransaction,
            entries,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in updating transaction and entries",
            error,
        });
    }
};


// Mark transaction as reconciled
const markTransactionReconciledController = async (req, res) => {
    try {
        const { transactionId, reconciliationId } = req.body;

        const transaction = await TransactionModel.findById(transactionId);

        if (!transaction) {
            return res.status(404).send({
                success: false,
                message: "Transaction Entry not found",
            });
        }

        // Check if the transaction is already marked as reconciled
        if (transaction.reconciliationID) {
            return res.status(400).send({
                success: false,
                message: "Transaction Entry is already reconciled",
            });
        }

        // Check if the provided reconciliationId is valid
        const reconciliation = await ReconciliationModel.findById(reconciliationId);

        if (!reconciliation) {
            return res.status(404).send({
                success: false,
                message: "Reconciliation not found",
            });
        }

        // Update the transaction with reconciliation information
        transaction.reconciliationID = reconciliationId;

        // Save the updated transaction
        const updatedTransaction = await transaction.save();

        return res.status(200).send({
            success: true,
            message: "Transaction Entry marked as reconciled successfully",
            transaction: updatedTransaction,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in marking Transaction Entry as reconciled",
            error,
        });
    }
};
// Get all transaction entries controller
const getAllTransactionsController = async (req, res) => {
    try {
        // Fetch all transactions
        const transactions = await TransactionModel.find();

        // Fetch entries for each transaction
        const transactionsWithEntries = await Promise.all(transactions.map(async (transaction) => {
            const entries = await EntryModel.find({ transactionID: transaction._id });
            return { transaction, entries };
        }));

        return res.status(200).send({
            success: true,
            message: "All transactions with entries fetched successfully",
            transactions: transactionsWithEntries,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching transactions with entries",
            error,
        });
    }
};


// Delete transaction entry controller
const deleteTransactionController = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await TransactionModel.findByIdAndDelete(id);
        await EntryModel.deleteMany({ transactionID: id });
        res.status(200).send({
            success: true,
            message: "Transaction Entry Deleted Successfully",
            transaction,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in Delete Transaction Entry",
            error,
        });
    }
};

// Get single transaction entry controller
const singleTransactionController = async (req, res) => {
    // Fetch a single transaction with its corresponding entries

    try {
        const { id } = req.params;

        // Fetch transaction with the given transactionId
        const transaction = await TransactionModel.findById(id);
        if (!transaction) {
            return res.status(404).send({
                success: false,
                message: "Transaction not found",
            });
        }

        // Fetch entries associated with the transactionId
        const entries = await EntryModel.find({ transactionID: id });

        return res.status(200).send({
            success: true,
            message: "Transaction with entries fetched successfully",
            transaction,
            entries,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching transaction with entries",
            error,
        });
    }
};

module.exports = {
    createTransactionController, singleTransactionController, updateTransactionController, getAllTransactionsController, deleteTransactionController
};
