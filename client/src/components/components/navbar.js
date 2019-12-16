import React, { Component } from "react";
import "./navbar.scoped.css";
import "./responsive.scoped.css";
class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light">
        <div className="container">
          {/* Brand and toggle get grouped for better mobile display */}
          <div className="navbar-header">
            <div>
              <a href="/" className="navbar-brand">
                <img
                  src="https://img.icons8.com/nolan/64/000000/share.png"
                  alt=""
                />
              </a>
            </div>
            <div>
              <button
                className="navbar-toggler menuicon"
                type="button"
                data-toggle="collapse"
                data-target="#main-navbar"
                aria-controls="main-navbar"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <img src="https://img.icons8.com/material-sharp/24/000000/squared-menu.png"></img>
                {/* <img src="https://img.icons8.com/ios-glyphs/30/000000/menu.png"></img> */}
                {/* <img src="https://img.icons8.com/offices/30/000000/menu.png"></img> */}
                {/* <img src="https://img.icons8.com/metro/26/000000/menu.png"></img> */}
                {/* <span className="navbar-toggler-icon" /> */}
              </button>
            </div>
          </div>

          {/* <div className="navbar-header">
           
          </div> */}

          <div className="collapse navbar-collapse" id="main-navbar">
            <ul className="navbar-nav mr-auto w-100 justify-content-left ">
              <li className="nav-item ">
                <a className="nav-link" href="/login">
                  Login
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/signup">
                  Signup
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/guestlogin">
                  Guest
                </a>
              </li>
              {/* <li className="nav-item">
                <a className="nav-link" href="http://rizkyrajitha.github.io/">
                  About us
                </a>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;

/**
 * <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <div className="navbar-header">
              <a href="#" className="navbar-brand">
                <img
                  className="d-inline-block align-top logonamenavbar "
                  src="https://img.icons8.com/nolan/64/000000/share.png"
                  alt=""
                />
              </a>
            </div>
            <button
              className="navbar-toggler navbar-toggler-right"
              type="button"
              data-toggle="collapse"
              data-target="#main-navbar"
              aria-controls="main-navbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="main-navbar">
              <ul className="navbar-nav mr-auto mt-2 mt-md-0">
                <li className="nav-item ">
                  <a className="nav-link" href="#hero-area">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#services">
                    Services
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#feature">
                    feature
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#contact">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
 */

/***
 *
 */

/***
 *  <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          
          <div className="navbar-header">
            <a href="index.html" className="navbar-brandlanding">
              <img
                src="https://img.icons8.com/nolan/64/000000/share.png"
                alt=""
              />
            </a>
          </div>
          <button
            className="navbar-toggler navbar-toggler-right"
            type="button"
            data-toggle="collapse"
            data-target="#main-navbar"
            aria-controls="main-navbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="main-navbar">
            <ul className="navbar-nav mr-auto mt-2 mt-md-0">
              <li className="nav-item ">
                <a className="nav-link" href="#hero-area">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#services">
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#feature">
                  feature
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

      </nav>
 */
