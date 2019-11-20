const express = require("express");
const router = express.Router();
const tempaccessroutes = require("./tempaccess.routes");

const multer = require("multer");

var storage = multer.memoryStorage();

const fileup = multer({ storage: storage });

// router.post("/createfolder", tempaccessroutes.createfolder);
router.get("/userdata", tempaccessroutes.getuserdata);
router.get("/getfolderinfo", tempaccessroutes.getfolderinfo);
router.post("/gettemplink", tempaccessroutes.gettemplink);
router.post(
  "/fileupload",
  fileup.array("resobj"),
  tempaccessroutes.fileuploads3
);

module.exports = router;
