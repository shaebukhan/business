const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const { createTransactionController, singleTransactionController, getAllTransactionsController, updateTransactionController, deleteTransactionController } = require("../controllers/transactionController");
const router = express.Router();
//routes
//create 
// router.post('/create-category', requireSignIn, isAdmin,  createAccountController);
router.post('/new', createTransactionController);
//update account
// router.put("/:id", requireSignIn, isAdmin, updateAccountController);
router.put("/:id", updateTransactionController);
//All  Transactions
router.get("/transactions", getAllTransactionsController);
//get single  account
router.get("/:id", singleTransactionController);

//delete  transaction
// router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteAccountController);
router.delete("/:id", deleteTransactionController);

module.exports = router;