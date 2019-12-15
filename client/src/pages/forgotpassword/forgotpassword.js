import React, { Component } from "react";

import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/components/navbar";
import Altert from "../../components/altert";
import Footer from "../../components/footer/footer";
import "./forgotpassoword.scoped.css";
const jwt = require("jsonwebtoken");
class Forgotpassword extends Component {
  state = { email: "", alerthidden: true, alertext: "", alertaction: "" };

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

    axios
      .post("/auth/forgotpassword", { email: this.state.email })
      .then(result => {
        console.log(result.data);

        if (result.data.msg === "success") {
          document.getElementById("email").value = "";

          this.setState({
            alerthidden: false,
            alertext:
              "password reset link send successfully , This link will only valid for 10 minutes",
            alertaction: "success"
          });
        } else if (result.data.msg === "nouser") {
          this.setState({
            alerthidden: false,
            alertext:
              "No user found .Please make sure the email you entered is valid",
            alertaction: "danger"
          });
        }
      })
      .catch(err => {
        console.log(err);
      });

    // console.log(this.props.params.token);
  };

  render() {
    return (
      <div className="">
        <Navbar />

        <div className="text-center">
          <div className="container">
            <form className="form-signin" onSubmit={this.onsubmit}>
              <img
                className="mb-4"
                src="https://img.icons8.com/nolan/64/000000/share.png"
                alt=""
                width={72}
                height={72}
              />
              <h1 className="h3 mb-3 font-weight-normal">
                Forgot your password don't worry we got you covered
              </h1>
              <label htmlFor="inputEmail" className="sr-only">
                Email address
              </label>

              <input
                id="email"
                required
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                onChange={e => this.setState({ email: e.target.value })}
                autofocus
              />
              <div
                className={"container saga" + this.state.alertaction}
                hidden={this.state.alerthidden}
              >
                <span className="">{this.state.alertext}</span>
              </div>
              <button
                className="btn btn-lg btn-primary btn-block forgotpasswordbtn"
                type="submit"
              >
                Recover my account
              </button>
              {/* <p className="mt-5 mb-3 text-muted ">© 2017-2019</p> */}

              <div className=" text-left mb-3 contactsupporttag">
                Still not sure how to recover{" "}
                <a href="https://rizkyrajitha.github.io/">contact support</a>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Forgotpassword;
