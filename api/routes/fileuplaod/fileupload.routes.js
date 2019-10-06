var fetch = require("isomorphic-fetch");
var Dropbox = require("dropbox").Dropbox;
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const User = require("../../models/users");

const accessToken =
  require('../../config/env').dropboxaccesstoken;

var dbx = new Dropbox({ accessToken: accessToken, fetch: fetch });

// const storageCv = multer.diskStorage({
//   destination: path.join(__dirname ,'../../','assets'),
//   filename: function(req, file, cb) {
//     console.log(req.params.id);

//     cb(null, req.params.id + path.extname(file.originalname));
//   }
// });

exports.fileuploaddemo = (req, res) => {
  console.log("upload file");
  console.log(req.body);
  console.log(req.file);

  User.getUserByToken(req.headers.authorization)
    .then(doc => {
      console.log(doc);

      console.log(req.body);
      var path = "/" + doc.userName + req.body.path + req.file.originalname;

      console.log(path);

      dbx
        .filesUpload({
          path: path,
          contents: req.file.buffer
        })
        .then(result => {
          console.log(result);
          res.status(200).json({ msg: "success" });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ msg: "error" });
        });
    })
    .catch(err => console.log(err));
};

exports.fileupload = (req, res) => {
  User.getUserByToken(req.headers.authorization)
    .then(doc => {
      const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;

      console.log("file upload");

      console.log(req.file);

      var path = "/" + doc.userName + req.body.path + req.file.originalname;

      var file = req.file;

      console.log(file.size);

      if (file.size < UPLOAD_FILE_SIZE_LIMIT) {
        // File is smaller than 150 Mb - use filesUpload API
        dbx
          .filesUpload({ path: path, contents: file.buffer })
          .then(function(response) {
            // var results = document.getElementById("results");
            // results.appendChild(document.createTextNode("File uploaded!"));
            console.log(response);
            console.log(req.id);

            User.updateOne(
              { _id: req.id },
              {
                $push: {
                  resources: {
                    id: response.id,
                    contenthash: response.content_hash,
                    name: response.name, //file name
                    path: response.path_lower, // file path
                    type: "file", //file or a folder
                    created: response.client_modified, //timestamp
                    size: response.size //file size N/A folder
                  }
                }
              }
            )
              .then(doc => {
                console.log(doc);
                res.status(200).json({ msg: "success" });
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(function(error) {
            console.error(error);
          });
      } else if (false) {
        // File is bigger than 150 Mb - use filesUploadSession* API
        const maxBlob = 8 * 1000 * 1000; // 8Mb - Dropbox JavaScript API suggested max file / chunk size
        var workItems = [];

        var offset = 0;
        while (offset < file.size) {
          var chunkSize = Math.min(maxBlob, file.size - offset);
          workItems.push(file.buffer.slice(offset, offset + chunkSize));
          offset += chunkSize;
        }

        // console.log(workItems);

        const task = workItems.reduce((acc, blob, idx, items) => {
          // console.log(blob);
          console.log("blob size" + blob.length);
          if (idx == 0) {
            // Starting multipart upload of file
            return acc.then(function() {
              return dbx
                .filesUploadSessionStart({ close: false, contents: blob })
                .then(response => {
                  console.log(response);
                  return response.session_id;
                })
                .catch(err => console.log(err));
            });
          } else if (idx < items.length - 1) {
            // Append part to the upload session
            return acc.then(function(sessionId) {
              var cursor = { session_id: sessionId, offset: idx * maxBlob };
              return dbx
                .filesUploadSessionAppendV2({
                  cursor: cursor,
                  close: false,
                  contents: blob
                })
                .then(ada => {
                  console.log(ada);
                  return sessionId;
                })
                .catch(err => console.log(err));
            });
          } else {
            // Last chunk of data, close session
            return acc
              .then(function(sessionId) {
                var cursor = {
                  session_id: sessionId,
                  offset: file.size - blob.length
                };
                var commit = {
                  path: path,
                  mode: "add",
                  autorename: true,
                  mute: false
                };
                return dbx.filesUploadSessionFinish({
                  cursor: cursor,
                  commit: commit,
                  contents: blob
                });
              })
              .catch(err => console.log(err));
          }
        }, Promise.resolve());

        task
          .then(function(result) {
            console.log("finifsh");
            console.log(result);

            //this will not work
            User.updateOne(
              { _id: req.id },
              {
                $push: {
                  resources: {
                    id: response.id,
                    contenthash: response.content_hash,
                    name: response.name, //file name
                    path: response.path_lower, // file path
                    type: "file", //file or a folder
                    created: response.client_modified, //timestamp
                    size: response.size //file size N/A folder
                  }
                }
              }
            )
              .then(doc => {
                console.log(doc);
                res.status(200).json({ msg: "success" });
              })
              .catch(err => {
                console.log(err);
              });

            res.status(200).json({ msg: "success" });
          })
          .catch(function(error) {
            console.error(error);
            res.status(200).json({ msg: "error" });
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(200).json({ msg: "success" });
    });
};
