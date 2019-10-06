import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class Footer extends Component {
  render() {
    return (
      <footer className="landingpagefooter">
        <div className="landingpagefooterdiv">
          <div className="landingpagefooterdivitembr"></div>
          <div className="landingpagefooterdivitem">
            <a className="landingpagefooterdivitemlink" href="/">
              {" "}
              contact us{" "}
            </a>
          </div>
          <div className="landingpagefooterdivitem">
            <a className="landingpagefooterdivitemlink" href="/">
              {" "}
              privacy policy
            </a>
          </div>
          <div className="landingpagefooterdivitem">
            <a className="landingpagefooterdivitemlink" href="/">
              {/* {" "} &#9749; */}
              buy me coffee ☕
            </a>
          </div>
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
