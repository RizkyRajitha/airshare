import React, { Component } from "react";
import "./altert.css";
class Altert extends Component {
  state = {
    comhide: false
  };
  componentDidMount() {
    if (!this.props.hiddenalert) {
      setInterval(() => {
        this.props.hiddenalert = true;
        this.setState({ comhide: true });
      }, 2000);
    }
  }

  render() {
    return (
      <div
        hidden={this.props.hiddenalert && this.state.comhide}
        className={`bootsrtapaltert ${this.props.action}`}
      >
        {this.props.text}
      </div>
    );
  }
}

export default Altert;
