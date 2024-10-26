const AccountModel = require("../models/AccountModel");
const TransactionModel = require("../models/TransactionModel");
const EntryModel = require("../models/EntryModel");
const CategoryModel = require("../models/CategoryModel");

//create category
const createAccountController = async (req, res) => {
    try {
        const { name, hidden } = req.body;
        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Name is Required"
            });
        }

        // Check if the category with the given name already exists
        const existingAccount = await AccountModel.findOne({ name });

        if (existingAccount) {
            return res.status(200).send({
                success: true,
                message: "Account Already Exists !!"
            });
        }

        // Create a new  account with the provided name and hidden status
        const account = await new AccountModel({ name, hidden }).save();

        if (account) {
            return res.status(201).send({
                success: true,
                message: "New Account Created Successfully !!",
                account
            });
        } else {
            return res.status(500).send({
                success: false,
                message: "Error in creating Account"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in creating Account",
            error
        });
    }

};

const createMultipleAccountsController = async (req, res) => {
    try {
        const accountDataArray = req.body;
        console.log(accountDataArray);
        if (!accountDataArray || !Array.isArray(accountDataArray)) {
            return res.status(400).send({
                success: false,
                message: "Invalid account data format"
            });
        }

        const createdAccounts = [];
        const createdTransactions = [];
        const createdEntries = [];
        const createdCategories = [];

        for (let accountData of accountDataArray) {
            const categoryNames = accountData.C ? accountData.C.split(',') : [];
            const categoryIds = [];

            // Save each category to the database or get existing category IDs
            for (let categoryName of categoryNames) {
                let category = await CategoryModel.findOne({ name: categoryName });
                if (!category) {
                    category = await CategoryModel.create({ name: categoryName, hidden: accountData.D });
                }
                categoryIds.push(category._id);
                createdCategories.push(category);
            }

            let account = await AccountModel.findOne({ name: accountData.A });
            if (!account) {
                account = await AccountModel.create({ name: accountData.A, hidden: accountData.B });
            }

            createdAccounts.push(account);

            const date = new Date((accountData.E - 1) * 24 * 60 * 60 * 1000 + (new Date('1899-12-30')).getTime());
            const formattedDate = `${date.getMonth() + 1},${date.getDate()},${date.getFullYear()}`;

            const transaction = await TransactionModel.create({
                date: formattedDate,
                accountID: account._id,
                name: accountData.F
            });

            createdTransactions.push(transaction);

            let amounts = [];
            if (typeof accountData.G === 'string' && accountData.G.includes('d')) {
                amounts = accountData.G.split('d');
            } else {
                amounts.push(accountData.G);
            }

            const comments = accountData.H.split(',');

            // Ensure there are entries for each category
            const numEntries = Math.max(categoryIds.length, amounts.length, comments.length);

            for (let i = 0; i < numEntries; i++) {
                const entry = await EntryModel.create({
                    categoryID: categoryIds[i % categoryIds.length], // Handle the case where there are fewer categories than amounts/comments
                    amount: amounts[i % amounts.length],
                    comments: comments[i % comments.length],
                    transactionID: transaction._id,
                });
                createdEntries.push(entry);
            }
        }

        return res.status(200).send({
            success: true,
            message: "Accounts, transactions, entries, and categories created successfully",
            accounts: createdAccounts,
            transactions: createdTransactions,
            entries: createdEntries,
            categories: createdCategories
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in creating accounts, transactions, entries, and categories",
            error: error.message
        });
    }
};


//update category 
const updateAccountController = async (req, res) => {
    try {
        const accountId = req.params.id;
        const { name, hidden } = req.body;

        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Name is Required"
            });
        }

        const existingAccount = await AccountModel.findById(accountId);

        if (!existingAccount) {
            return res.status(404).send({
                success: false,
                message: "Account not found"
            });
        }

        const isNameTaken = await AccountModel.findOne({ name, _id: { $ne: accountId } });

        if (isNameTaken) {
            return res.status(200).send({
                success: true,
                message: "Account name already exists"
            });
        }

        // Update the category with the new data
        existingAccount.name = name;
        existingAccount.hidden = hidden;

        // Save the updated category
        const updatedAccount = await existingAccount.save();

        return res.status(200).send({
            success: true,
            message: "Account updated successfully",
            category: updatedAccount
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in updating category",
            error
        });
    }
};

//get all categories 
const GetAllAccountsController = async (req, res) => {
    try {
        const accounts = await AccountModel.find({});
        res.status(200).send({
            success: true,
            message: "All  Accounts listed SuccessFully !!",
            accounts
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting All Accounts Api",
            error
        });
    }
};

const GetAllSAccountsController = async (req, res) => {
    try {
        const accounts = await AccountModel.find({ hidden: false });
        res.status(200).send({
            success: true,
            message: "All  Accounts listed SuccessFully !!",
            accounts
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting All Accounts Api",
            error
        });
    }
};
//delete  account controller 
const deleteAccountController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const used = await TransactionModel.findOne({ accountID: id });
        if (used) {
            return res.status(200).send({
                success: false,
                message: "Account is Used for Transaction Can not be Deleted !!"
            });
        }
        const account = await AccountModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Account Deleted SuccessFully !!",
            account
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Delete Account Api",
            error
        });
    }
};
//single category controller 
const singleAccountController = async (req, res) => {
    const { id } = req.params;
    try {
        const account = await AccountModel.findOne({ id });
        if (!account) {
            return res.status(404).send({
                success: false,
                message: "No account found with this Name",
            });
        }
        res.status(200).send({
            success: true,
            message: "Account found successfully",
            account
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting single account",
            error
        });
    }
};



module.exports = { createAccountController, updateAccountController, GetAllAccountsController, deleteAccountController, singleAccountController, GetAllSAccountsController, createMultipleAccountsController };