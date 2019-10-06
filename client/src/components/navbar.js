import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./navbar.css";
class Navbar extends Component {
  render() {
    return (
      <nav className="navbardashboards">
        <div className=" nav-wrapper  ">
          <img
            onClick={() => this.props.history.push("/")}
            className="logonamenavbar"
            src="https://img.icons8.com/nolan/64/000000/share.png"
          />

          <a href="/" class="brand-logo center">
            AIR SHARE
          </a>

          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>
              <a href="/signup">Settings</a>
            </li>

            <li hidden={this.props.useractive === "true" ? false : true}>
              <a
                onClick={() => {
                  if (this.props.type === "dashboard") {
                    localStorage.removeItem("tempotp");
                    localStorage.removeItem("jwt");
                  } else if (this.props.type === "dashboardlite") {
                    localStorage.removeItem("tempotp");
                    localStorage.removeItem("jwtguest");
                  }

                  this.props.history.push("/");
                }}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default withRouter(Navbar);
