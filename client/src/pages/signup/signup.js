import React, { Component } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/navbar";
import Altert from "../../components/altert";
import Footer from "../../components/footer/footer";
import "./signup.css";
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
    alertaction: ""
  };

  onsubmit = e => {
    e.preventDefault();

    console.log(this.state);

    var payload = {
      email: this.state.email,
      firstName: this.state.firstaName,
      lastName: this.state.lastName,
      phone: this.state.phone,
      username: this.state.username,
      password: this.state.password
    };

    axios
      .post("/reg/signup", payload)
      .then(res => {
        console.log(res.data);
        this.props.history.push("/dashboard");
      })
      .catch(err => {
        console.log(err);
        if (err.response.data.msg === "dupuser") {
          this.setState({
            alerthidden: false,
            alertext: "Error This email is in use",
            alertaction: "danger"
          });
        }
      });
  };

  chechusername = uname => {
    console.log(uname);
    var usernsmae = new String(uname);
    if (usernsmae.length < 5) {
      // document
      //   .getElementById("signupusername")
      // .setAttribute("data-error", "username too short");
    } else {
      // document.getElementById("signupusername").removeAttribute("data-error");
      console.log("check username");
      axios
        .post("/reg/chechusername", { username: uname })
        .then(res => {
          console.log(res.data);
          if (res.data.msg === "valid") {
            this.setState({ unamevlid: true }); //data-error="wrong" data-success="right"
            // document
            //   .getElementById("signupusername")
            //   .setAttribute("data-success", "username valid");
          } else if (res.data.msg === "invalid") {
            this.setState({ unamevlid: false });
            // document
            //   .getElementById("signupusername")
            //   .setAttribute("data-error", "invalid username");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    return (
      <div className="maindivsignup">
        <Navbar />
        <div className="wrappersignup">
          <div className="form-wrappersignup">
            <h2 className="signupheading">Signup</h2>
            <div className="informmsignup">
              <form onSubmit={this.onsubmit}>
                <div class="row">
                  <div class="input-field ">
                    <input
                      id="email"
                      type="text"
                      class="validate inputsignup inputsignup"
                      onChange={e => this.setState({ email: e.target.value })}
                    />
                    <label className="logininputlabel" for="email">
                      email
                    </label>
                  </div>
                </div>

                <div class="row">
                  <div class="input-field ">
                    <input
                      // placeholder="Placeholder"
                      id="first_name"
                      type="text"
                      class="validate inputsignup"
                      onChange={e =>
                        this.setState({ firstaName: e.target.value })
                      }
                    />
                    <label className="logininputlabel" for="first_name">
                      First Name
                    </label>
                  </div>
                </div>

                <div class="row">
                  <div class="input-field ">
                    <input
                      // placeholder="Placeholder"
                      id="lastname"
                      type="text"
                      class="validate inputsignup"
                      onChange={e =>
                        this.setState({ lastName: e.target.value })
                      }
                    />
                    <label className="logininputlabel" for="lastname">
                      Last Name
                    </label>
                  </div>
                </div>

                <div class="row">
                  <div class="input-field ">
                    {/* <img
                      class="material-icons prefix"
                      src="https://img.icons8.com/color/48/000000/cancel--v1.png"
                    />
                    <img src="https://img.icons8.com/color/27/000000/ok--v2.png"></img> */}

                    <input
                      id="username"
                      type="text"
                      class="validate inputsignup"
                      minLength="6"
                      onChange={e => {
                        this.setState({ username: e.target.value });
                        this.chechusername(e.target.value);
                      }}
                    />
                    <label className="logininputlabel" for="username">
                      Username
                    </label>
                    <span
                      hidden={this.state.unamevlid}
                      // id="signupusername"
                      class="helper-text"
                    >
                      invalid usernaame
                    </span>
                    <span
                      hidden={!this.state.unamevlid}
                      // id="signupusername"
                      class="helper-text"
                    >
                      valid usernaame
                    </span>
                  </div>
                </div>
                <div class="row">
                  <div class="input-field ">
                    <input
                      // placeholder="Placeholder"
                      id="password"
                      type="password"
                      class="validate inputsignup"
                      onChange={e =>
                        this.setState({ password: e.target.value })
                      }
                    />
                    <label className="logininputlabel" for="password">
                      password
                    </label>
                  </div>
                </div>
                <div class="row">
                  <div class="input-field ">
                    <input
                      // placeholder="Placeholder"
                      id="phone"
                      type="text"
                      class="validate inputsignup"
                      onChange={e => this.setState({ phone: e.target.value })}
                    />
                    <label className="logininputlabel" for="phone">
                      phone number
                    </label>
                  </div>
                </div>
                <button
                  className="btn waves-effect waves-light  light-blue darken-4    "
                  type="submit"
                  name="action"
                >
                  Signup
                </button>
              </form>
            </div>{" "}
          </div>
        </div>{" "}
        <Footer />
      </div>
    );
  }
}

export default Signup;
