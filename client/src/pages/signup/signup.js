import React, { Component } from "react";
import axios from "axios";
import Navbar from "../../components/components/navbar";
import Altert from "../../components/altert";
import Footer from "../../components/footer/footer";
import "./signup.scoped.css";

const jwt = require("jsonwebtoken");
class Signup extends Component {
  state = {
    email: "",
    firstaName: "",
    lastName: "",
    phone: "",
    username: "",
    password: "",
    alerthidden: true,
    alertext: "",
    alertaction: "",
    unamevlid: null,
    confirmemail: false,
    invitecode: ""
  };
  componentDidMount() {
    var token = localStorage.getItem("jwt");

    try {
      var decode = jwt.verify(token, "authdemo");
      this.props.history.push("/dashboard");
    } catch (error) {}
  }
  onsubmit = e => {
    e.preventDefault();

    this.setState({
      alerthidden: true,
      alertext: "",
      alertaction: ""
    });

    console.log(this.state);

    var payload = {
      email: this.state.email,
      firstName: this.state.firstaName,
      lastName: this.state.lastName,
      phone: this.state.phone,
      username: this.state.username,
      password: this.state.password,
      invitecode: this.state.invitecode
    };

    axios
      .post("/reg/signup", payload)
      .then(res => {
        console.log(res.data.msg);

        if (res.data.msg === "dupuser") {
          this.setState({
            alerthidden: false,
            alertext: "Error This email is in use",
            alertaction: "danger"
          });
        } else if (res.data.msg === "BucketAlreadyExists") {
          this.setState({
            alerthidden: false,
            alertext: "Error This Username is unavailable",
            alertaction: "danger"
          });
        } else if (res.data.msg === "invalidinvite") {
          this.setState({
            alerthidden: false,
            alertext: "Error This Invite code is unavailable",
            alertaction: "danger"
          });
        } else {
          // this.setState({ confirmemail: true });
          this.props.history.push("/login");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  chechusername = uname => {
    console.log(uname);
    var usernsmae = new String(uname);
    if (usernsmae.length < 8) {
      this.setState({ unamevlid: false });
    } else {
      if (uname.indexOf(" ") >= 0) {
        this.setState({ unamevlid: false });
      } else {
        console.log("check username");
        axios
          .post("/reg/chechusername", { username: uname })
          .then(res => {
            console.log(res.data);
            if (res.data.msg === "valid") {
              this.setState({ unamevlid: true }); //data-error="wrong" data-success="right"
            } else if (res.data.msg === "invalid") {
              this.setState({ unamevlid: false });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }

      // document.getElementById("signupusername").removeAttribute("data-error");
    }
  };

  render() {
    return (
      <div className="">
        <Navbar />
        <div className="container">
          {" "}
          {/* <Altert
            action={this.state.alertaction}
            text={this.state.alertext}
            hiddenalert={this.state.alerthidden}
          /> */}
          <form className="form-signin" onSubmit={this.onsubmit}>
            <h1 className="h3 mb-3 font-weight-normal">Signup</h1>

            <div class="row">
              <div class="col-md-6 mb-3">
                <input
                  // placeholder="Placeholder"
                  id="first_name"
                  type="text"
                  className="form-control "
                  required
                  onChange={e => this.setState({ firstaName: e.target.value })}
                  placeholder="Enter your First name"
                />
              </div>
              <div class="col">
                <input
                  // placeholder="Placeholder"
                  id="lastname"
                  type="text"
                  required
                  className="form-control"
                  placeholder="Enter your Last Name"
                  onChange={e => this.setState({ lastName: e.target.value })}
                />{" "}
              </div>
            </div>

            <input
              id="email"
              type="email"
              required
              className="form-control "
              onChange={e => this.setState({ email: e.target.value })}
              placeholder="Enter your email"
            />

            <input
              id="username"
              type="text"
              required
              className={
                this.state.unamevlid
                  ? "form-control fominputsrows is-valid"
                  : this.state.unamevlid === null
                  ? "form-control fominputsrows "
                  : "form-control fominputsrows is-invalid"
              }
              minLength="8"
              placeholder="Enter your prefered username"
              onChange={e => {
                this.setState({ username: e.target.value });
                this.chechusername(e.target.value);
              }}
            />

            <input
              // placeholder="Placeholder"
              id="password"
              type="password"
              required
              className="form-control fominputsrows"
              placeholder="Enter your password"
              onChange={e => this.setState({ password: e.target.value })}
            />

            <input
              // placeholder="Placeholder"
              id="invitecode"
              type="text"
              required
              className="form-control fominputsrows"
              placeholder="Enter your Invite code"
              minLength="6"
              onChange={e => this.setState({ invitecode: e.target.value })}
            />

            <div className="form-group  pt-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="gridCheck1"
                  required
                />

                <span className="checkterms">
                  {" "}
                  I accept the
                  <a className="privarcypolicyanchor" href="/privacypolicy">
                    {" "}
                    Privacy Policy{" "}
                  </a>
                </span>
              </div>
            </div>
            <div className="container error" hidden={this.state.alerthidden}>
              <span className="">{this.state.alertext}</span>
            </div>
            <button
              className="btn btn-primary  signupbtn"
              type="submit"
              disabled={!this.state.unamevlid}
            >
              Signup
            </button>
          </form>
        </div>{" "}
        <Footer />
      </div>
    );
  }
}

export default Signup;
