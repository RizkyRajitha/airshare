import React, { Component } from "react";
// import { Redirect, Link } from "react-router-dom";
// import Navbar from "../../components/navbar";

// import Navbar from "../../components/navbar/navbar";
import "./footer.scoped.css";
const jsonwebtoken = require("jsonwebtoken");

class Footer extends Component {
  render() {
    return (
      <footer id="footer" className="footer-area section-padding">
        <div className="container">
          <div className="container">
            <div className="row">
              <div
                className="col-lg-3 col-md-6 col-sm-12 col-xs-12 wow fadeInUp"
                data-wow-delay="0.2s"
              >
                <div className="footer-logo">
                  <img
                    src="https://img.icons8.com/nolan/128/000000/share.png"
                    alt=""
                  />
                </div>
                <p>AIRSHARE.inc</p>
              </div>
              <div
                className="col-lg-3 col-md-6 col-sm-12 col-xs-12 wow fadeInUp"
                data-wow-delay="0.4s"
              >
                <h3 className="footer-titel"></h3>
                <ul>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              </div>
              <div
                className="col-lg-3 col-md-6 col-sm-12 col-xs-12 wow fadeInUp"
                data-wow-delay="0.6s"
              >
                <h3 className="footer-titel"></h3>
                <ul>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              </div>
              <div
                className="col-lg-3 col-md-6 col-sm-12 col-xs-12 wow fadeInUp"
                data-wow-delay="0.8s"
              >
                <h3 className="footer-titel">Find us on</h3>
                <div className="">
                  <a
                    className="facebook"
                    href="https://github.com/RizkyRajitha/airshare"
                  >
                    <i className="fab fa-github fa-3x"></i>{" "}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
