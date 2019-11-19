var fetch = require("isomorphic-fetch");
var Dropbox = require("dropbox").Dropbox;
const User = require("../../models/users");
const jwt = require("jsonwebtoken");
const axios = require("axios");
var AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-2" });
const accessToken =
  "IxYL8zP9-SAAAAAAAAAAEgZN_Q3-gURLt0semlNZ9kCdND5I5t519NMT2QlOLWvx";
const awskey = require("../../config/env").awskey;
const awsseacret = require("../../config/env").awsseacret;
var dbx = new Dropbox({ accessToken: accessToken, fetch: fetch });
let s3bucket = new AWS.S3({
  accessKeyId: awskey,
  secretAccessKey: awsseacret
  // Bucket: BUCKET_NAME
});
exports.getfolderinfo = (req, res) => {
  console.log("info");

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
          console.log();
          console.log(result[1].resources);

          result[0].Contents.forEach(element1 => {
            result[1].resources.forEach(element2 => {
              if (element2.allowaccess) {
                if (element1.Key === element2.name) {
                  element1.allowaccess = element2.allowaccess;
                  payload.push(element1);
                }
              }
            });
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

exports.fileuploaddemo = (req, res) => {
  console.log(req.files);
  var files = req.files;
  console.log("s3");

  let s3bucket = new AWS.S3({
    accessKeyId: awskey,
    secretAccessKey: awsseacret
    // Bucket: BUCKET_NAME
  });
  var promisarr = [];
  function multiplefiles3(resobj) {
    console.log(resobj.originalname);
    var params = {
      Bucket: "natalie1234",
      Key: resobj.originalname,
      Body: resobj.buffer
    };
    return s3bucket.upload(params).promise();
  }
  files.map(file => {
    promisarr.push(multiplefiles3(file));
  });

  Promise.all(promisarr)
    .then(result => {
      console.log(result);
      //TODO
      // User.findOne({ _id: req.id })
      //   .then(docusr => {
      //     docusr.resources.forEach(element1 => {
      //       for (let element2 of result) {
      //         if (
      //           element1.name === element2.Key &&
      //           element1.contenthash === element2.ETag
      //         ) {
      //           console.log("22222222222222 duplicate file");
      //         } else if (element1.name === element2.Key) {
      //           console.log("444444444444444444 re wtite  file");
      //         } else if (element1.contenthash === element2.ETag) {
      //           console.log("444444444444444444 re wtite  file");
      //         }
      //       }
      //     });
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   })
      result.forEach(element => {
        User.updateOne(
          { _id: req.id },
          {
            $push: {
              resources: {
                name: element.key, //file name
                path: element.key, // file path
                contenthash: element.ETag,
                type: "file", //file or a folder
                created: new Date().toISOString(), //timestamp
                allowaccess: true
              }
            }
          }
        )
          .then(doc => {
            console.log(doc);
          })
          .catch(err => {
            console.log(err);
          });
      });

      res.status(200).json({ msg: "success" });
    })
    .catch(err => {
      console.log(err);
    });
};

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
//                   allowaccess: true,
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
