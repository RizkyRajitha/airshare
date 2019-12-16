import React, { Component } from "react";
// import { Redirect, Link } from "react-router-dom";
// import Navbar from "../../components/navbar";
import Altert from "../../components/altert";
import "./resetpassword.scoped.css";
import axios from "axios";
import moments from "moment";
// import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
const jsonwebtoken = require("jsonwebtoken");

class Resetpassword extends Component {
  state = {
    token: "",
    // email: "",
    password1: "",
    password2: "",
    alerthidden: true,
    alertext: "",
    alertaction: "",
    remain: ""
  };

  // componentDidMount() {
  //   //M.toast({ html: "I am a toast!" });
  //   var jwt = this.props.match.params.id; //localStorage.getItem("jwt");
  //   console.log("comp mount");
  //   console.log(jwt);
  //   try {
  //     var tk = jsonwebtoken.verify(jwt, "authdemo");
  //     if (tk) {
  //       console.log(tk);
  //       console.log("valid token");

  //       var date = new Date(tk.exp * 1000);

  //       var dato = new Date().toUTCString();

  //       var ddt = moments(date).format("YYYY-MM-DD HH:mm:ss");
  //       var ddtas = moments(dato).format("YYYY-MM-DD HH:mm:ss");

  //       console.log("ddt");
  //       console.log(ddt);
  //       var stst = moments.utc(
  //         moments(ddt).diff(moments(ddtas, "YYYY-MM-DD HH:mm:ss"))
  //       );

  //       var countdown = setInterval(() => {
  //         stst.subtract({ second: 1 });
  //         this.setState({ remain: stst.format("HH:mm:ss").slice(3, 8) });
  //         console.log(stst.format("HH:mm:ss"));

  //         if (stst.format("HH:mm:ss") === "00:00:00") {
  //           this.setState({
  //             alerthidden: false,
  //             alertext: "please login to continue",
  //             alertaction: "danger"
  //           });
  //           this.props.history.push("/login");
  //           clearInterval(countdown);
  //         }
  //       }, 1000);
  //     }
  //   } catch (error) {
  //     console.log(error);

  //     // setTimeout(() => {
  //     //   this.props.history.push("/");
  //     // }, 2000);

  //     this.setState({
  //       alerthidden: false,
  //       alertext: "Token expired please request a reset password again",
  //       alertaction: "danger"
  //     });
  //   }
  // }

  btn1handler = e => {
    e.preventDefault();

    // this.setState({ creaderror: true });
    console.log("cliking");

    if (this.state.password1 === this.state.password2) {
      console.log("passwords match " + this.state.password1);

      axios
        .post("/auth/resetpassword", {
          token: this.props.match.params.id,
          password: this.state.password1
        })
        .then(data => {
          console.log("awe mewwa - - -popopopopo");
          console.log(data);
          var body = data.data;

          if (body.msg === "success") {
            console.log("body - " + body);

            this.props.history.push("/");

            this.setState({
              alerthidden: false,
              alertext: "password changed succesfully",
              alertaction: "success"
            });
          } else if (body.msg === "tokendisbled") {
            this.setState({
              alerthidden: false,
              alertext: "this link is disabled",
              alertaction: "danger"
            });
          }
        })
        .catch(err => {
          //   M.toast({ html: "Invalid Credentials" });
          console.log(err);
          if (err.response.data.msg === "tokenerr") {
            this.setState({
              alerthidden: false,
              alertext: "Token malformed",
              alertaction: "danger"
            });
            console.log("l>> err" + err);
          }
        });
    } else {
      this.setState({
        alerthidden: false,
        alertext: "password does not match please try again",
        alertaction: "danger"
      });
      console.log("passwords mismatch");
    }
  };

  render() {
    return (
      <div className="maindivreset">
        <Altert
          action={this.state.alertaction}
          text={this.state.alertext}
          hiddenalert={this.state.alerthidden}
        />

        <div className="text-center">
          <div className="container">
            <form className="form-signin" onSubmit={this.btn1handler}>
              <img
                className="mb-4"
                src="https://img.icons8.com/nolan/64/000000/share.png"
                alt=""
                width={72}
                height={72}
              />
              <h1 className="h3 mb-3 font-weight-normal">
                Reset your password
              </h1>
              <div className=" text-left mb-3">
                <span>Time remaining : {this.state.remain}</span>
              </div>
              <label htmlFor="inputEmail" className="sr-only">
                Enter new password
              </label>

              <input
                placeholder="Enter new password"
                id="pass1"
                required
                type="password"
                name="password"
                className="form-control"
                minLength="7"
                onChange={e => this.setState({ password1: e.target.value })}
                autofocus
              />

              <label htmlFor="inputPassword" className="sr-only">
                Password
              </label>
              <input
                placeholder="Re enter new password"
                required
                id="pass2"
                type="password"
                name="pass2"
                className="form-control"
                onChange={e => this.setState({ password2: e.target.value })}
              />
              <div className=" text-left mb-3">
                <a href="/forgotpassword">forgot password</a>
              </div>

              <div
                className={"container saga" + this.state.alertaction}
                hidden={this.state.alerthidden}
              >
                <span className="">{this.state.alertext}</span>
              </div>

              <button
                className="btn btn-lg btn-primary btn-block"
                type="submit"
              >
                Reset password
              </button>
              {/* <p className="mt-5 mb-3 text-muted ">© 2017-2019</p> */}
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Resetpassword;
