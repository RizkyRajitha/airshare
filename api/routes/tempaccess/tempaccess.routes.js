var fetch = require("isomorphic-fetch");
var Dropbox = require("dropbox").Dropbox;
const User = require("../../models/users");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const accessToken =
  "IxYL8zP9-SAAAAAAAAAAEgZN_Q3-gURLt0semlNZ9kCdND5I5t519NMT2QlOLWvx";

var dbx = new Dropbox({ accessToken: accessToken, fetch: fetch });

exports.getfolderinfo = (req, res) => {
  console.log("info");

  User.getUserByToken(req.headers.authorization)
    .then(doc => {
      console.log(doc);

      var promissarr = [];
      doc.resources.forEach(element => {
        // i++;
        if (element.allowaccess) {
          promissarr.push(dbx.filesGetMetadata({ path: element.path }));
        }
      });

      Promise.all(promissarr)
        .then(result => {
          // reso;

          console.log(result);
          res.status(200).json({ entries: result });
          // var temppayload = {
          //   type: result[".tag"],
          //   created: result.client_modified,
          //   id: result.id,
          //   name: result.name,
          //   path: result.path_lower,
          //   size: result.size,
          //   isallowedaccesss: element.allowaccess
          // };
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
      res.status(401).send(err);
    });
};

exports.gettemplink = (req, res) => {
  console.log("get temp link");

  User.getUserByToken(req.headers.authorization)
    .then(doc => {
      console.log(doc);
      console.log(req.body);

      dbx
        .filesGetTemporaryLink({ path: req.body.path })
        .then(function(response) {
          console.log(response.link);

          res.status(200).json({ msg: "linkgenerated", resurl: response.link });
        })
        .catch(function(error) {
          console.log(error);
        });
    })
    .catch(err => {
      console.log(err);
      res.status(401).send(err);
    });

  //   {
  //     "path": "/video.mp4"
  // }
};

exports.createfolder = (req, res) => {
  User.findOne({ _id: req.id })
    .then(doc => {
      console.log(doc);
      var path = `/${doc.userName}${req.body.foldername}`;

      console.log(path);

      dbx
        .filesCreateFolder({ path: path })
        .then(result => {
          console.log(result);

          User.updateOne(
            { _id: req.id },
            {
              $push: {
                resources: {
                  id: result.id,
                  allowaccess: true,
                  name: result.name, //file name
                  path: result.path_lower, // file path
                  type: "file", //file or a folder
                  created: new Date().toISOString() //timestamp
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
        .catch(err => {
          console.log(err);
          res.status(200).json({ msg: "error" });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(200).json({ msg: "error" });
    });
};

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
        .then(response => {
          console.log(response);

          User.updateOne(
            { _id: doc._id },
            {
              $push: {
                resources: {
                  id: response.id,
                  allowaccess: true,
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
              res.status(500).json({ msg: "error" });
            });

          // res.status(200).json({ msg: "success" });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ msg: "error" });
        });
    })
    .catch(err => console.log(err));
};
