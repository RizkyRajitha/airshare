var fetch = require("isomorphic-fetch");
var Dropbox = require("dropbox").Dropbox;
const User = require("../../models/users");
const jwt = require("jsonwebtoken");
const axios = require("axios");
var AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-2" });
const accessToken =
  "IxYL8zP9-SAAAAAAAAAAEgZN_Q3-gURLt0semlNZ9kCdND5I5t519NMT2QlOLWvx";
const awskey = process.env.awskey || require("../../config/env").awskey;
const awsseacret = process.env.awskey || require("../../config/env").awsseacret;
var dbx = new Dropbox({ accessToken: accessToken, fetch: fetch });
let s3bucket = new AWS.S3({
  accessKeyId: awskey,
  secretAccessKey: awsseacret
  // Bucket: BUCKET_NAME
});

exports.getuserdata = (req, res) => {
  User.findOne({ _id: req.id })
    .then(doc => {
      var allfiles = [];

      doc.resources.forEach(element => {
        allfiles.push(element.name);
      });

      var payload = {
        name: doc.firstName + " " + doc.lastName,
        storage: doc.storageSpace,
        allfiles: allfiles,
        id: doc._id
      };
      res.status(200).json(payload);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
};

// exports.getfolderinfo = (req, res) => {
//   User.findOne({ _id: req.id })
//     .then(doc => {
//       var params = {
//         Bucket: "natalie1234"
//       };
//       var promisarr = [];
//       promisarr.push(s3bucket.listObjectsV2(params).promise());
//       promisarr.push(User.findOne({ _id: req.id }));

//       var payload = [];

//       Promise.all(promisarr)
//         .then(result => {
//           console.log(result[0].Contents);
//           console.log(result[1].resources);

//           result[0].Contents.forEach(element1 => {
//             for (let element2 of result[1].resources) {
//               if (
//                 element1.Key === element2.name &&
//                 element1.ETag === element2.contenthash
//               ) {
//                 element1.allowaccess = element2.allowaccess;
//                 element1.path = element2.path;
//                 element1.contentid = element2._id;
//                 payload.push(element1);
//                 break;
//               }
//             }
//           });

//           console.log(payload);

//           res.status(200).json(payload);
//         })
//         .catch(err => {
//           console.log(err);
//         });
//       // .then(result => {
//       //   console.log(result.Contents);
//       //   res.json(result);
//       // })
//       // .catch(err => {
//       //  console.log(err);
//       // });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

exports.getfolderinfo = (req, res) => {
  console.log("info");

  User.findOne({ _id: req.id })
    .then(doc => {
      var payload = [];

      doc.resources.forEach(element => {
        if (element.allowaccess) {
          payload.push(element);
        }
      });

      res.status(200).json(payload);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.gettemplink = (req, res) => {
  console.log("get temp link");
  // console.log(doc);
  console.log(req.body);

  User.findOne({ _id: req.id })
    .then(userdoc => {
      var params = {
        Bucket: userdoc.userName,
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
          res.status(500).json({ msg: "error" });
        });
    })
    .catch(err => {
      res.status(500).json({ msg: "error" });
    });
};

exports.fileuploads3 = (req, res) => {
  console.log(req.body);

  var files = req.body.fileset;
  console.log(files);

  User.findOne({ _id: req.id })
    .then(usrdoc => {
      console.log("s3 presignurl");
      let s3bucket = new AWS.S3({
        accessKeyId: awskey,
        secretAccessKey: awsseacret
        // Bucket: BUCKET_NAME
      });
      //     // s3bucket
      //     //   .getSignedUrlPromise("putObject", params)
      //     //   .then(result => {
      //     //     // console.log(result);
      //     //     res.status(200).json({ msg: "linkgenerated", resurl: result });
      //     //   })
      //     //   .catch(err => {
      //     //     console.log(err);
      //     //     res.status(500).json({ msg: "error" });
      //     //   });
      var promisarr = [];
      function multiplefiles3presigedurl(resobj) {
        console.log(resobj.name);
        var params = {
          Bucket: usrdoc.userName,
          Key: resobj.name,
          ContentType: resobj.type,
          Expires: 3600
        };
        return s3bucket.getSignedUrlPromise("putObject", params);
      }
      var uploadsize = 0;
      files.map(file => {
        uploadsize = uploadsize + file.size;
        promisarr.push(multiplefiles3presigedurl(file));
      });
      User.findOne({ _id: req.id })
        .then(doc => {
          console.log(parseInt(doc.storageSpace));
          var remainspace = 100 * 1024 * 1024 - parseInt(doc.storageSpace);
          console.log("remain space ", remainspace);
          console.log("upload size  ", uploadsize);
          if (remainspace > uploadsize) {
            console.log("go........");
            console.log(promisarr);
            var newstorage = parseInt(doc.storageSpace) + parseInt(uploadsize);
            console.log(newstorage);
            Promise.all(promisarr)
              .then(singedurlarray => {
                console.log(singedurlarray);
                var dbpromisarr = [];
                files.forEach(element => {
                  dbpromisarr.push(
                    User.findOneAndUpdate(
                      { _id: req.id },
                      {
                        $push: {
                          resources: {
                            name: element.name, //file name
                            size: element.size, // file path
                            allowaccess: true, // contenthash: element.ETag,
                            type: "file", //file or a folder
                            created: new Date().toISOString() //timestamp
                          }
                        }
                      }
                    )
                  );
                }); //handled poorly
                Promise.all(dbpromisarr)
                  .then(dbdocs => {
                    console.log(dbdocs);
                    User.findOneAndUpdate(
                      { _id: req.id },
                      {
                        $set: {
                          storageSpace: newstorage
                        }
                      }
                    )
                      .then(docup => {
                        console.log(docup);
                        res
                          .status(200)
                          .json({ urlarr: singedurlarray, msg: "success" });
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
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            res.status(200).json({ msg: "lowspace" });
            console.log("limit off");
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ msg: "error" });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: "error" });
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
