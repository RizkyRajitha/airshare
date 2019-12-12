const express = require("express");

const router = express.Router();

const multer = require("multer");

var storage = multer.memoryStorage();

const fileup = multer({ storage: storage });

const fileuploadroutes = require("./fileupload.routes");

// router.post(
//   "/uploadfile",
//   fileup.single("resobj"),
//   fileuploadroutes.fileupload
// );

router.post(
  "/uploadfileawss3",
  fileup.array("resobj"),
  fileuploadroutes.fileuploadawss3
);

router.post(
  "/uploadfileawss3managed",
  fileup.single("resobj"),
  fileuploadroutes.fileuploadmanaged
);

router.post("/presigendurlupload", fileuploadroutes.presigendurlupload);

// router.post(
//   "/uploadfilesession",
//   fileup.single("resobj"),
//   fileuploadroutes.fileuploadsession
// );

module.exports = router;
