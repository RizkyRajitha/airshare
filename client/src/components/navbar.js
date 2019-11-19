import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./navbar.css";
class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        {/* <div className="container"> */}
        <a className="navbar-brand" href="#">
          <img
            onClick={() => this.props.history.push("/")}
            classNameName="logonamenavbar"
            src="https://img.icons8.com/nolan/64/000000/share.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
        </a>{" "}
        <div className="mx-auto order-0">
          <a className="navbar-brand mx-auto" href="/">
            AIRSHARE <span className="">BETA v1.0</span>
          </a>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item ">
              <a className="nav-link disabled" href="#">
                {this.props.username}
              </a>
            </li>
            <li className="nav-item ">
              <a className="nav-link" href="#">
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => {
                  localStorage.removeItem("jwt");
                  this.props.history.push("/");
                }}
                href="#"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
        {/* </div> */}
      </nav>
    );
  }
}

export default withRouter(Navbar);

{
  /* <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/api">
          <img
            onClick={() => this.props.history.push("/")}
            classNameName="logonamenavbar"
            src="https://img.icons8.com/nolan/64/000000/share.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
        </a>

        <div className="mx-auto order-0">
          <a className="navbar-brand mx-auto" href="/">
            AIRSHARE
          </a>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        
        <div className="navbar-collapse collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item ">
              <a className="nav-link" href="#">
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => {
                  localStorage.removeItem("jwt");
                  this.props.history.push("/");
                }}
                href="#"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav> */
}

{
  /* <nav classNameName="navbardashboards">
        <div classNameName=" nav-wrapper  ">
          <img
            onClick={() => this.props.history.push("/")}
            classNameName="logonamenavbar"
            src="https://img.icons8.com/nolan/64/000000/share.png"
          />

          <a href="/" className="brand-logo center">
            AIR SHARE
          </a>

          <ul id="nav-mobile" classNameName="right hide-on-med-and-down">
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
      </nav> */
}
