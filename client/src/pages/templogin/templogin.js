import React, { Component } from "react";

import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar/navbar";
import Altert from "../../components/altert";
import Footer from "../../components/footer/footer";
// import "./css/main.css";
// import "./landingpage.css";
import "./templogin.css";

class Templogin extends Component {
  state = {
    email: "",
    emailhidden: false,
    otp: "",
    alerthidden: true,
    alertext: "",
    alertaction: "",
    timer: 60
  };

  onsubmit = e => {
    this.setState({
      alerthidden: true,
      alertext: "",
      alertaction: ""
    });
    e.preventDefault();
    console.log(this.state.email);
    var payload = {
      email: this.state.email
    };
    axios
      .post("/auth/requestotp", payload)
      .then(res => {
        // document.getElementById("username").value = "";
        console.log(res.data);
        if (res.data.msg === "otpsend") {
          localStorage.setItem("tempotp", res.data.token);
          this.setState({ emailhidden: true });
          this.setState({
            alerthidden: false,
            alertext: "OTP send",
            alertaction: "success"
          });
        }
      })
      .catch(err => {
        document.getElementById("username").value = "";
        console.log(err.response.data);

        if (err.response.data.msg === "nouser") {
          this.setState({
            alerthidden: false,
            alertext: "user not found",
            alertaction: "danger"
          });
        } else if (err.response.data.msg === "errdbconn") {
          this.setState({
            alerthidden: false,
            alertext: "user not found",
            alertaction: "danger"
          });
        }
      });

    var otptimer = setInterval(() => {
      this.setState({ timer: this.state.timer - 1 });
      if (this.state.timer < 0) {
        clearTimeout(otptimer);
      }
    }, 1000);
  };

  onsubmitotp = e => {
    e.preventDefault();
    this.setState({
      alerthidden: true,
      alertext: "",
      alertaction: ""
    });
    console.log(this.state.otp);
    var tempotptoken = localStorage.getItem("tempotp");
    var payload = {
      otp: this.state.otp,
      token: tempotptoken
    };
    axios
      .post("/auth/verifyotp", payload)
      .then(res => {
        console.log(res.data);
        if (res.data.msg === "otpsucsess") {
          localStorage.setItem("jwtguest", res.data.token);
          this.props.history.push("/dashboardlite");
        }
      })
      .catch(err => {
        console.log(err);

        if (err.response.data.msg === "otpmissmatch") {
          console.log("error otp invalid");
          this.setState({
            alerthidden: false,
            alertext: "error otp invalid",
            alertaction: "danger"
          });
        } else if (err.response.data.msg === "otptimeexpired") {
          console.log("error otp time expried");
          this.setState({
            alerthidden: false,
            alertext: "error otp time expried",
            alertaction: "danger"
          });
        }
      });
  };

  resendotp = () => {
    this.setState({
      alerthidden: true,
      alertext: "",
      alertaction: "",
      timer: 60
    });

    console.log(this.state.email);
    var payload = {
      email: this.state.email
    };
    axios
      .post("/auth/requestotp", payload)
      .then(res => {
        // document.getElementById("username").value = "";
        console.log(res.data);
        if (res.data.msg === "otpsend") {
          localStorage.setItem("tempotp", res.data.token);
          this.setState({ emailhidden: true });
          this.setState({
            alerthidden: false,
            alertext: "OTP re send",
            alertaction: "success"
          });
        }
      })
      .catch(err => {
        document.getElementById("username").value = "";
        console.log(err.response.data);

        if (err.response.data.msg === "nouser") {
          this.setState({
            alerthidden: false,
            alertext: "user not found",
            alertaction: "danger"
          });
        } else if (err.response.data.msg === "errdbconn") {
          this.setState({
            alerthidden: false,
            alertext: "user not found",
            alertaction: "danger"
          });
        }
      });

    var otptimer = setInterval(() => {
      this.setState({ timer: this.state.timer - 1 });
      if (this.state.timer < 0) {
        clearTimeout(otptimer);
      }
    }, 1000);
  };

  render() {
    return (
      <div className="maindivforgotpassword">
        <Navbar />
        <Altert
          action={this.state.alertaction}
          text={this.state.alertext}
          hiddenalert={this.state.alerthidden}
        />
        <div className="wrapper">
          <div className="form-wrapper">
            <div className="headingwrapperforgotpassword">
              <h4>
                Not sure where you login <br /> use guest mode to securely
                access your files without a fuss
              </h4>
            </div>

            <div className="informmforgotpassword">
              <br />

              <form onSubmit={this.onsubmit} hidden={this.state.emailhidden}>
                <br />
                <br />
                <br />

                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="Enter your email"
                    id="username"
                    type="email"
                    required
                    onChange={e => this.setState({ email: e.target.value })}
                  />
                  {/* <label className="forgotpasswordinputlabel" for="email">
                    Email
                  </label> */}
                </div>

                <div className="submit">
                  <input
                    type="submit"
                    className="btn forgotpasswordbtn"
                    value="Send my one time password"
                  />
                </div>
              </form>

              <form
                onSubmit={this.onsubmitotp}
                hidden={!this.state.emailhidden}
              >
                <br />
                <br />
                <br />

                <div className="form-group">
                  <input
                    placeholder="Enter your one time password"
                    id="username"
                    type="text"
                    required
                    onChange={e => this.setState({ otp: e.target.value })}
                    className="form-control"
                  />
                  {/* <label className="forgotpasswordinputlabel">
                    Enter your one tim epassword
                  </label> */}
                </div>
                <div>
                  <span>
                    {this.state.timer < 0 && (
                      <a onClick={() => this.resendotp()}> Resend otp </a>
                    )}{" "}
                    {this.state.timer}
                  </span>
                </div>
                <div className="submit">
                  <input
                    type="submit"
                    className="btn forgotpasswordbtn"
                    value="let me in"
                  />
                </div>
              </form>
              {this.state.creaderror && (
                <div className="container">
                  <div className="credeer">Invalid Creadentials</div>
                </div>
              )}
              <br />
              <br />

              <div className="haveaccc">
                having a problem
                <Link to="/contactsupport">
                  <span> </span>{" "}
                  <a
                    className="ladinpageatag"
                    href="http://rizkyrajitha.github.io/"
                  >
                    contact support
                  </a>
                </Link>
              </div>
            </div>
          </div>{" "}
        </div>{" "}
        <Footer />
      </div>
    );
  }
}

export default Templogin;
