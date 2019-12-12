const express = require("express");
const axios = require("axios");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

const fs = require("fs");
const path = require("path");
const Sharecode = require("./models/sharecodes");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/users");
const Views = require("./models/views");
const bp = require("body-parser");
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(require("morgan")("dev"));

app.set("view engine", "ejs");

const jwtsecret = require("./config/env").jwtsecret;
// const accountSid = require("./config/env").twilliosid;
// const authToken = require("./config/env").twilliotoken;
// const twillioclient = require("twilio")(accountSid, authToken);

var AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-2" });

const awskey = process.env.awskey || require("./config/env").awskey;
const awsseacret = process.env.awsseacret || require("./config/env").awsseacret;

let s3bucket = new AWS.S3({
  accessKeyId: awskey,
  secretAccessKey: awsseacret
});
// telegram = '982920318:AAFJanZtcladHlMpt7rELD38dbh6wT91meM'    chait = -363135079

const port = process.env.PORT || 5000;

mongoose.Promise = global.Promise;
//"mongodb://127.0.0.1:27017/authdb" ||
const mongodbAPI = process.env.mongourl || require("./config/env").mongodbAPI; //keys.mongouri;
app.use(require("morgan")("dev"));

// const accessToken = require("./config/env").dropboxaccesstoken;
// var dbx = new Dropbox({ accessToken: accessToken, fetch: fetch });

// const multer = require("multer");

// app.use(express.static("./build"));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "build", "index.html"));
// });

var jwthelper = (req, res, next) => {
  console.log("helper .....");
  const token = req.headers.authorization;
  //  req.body.token || req.query.token || req.headers['x-access-token']
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, jwtsecret, function(err, decoded) {
      if (err) {
        console.log(err);

        return res
          .status(401)
          .json({ error: true, message: "unauthorized_access" });
      }
      if (decoded.type === "regular") {
        console.log("helper oK");
        // console.log()
        req.id = decoded.id;

        var ipaddr =
          req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        var newview = new Views({
          route: "default",
          location: req.originalUrl,
          time: new Date().toISOString(),
          ip: ipaddr
        });

        newview
          .save()
          .then(result => {})
          .catch(err => {
            console.log(err);
          });
        next();
      } else {
        return res
          .status(401)
          .json({ error: true, message: "unauthorized_access" });
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      error: true,
      message: "no_token_provided."
    });
  }
};

var jwthelpertemp = (req, res, next) => {
  console.log("helper .....");
  const token = req.headers.authorization;
  //  req.body.token || req.query.token || req.headers['x-access-token']
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, jwtsecret, function(err, decoded) {
      if (err) {
        console.log(err);

        return res
          .status(401)
          .json({ error: true, message: "unauthorized_access" });
      }
      if (decoded.type === "temp") {
        console.log("helper oK");
        // console.log()
        req.id = decoded.id;
        var ipaddr =
          req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        var newview = new Views({
          route: "temp",
          location: req.originalUrl,
          time: new Date().toISOString(),
          ip: ipaddr
        });

        newview
          .save()
          .then(result => {})
          .catch(err => {
            console.log(err);
          });

        next();
      } else {
        return res
          .status(401)
          .json({ error: true, message: "unauthorized_access" });
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      error: true,
      message: "no_token_provided."
    });
  }
};

// var jwthelperadmin = (req, res, next) => {
//   console.log("helper .....");
//   const token = req.headers.authorization;
//   //  req.body.token || req.query.token || req.headers['x-access-token']
//   // decode token
//   if (token) {
//     // verifies secret and checks exp
//     jwt.verify(token, jwtsecret, function(err, decoded) {
//       if (err) {
//         console.log(err);

//         return res
//           .status(401)
//           .json({ error: true, message: "unauthorized_access" });
//       }
//       if (decoded.type === "regular") {
//         console.log("helper oK");

//         // console.log()
//         req.id = decoded.id;
//         next();
//       } else {
//         return res
//           .status(401)
//           .json({ error: true, message: "unauthorized_access" });
//       }
//     });
//   } else {
//     // if there is no token
//     // return an error
//     return res.status(403).send({
//       error: true,
//       message: "no_token_provided."
//     });
//   }
// };

app.use(express.static("./views/pages"));

