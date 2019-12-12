import React, { Component } from "react";
import axios from "axios";
import Navbar from "../../components/navbar";
import Altert from "../../components/altert";
import "./dashboardlite.css";
import moments from "moment";

import Modal from "react-responsive-modal";
import io from "socket.io-client";
import {
  remotecopyclientfunction,
  remoteuploadclientfunction
} from "./remotecopy";
const jwt = require("jsonwebtoken");

const api = "http://127.0.0.1:5000";

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)

class Dashboardlite extends Component {
  state = {
    id: "",
    filedata: [],
    alerthidden: true,
    alertext: "",
    alertaction: "",
    resobj: "",
    modalIsOpen: false,
    newfoldername: "",
    currentpath: "/",
    hideprogressbar: true,
    fileuploadprogress: 0,
    sessionexptimestamp: "",
    remain: "",
    allfiles: [],
    username: "",
    spaceused: "",
    isloading: false
  };
  openModel = () => {
    this.setState({ modelopen: true });
  };
  closeModel = () => {
    this.setState({ modelopen: false });
  };
  componentDidMount() {
    var token = localStorage.getItem("jwtguest");
    localStorage.removeItem("templogin");
    localStorage.removeItem("tempotp");
    var config = {
      headers: { authorization: token }
    };

    const socket = io(api, {
      transports: ["websocket"],
      upgrade: false
    });

    axios
      .get("/temp/userdata", config)
      .then(result => {
        console.log(result.data);
        this.setState({
          username: result.data.name,
          spaceused: result.data.storage,
          allfiles: result.data.allfiles,
          id: result.data.id
        });

        socket.on("remotecopyclient" + result.data.id, data => {
          console.log(data);
          this.setState({ shownotify: true, remotecopydata: data.text });
        });

        socket.on("filechange" + result.data.id, data => {
          this.getuserdata();
          this.getfolderdata();
          // console.log(data);
          // this.setState({ shownotify: true, remotecopydata: data.text });
        });
      })
      .catch(err => {
        this.setState({ isloading: false });
        console.log(err);
      });

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
    }
    this.setState({ isloading: true });
    axios
      .get("/temp/getfolderinfo", config)
      .then(result => {
        console.log(result.data);
        this.setState({ filedata: result.data, isloading: false });
      })
      .catch(err => {
        this.setState({ isloading: false });
        console.log(err);
      });
  }

  getfolderdata = () => {
    var token = localStorage.getItem("jwtguest");
    this.setState({ isloading: true });
    var config = {
      headers: { authorization: token }
    };

    axios
      .get("/temp/getfolderinfo", config)
      .then(result => {
        console.log(result.data);

        this.setState({ filedata: result.data, isloading: false });
      })
      .catch(err => {
        this.setState({ isloading: false });
        console.log(err);
      });
  };

  getuserdata = () => {
    var token = localStorage.getItem("jwtguest");

    var config = {
      headers: { authorization: token }
    };

    axios
      .get("/temp/userdata", config)
      .then(result => {
        console.log(result.data);
        this.setState({
          username: result.data.name,
          spaceused: result.data.storage,
          allfiles: result.data.allfiles
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
    var token = localStorage.getItem("jwtguest");

    var config = {
      headers: { authorization: token }
    };

    var payload = {
      path: path
    };
    this.setState({ isloading: true });

    axios
      .post("/temp/gettemplink", payload, config)
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

  uploadfilepresigned = e => {
    this.setState({
      alerthidden: true,
      alertext: "",
      alertaction: ""
    });

    this.setState({ isloading: true });
    this.setState({ resobj: e.target.files });
    console.log(e.target.files);
    var filestobeuploaded = e.target.files;
    var payload = [];
    var upname = [];
    var uploadsize = 0;
    for (let index = 0; index < e.target.files.length; index++) {
      const element = e.target.files[index];
      var temppayload = {
        name: element.name,
        size: element.size,
        type: element.type
      };
      upname.push(element.name);
      uploadsize = uploadsize + element.size;
      payload.push(temppayload);
    }
    var dups = false;

    var remain = 100 * 1024 * 1024 - this.state.spaceused;

    var dupname = "";
    console.log(this.state.allfiles, " ", upname);

    label: for (let element of this.state.allfiles) {
      for (let ele2 of upname) {
        console.log(element, " ", ele2);

        if (element === ele2) {
          console.log("duplicate uploads");
          dupname = element;
          dups = true;
          break label;
        }
      }
    }

    var jwt = localStorage.getItem("jwtguest");

    var config = {
      headers: {
        authorization: jwt
      }
    };

    if (!dups) {
      if (remain > uploadsize) {
        console.log("no dups ok!!!!!!");
        axios
          .post("/temp/fileupload", { fileset: payload }, config)
          .then(result => {
            console.log(result.data);
            if (result.data.msg === "success") {
              // this.getfolderdata();
              // this.getuserdata();

              console.log(result.data.urlarr);

              console.log(this.state.resobj);
              console.log(filestobeuploaded);

              for (let index = 0; index < filestobeuploaded.length; index++) {
                const element = filestobeuploaded[index];
                console.log(element);

                this.setState({
                  alerthidden: false,
                  alertext: "file " + index + " upload initiated",
                  alertaction: "success",
                  isloading: true
                });

                var config = {
                  onUploadProgress: progressEvent =>
                    this.fileuploaddindicater(
                      element.size,
                      progressEvent.loaded
                    ),
                  headers: {
                    "Content-Type": element.type
                  }
                };

                axios
                  .put(result.data.urlarr[index], element, config)
                  .then(result2 => {
                    this.getfolderdata();
                    this.getuserdata();
                    console.log(result2);
                    remoteuploadclientfunction({ id: this.state.id });
                    this.setState({
                      alerthidden: false,
                      alertext: "file " + index + " successfully uploaded",
                      alertaction: "success",
                      isloading: false
                    });
                  })
                  .catch(err => {
                    console.log(err);
                    this.setState({
                      alerthidden: false,
                      alertext: "file " + index + "  upload error",
                      alertaction: "danger",
                      isloading: false
                    });
                  });
              }
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

  uploadfile = e => {
    this.setState({
      alerthidden: true,
      alertext: "",
      alertaction: ""
    });

    this.setState({ resobj: e.target.files[0] });
    console.log(e.target.files);

    // console.log(this.state.currentpath);

    const formdata = new FormData();
    this.setState({ isloading: true });
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
    console.log(this.state.allfiles, " ", upname);

    this.state.allfiles.forEach(element => {
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
    var jwt = localStorage.getItem("jwtguest");
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
          .post("/temp/fileupload", formdata, config)
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
              // this.getfolderdata();
              // this.getuserdata();
              this.setState({
                alerthidden: false,
                alertext: "Low space",
                alertaction: "danger",
                isloading: false
              });
            }
          })
          .catch(err => {
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

  // uploadfile = e => {
  //   this.setState({ resobj: e.target.files[0] });
  //   console.log(e.target.files);

  //   console.log(this.state.currentpath);

  //   const formdata = new FormData();
  //   formdata.append("resobj", e.target.files[0]);
  //   formdata.append("path", this.state.currentpath);
  //   //
  //   var filesize = e.target.files[0].size;
  //   var jwt = localStorage.getItem("jwtguest");
  //   var config = {
  //     onUploadProgress: progressEvent =>
  //       this.fileuploaddindicater(filesize, progressEvent.loaded),
  //     headers: {
  //       "content-type": "multipart/form-data",
  //       authorization: jwt
  //     }
  //   };
  //   axios
  //     .post("/temp/fileupload", formdata, config)
  //     .then(result => {
  //       console.log(result.data);
  //       if (result.data.msg === "success") {
  //         this.getfolderdata();
  //         this.setState({
  //           alerthidden: false,
  //           alertext: "file successfully uploaded",
  //           alertaction: "success"
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };

  render() {
    return (
      <div>
        <Navbar
          type="dashboardlite"
          username={this.state.username}
          useractive="true"
        />
        <div className="container ">
          <Altert
            action={this.state.alertaction}
            text={this.state.alertext}
            hiddenalert={this.state.alerthidden}
          />
          <Modal
            // className="commentmodal"
            open={this.state.modelopen}
            onClose={this.closeModel}
            closeIconSize={20}
            styles={{ modal: { color: "black", width: "50%", height: "44%" } }}
            center
          >
            <div className="textsharemodalflexfiv">
              <span className="textshareheading">Start sharing text</span>

              <button
                className="btn btn-primary textsharemodalcopybtn"
                onClick={() => {
                  this.copyremoteshare();
                }}
              >
                <i className="far fa-copy"></i>
              </button>
            </div>

            <div class="form-group">
              <textarea
                id="remotecopytextarea"
                class="form-control"
                rows="6"
                value={this.state.remotecopydata}
                onChange={e =>
                  remotecopyclientfunction({
                    text: e.target.value,
                    uid: this.state.id
                  })
                }
              ></textarea>
            </div>
          </Modal>
          <div hidden={this.state.hideprogressbar} class="progress">
            <div
              class="progress-bar bg-success"
              role="progressbar"
              style={{ width: this.state.fileuploadprogress + "%" }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>

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
            </div>{" "}
            <div className="spinnerdashboard">
              <div
                hidden={!this.state.isloading}
                className="spinner-border text-primary"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
            <div className="timeremain">
              {" "}
              Time remaining 💣 : {this.state.remain}
            </div>{" "}
            <div className="dashboardbtnbr"></div>
            <button
              className="btn btn-primary fileuploadbtndashlite  "
              onClick={() => this.openModel()}
            >
              Text share
            </button>
            <input
              type="file"
              name="resobj"
              onChange={this.uploadfilepresigned}
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

          {/* <div className="contentdivdashboardlite">
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
          </div> */}

          <div className="table-responsive">
            {" "}
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">item type</th>
                  <th scope="col">Item Name</th>
                  <th scope="col">Item last modified</th>
                  <th scope="col">Item size</th>
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
                      <td className="tabledatanamedash">{ele.name}</td>
                      <td>
                        {moments(ele.created, "YYYY-MM-DD HH:mm:ssZ").fromNow()}
                      </td>
                      <td>{(ele.size / 1024 / 1024).toFixed(3) + " Mb"}</td>
                      <td>
                        {" "}
                        <button
                          className="btn btn-primary "
                          onClick={() => {
                            this.downloadfile(ele.name);
                          }}
                        >
                          Download
                        </button>{" "}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {this.state.filedata.length === 0 ? "No files to show " : ""}
        </div>
      </div>
    );
  }
}

export default Dashboardlite;
