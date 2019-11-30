var fetch = require("isomorphic-fetch");
var Dropbox = require("dropbox").Dropbox;

const express = require("express");
const axios = require("axios");
const app = express();
const fs = require("fs");
const path = require("path");

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
const jwtsecret = require("./config/env").jwtsecret;
// const accountSid = require("./config/env").twilliosid;
// const authToken = require("./config/env").twilliotoken;
// const twillioclient = require("twilio")(accountSid, authToken);

var AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-2" });

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

app.use("/auth", require("./routes/auth/auth.router")); //dont add jwt middleware
app.use("/reg", require("./routes/register/register.router")); //dont add jwt middleware

app.use("/api", jwthelper, require("./routes/api/api.router"));
app.use("/upload", jwthelper, require("./routes/fileuplaod/fileupload.router"));

app.use(
  "/temp",
  jwthelpertemp,
  require("./routes/tempaccess/tempaccess.router")
);

app.post("/presigendurltest", (req, res) => {
  console.log(req.body);
  var params = {
    Bucket: "rizky123",
    Key: req.body.name,
    Expires: 3600,
    ContentType: req.body.type
  };
  let s3bucket = new AWS.S3({
    accessKeyId: awskey,
    secretAccessKey: awsseacret
    // Bucket: BUCKET_NAME
  });

  var thisConfig = {
    AllowedHeaders: ["*"],
    AllowedMethods: ["PUT"],
    AllowedOrigins: ["*"],
    ExposeHeaders: [],
    MaxAgeSeconds: 3000
  };

  var corsRules = new Array(thisConfig);

  // Create CORS params
  var corsParams = {
    Bucket: "rizky123",
    CORSConfiguration: { CORSRules: corsRules }
  };

  // set the new CORS configuration on the selected bucket

  // s3bucket
  //   .putBucketCors(corsParams)
  //   .promise()
  //   .then(result => {
  //     console.log(result);
  s3bucket
    .getSignedUrlPromise("putObject", params)
    .then(result => {
      // console.log(result);
      res.status(200).json({ msg: "linkgenerated", resurl: result });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: "error" });
    });
  // })
  // .catch(err => {
  //   console.log(err);
  // });
});

// app.get("/", (req, res) => {
// from: "+12512610310",
// to: "+94765628312"

// twillioclient.messages
//   .create({
//     from: "whatsapp:+14155238886",
//     body: "Hello there!",
//     to: "whatsapp:+94765628312"
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
//     to: "+94765628312"
//   })
//   .then(message => console.log(message.sid));

// dbx
//   .filesListFolder({ path: "/new folder (2)/scripts" })
//   .then(function(response) {
//     console.log(response);

//     res.json(response);
//   })
//   .catch(function(error) {
//     console.log(error);
//   });
// });

const awskey = require("./config/env").awskey;
const awsseacret = require("./config/env").awsseacret;

const multer = require("multer");

var storage = multer.memoryStorage();

const fileup = multer({ storage: storage });

// app.get("/", fileup.array("resobj"), (req, res) => {
//   console.log(req.files);

//   console.log("s3");

// let s3bucket = new AWS.S3({
//   accessKeyId: awskey,
//   secretAccessKey: awsseacret
//   // Bucket: BUCKET_NAME
// });

//   s3bucket.getSignedUrl(
// "getObject",
// {
//   Bucket: "rajitha1234",
//   Key:
//     "newitens/",
//   Expires: 3600
// },
//     (err, url) => {
//       if (err) {
//         console.log("Error", err);
//       } else {
//         res.send(url);
//         console.log("Success", url);
//       }
//     }
//   );

//   // var params = {
//   //   Bucket: "rajitha1234",
//   //   Key: req.files[0].originalname,
//   //   Body: req.files[0].buffer
//   // };
//   // s3bucket.upload(params, function(err, data) {
//   // if (err) {
//   //   console.log("Error", err);
//   // } else {
//   //   console.log("Success", data);
//   // }
//   // });
//   // Call S3 to list the buckets
//   // s3bucket.listBuckets(function(err, data) {
//   // if (err) {
//   //   console.log("Error", err);
//   // } else {
//   //   console.log("Success", data.Buckets);
//   // }
//   // });

//   // s3bucket.createBucket({ Bucket: "rajitha1234" }, (err, data) => {
//   //   if (err) {
//   //     console.log(err);
//   //   }

//   //   console.log(data);
//   // });
// });

app.get("/down", (req, res) => {
  console.log("info");

  // dbx
  //   .filesDownloadZip({ path: "/new folder (2)" })
  //   .then(function(response) {
  //     console.log(response.fileBinary);

  //     fs.writeFileSync(`qwqwqw.zip`, response.fileBinary, function(error) {
  //       if (error) {
  //         console.error(error);
  //       }
  //     });
  //     res.json(response);
  //   })
  //   .catch(function(error) {
  //     console.log(error);
  //   });
});

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

app.listen(port, () => {
  console.log("listsing on " + port);
});
