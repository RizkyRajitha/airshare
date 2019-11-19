import React, { Component } from "react";
import axios from "axios";
import Navbar from "../../components/navbar";
import Altert from "../../components/altert";
import "./dashboardlite.css";
import Modal from "react-modal";
import moments from "moment";
var FileDownload = require("js-file-download");
const jwt = require("jsonwebtoken");

const customStyles = {
  content: {
    width: "40%",
    height: "50%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

class Dashboardlite extends Component {
  state = {
    filedata: [],
    alerthidden: true,
    alertext: "",
    alertaction: "",
    resobj: "",
    modalIsOpen: false,
    newfoldername: "",
    currentpath: "/",
    hideprogressbar: true,
    sessionexptimestamp: "",
    remain: ""
  };

  componentDidMount() {
    var token = localStorage.getItem("jwtguest");

    try {
      var decode = jwt.verify(token, "authdemo");
      console.log(decode);
      // this.setState({ sessionexptimestamp: decode.exp });

      var date = new Date(decode.exp * 1000);

      var dato = new Date().toUTCString();

      var ddt = moments(date).format("YYYY-MM-DD HH:mm:ss");
      var ddtas = moments(dato).format("YYYY-MM-DD HH:mm:ss");

      console.log("ddt");
      console.log(ddt);
      var stst = moments.utc(
        moments(ddt).diff(moments(ddtas, "YYYY-MM-DD HH:mm:ss"))
      );

      var countdown = setInterval(() => {
        stst.subtract({ second: 1 });
        this.setState({ remain: stst.format("HH:mm:ss").slice(3, 8) });
        console.log(stst.format("HH:mm:ss"));

        if (stst.format("HH:mm:ss") === "00:00:00") {
          this.setState({
            alerthidden: false,
            alertext: "please login to continue",
            alertaction: "danger"
          });
          this.props.history.push("/guestlogin");
          clearInterval(countdown);
        }
      }, 1000);

      var expstr = stst.format("HH:mm:ss");

      console.log(expstr);

      // .format("HH:mm:ss");
      console.log("diff");
      console.log(stst.minute());
      console.log(stst.second());
      // console.log(stst.second());
    } catch (error) {
      this.setState({
        alerthidden: false,
        alertext: "please login to continue",
        alertaction: "danger"
      });
      this.props.history.push("/guestlogin");
      // setTimeout(() => {
      //
      // }, 1000);
    }

    var config = {
      headers: { authorization: token }
    };

    var payload = {
      currentpath: this.state.currentpath
    };

    axios
      .post("/temp/getfolderinfo", payload, config)
      .then(result => {
        console.log(result.data);
        this.setState({ filedata: result.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getfolderdata = () => {
    var token = localStorage.getItem("jwtguest");

    var config = {
      headers: { authorization: token }
    };

    axios
      .get("/temp/getfolderinfo", config)
      .then(result => {
        var filedata = [];
        console.log(result.data);

        this.setState({ filedata: filedata });
      })
      .catch(err => {
        console.log(err);
      });
  };

  downloadfile = path => {
    this.setState({
      alerthidden: true,
      alertext: "",
      alertaction: ""
    });
    var token = localStorage.getItem("jwtguest");

    var config = {
      headers: { authorization: token }
    };

    var payload = {
      path: path
    };

    axios
      .post("/temp/gettemplink", payload, config)
      .then(res => {
        console.log(res.data.url);
        if (res.data.msg === "linkgenerated") {
          this.openPopUp(res.data.resurl);
          // window.open(res.data.resurl);
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          alerthidden: false,
          alertext: "error i dont know  ",
          alertaction: "danger"
        });
      });
  };

  openPopUp = urlToOpen => {
    var popup_window = window.open(
      urlToOpen,

      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=yes, width=400, height=400"
    );
    try {
      popup_window.focus();
    } catch (e) {
      this.setState({
        alerthidden: false,
        alertext:
          "Your browser blocked downloading resource file please visit " +
          urlToOpen,
        alertaction: "danger"
      });
    }
  };

  allowaccess = (path, type, allowstate) => {
    console.log(path);

    console.log(this.state);

    var jwt = localStorage.getItem("jwt");
    var config = {
      headers: {
        authorization: jwt
      }
    };

    var payload = {
      path: path,
      type: type,
      setallow: !allowstate
    };

    axios
      .post("/api/allowaccess", payload, config)
      .then(result => {
        console.log(result.data);
        this.getfolderdata();
      })
      .catch(err => {
        console.log(err);
      });
  };

  fileuploaddindicater = (orisize, eventsize) => {
    this.setState({ hideprogressbar: false });
    console.log(eventsize / orisize);
    var width = (eventsize / orisize) * 100;
    var elem = document.getElementById("myBar");
    elem.style.width = width + "%";
    // var id = setInterval(frame, 10);

    console.log(width);

    if (width > 100) {
      console.log("finish");
      this.setState({ hideprogressbar: true });
    }
  };

  uploadfile = e => {
    this.setState({ resobj: e.target.files[0] });
    console.log(e.target.files);

    console.log(this.state.currentpath);

    const formdata = new FormData();
    formdata.append("resobj", e.target.files[0]);
    formdata.append("path", this.state.currentpath);
    //
    var filesize = e.target.files[0].size;
    var jwt = localStorage.getItem("jwtguest");
    var config = {
      onUploadProgress: progressEvent =>
        this.fileuploaddindicater(filesize, progressEvent.loaded),
      headers: {
        "content-type": "multipart/form-data",
        authorization: jwt
      }
    };
    axios
      .post("/temp/fileupload", formdata, config)
      .then(result => {
        console.log(result.data);
        if (result.data.msg === "success") {
          this.getfolderdata();
          this.setState({
            alerthidden: false,
            alertext: "file successfully uploaded",
            alertaction: "success"
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <Navbar type="dashboardlite" useractive="true" />
        <div className="container xl dashboardmain">
          <Altert
            action={this.state.alertaction}
            text={this.state.alertext}
            hiddenalert={this.state.alerthidden}
          />

          <div className="contentdivdashboardlite">
            <div className="timeremain">
              {" "}
              Time remaining 💣 : {this.state.remain}
            </div>

            <input
              type="file"
              name="resobj"
              onChange={this.uploadfile}
              className="dashfileinputtemp"
              id="customFile"
              multiple
            />
            <label
              class="btn btn-primary fileuploadbtndashlite "
              for="customFile"
            >
              <i class="fas fa-file-upload"></i>
            </label>
          </div>
          <div hidden={this.state.hideprogressbar} id="myProgress">
            <div id="myBar"></div>
          </div>

          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">item type</th>
                <th scope="col">Item Name</th>
                <th scope="col">Item last modified</th>
                <th scope="col">Item size</th>
                <th scope="col"></th>
                {/* <th scope="col"></th> */}
              </tr>
            </thead>
            <tbody>
              {this.state.filedata.map(ele => {
                // console.log(ele);

                return (
                  <tr>
                    <td>
                      <img src="https://img.icons8.com/color/48/000000/file.png"></img>
                    </td>
                    <td>{ele.Key}</td>
                    <td>
                      {moments(
                        ele.LastModified,
                        "YYYY-MM-DD HH:mm:ssZ"
                      ).fromNow()}
                    </td>
                    <td>{(ele.Size / 1024 / 1024).toFixed(2) + " Mb"}</td>
                    <td>
                      {" "}
                      <button
                        className="btn btn-primary "
                        onClick={() => {
                          this.downloadfile(ele.Key);
                        }}
                      >
                        Download
                      </button>{" "}
                    </td>
                    {/* <td>
                      <button
                        className="btn btn-primary "
                        onClick={() => {
                          this.allowaccess(ele.contentid, ele.allowaccess);
                        }}
                      >
                        {ele.allowaccess ? "revoke " : "allow access"}
                      </button>{" "}
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {this.state.filedata.length === 0 ? "No files to show " : ""}
        </div>
      </div>
    );
  }
}

export default Dashboardlite;
