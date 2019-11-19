import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <header>
        <div className="landingpagelogo">
          <img
            onClick={() => this.props.history.push("/")}
            className="logonamelandingpage"
            src="https://img.icons8.com/nolan/64/000000/share.png"
          />
          <span className="landigpageversionspan">BETA v1.0</span>
        </div>
        <div className="landingpagbrnav">
          {/* <h4 className="logonamelandingpage">Logo</h4> */}
        </div>
        <nav className="landingpagenavbar">
          <ul className=" list-unstyled landingpagenavlinks">
            {/* <li
              className="landingpagenavlink"
              onClick={() => this.props.history.push("/")}
            >
              home
            </li> */}
            <li
              className="landingpagenavlink"
              onClick={() => this.props.history.push("/login")}
            >
              Login
            </li>
            <li
              className="landingpagenavlink"
              onClick={() => this.props.history.push("/guestlogin")}
            >
              Guest login
            </li>
            <li
              className="landingpagenavlink"
              onClick={() => this.props.history.push("/signup")}
            >
              signup
            </li>
            <li
              className="landingpagenavlink"
              onClick={() => window.open("https://rizkyrajitha.github.io/")}
            >
              about us
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default withRouter(Navbar);
