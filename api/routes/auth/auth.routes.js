// const Nexmo = require("nexmo");

const apiurl = process.env.apiurl || require("../../config/env").api;
const sendgridkey =
  process.env.sendgridkey || require("../../config/env").sendgridkey;
const telegramtoke =
  process.env.telegramtoke || require("../../config/env").telegramtoken;
const telegramchatid =
  process.env.telegramchatid || require("../../config/env").telegramchatid;

const telegramtokelogger =
  process.env.telegramtokelogger ||
  require("../../config/env").telegramtokelogger;
const telegramchatidlogger =
  process.env.telegramchatidlogger ||
  require("../../config/env").telegramchatidlogger;
const ipdatakey =
  process.env.ipdatakey || require("../../config/env").ipdatakey;

const sgMail = require("@sendgrid/mail");
const jwtsecret =
  process.env.jwtsecret || require("../../config/env").jwtsecret;
const jwt = require("jsonwebtoken");
const User = require("../../models/users");
const bcrypt = require("bcryptjs");
const axios = require("axios");

exports.login = (req, res) => {
  console.log(req.body);

  User.findOne({ email: req.body.email })
    .then(doc => {
      console.log(doc);

      var state = bcrypt.compareSync(req.body.password, doc.hash);

      console.log(state);

      if (state) {
        var token = jwt.sign(
          {
            email: doc.email,
            id: doc._id,
            type: "regular"
          },
          jwtsecret,
          { expiresIn: "600m" }
        );

        res.status(200).json({ msg: "success", token: token });
      } else {
        res.status(401).json({ msg: "invalidcredentials" });
      }
    })
    .catch(err => {
      res.status(401).json({ msg: "nouser" });
    });
};

exports.requestotp = (req, res) => {
  // const mymail = "rajitha123";
  console.log(req.body);

  User.findOne({ email: req.body.email })
    .then(doc => {
      var otp = (Math.floor(Math.random() * 10000) + 1000)
        .toString()
        .slice(0, 6);

      User.findOneAndUpdate(
        { email: req.body.email },
        {
          $set: {
            tempotp: otp
          }
        }
      )
        .then(doc => {
          //use telegram bot  - post axios - https://api.telegram.org/bot982920318:AAFJanZtcladHlMpt7rELD38dbh6wT91meM/sendMessage?chat_id=-363135079&text=Hello%20World

          console.log(doc);
          // twillioclient.messages
          //   .create({
          //     body: `confirmation code for [${doc.firstName}] sh care [${otp}] `,
          //     from: "+12512610310",
          //     to: "+94765628312"
          //   })

          var eventtime = new Date().toLocaleString("en-US", {
            timeZone: "Asia/Colombo"
          });

          if (doc) {
            var value = `hi ${doc.userName} ,\n use ${otp} confirmation code for Guest login in AIR_SHARE \nAIR_SHARE TEAM \n${eventtime}  `;

            console.log(value);
            const uurll = encodeURIComponent(value).replace("%20", "+");
            // const url = 'http://example.com?lang=en&key=' + value

            axios
              .post(
                `https://api.telegram.org/bot${telegramtoke}/sendMessage?chat_id=${telegramchatid}&text=${uurll}`
              )
              .then(message => {
                console.log(message.data);

                var jwtpayload = {
                  email: req.body.email,
                  type: "requestotp"
                };

                var token = jwt.sign(jwtpayload, jwtsecret, {
                  expiresIn: "1m"
                });

                res.status(200).json({ msg: "otpsend", token: token });
              });
          } else {
            res.status(401).json({ msg: "nouser" });
          }
        })
        .catch(err => {
          console.log(err);
          res.status(401).json({
            msg: "errdbconn"
          });
        });
    })
    .catch(err => {
      if (err.code === 11000) {
        console.log(" reg err duplicate email found ");
        res.status(403).json(err.code);
      } else {
        res.status(401).json({
          msg: "lesspre"
        });
      }
      console.log("error invalid email");
    });
};

exports.verifyotp = (req, res) => {
  var datain = req.body;
  console.log(datain);

  try {
    var decode = jwt.verify(datain.token, jwtsecret);

    console.log(decode);

    User.findOne({ email: decode.email })
      .then(doc => {
        // console.log(doc);

        if (doc.tempotp === datain.otp) {
          console.log("valid otp");

          var tokenpayload = {
            email: doc.email,
            id: doc._id,
            type: "temp"
          };

          var token = jwt.sign(tokenpayload, jwtsecret, {
            expiresIn: "10m"
          });

          User.findOneAndUpdate(
            { email: doc.email },
            {
              $set: {
                tempotp: null
              }
            }
          )
            .then(doc => {
              console.log("temp otp erased");
            })
            .catch(err => {
              console.log(err);
            });

          res.status(200).json({ msg: "otpsucsess", token: token });
        } else {
          console.log("invalid otp");
          res.status(401).json({ msg: "otpmissmatch" });
        }
      })
      .catch(err => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "otptimeexpired" });
  }
};

exports.forgotPassword = (req, res) => {
  var email = req.body.email;
  console.log("in forgot password");
  User.findOne({ email: email })
    .then(result => {
      if (!result) {
        console.log(result + "not found error");
        res.status(200).json({ msg: "nouser" });
      } else {
        var payload = {
          id: result._id,
          prehash: result.hash
        };

        var token = jwt.sign(payload, jwtsecret, {
          expiresIn: "10m"
        });

        sgMail.setApiKey(sendgridkey);
        const msg = {
          to: result.email,
          from: "support@airshare.com",
          subject: "RESET PASSWORD",
          templateId: "d-07807a10af4f42a1be9b9502464c6886",
          dynamic_template_data: {
            name: result.userName,
            msg: `${apiurl}resetpassword/${token}`,
            date: new Date().toUTCString(),
            uniqeid: Math.floor(Math.random() * 1000000000)
          }
        };
        sgMail
          .send(msg)
          .then(result => {
            console.log("email sent");
            // console.log(result[0]._id);
            res.status(200).json({ msg: "success" });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "servererr" });
          });
      }
    })
    .catch(err => {
      console.log("error - - - " + err);
      res.send("no_user_found");
    });
};

exports.resetpassword = (req, res) => {
  // id = req.body.id;
  newpassword = req.body.password;
  passresetjwt = req.body.token;

  console.log(req.body);

  try {
    var decode = jwt.verify(passresetjwt, jwtsecret);
    console.log("decode jwt - " + JSON.stringify(decode));

    var id = decode.id;

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
              console.log();
              res.status(500).json({ msg: "tokenerr" });
            });
        } else {
          console.log("hash error");
          res.status(200).json({ msg: "tokendisbled" });
        }
      })
      .catch(err => {
        console.log(err);
        // res.send("error");
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "tokenerr" });
  }

  console.log(id);
  console.log(newpassword);
  // res.send("hahahaha  " + id);
};
