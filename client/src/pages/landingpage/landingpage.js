import React, { Component } from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
// import "./css/main.css";
// import "./landingpage.css";
import "./landingpage.css";
class Landingpage extends Component {
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
                  cool new way of accessing
                  <br /> your files around the world
                </h2>
                <p className="landingpagepara">
                  we make sure you can access your files through your platfrom
                  without compromising your password
                </p>
              </div>
              <button
                onClick={() => this.props.history.push("/signup")}
                className="landingpagebtn"
              >
                Sneek a peek
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


