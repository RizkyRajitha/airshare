const express = require("express");
const router = express.Router();

const apiroutes = require("./api.routes");

router.post("/getfolderinfo", apiroutes.getfolderinfo);
router.post("/gettemplink", apiroutes.gettemplink);
router.post("/createnewfolder", apiroutes.createfolder);
router.post("/downloadzip", apiroutes.downloadzip);
router.post("/allowaccess", apiroutes.allowaccess);

module.exports = router;
