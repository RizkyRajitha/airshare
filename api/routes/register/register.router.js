const express = require("express");
const router = express.Router();
const registerroutes = require("./register.routes");

router.post("/signup", registerroutes.signup);
router.post("/chechusername", registerroutes.chechusername);

module.exports = router;
