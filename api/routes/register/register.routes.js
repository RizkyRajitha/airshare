const User = require("../../models/users");
const Invitecode = require("../../models/invitecodestemp");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const sendgridkey =
  process.env.sendgridkey || require("../../config/env").sendgridkey;
const sgMail = require("@sendgrid/mail");
const jwtsecret =
  process.env.jwtsecret || require("../../config/env").jwtsecret;

const awskey = process.env.awskey || require("../../config/env").awskey;
const awsseacret = process.env.awskey || require("../../config/env").awsseacret;
var AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-2" });
exports.signup = (req, res) => {
  console.log("signup");
  var datain = req.body;
  console.log(datain);

  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(datain.password, salt);

  console.log("hash - " + hash);

  Invitecode.findOne({ invitecode: datain.invitecode })
    .then(doc => {
      console.log(doc);
      if (doc) {
        console.log(" invite code vaild ");

        var newuser = new User({
          email: datain.email,
          phone: datain.phone,
          firstName: datain.firstName,
          lastName: datain.lastName,
          hash: hash,
          userName: datain.username,
          userType: "regular"
        });

        newuser
          .save()
          .then(doc => {
            console.log(doc);

            let s3bucket = new AWS.S3({
              accessKeyId: awskey,
              secretAccessKey: awsseacret
            });

            var params = {
              Bucket: datain.username
            };
            s3bucket.createBucket(params, function(err, data) {
              if (err) {
                console.log(err);
                if (err.code === "BucketAlreadyExists") {
                  res
                    .status(200)
                    .json({ error: true, msg: "BucketAlreadyExists" });
                }
                res
                  .status(200)
                  .json({ error: true, msg: "errorcreatingbucket" });
              }
              // an error occurred
              else {
                console.log(data);

                Invitecode.findOneAndDelete({ invitecode: datain.invitecode })
                  .then(doc2 => {
                    console.log(" invite code vaild deleted ");
                  })
                  .catch(err => {
                    console.log(err);
                  });

                res.status(200).json({ data: data, msg: "success" });
                sgMail.setApiKey(sendgridkey);
                const msg = {
                  to: datain.email,
                  from: "support@airshare.com",
                  subject: "WELCOME TO AIRSHARE",
                  templateId: "d-fba82ccbc86c43538d32d49b4d8429d3",
                  dynamic_template_data: {
                    name: doc.firstName,
                    date: new Date().toUTCString(),
                    uniqeid: Math.floor(Math.random() * 1000000000)
                  }
                };
                sgMail
                  .send(msg)
                  .then(result => {
                    console.log(result);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              } // successful response
            });

            // dbx.filesCreateFolder({
            //   path: "/" + datain.username,
            //   autorename: false
            // });
          })
          .catch(err => {
            if (err.code === 11000) {
              console.log("duplicate user");
              res.status(200).json({ msg: "dupuser" });
            }
          });
      } else {
        console.log("invalid invite code");
        res.status(200).json({ msg: "invalidinvite" });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

exports.chechusername = (req, res) => {
  console.log(req.body);

  User.findOne({ userName: req.body.username })
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json({ msg: "invalid" });
      } else {
        res.status(200).json({ msg: "valid" });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

exports.forgotPassword = (req, res) => {
  var email = req.body.email;

  User.findOne({ email: email })
    .then(result => {
      if (!result) {
        console.log(result + "not found error");
        res.status(401).json({ msg: "nouser" });
      } else {
        var payload = {
          id: result._id,
          prehash: result.hash
        };

        var token = jwt.sign(payload, jwtsecret, {
          expiresIn: "30m"
        });

        sgMail.setApiKey(sendgridkey);
        const msg = {
          to: "rajithagunathilake@gmail.com",
          from: "support@airshare.com",
          subject: "RESET PASSWORD",
          templateId: "d-2dff1651f13642be887e376057747aa4",
          dynamic_template_data: {
            name: result.userName,
            msg: `${apiurl}${token}`,
            date: new Date().toUTCString(),
            uniqeid: Math.floor(Math.random() * 1000000000)
          }
        };
        sgMail
          .send(msg)
          .then(result => {
            // console.log(result[0]._id);
            res.status(200).json({ msg: "success" });
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log("error - - - " + err);
      res.send("no_user_found");
    });
};

exports.resetpassword = (req, res) => {
  id = req.params.id;
  newpassword = req.body.password;
  passresetjwt = req.body.token;

  try {
    var decode = jwt.verify(passresetjwt, jwtsecret);
    console.log("decode jwt - " + JSON.stringify(decode));

    User.findOne({ _id: id })
      .then(result => {
        if (result.hash === decode.prehash) {
          console.log("hash verified");
          console.log("found " + result.email);

          var salt = bcrypt.genSaltSync(saltRounds);
          var hash = bcrypt.hashSync(newpassword, salt);

          User.findOneAndUpdate(
            { _id: id },
            {
              $set: {
                hash: hash
              }
            }
          )
            .then(doc => {
              console.log("password changed succesfully");
              res.status(200).json({ msg: "success" });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({ msg: "servererror" });
            });
        } else {
          console.log("hash error");
          res.status.json({ msg: "tokendisbled" });
        }
      })
      .catch(err => {
        console.log(err);
        // res.send("error");
      });
  } catch (error) {
    console.log(error);
  }

  console.log(id);
  console.log(newpassword);
  // res.send("hahahaha  " + id);
};
