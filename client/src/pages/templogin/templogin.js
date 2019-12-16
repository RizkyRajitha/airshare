import React, { Component } from "react";

import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/components/navbar";
import Altert from "../../components/altert";
import Footer from "../../components/footer/footer";
// import "./css/main.css";
// import "./landingpage.css";
import "./templogin.scoped.css";

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
            alertext: "OTP sent . Please check your Email",
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
            alertext: "OTP re sent . Please check your Email",
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
      <div className="">
        <Navbar />
        <Altert
          action={this.state.alertaction}
          text={this.state.alertext}
          hiddenalert={this.state.alerthidden}
        />

        <div className="text-center" hidden={this.state.emailhidden}>
          <div className="container">
            <form
              className="form-signin"
              onSubmit={this.onsubmit}
              hidden={this.state.emailhidden}
            >
              <img
                className="mb-4"
                src="https://img.icons8.com/nolan/64/000000/share.png"
                alt=""
                width={72}
                height={72}
              />
              <h1 className="h3 mb-3 font-weight-normal"> Guest Login</h1>
              <label htmlFor="inputEmail" className="sr-only">
                Email address
              </label>

              <input
                className="form-control"
                placeholder="Enter your email"
                id="email"
                type="email"
                required
                onChange={e => this.setState({ email: e.target.value })}
                name="email"
                autofocus
              />
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
                Send my one time password
              </button>
              {/* <p className="mt-5 mb-3 text-muted ">© 2017-2019</p> */}
            </form>
          </div>
        </div>

        <div className="text-center" hidden={!this.state.emailhidden}>
          <div className="container">
            <form
              className="form-signin"
              onSubmit={this.onsubmitotp}
              hidden={!this.state.emailhidden}
            >
              <img
                className="mb-4"
                src="https://img.icons8.com/nolan/64/000000/share.png"
                alt=""
                width={72}
                height={72}
              />
              <h1 className="h3 mb-3 font-weight-normal"> Confirm OTP </h1>
              <input
                placeholder="Enter your one time password"
                id="otp"
                type="text"
                required
                onChange={e => this.setState({ otp: e.target.value })}
                className="form-control"
              />

              <div className="text-left remaintimeguest">
                <span>
                  Time remaining :
                  {this.state.timer < 0 && (
                    <a
                      className="btn btn-info"
                      onClick={() => this.resendotp()}
                    >
                      {" "}
                      Resend otp{" "}
                    </a>
                  )}{" "}
                  {this.state.timer}
                </span>
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
                Confirm
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Templogin;
