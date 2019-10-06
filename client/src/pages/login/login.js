import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
// import Navbar from "../../components/navbar";
import Altert from "../../components/altert";
import "./login.css";
import axios from "axios";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";

class Login extends Component {
  state = {
    token: "",
    // email: "",
    // password: "",
    loggedIn: false,
    showError: false,
    showNullError: false,
    creaderror: false
  };

  changehandleremail = event => {
    this.setState({
      email: event.target.value
    });
  };

  changehandlerpass = event => {
    this.setState({
      password: event.target.value
    });
  };

  //   componentDidMount() {
  //     //M.toast({ html: "I am a toast!" });
  //     var jwt = localStorage.getItem("jwt");
  //     console.log("comp mount");
  //     console.log(jwt);
  //     try {
  //       var tk = jsonwebtoken.verify(jwt, "authdemo");
  //       if (tk) {
  //         console.log("loged in");
  //         this.setState({
  //           loggedIn: true,
  //           email: tk.email
  //         });
  //       }
  //     } catch (error) {
  //       console.log("not logged in" + error);

  //       this.setState({
  //         loggedIn: false
  //       });
  //     }
  //   }

  btn1handler = e => {
    e.preventDefault();

    // this.setState({ creaderror: true });
    console.log("cliking");

    if (this.state.email === "" || this.state.password === "") {
      console.log(this.state.email + "   " + this.state.password);
      // console.log("wtf");
      this.setState({
        loggedIn: false,
        showError: false,
        showNullError: true
      });
    } else {
      console.log("sending..............");
      console.log(this.state.email + this.state.password);

      axios
        .post("/auth/login", {
          email: this.state.email,
          password: this.state.password
        })
        .then(data => {
          console.log("awe mewwa - - -popopopopo");
          console.log(data);
          var body = data.data;

          if (body.msg === "success") {
            console.log("body - " + body);
            localStorage.setItem("jwt", body.token);

            this.props.history.push("/dashboard");

            this.setState({
              loggedIn: true,
              showError: false,
              showNullError: false
            });
          } else if (body.msg === "invalidcredentials") {
            this.setState({ creaderror: true });
          }
        })
        .catch(err => {
          //   M.toast({ html: "Invalid Credentials" });
          console.log("l>> err" + err);
          this.setState({
            loggedIn: false,
            showError: true,
            showNullError: false,
            creaderror: true
          });
        });
    }
  };

  render() {
    return (
      <div className="maindivlogin">
        <Navbar />
        <div className="wrapper">
          <div className="form-wrapper">
            <div className="headingwrapperlogin">
              <h3>Your files are excited to see you</h3>
            </div>

            <div className="informm">
              <br />

              <form onSubmit={this.btn1handler}>
                <br />
                <br />
                <br />

                <div className="input-field">
                  <input
                    id="email"
                    required
                    type="email"
                    name="email"
                    className="inputlogin"
                    onChange={this.changehandleremail}
                  />
                  <label className="logininputlabel" for="email">
                    Email
                  </label>
                </div>
                <div className="input-field">
                  <input
                    required
                    id="pass"
                    type="password"
                    name="pass"
                    className="inputlogin"
                    onChange={this.changehandlerpass}
                  />
                  <label className="logininputlabel" for="pass">
                    Password
                  </label>
                </div>
                <div className="submit">
                  <input
                    type="submit"
                    className="btn loginbtn"
                    value="sign in"
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

              <div>
                <Link to="/forgotpassword">
                  <a className="ladinpageatag">Forgotten password</a>
                </Link>
                <br />
              </div>
              <div className="haveaccc">
                still dont have a account
                <Link to="/signup">
                  <span> </span> <a className="ladinpageatag">signup</a>
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

export default Login;
