// const express = require("express");
// const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
// const { createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController, productFilterController, productCountController, productListController, searchcontroller } = require("../controllers/productController");
// const router = express.Router();
// const formidableMiddleware = require('express-formidable');
// //Routes
// //create product
// router.post("/create-product", requireSignIn, isAdmin, formidableMiddleware(), createProductController);
// //get all  products
// router.get("/get-product", getProductController);
// //get single product
// router.get("/get-product/:slug", getSingleProductController);
// //get photo
// router.get("/product-photo/:pid", productPhotoController);
// //delete product
// router.delete("/delete-product/:pid", requireSignIn, isAdmin, deleteProductController);
// //update product
// router.put("/update-product/:pid", requireSignIn, isAdmin, formidableMiddleware(), updateProductController);
// //filter product
// router.post("/product-filters", productFilterController);
// //product count
// router.get("/product-count", productCountController);
// //product per page
// router.get("/product-list/:page", productListController);
// //search product
// router.get("/search/:keyword", searchcontroller);
// module.exports = router;