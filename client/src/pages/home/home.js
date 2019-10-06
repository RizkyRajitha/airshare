import React, { Component } from "react";
import Navbar from "../../components/navbar";
import Altert from "../../components/altert";
import "./home.css";
import axios from "axios";
class Home extends Component {
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
        this.setState({
          alerthidden: false,
          alertext: "user not found",
          alertaction: "danger"
        });
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
          localStorage.setItem("templogin", res.data.token);
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

  render() {
    return (
      <div>
        <Navbar />
        <div className="container">
          <h2> welcome to sh care </h2>

          <Altert
            action={this.state.alertaction}
            text={this.state.alertext}
            hiddenalert={this.state.alerthidden}
          />
          <span> please enter your email to get started </span>
          <div className="row" hidden={this.state.emailhidden}>
            <form className="col s12" onSubmit={this.onsubmit}>
              <div className="row ">
                <div className="input-field col s4 offset-s3 homeusernametextin ">
                  <input
                    placeholder="Enter  email"
                    id="username"
                    type="text"
                    className="validate"
                    required
                    onChange={e => this.setState({ email: e.target.value })}
                  />
                  <label
                    className=" light-blue-text text-darken-4"
                    htmlFor="first_name"
                  >
                    Enter email
                  </label>
                  <button
                    className="btn waves-effect waves-light  light-blue darken-4    "
                    type="submit"
                    name="action"
                  >
                    Send my otp
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="row" hidden={!this.state.emailhidden}>
            <form className="col s12" onSubmit={this.onsubmitotp}>
              <div className="row ">
                <div className="input-field col s4 offset-s3 homeusernametextin ">
                  <input
                    placeholder="Enter  otp"
                    id="username"
                    type="number"
                    required
                    className="validate"
                    onChange={e => this.setState({ otp: e.target.value })}
                  />
                  <label htmlFor="first_name">Enter OTP</label>

                  <div>
                    <span>
                      {this.state.timer < 0 && "resend OTP"} {this.state.timer}
                    </span>
                  </div>

                  <button
                    className="btn waves-effect waves-light"
                    type="submit"
                    name="action"
                  >
                    confirm
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
