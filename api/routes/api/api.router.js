const express = require("express");
const router = express.Router();

const apiroutes = require("./api.routes");

router.get("/getfolderinfo", apiroutes.getfolderinfo);
router.get("/userdata", apiroutes.getuserdata);
router.post("/gettemplink", apiroutes.gettemplink);
router.post("/allowaccess", apiroutes.allowaccess);
router.post("/deletefile", apiroutes.deletefile);
router.post("/sharefile", apiroutes.sharefile);
router.post("/addtorrent", apiroutes.addtorrent);
module.exports = router;
