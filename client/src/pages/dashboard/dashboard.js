import React, { Component } from "react";
import axios from "axios";
import Navbar from "../../components/navbar";
import Altert from "../../components/altert";
import "./dashboard.css";
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

class Dashboard extends Component {
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
    filenamelist: [],
    username: "",
    spaceused: "",
    fileuploadprogress: 0,
    deleting: false,
    isloading: false
  };

  componentDidMount() {
    var token = localStorage.getItem("jwt");

    try {
      var decode = jwt.verify(token, "authdemo");
    } catch (error) {
      this.setState({
        alerthidden: false,
        alertext: "please login to continue",
        alertaction: "danger"
      });

      this.props.history.push("/");
    }

    var config = {
      headers: { authorization: token }
    };
    this.setState({ isloading: true });
    axios
      .get("/api/userdata", config)
      .then(result => {
        console.log(result.data);
        this.setState({
          username: result.data.name,
          spaceused: result.data.storage
        });
      })
      .catch(err => {
        console.log(err);
      });

    axios
      .get("/api/getfolderinfo", config)
      .then(result => {
        console.log(result.data);

        this.setState({ filedata: result.data });
        var filenames = [];
        result.data.forEach(element => {
          filenames.push(element.Key);
        });

        this.setState({ filenamelist: filenames, isloading: false });
      })
      .catch(err => {
        this.setState({ isloading: false });
        console.log(err);
      });
  }

  getuserdata = () => {
    var token = localStorage.getItem("jwt");

    var config = {
      headers: { authorization: token }
    };
    this.setState({ isloading: true });
    axios
      .get("/api/userdata", config)
      .then(result => {
        console.log(result.data);
        this.setState({
          username: result.data.name,
          spaceused: result.data.storage,
          isloading: false
        });
      })
      .catch(err => {
        this.setState({ isloading: false });
        console.log(err);
      });
  };

  getfolderdata = () => {
    var token = localStorage.getItem("jwt");

    var config = {
      headers: { authorization: token }
    };
    this.setState({ isloading: true });
    axios
      .get("/api/getfolderinfo", config)
      .then(result => {
        var filedata = [];
        console.log(result.data);

        var filenames = [];
        result.data.forEach(element => {
          filenames.push(element.Key);
        });

        this.setState({
          filedata: result.data,
          filenamelist: filenames,
          isloading: false
        });
      })
      .catch(err => {
        this.setState({ isloading: false });
        console.log(err);
      });
  };

  downloadfile = path => {
    this.setState({
      alerthidden: true,
      alertext: "",
      alertaction: ""
    });
    var token = localStorage.getItem("jwt");

    var config = {
      headers: { authorization: token }
    };

    var payload = {
      path: path
    };
    this.setState({ isloading: true });
    axios
      .post("/api/gettemplink", payload, config)
      .then(res => {
        console.log(res.data.url);
        if (res.data.msg === "linkgenerated") {
          this.openPopUp(res.data.resurl);
          this.setState({ isloading: false });
          // window.open(res.data.resurl);
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          alerthidden: false,
          alertext: "error i dont know  ",
          alertaction: "danger",
          isloading: false
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

  allowaccess = (path, allowstate) => {
    console.log(path);
    console.log(allowstate);

    // console.log(this.state);
    this.setState({ isloading: true });
    var jwt = localStorage.getItem("jwt");
    var config = {
      headers: {
        authorization: jwt
      }
    };

    var payload = {
      path: path,
      setallow: !allowstate
    };

    axios
      .post("/api/allowaccess", payload, config)
      .then(result => {
        console.log(result.data);
        this.getfolderdata();
        this.setState({ isloading: false });
        // window.location.reload();
      })
      .catch(err => {
        this.setState({ isloading: false });
        console.log(err);
      });
  };

  fileuploaddindicater = (orisize, eventsize) => {
    this.setState({ hideprogressbar: false });
    console.log(eventsize / orisize);
    var width = (eventsize / orisize) * 100;
    this.setState({ fileuploadprogress: width });
    // var elem = document.getElementById("myBar");
    // elem.style.width = width + "%";

    console.log(width);

    if (width > 100) {
      console.log("finish");
      this.setState({ hideprogressbar: true });
    }
  };

  deletefile = (contentid, key) => {
    this.setState({
      alerthidden: true,
      alertext: "",
      alertaction: ""
    });
    console.log(key);
    console.log(contentid);
    var jwt = localStorage.getItem("jwt");
    var config = {
      headers: {
        authorization: jwt
      }
    };

    var payload = {
      contentid: contentid,
      key: key
    };

    this.setState({ deleting: true });
    this.setState({ isloading: true });
    axios
      .post("/api/deletefile", payload, config)
      .then(result => {
        this.getfolderdata();
        this.getuserdata();
        console.log(result);
        this.setState({
          alerthidden: false,
          alertext: key + " successfully deleted",
          alertaction: "success",
          isloading: false,
          deleting: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          alerthidden: false,
          alertext: key + " Error deleting file",
          alertaction: "danger",
          isloading: false,
          deleting: false
        });
      });
  };

  uploadfile = e => {
    this.setState({
      alerthidden: true,
      alertext: "",
      alertaction: ""
    });
    this.setState({ isloading: true });
    this.setState({ resobj: e.target.files[0] });
    console.log(e.target.files);

    // console.log(this.state.currentpath);

    const formdata = new FormData();

    var upname = [];
    var uploadsize = 0;
    for (let index = 0; index < e.target.files.length; index++) {
      const element = e.target.files[index];
      upname.push(element.name);
      uploadsize = uploadsize + element.size;
      formdata.append("resobj", element);
    }
    var dups = false;

    var remain = 100 * 1024 * 1024 - this.state.spaceused;

    var dupname = "";
    console.log(this.state.filenamelist, " ", upname);

    this.state.filenamelist.forEach(element => {
      for (let ele2 of upname) {
        console.log(element, " ", ele2);

        if (element === ele2) {
          console.log("duplicate uploads");
          dupname = element;
          dups = true;
          break;
        }
      }
    });

    console.log("kokok");

    // formdata.append("path", this.state.currentpath);
    //
    var filesize = e.target.files[0].size;
    var jwt = localStorage.getItem("jwt");
    var config = {
      onUploadProgress: progressEvent =>
        this.fileuploaddindicater(filesize, progressEvent.loaded),
      headers: {
        "content-type": "multipart/form-data",
        authorization: jwt
      }
    };

    if (!dups) {
      if (remain > uploadsize) {
        console.log("no dups ok!!!!!!");
        axios
          .post("/upload/uploadfileawss3", formdata, config)
          .then(result => {
            console.log(result.data);
            if (result.data.msg === "success") {
              this.getfolderdata();
              this.getuserdata();
              this.setState({
                alerthidden: false,
                alertext: "file successfully uploaded",
                alertaction: "success",
                isloading: false
              });
            } else if (result.data.msg === "lowspace") {
              this.getfolderdata();
              this.getuserdata();
              this.setState({
                alerthidden: false,
                alertext: "Low space",
                alertaction: "danger",
                isloading: false
              });
            }
          })
          .catch(err => {
            this.setState({ isloading: false });
            console.log(err);
          });
      } else {
        this.setState({
          alerthidden: false,
          alertext: ` Low Space `,
          alertaction: "danger",
          isloading: false
        });
      }
    } else {
      this.setState({
        alerthidden: false,
        alertext: `Duplicate files found please remove them and try again  "${dupname}" `,
        alertaction: "danger",
        isloading: false
      });
    }
  };

  render() {
    return (
      <div className="">
        <Navbar
          useractive="true"
          username={this.state.username}
          type="dashboard"
        />
        <div class="container">
          {/* <div class="row"> */}
          {/* <div class="col-md-12"> */}
          <Altert
            action={this.state.alertaction}
            text={this.state.alertext}
            hiddenalert={this.state.alerthidden}
          />

          {/* <input
            class="custom-file-input"
            id="inputGroupFile01"
            // required
            type="file"
            name="resobj"
            onChange={this.uploadfile}
          /> */}

          <div hidden={this.state.hideprogressbar} className="progress">
            <div
              class="progress-bar bg-success"
              role="progressbar"
              style={{ width: this.state.fileuploadprogress + "%" }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>

          {/* <div hidden={this.state.hideprogressbar} id="myProgress">
            <div id="myBar"></div>
          </div> */}
          <div className="dashboardbtngroup">
            <div>
              <span>
                space used : {(this.state.spaceused / 1024 / 1024).toFixed(3)}
                mb
              </span>{" "}
              {console.log(
                `${this.state.spaceused / (1024 * 1024).toFixed(1)}%`
              )}
              <div class="progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${this.state.spaceused / (1024 * 1024).toFixed(1)}%`
                  }}
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>

            <div className="spinnerdashboard">
              <div
                hidden={!this.state.isloading}
                className="spinner-border text-primary"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>

            <div className="dashboardbtnbr"></div>

            <input
              type="file"
              name="resobj"
              onChange={this.uploadfile}
              class="dashfileinput"
              id="customFile"
              multiple
            />
            <label class="btn btn-primary fileuploadbtn " for="customFile">
              <i class="fas fa-file-upload"></i>
            </label>
          </div>
          <div className="table-responsive">
            {" "}
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">item type</th>
                  <th scope="col">Item Name</th>
                  <th scope="col">Item last modified</th>
                  <th scope="col">Item size</th>
                  <th scope="col"></th> <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>

              <tbody>
                {this.state.filedata.map(ele => {
                  console.log(ele);

                  return (
                    <tr>
                      <td>
                        <img src="https://img.icons8.com/color/48/000000/file.png"></img>
                      </td>
                      <td className="tabledatanamedash">{ele.Key}</td>
                      <td>
                        {moments(
                          ele.LastModified,
                          "YYYY-MM-DD HH:mm:ssZ"
                        ).fromNow()}
                      </td>
                      <td>{(ele.Size / 1024 / 1024).toFixed(3) + " Mb"}</td>
                      <td>
                        {" "}
                        <button
                          disabled={this.state.deleting}
                          className="btn btn-primary "
                          onClick={() => {
                            this.downloadfile(ele.Key);
                          }}
                        >
                          Download
                        </button>{" "}
                      </td>
                      <td>
                        <button
                          disabled={this.state.deleting}
                          className={`btn ${
                            ele.allowaccess ? "btn-success" : "btn-warning "
                          } `}
                          onClick={() => {
                            this.allowaccess(ele.contentid, ele.allowaccess);
                          }}
                        >
                          {ele.allowaccess ? "Revoke access" : "Allow access "}
                        </button>{" "}
                      </td>
                      <td>
                        <button
                          disabled={this.state.deleting}
                          className={`btn btn-danger `}
                          onClick={() => {
                            this.deletefile(ele.contentid, ele.Key);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {this.state.filedata.length === 0 ? "No files to show " : ""}
          {/* </div> */}
          {/* </div> */}
        </div>
      </div>
    );
  }
}

export default Dashboard;
