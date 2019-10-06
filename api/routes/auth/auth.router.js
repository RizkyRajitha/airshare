const express = require("express");
const router = express.Router();
const authroutes = require("./auth.routes");

router.post("/requestotp", authroutes.requestotp);
router.post("/verifyotp", authroutes.verifyotp);
router.post("/login", authroutes.login);
router.post("/forgotpassword", authroutes.forgotPassword);
router.post("/resetpassword", authroutes.resetpassword);

module.exports = router;
