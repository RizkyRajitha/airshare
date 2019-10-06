import React, { Component } from "react";

import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar/navbar";
import Altert from "../../components/altert";
import Footer from "../../components/footer/footer";
// import "./css/main.css";
// import "./landingpage.css";
import "./forgotpassoword.css";

class Forgotpassword extends Component {
  state = { email: "", alerthidden: true, alertext: "", alertaction: "" };

  onsubmit = e => {
    e.preventDefault();

    axios
      .post("/auth/forgotpassword", { email: this.state.email })
      .then(result => {
        console.log(result.data);

        if (result.data.msg === "success") {
          document.getElementById("email").value = "";

          this.setState({
            alerthidden: false,
            alertext: "password reset link send successfully",
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
                {" "}
                Oops forgot your password don't worry we got you covered{" "}
              </h4>
            </div>

            <div className="informmforgotpassword">
              <br />

              <form onSubmit={this.onsubmit}>
                <br />
                <br />
                <br />

                <div className="input-field">
                  <input
                    id="email"
                    required
                    type="email"
                    name="email"
                    className="inputforgotpassword"
                    onChange={e => this.setState({ email: e.target.value })}
                  />
                  <label className="forgotpasswordinputlabel" for="email">
                    Email
                  </label>
                </div>

                <div className="submit">
                  <input
                    type="submit"
                    className="btn forgotpasswordbtn"
                    value="recover my account"
                  />
                </div>
              </form>

              <br />
              <br />

              <div className="haveaccc">
                still not sure how to recover
                <Link to="/signup">
                  <span> </span>{" "}
                  <a className="ladinpageatag">contact support</a>
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

export default Forgotpassword;
