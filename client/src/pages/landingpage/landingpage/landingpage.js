import React, { Component } from "react";
// import { Redirect, Link } from "react-router-dom";
// import Navbar from "../../components/navbar";

// import Navbar from "../../components/navbar/navbar";

import Footer from "../../../components/components/footer";
import Navbar from "../../../components/components/navbar";
import Fade from "react-reveal/Fade";
import Slide from "react-reveal/Slide";
// const jsonwebtoken = require("jsonwebtoken");
import "./main.scoped.css";
import "./animate.scoped.css";
import "./responsive.scoped.css";
const img = require("./dashboard.PNG");
const img2 = require("./qqqqqqqqqqqqq.PNG");

class Share extends Component {
  render() {
    return (
      <div>
        {/* Header Area wrapper Starts */}
        <header id="header-wrap">
          <Navbar />

          {/* Hero Area Start */}
          <div id="hero-area" className="hero-area-bg">
            <div className="overlay" />
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="contents text-center">
                    <Fade bottom distance={"30%"}>
                      <h2 className="head-title landingtitle">
                        A new way of accessing your files
                        <br />
                        Without compromising your passwords
                      </h2>
                    </Fade>
                    <Fade Fade bottom distance={"30%"} delay={300}>
                      <div className="header-button " data-wow-delay="0.3s">
                        <a href="/signup" className="btn btn-common">
                          Check it out
                        </a>
                      </div>
                    </Fade>
                  </div>
                  <Fade Fade bottom distance={"30%"} delay={600}>
                    <div
                      className="img-thumb text-center wow fadeInUp"
                      data-wow-delay="0.6s"
                    >
                      <img className="img-fluid" src={img2} alt="" />
                    </div>
                  </Fade>
                </div>
              </div>
            </div>
          </div>
          {/* Hero Area End */}
        </header>
        {/* Header Area wrapper End */}
        {/* Services Section Start */}
        <section id="services" className="section-padding">
          <div className="container">
            <div className="section-header text-center">
              <h2
                className="section-title wow fadeInDown"
                data-wow-delay="0.3s"
              >
                Why we are Unique
              </h2>
            </div>
            <div className="row">
              {/* Services item */}
              <div className="col-md-6 col-lg-4 col-xs-12">
                <div
                  className="services-item wow fadeInRight"
                  data-wow-delay="0.3s"
                >
                  <div className="icon">
                    <Slide left={true} delay={300}>
                      <img src="https://img.icons8.com/carbon-copy/100/000000/share.png" />
                      {/* <i className="lni-cog" /> */}
                    </Slide>
                  </div>
                  <div className="services-content">
                    <h3>
                      <a>Share Files instantly</a>
                    </h3>
                    <p>
                      You can upload your files to our platform and share them
                      instantly. with our efficient cloud services, file sharing
                      is never been better
                    </p>
                  </div>
                </div>
              </div>
              {/* Services item */}
              <div className="col-md-6 col-lg-4 col-xs-12">
                <div
                  className="services-item wow fadeInRight"
                  data-wow-delay="1.5s"
                >
                  <div className="icon">
                    <Slide left={true} delay={400}>
                      <img src="https://img.icons8.com/ios-filled/100/000000/lock-orientation.png" />
                      {/* <i className="lni-mobile" /> */}
                    </Slide>
                  </div>
                  <div className="services-content">
                    <h3>
                      <a>Secured with 2FA</a>
                    </h3>
                    <p>
                      Our primary concern is to protect user privacy.So we
                      introduce Guest login. with Guest login, you can securely
                      log in as guest to your account using
                      two-factor-authentication, without using the password.
                    </p>
                  </div>
                </div>
              </div>
              {/* Services item */}
              <div className="col-md-6 col-lg-4 col-xs-12">
                <div
                  className="services-item wow fadeInRight"
                  data-wow-delay="1.8s"
                >
                  <div className="icon">
                    <Slide left={true} delay={500}>
                      <img src="https://img.icons8.com/ios/100/000000/cloud.png" />
                    </Slide>
                  </div>
                  <div className="services-content">
                    <h3>
                      <a>Drive is better</a>
                    </h3>
                    <p>
                      Using Drive is awesome.But not always reliable.you could
                      compromise your valuable account because of one bad login.
                      With AIRSHARE, you can securely share your files without
                      bothering about your passwords.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Services Section End */}
        {/* Feature Section Start */}
        {/* <div id="feature">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="text-wrapper">
                  <div>
                    <h2
                      className="title-hl wow fadeInLeft"
                      data-wow-delay="0.3s"
                    >
                      Learn More About Us
                    </h2>
                    <div className="row">
                      <div className="col-md-6 col-sm-6">
                        <div
                          className="features-box wow fadeInLeft"
                          data-wow-delay="0.3s"
                        >
                          <div className="features-icon">
                            <i className="lni-layers" />
                          </div>
                          <div className="features-content">
                            <h4>Bootstrap 4</h4>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicing elit. Veniam tempora quidem vel sint.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-6">
                        <div
                          className="features-box wow fadeInLeft"
                          data-wow-delay="0.6s"
                        >
                          <div className="features-icon">
                            <i className="lni-briefcase" />
                          </div>
                          <div className="features-content">
                            <h4>100% Free</h4>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicing elit. Veniam tempora quidem vel sint.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-6">
                        <div
                          className="features-box wow fadeInLeft"
                          data-wow-delay="0.9s"
                        >
                          <div className="features-icon">
                            <i className="lni-cog" />
                          </div>
                          <div className="features-content">
                            <h4>Responsive</h4>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicing elit. Veniam tempora quidem vel sint.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-6">
                        <div
                          className="features-box wow fadeInLeft"
                          data-wow-delay="1.2s"
                        >
                          <div className="features-icon">
                            <i className="lni-leaf" />
                          </div>
                          <div className="features-content">
                            <h4>Easy to Use</h4>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicing elit. Veniam tempora quidem vel sint.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-sm-12 padding-none">
                <div className="feature-thumb">
                  <img src={img3} className="" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* Feature Section End */}
        {/* Footer Section Start */}
        <Footer />
        {/* Footer Section End */}
        {/* <section id="copyright">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <p>Copyright © 2018 UIdeck All Right Reserved</p>
              </div>
            </div>
          </div>
        </section> */}
      </div>
    );
  }
}

export default Share;
