var fetch = require("isomorphic-fetch");
var Dropbox = require("dropbox").Dropbox;
const User = require("../../models/users");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const ipdataapikey = require("../../config/env").ipdatakey;
const apiurl = require("../../config/env").api;

const accessToken = require("../../config/env").dropboxaccesstoken;

var dbx = new Dropbox({ accessToken: accessToken, fetch: fetch });

exports.getfolderinfo = (req, res) => {
  console.log("current path - ", req.body.currentpath);

  User.getUserByToken(req.headers.authorization)
    .then(doc => {
      // console.log(doc);

      // res.status(200).json(payload);
      var payload = [];
      dbx
        .filesListFolder({ path: "/" + doc.userName + req.body.currentpath })
        .then(function(response) {
          // console.log(response);

          doc.resources.forEach(element => {
            console.log(element.name);
            // console.log(.path_lower)
            response.entries.forEach(element2 => {
              if (element.path === element2.path_lower) {
                console.log("hha");
                console.log(element2[".tag"]);
                // type: res.type,
                // modified: res.created,
                // id: res.id,
                // name: res.name,
                // path: res.path_display,
                // size: (res.size

                var temppayload = {
                  type: element2[".tag"],
                  created: element2.client_modified,
                  id: element2.id,
                  name: element2.name,
                  path: element2.path_lower,
                  size: element2.size,
                  isallowedaccesss: element.allowaccess
                };

                payload.push(temppayload);
              }
            });
          });

          console.log(payload);

          res.status(200).json({ entries: payload });
        })
        .catch(function(error) {
          console.log(error);
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

exports.deletefile = (req, res) => {
  dbx
    .filesDelete({ path: req.body.path })
    .then(result => {
      res.status(200).json({ msg: "success" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: "error" });
    });

  // User.getUserByToken(req.headers.authorization)
  //   .then(doc => {

  //   }).catch(err=>{

  //   })
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

exports.allowaccess = (req, res) => {
  console.log(req.body);

  // console.log("hilfhlaihf;i");
  var pathlower = String(req.body.path).toLowerCase();

  console.log("assas = " + pathlower);

  if (req.body.setallow === true) {
    User.findOneAndUpdate(
      {
        _id: req.id,
        "resources.path": pathlower
      },
      {
        $set: {
          "resources.$.allowaccess": true
        }
      }
    )
      .then(userdoc2 => {
        console.log(userdoc2);

        console.log("doc");

        res.status(200).json({ msg: "sucsess", allow: true });
      })
      .catch(err => {
        console.log(err);
      });
  } else if (req.body.setallow === false) {
    console.log("revoking access");

    User.findOneAndUpdate(
      {
        _id: req.id,
        "resources.path": pathlower
      },
      {
        $set: {
          "resources.$.allowaccess": false
        }
      }
    )
      .then(userdoc2 => {
        console.log(userdoc2);

        console.log("doc");

        res.status(200).json({ msg: "sucsess", allow: false });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // User.updateOne(
  //   { _id: req.id },
  //   { $push: { allowaccess: { path: req.body.path, type: req.body.type } } }
  // )
  //   .then(doc => {
  //     console.log(doc);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};

// exports.allowaccess = (req, res) => {
//   console.log(req.body);

//   console.log(req.id);

//   User.updateOne(
//     { _id: req.id },
//     { $push: { allowaccess: { path: req.body.path, type: req.body.type } } }
//   )
//     .then(doc => {
//       console.log(doc);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

exports.getuserlocdata = (req, res) => {
  // var userip =

  axios
    .get(`https://api.ipdata.co/${userip}?api-key=${ipdataapikey}`)
    .then(result => {
      var userlocdata = {
        ip: result.ip,
        country_name: result.country_name,
        flag: result.flag
      };
    })
    .catch(err => {});
};

exports.downloadzip = (req, res) => {
  dbx
    .filesDownloadZip({ path: "/rizky/testfolder" })
    .then(result => {
      console.log(result);
      res.download(result.fileBinary, err => {
        console.log(err);
      });
    })
    .catch(err => {
      console.log(err);
    });
};

function syncwithdbx(path) {
  dbx
    .filesListFolder({ path: path })
    .then(function(response) {
      console.log(response);

      res.status(200).json(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}
