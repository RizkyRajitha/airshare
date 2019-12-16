import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./fotter.scoped.css";

class Footer extends Component {
  render() {
    return (
      <footer className="landingpagefooter">
        <div className="landingpagefooterdiv">
          {/* <div className="landingpagefooterdivitembr"></div> */}
          <div className="landingpagefooterdivitem">
            <a
              className="landingpagefooterdivitemlink"
              href="http://rizkyrajitha.github.io/"
            >
              contact us  &nbsp;  &nbsp; &nbsp;
            </a>
          </div>
          <div className="landingpagefooterdivitem">
            <a className="landingpagefooterdivitemlink" href="/privacypolicy">
              privacy policy
            </a>
          </div>
          {/* <div className="landingpagefooterdivitem">
            <a className="landingpagefooterdivitemlink" href="/">
             
              buy me coffee ☕
            </a>
          </div> */}
          <div
            className="landingpagefooterdivitem"
            className="landingpagefooterdivitembr"
          ></div>
        </div>
      </footer>
    );
  }
}

export default withRouter(Footer);