app.get("/share/:sharecode", function(req, res) {
  // console.log(sharecode);
  console.log(req.params.sharecode);
  console.log("shareeeeeeeeeeeee");

  Sharecode.findOne({ code: req.params.sharecode })
    .then(sharecodedoc => {
      console.log(sharecodedoc);

      if (sharecodedoc) {
        var then = new Date(sharecodedoc.createdAt).getTime();
        var diff = Math.floor((new Date().getTime() - then) / 1000);

        if (diff < 604700) {
          console.log("\n\nServing from DB \n\n");

          res.render("pages/share", {
            size: sharecodedoc.size,
            title: sharecodedoc.key,
            username: sharecodedoc.username,
            resurl: sharecodedoc.awsurl
          });

          // res.status(200).json({
          //   msg: "linkgenerated",
          //   resurl: `${apiurl}share/${sharecodedoc.code}`
          // });
        } else {
          console.log("\n link expired from DB , updating link.... \n\n");
          var params = {
            Bucket: sharecodedoc.username,
            Key: sharecodedoc.key,
            Expires: 604800 //604800
          };

          s3bucket
            .getSignedUrlPromise("getObject", params)
            .then(result => {
              // console.log(result);

              sharecodedoc.awsurl = result;
              sharecodedoc.createdAt = new Date();

              sharecodedoc
                .save()
                .then(savedoc => {
                  console.log("new url updated");

                  res.render("pages/share", {
                    size: sharecodedoc.size,
                    title: sharecodedoc.key,
                    username: sharecodedoc.username,
                    resurl: sharecodedoc.result
                  });

                  // res.status(200).json({
                  //   msg: "linkgenerated",
                  //   resurl: `${apiurl}share/${sharecodedoc.code}`
                  // });
                })
                .catch(err => {
                  console.log(err);
                });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({ msg: "error" });
            });
        }
      } else {
        res.render("pages/share", {
          size: "Nan",
          title: "error file not found",
          username: "",
          resurl: "0"
        });
      }
    })
    .catch(err => {
      console.log(err);
    });

  // console.log(result);

  // res.status(200).json({ msg: "linkgenerated", resurl: result });
});

app.use("/auth", require("./routes/auth/auth.router")); //dont add jwt middleware
app.use("/reg", require("./routes/register/register.router")); //dont add jwt middleware

app.use("/api", jwthelper, require("./routes/api/api.router"));
app.use("/upload", jwthelper, require("./routes/fileuplaod/fileupload.router"));

app.use(
  "/temp",
  jwthelpertemp,
  require("./routes/tempaccess/tempaccess.router")
);

// app.use()

app.use(express.static("./build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

io.on("connection", sock => {
  console.log("user connected");
  sock.on("disconnect", () => {
    console.log("user disconnected");
  });

  sock.on("remotecopynew", data => {
    console.log(data);
    sock.broadcast.emit("remotecopyclient" + data.uid, data);
    // io.emit("remotecopyclient" + data.uid, data);
  });

  sock.on("newfileupload", data => {
    console.log(data);
    console.log("new file upload");
    sock.broadcast.emit("filechange" + data.id, {});
    // io.emit("remotecopyclient" + data.uid, data);
  });
});

module.exports.wsfunc = (event, data) => {
  console.log("new " + event);
  io.emit(event, data);
};

app.post("/presigendurltest", (req, res) => {
  console.log("yeehaa");
  // console.log(req.body);
  // var params = {
  //   Bucket: "rizky123",
  //   Key: req.body.name,
  //   Expires: 3600,
  //   ContentType: req.body.type
  // };
  // let s3bucket = new AWS.S3({
  //   accessKeyId: awskey,
  //   secretAccessKey: awsseacret
  //   // Bucket: BUCKET_NAME
  // });
  // var thisConfig = {
  //   AllowedHeaders: ["*"],
  //   AllowedMethods: ["PUT"],
  //   AllowedOrigins: ["*"],
  //   ExposeHeaders: [],
  //   MaxAgeSeconds: 3000
  // };
  // var corsRules = new Array(thisConfig);
  // Create CORS params
  // var corsParams = {
  //   Bucket: "rizky123",
  //   CORSConfiguration: { CORSRules: corsRules }
  // };
  // set the new CORS configuration on the selected bucket
  // s3bucket
  //   .putBucketCors(corsParams)
  //   .promise()
  //   .then(result => {
  //     console.log(result);
  // s3bucket
  //   .getSignedUrlPromise("putObject", params)
  //   .then(result => {
  //     // console.log(result);
  //     res.status(200).json({ msg: "linkgenerated", resurl: result });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     res.status(500).json({ msg: "error" });
  //   });
  // })
  // .catch(err => {
  //   console.log(err);
  // });
});

// app.get("/", (req, res) => {
// from: "+12512610310",
// to: "+"

// twillioclient.messages
//   .create({
//     from: "whatsapp:+14155238886",
//     body: "Hello there!",
//     to: "whatsapp:+"
//   })
//   .then(message => console.log(message.sid))
//   .catch(err => {
//     console.log(err);
//   });

// console.log("info");

// console.log(req.body);

// fs.readFile("./package.json", (err, data) => {
//   if (err) {
//     console.log(err);
//   } else {
//     dbx
//       .filesUpload({ path: "/package3.json", contents: data })
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
// });

// console.log(otp);

// twillioclient.messages
//   .create({
//     body: "This is the ship that made the Kessel Run in fourteen parsecs?",
//     from: "+12512610310",
//     to: "+"
//   })
//   .then(message => console.log(message.sid));

try {
  mongoose.connect(
    mongodbAPI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    err => {
      if (!err) console.log("connected to mongodb sucsessfully" + "👍");
    }
  );
} catch (error) {
  console.log(err);
}

http.listen(port, () => {
  console.log("listning on " + port);
});

// app.listen(port, () => {
//   console.log("listsing on " + port);
// });
