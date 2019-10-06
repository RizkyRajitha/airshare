const express = require("express");

const router = express.Router();

const multer = require("multer");

var storage = multer.memoryStorage();

const fileup = multer({ storage: storage });

const fileuploadroutes = require("./fileupload.routes");

router.post(
  "/uploadfile",
  fileup.single("resobj"),
  fileuploadroutes.fileupload
);

// router.post(
//   "/uploadfilesession",
//   fileup.single("resobj"),
//   fileuploadroutes.fileuploadsession
// );

module.exports = router;
