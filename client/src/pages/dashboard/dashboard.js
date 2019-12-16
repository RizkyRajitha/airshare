import React, { Component } from "react";
import axios from "axios";
import Navbar from "../../components/navbar";
import Altert from "../../components/altert";
import "./dashboard.scoped.css";
import moments from "moment";
import io from "socket.io-client";
import Modal from "react-responsive-modal";
import Swal from "sweetalert2";
import {
  remotecopyclientfunction,
  remoteuploadclientfunction
} from "./remotecopy";
var FileDownload = require("js-file-download");

// const api = "http://localhost:5000";

// const api = "https://airsharebetav2.herokuapp.com";
const api = "https://airsharebeta.herokuapp.com";

const jwt = require("jsonwebtoken");

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)

class Dashboard extends Component {
  state = {
    filedata: [],
    alerthidden: true,
    alertext: "",
    alertaction: "",
    resobj: [],
    newfoldername: "",
    currentpath: "/",
    hideprogressbar: true,
    filenamelist: [],
    username: "",
    spaceused: "",
    fileuploadprogress: 0,
    deleting: false,
    isloading: false,
    resobjsize: "",
    id: "",
    modelopen: false,
    shownotify: false,
    remotecopydata: ""
  };

  openModel = () => {
    this.setState({ modelopen: true });
  };
  closeModel = () => {
    this.setState({ modelopen: false });
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

    const socket = io(api, {
      transports: ["websocket"],
      upgrade: false
    });

    var config = {
      headers: { authorization: token }
    };
    this.setState({ isloading: true });
    axios
      .get("/api/userdata", config)
      .then(result => {
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

        console.log(result.data);
        this.setState({
          username: result.data.name,
          spaceused: result.data.storage,
          id: result.data.id
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

  // copyshareurlbtn = () => {};

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
    if (!allowstate) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to allow guest access to " + path + " file?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, allow it!"
      }).then(result => {
        if (result.value) {
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
              Swal.fire(
                "Access Granted!",
                "Your file now has guest access",
                "success"
              );
              // window.location.reload();
            })
            .catch(err => {
              this.setState({ isloading: false });
              Swal.fire("Error!", "Error occured", "error");
              console.log(err);
            });
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to revoke guest access to " + path + " file?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, revoke it!"
      }).then(result => {
        if (result.value) {
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
              Swal.fire(
                "Access Revoked!",
                "Your file guest access revoked",
                "success"
              );
              // window.location.reload();
            })
            .catch(err => {
              this.setState({ isloading: false });
              Swal.fire("Error!", "Error occured", "error");
              console.log(err);
            });
        }
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

    console.log(
      "original size - " +
        orisize +
        " eventsize -  " +
        eventsize +
        " present - " +
        width
    );

    if (width > 100) {
      console.log("finish");
      this.setState({ hideprogressbar: true });
    }
  };

  deletefile = (contentid, key) => {
    Swal.fire({
      // html: true,
      title: "Sure want to delete \n" + key + "\n ?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
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
            this.setState({ deleting: false });
            this.setState({ isloading: false });
            console.log(result);
            Swal.fire("Deleted!", key + " successfully deleted", "success");
          })
          .catch(err => {
            console.log(err);
            this.setState({ deleting: false });
            this.setState({ isloading: false });
            Swal.fire({
              title: "Error!",
              text: " Error deleting file",
              icon: "error",
              confirmButtonText: "Cool"
            });
          });
      }
    });
  };

  presigendurltest = e => {
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
    console.log(this.state.filenamelist, " ", upname);

    label: for (let element of this.state.filenamelist) {
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

    var jwt = localStorage.getItem("jwt");

    var config = {
      headers: {
        authorization: jwt
      }
    };

    if (!dups) {
      if (remain > uploadsize) {
        console.log("no dups ok!!!!!!");
        axios
          .post("/upload/presigendurlupload", { fileset: payload }, config)
          .then(result => {
            console.log(result.data);
            if (result.data.msg === "success") {
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
                var contendis = 'attachment; filename="' + element.name + '"';
                var config = {
                  onUploadProgress: progressEvent =>
                    this.fileuploaddindicater(
                      element.size,
                      progressEvent.loaded
                    ),
                  headers: {
                    "Content-Type": element.type,
                    "Content-Disposition": contendis
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
                      isloading: false,
                      hideprogressbar: true
                    });
                  })
                  .catch(err => {
                    console.log(err);
                    this.setState({
                      alerthidden: false,
                      alertext: "file " + index + "  upload error",
                      alertaction: "danger",
                      isloading: false,
                      hideprogressbar: true
                    });
                  });
              }

              // filestobeuploaded.forEach(e => console.log(e));
              // this.state.resobj.forEach(async (objects, index) => {
              // var config = {
              //   onUploadProgress: progressEvent =>
              //     this.fileuploaddindicater(
              //       objects.size,
              //       progressEvent.loaded
              //     ),
              //   headers: {
              //     "Content-Type": objects.type
              //   }
              // };
              // await axios
              //   .put(result.data.urlarr[index], objects, config)
              //   .then(result2 => {
              //     console.log(result2);
              //     this.setState({
              //       alerthidden: false,
              //       alertext: "file successfully uploaded",
              //       alertaction: "success",
              //       isloading: true
              //     });
              //   })
              //   .catch(err => {
              //     console.log(err);
              //   });
              // });

              // axios
              // .put(result.data.resurl, this.state.resobj, config)
              // .then(result2 => {
              //   console.log(result2);
              //   this.setState({
              //     alerthidden: false,
              //     alertext: "file successfully uploaded",
              //     alertaction: "success",
              //     isloading: true
              //   });
              // })
              // .catch(err => {
              //   console.log(err);
              // });
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
          alertext: ` You ran out of space buddy `,
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

    // console.log("kokok");

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

  copyremoteshare = () => {
    this.setState({ shownotify: false });
    var copyText = document.getElementById("remotecopytextarea");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");
  };

  sharefile = (name, size) => {
    var jwt = localStorage.getItem("jwt");

    var config = {
      headers: {
        authorization: jwt
      }
    };

    var payload = {
      key: name,
      size: size
    };

    axios
      .post("/api/sharefile", payload, config)
      .then(res => {
        console.log(res.data);

        Swal.fire({
          title: "Share file",
          input: "text",
          inputValue: res.data.resurl,
          inputAttributes: {
            id: "sharefilelinkswaltectinput"
          },
          // text: " Error deleting file",
          html:
            '<button class="btn btn-primary" id="sharefilelinkswalcopybtn" >Copy link</button> ',
          icon: "success",
          confirmButtonText: "Cool"
        });

        var copysharebtnnn = document.getElementById(
          "sharefilelinkswalcopybtn"
        );
        copysharebtnnn.addEventListener("click", function() {
          // alert("boom");
          var copyText = document.getElementById("sharefilelinkswaltectinput");

          /* Select the text field */
          copyText.select();
          copyText.setSelectionRange(0, 99999); /*For mobile devices*/

          /* Copy the text inside the text field */
          document.execCommand("copy");
        });
        //   Swal.fire("Share file", res.data.resurl, "success",html:
        //   'You can use <b>bold text</b>, ' +
        //   '<a href="//sweetalert2.github.io">links</a> ' +
        //   'and other HTML tags',);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="">
        <Navbar
          useractive="true"
          username={this.state.username}
          type="dashboard"
          clickremotesharenotify={this.openModel}
          shownotify={this.state.shownotify}
        />
        <div class="container">
          {/* <div class="row"> */}
          {/* <div class="col-md-12"> */}
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

          {/* {this.state.remotecopydata} */}
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
            <button
              className="btn btn-primary fileuploadbtn  "
              onClick={() => this.openModel()}
            >
              Text share
            </button>
            <input
              type="file"
              name="resobj"
              onChange={this.presigendurltest}
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
                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>

              <tbody>
                {this.state.filedata.map(ele => {
                  console.log(ele);

                  return (
                    <tr>
                      <td className="tabledata-dashboard">
                        <img
                          className="dashboardfileicon"
                          src="https://img.icons8.com/color/48/000000/file.png"
                        ></img>
                      </td>
                      <td className="tabledatanamedash tabledata-dashboard ">
                        {ele.name}
                      </td>
                      <td>
                        {moments(ele.created, "YYYY-MM-DD HH:mm:ssZ").fromNow()}
                      </td>
                      <td className="tabledata-dashboard">
                        {(ele.size / 1024 / 1024).toFixed(3) + " Mb"}
                      </td>
                      <td className="tabledata-dashboard">
                        <button
                          disabled={this.state.deleting}
                          className="btn btn-primary "
                          onClick={() => {
                            this.sharefile(
                              ele.name,
                              (ele.size / 1024 / 1024).toFixed(3) + " Mb"
                            );
                          }}
                        >
                          Share
                        </button>
                      </td>
                      <td className="tabledata-dashboard">
                        {" "}
                        <button
                          disabled={this.state.deleting}
                          className="btn btn-primary "
                          onClick={() => {
                            this.downloadfile(ele.name);
                          }}
                        >
                          Download
                        </button>{" "}
                      </td>
                      <td className="tabledata-dashboard">
                        <button
                          disabled={this.state.deleting}
                          className={`btn ${
                            ele.allowaccess ? "btn-success" : "btn-warning "
                          } `}
                          onClick={() => {
                            this.allowaccess(ele._id, ele.allowaccess);
                          }}
                        >
                          {ele.allowaccess ? "Revoke access" : "Allow access "}
                        </button>{" "}
                      </td>
                      <td className="tabledata-dashboard">
                        <button
                          disabled={this.state.deleting}
                          className={`btn btn-danger `}
                          onClick={() => {
                            this.deletefile(ele._id, ele.name);
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

/**
 *    this.setState({
      alerthidden: true,
      alertext: "",
      alertaction: ""
    });
    this.setState({ isloading: true });
    this.setState({ resobj: e.target.files[0] });
    this.setState({ resobjsize: e.target.files[0].size });

    console.log(e.target.files);

    var payload = {
      name: e.target.files[0].name,
      size: e.target.files[0].size,
      type: e.target.files[0].type
    };
    console.log(payload);
    // formdata.append("resobj", e.target.files[0]);

    // console.log("no dups ok!!!!!!");

    var config = {
      onUploadProgress: progressEvent =>
        this.fileuploaddindicater(this.state.resobjsize, progressEvent.loaded),
      headers: {
        "Content-Type": e.target.files[0].type
      }
    };

    axios
      .post("/upload/presigendurltest", payload)
      .then(result => {
        console.log(result.data);

        axios
          .put(result.data.resurl, this.state.resobj, config)
          .then(result2 => {
            console.log(result2);
            this.setState({
              alerthidden: false,
              alertext: "file successfully uploaded",
              alertaction: "success",
              isloading: true
            });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => console.log(err));
 */
