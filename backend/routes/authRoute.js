const express = require("express");
const { registerController, loginController, testController, forgotPasswordController } = require("../controllers/authController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

//Register Route
router.post("/register", registerController);
//login route
router.post("/login", loginController);
//Forgot password 
router.post("/forgot-password", forgotPasswordController);
//test route 
router.get("/test", requireSignIn, isAdmin, testController);
//protected route 
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({
        ok: true
    });
});
//admin route 
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({
        ok: true
    });
});

module.exports = router;