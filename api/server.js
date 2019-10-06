var fetch = require("isomorphic-fetch");
var Dropbox = require("dropbox").Dropbox;

const express = require("express");
const axios = require("axios");
const app = express();
const fs = require("fs");

const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/users");
const bp = require("body-parser");
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(require("morgan")("dev"));
const jwtsecret = require("./config/env").jwtsecret;
const accountSid = require("./config/env").twilliosid;
const authToken = require("./config/env").twilliotoken;
const twillioclient = require("twilio")(accountSid, authToken);

// telegram = '982920318:AAFJanZtcladHlMpt7rELD38dbh6wT91meM'    chait = -363135079

const port = 5000 || process.env.PORT;

mongoose.Promise = global.Promise;
//"mongodb://127.0.0.1:27017/authdb" ||
const mongodbAPI = require("./config/env").mongodbAPI; //keys.mongouri;

const accessToken = require("./config/env").dropboxaccesstoken;
var dbx = new Dropbox({ accessToken: accessToken, fetch: fetch });

// const multer = require("multer");

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

var jwthelperadmin = (req, res, next) => {
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

app.use("/auth", require("./routes/auth/auth.router")); //dont add jwt middleware
app.use("/reg", require("./routes/register/register.router")); //dont add jwt middleware

app.use("/api", jwthelper, require("./routes/api/api.router"));
app.use("/upload", jwthelper, require("./routes/fileuplaod/fileupload.router"));

app.use(
  "/temp",
  jwthelpertemp,
  require("./routes/tempaccess/tempaccess.router")
);

app.get("/", (req, res) => {
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

  console.log(req.body);

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
});

app.get("/down", (req, res) => {
  console.log("info");

  dbx
    .filesDownloadZip({ path: "/new folder (2)" })
    .then(function(response) {
      console.log(response.fileBinary);

      fs.writeFileSync(`qwqwqw.zip`, response.fileBinary, function(error) {
        if (error) {
          console.error(error);
        }
      });
      res.json(response);
    })
    .catch(function(error) {
      console.log(error);
    });
});

try {
  mongoose.connect(mongodbAPI, { useNewUrlParser: true }, err => {
    if (!err) console.log("connected to mongodb sucsessfully" + "👍");
  });
} catch (error) {
  console.log(err);
}

app.listen(port, () => {
  console.log("listsing on " + port);
});
