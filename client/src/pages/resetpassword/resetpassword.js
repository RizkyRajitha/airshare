import React, { Component } from "react";
// import { Redirect, Link } from "react-router-dom";
// import Navbar from "../../components/navbar";
import Altert from "../../components/altert";
import "./resetpassword.css";
import axios from "axios";
import moments from "moment";
// import Navbar from "../../components/navbar/navbar";
// import Footer from "../../components/footer/footer";
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

  componentDidMount() {
    //M.toast({ html: "I am a toast!" });
    var jwt = this.props.match.params.id; //localStorage.getItem("jwt");
    console.log("comp mount");
    console.log(jwt);
    try {
      var tk = jsonwebtoken.verify(jwt, "authdemo");
      if (tk) {
        console.log(tk);
        console.log("valid token");

        var date = new Date(tk.exp * 1000);

        var dato = new Date().toUTCString();

        var ddt = moments(date).format("YYYY-MM-DD HH:mm:ss");
        var ddtas = moments(dato).format("YYYY-MM-DD HH:mm:ss");

        console.log("ddt");
        console.log(ddt);
        var stst = moments.utc(
          moments(ddt).diff(moments(ddtas, "YYYY-MM-DD HH:mm:ss"))
        );

        var countdown = setInterval(() => {
          stst.subtract({ second: 1 });
          this.setState({ remain: stst.format("HH:mm:ss").slice(3, 8) });
          console.log(stst.format("HH:mm:ss"));

          if (stst.format("HH:mm:ss") === "00:00:00") {
            this.setState({
              alerthidden: false,
              alertext: "please login to continue",
              alertaction: "danger"
            });
            this.props.history.push("/login");
            clearInterval(countdown);
          }
        }, 1000);
      }
    } catch (error) {
      console.log(error);

      // setTimeout(() => {
      //   this.props.history.push("/");
      // }, 2000);

      this.setState({
        alerthidden: false,
        alertext: "Token expired please request a reset password again",
        alertaction: "danger"
      });
    }
  }

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
      <div className="maindivlogin">
        {/* <Navbar /> */}
        <div className="wrapper">
          <Altert
            action={this.state.alertaction}
            text={this.state.alertext}
            hiddenalert={this.state.alerthidden}
          />
          <div className="form-wrapper-resetpass">
            <div className="headingwrapperlogin">
              <h3>Reset your password</h3>
            </div>

            <span>{this.state.remain}</span>

            <div className="informmresetpass">
              <br />

              <form onSubmit={this.btn1handler}>
                <br />
                <br />
                <br />

                <div className="form-group">
                  <input
                    placeholder="New password"
                    id="pass1"
                    required
                    type="password"
                    name="password"
                    className="form-control"
                    minLength="7"
                    onChange={e => this.setState({ password1: e.target.value })}
                  />
                  {/* <label className="logininputlabel" for="email">
                    New password
                  </label> */}
                </div>
                <div className="form-group">
                  <input
                    placeholder="Re enter new password"
                    required
                    id="pass2"
                    type="password"
                    name="pass2"
                    className="form-control"
                    onChange={e => this.setState({ password2: e.target.value })}
                  />
                  {/* <label className="logininputlabel" for="pass">
                    Re enter new password
                  </label> */}
                </div>
                <div className="submit">
                  <input
                    type="submit"
                    className="btn loginbtn"
                    value="Reset password"
                  />
                </div>
              </form>

              <br />
              <br />
            </div>
          </div>{" "}
        </div>{" "}
        {/* <Footer /> */}
      </div>
    );
  }
}

export default Resetpassword;
