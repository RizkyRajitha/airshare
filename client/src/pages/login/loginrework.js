import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./loginrework.css";
import axios from "axios";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";

class Loginnew extends Component {
  state = {
    token: "",
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
      <div className="maindivlogin ">
        <Navbar />
        <div class="row justify-content-center">
          <div class="col-sm-4">
            <form className="" onSubmit={this.btn1handler}>
              <div class="card">
                <article class="card-body">
                  <a
                    href="/signup"
                    class="float-right btn btn-outline-primary"
                  >
                    Sign up
                  </a>
                  <h4 class="card-title mb-4 mt-1">Sign in</h4>
                  <form>
                    <div class="form-group">
                      <label>Your email</label>
                      <input
                        name=""
                        class="form-control"
                        placeholder="Email"
                        type="email"
                      />
                    </div>
                    <div class="form-group">
                      <Link to="/forgotpassword">
                        <a class="float-right">Forgot password ?</a>
                      </Link>

                      <label>Your password</label>
                      <input
                        class="form-control"
                        placeholder="******"
                        type="password"
                      />
                    </div>

                    <div class="form-group">
                      <button type="submit" class="btn btn-primary btn-block">
                        {" "}
                        Login{" "}
                      </button>
                    </div>
                  </form>
                </article>
              </div>{" "}
            </form>

            {this.state.creaderror && (
              <div className="container">
                <div className="credeer">Invalid Creadentials</div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Loginnew;
