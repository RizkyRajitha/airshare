import React, { Component } from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";

import "./landingpage.css";
const jwt = require("jsonwebtoken");
class Landingpage extends Component {
  componentDidMount() {
    var token = localStorage.getItem("jwt");

    try {
      var decode = jwt.verify(token, "authdemo");
      this.props.history.push("/dashboard");
    } catch (error) {}
  }

  render() {
    return (
      <div className="maindivlandingpage">
        <Navbar />
        <main>
          <section className="firstseclandingpagebr"></section>
          <section className="firstseclandingpage">
            <div className="intro">
              <div className="intro-heading">
                <h2 className="intro-headingh2">
                  Cool new way of accessing
                  <br /> Your files around the world
                </h2>
                <div className="landingpagepara">
                  <br />
                  We make sure you can access your files through any platfrom
                  without compromising your passwords
                </div>
              </div>
              <button
                onClick={() => this.props.history.push("/signup")}
                className="landingpagebtn"
              >
                Sneek a Peek 👀
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }
}

export default Landingpage;
