const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}

// signup
router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

// login

router.get("/login",userController.renderLoginForm);

router.post("/login", saveRedirectUrl,passport.authenticate("local", {failureRedirect: "/login", failureFlash:true}), userController.login);

router.get("/logout", userController.logout);





module.exports = router;