import React, { Component } from "react";
import "./altert.css";
class Altert extends Component {
  render() {
    return (
      <div
        hidden={this.props.hiddenalert}
        className={`bootsrtapaltert ${this.props.action}`}
      >
        {this.props.text}
      </div>
    );
  }
}

export default Altert;
