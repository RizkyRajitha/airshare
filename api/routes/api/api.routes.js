// import { WebTorrent } from "webtorrent";

const User = require("../../models/users");
const path = require("path");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const ipdatakey = process.env.ipdatakey ||  require("../../config/env").ipdatakey;
const apiurl =  process.env.apiurl || require("../../config/env").api;
const WebTorrent = require("webtorrent");



var AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-2" });

const awskey = require("../../config/env").awskey;
const awsseacret = require("../../config/env").awsseacret;


let s3bucket = new AWS.S3({
  accessKeyId: awskey,
  secretAccessKey: awsseacret
});

exports.getuserdata = (req, res) => {
  User.findOne({ _id: req.id })
    .then(doc => {
      var payload = {
        name: doc.firstName + " " + doc.lastName,
        storage: doc.storageSpace
      };
      res.status(200).json(payload);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getfolderinfo = (req, res) => {
  User.findOne({ _id: req.id })
    .then(doc => {
      var params = {
        Bucket: "natalie1234"
      };
      var promisarr = [];
      promisarr.push(s3bucket.listObjectsV2(params).promise());
      promisarr.push(User.findOne({ _id: req.id }));

      var payload = [];

      Promise.all(promisarr)
        .then(result => {
          console.log(result[0].Contents);
          console.log(result[1].resources);

          result[0].Contents.forEach(element1 => {
            for (let element2 of result[1].resources) {
              if (
                element1.Key === element2.name &&
                element1.ETag === element2.contenthash
              ) {
                element1.allowaccess = element2.allowaccess;
                element1.path = element2.path;
                element1.contentid = element2._id;
                payload.push(element1);
                break;
              }
            }
          });

          console.log(payload);

          res.status(200).json(payload);
        })
        .catch(err => {
          console.log(err);
        });
      // .then(result => {
      //   console.log(result.Contents);
      //   res.json(result);
      // })
      // .catch(err => {
      //  console.log(err);
      // });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.gettemplink = (req, res) => {
  console.log("get temp link");

  // console.log(doc);
  console.log(req.body);

  var params = {
    Bucket: "natalie1234",
    Key: req.body.path,
    Expires: 3600
  };

  s3bucket
    .getSignedUrlPromise("getObject", params)
    .then(result => {
      // console.log(result);
      res.status(200).json({ msg: "linkgenerated", resurl: result });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.deletefile = (req, res) => {
  var params = {
    Bucket: "natalie1234",
    Key: req.body.key
  };

  params = { Bucket: "natalie1234", Key: req.body.key };

  s3bucket
    .getObject(params)
    .promise()
    .then(result => {
      console.log(result.ContentLength);

      User.findOne({ _id: req.id })
        .then(doc => {
          var newstoragespace =
            parseInt(doc.storageSpace) - parseInt(result.ContentLength);
          doc.storageSpace = newstoragespace;
          doc
            .save()
            .then(doc2 => {
              console.log;
              var promisearr = [
                User.findOneAndUpdate(
                  { _id: req.id },
                  { $pull: { resources: { _id: req.body.contentid } } }
                ),
                s3bucket.deleteObject(params).promise()
              ];

              Promise.all(promisearr)
                .then(result => {
                  console.log(result);
                  res.status(200).json({ msg: "sucsess" });
                })
                .catch(err => {
                  console.log(err);
                });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });

  // .then(result => {
  //   console.log(result);

  //     .then(result => {
  //       console.log(result);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // })
  // .catch(err => {
  //   console.log(err);
  // });
};

exports.allowaccess = (req, res) => {
  console.log(req.body);

  var pathlower = String(req.body.path);

  console.log("assas = " + pathlower);

  if (req.body.setallow === true) {
    User.findOneAndUpdate(
      {
        _id: req.id,
        "resources._id": req.body.path
      },
      {
        $set: {
          "resources.$.allowaccess": true
        }
      }
    )
      .then(userdoc2 => {
        console.log(userdoc2);

        // console.log("doc");

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
        "resources._id": req.body.path
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

exports.addtorrent = (req, res) => {
  var client = new WebTorrent();

  params = { Bucket: "natalie1234", Key: req.body.key };

  s3bucket
    .getObject(params)
    .promise()
    .then(result => {
      console.log(result);
      var torrentId = result.Body;

      var downpath = path.join(__dirname, "torrent");

      // client.add(torrentId, { path: downpath }, function(torrent) {
      //   var file = torrent.files;
      //   console.log(file[0].name);
      //   console.log(torrent.length / 1024 / 1024);
      //   res.send(torrent.files[0].name);
      //   torrent.on("error", err => {
      //     console.log(err);
      //   });

      //   torrent.on("done", function() {
      //     console.log("torrent finished downloading");
      //     torrent.files.forEach(function(file) {
      //       // console.log(file);
      //       file.getBuffer(function(err, buffer) {
      //         if (err) throw err;

      //         console.log("uploading to s3 .......");

      //         paramstorrentupload = {
      //           Bucket: "natalie1234",
      //           Key: file.name,
      //           Body: buffer
      //         };

      //         s3bucket
      //           .upload(paramstorrentupload)
      //           .promise()
      //           .then(result => {
      //             console.log(result);
      //             User.updateOne(
      //               { _id: req.id },
      //               {
      //                 $push: {
      //                   resources: {
      //                     name: result.Key, //file name
      //                     path: result.Key, // file path
      //                     contenthash: result.ETag,
      //                     type: "file", //file or a folder
      //                     created: new Date().toISOString() //timestamp
      //                   }
      //                 }
      //               }
      //             )
      //               .then(doc => {
      //                 console.log(doc);
      //               })
      //               .catch(err => {
      //                 console.log(err);
      //               });
      //           })
      //           .catch(err => {
      //             console.log(err);
      //           });

      //         console.log(buffer); // <Buffer 00 98 00 01 ...>
      //       });
      //       // do something with file
      //     });
      //   });

      //   torrent.on("download", function(bytes) {
      //     console.log("just downloaded: " + bytes);
      //     console.log("total downloaded: " + torrent.downloaded);
      //     console.log("download speed: " + torrent.downloadSpeed);
      //     console.log("progress: " + torrent.progress);
      //   });

      //   // Torrents can contain many files. Let's use the .mp4 file

      //   // var file = torrent.files.find(function(file) {});
      // });
    })
    .catch(err => {
      console.log(err);
    });
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

// exports.createfolder = (req, res) => {
//   User.findOne({ _id: req.id })
//     .then(doc => {
//       console.log(doc);
//       var path = `/${doc.userName}${req.body.foldername}`;

//       console.log(path);

//       dbx
//         .filesCreateFolder({ path: path })
//         .then(result => {
//           console.log(result);

//           User.updateOne(
//             { _id: req.id },
//             {
//               $push: {
//                 resources: {
//                   id: result.id,

//                   name: result.name, //file name
//                   path: result.path_lower, // file path
//                   type: "file", //file or a folder
//                   created: new Date().toISOString() //timestamp
//                 }
//               }
//             }
//           )
//             .then(doc => {
//               console.log(doc);
//               res.status(200).json({ msg: "success" });
//             })
//             .catch(err => {
//               console.log(err);
//             });

//           res.status(200).json({ msg: "success" });
//         })
//         .catch(err => {
//           console.log(err);
//           res.status(200).json({ msg: "error" });
//         });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(200).json({ msg: "error" });
//     });
// };

// exports.getuserlocdata = (req, res) => {
//   // var userip =

//   axios
//     .get(`https://api.ipdata.co/${userip}?api-key=${ipdataapikey}`)
//     .then(result => {
//       var userlocdata = {
//         ip: result.ip,
//         country_name: result.country_name,
//         flag: result.flag
//       };
//     })
//     .catch(err => {});
// };

// exports.downloadzip = (req, res) => {
//   dbx
//     .filesDownloadZip({ path: "/rizky/testfolder" })
//     .then(result => {
//       console.log(result);
//       res.download(result.fileBinary, err => {
//         console.log(err);
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// exports.getfolderinfo = (req, res) => {
//   console.log("current path - ", req.body.currentpath);

//   User.getUserByToken(req.headers.authorization)
//     .then(doc => {
//       // console.log(doc);

//       // res.status(200).json(payload);
//       var payload = [];
//       dbx
//         .filesListFolder({ path: "/" + doc.userName + req.body.currentpath })
//         .then(function(response) {
//           // console.log(response);

//           doc.resources.forEach(element => {
//             console.log(element.name);
//             // console.log(.path_lower)
//             response.entries.forEach(element2 => {
//               if (element.path === element2.path_lower) {
//                 console.log("hha");
//                 console.log(element2[".tag"]);
//                 // type: res.type,
//                 // modified: res.created,
//                 // id: res.id,
//                 // name: res.name,
//                 // path: res.path_display,
//                 // size: (res.size

//                 var temppayload = {
//                   type: element2[".tag"],
//                   created: element2.client_modified,
//                   id: element2.id,
//                   name: element2.name,
//                   path: element2.path_lower,
//                   size: element2.size,
//                   isallowedaccesss: element.allowaccess
//                 };

//                 payload.push(temppayload);
//               }
//             });
//           });

//           console.log(payload);

//           res.status(200).json({ entries: payload });
//         })
//         .catch(function(error) {
//           console.log(error);
//         });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(401).send(err);
//     });
// };
