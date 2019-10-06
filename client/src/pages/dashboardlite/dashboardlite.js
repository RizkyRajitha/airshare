import React, { Component } from "react";
import axios from "axios";
import Navbar from "../../components/navbar";
import Altert from "../../components/altert";
import "./dashboardlite.css";
import Modal from "react-modal";
var FileDownload = require("js-file-download");
const jwt = require("jsonwebtoken");
const moment = require("moment");

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

      var ddt = moment(date).format("YYYY-MM-DD HH:mm:ss");
      var ddtas = moment(dato).format("YYYY-MM-DD HH:mm:ss");

      console.log("ddt");
      console.log(ddt);
      var stst = moment.utc(
        moment(ddt).diff(moment(ddtas, "YYYY-MM-DD HH:mm:ss"))
      );

      setInterval(() => {
        stst.subtract({ second: 1 });
        this.setState({ remain: stst.format("HH:mm:ss").slice(3, 8) });
        console.log(stst.format("HH:mm:ss"));
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

      // setTimeout(() => {
      //   this.props.history.push("/guestlogin");
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
        var filedata = [];
        console.log(result.data);
        result.data.entries.map(res => {
          console.log(res.type);

          // (this.state.cvFile.size / 1024 / 1024).toFixed(2)
          var isFolder = false;
          if (res.type === "folder") {
            isFolder = true;
          }

          //   name: 'Mr. Robot - 3x02 - eps3.1_undo.gz.HDTV.SVA.en.srt',
          //   path_lower: '/devindi/mr. robot - 3x02 - eps3.1_undo.gz.hdtv.sva.en.srt',
          //   path_display: '/devindi/Mr. Robot - 3x02 - eps3.1_undo.gz.HDTV.SVA.en.srt',
          //   id: 'id:8LNa9hp60dAAAAAAAAAAPA',
          //   client_modified: '2019-10-03T13:40:36Z',
          //   server_modified: '2019-10-03T13:40:36Z',
          //   rev: '0159401bafdd95f000000017000a030',
          //   size: 51682,
          //   is_downloadable: true,
          //   content_hash:

          var tempdata = {
            modified: res.client_modified,
            id: res.id,
            name: res.name,
            path: res.path_lower,
            size: (res.size / 1024 / 1024).toFixed(2) + " Mb"
          };

          filedata.push(tempdata);
        });

        this.setState({ filedata: filedata });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getfolderdata = folderpath => {
    var token = localStorage.getItem("jwtguest");

    var config = {
      headers: { authorization: token }
    };

    var payload = {
      currentpath: folderpath
    };

    axios
      .post("/temp/getfolderinfo", payload, config)
      .then(result => {
        var filedata = [];
        console.log(result.data);
        result.data.entries.map(res => {
          console.log("patha");
          console.log(res.path);

          // (this.state.cvFile.size / 1024 / 1024).toFixed(2)
          var isFolder = false;
          if (res.type === "folder") {
            isFolder = true;
          }

          var tempdata = {
            modified: res.client_modified,
            id: res.id,
            name: res.name,
            path: res.path_lower,
            size: (res.size / 1024 / 1024).toFixed(2) + " Mb"
          };

          filedata.push(tempdata);
        });

        this.setState({ filedata: filedata });
      })
      .catch(err => {
        console.log(err);
      });
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#f00";
    // this.subtitle.style.textAlign = "center";
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
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
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      });
  };

  createfolder = e => {
    e.preventDefault();
    console.log("create folder " + this.state.newfoldername);

    var jwt = localStorage.getItem("jwtguest");
    var config = {
      headers: {
        authorization: jwt
      }
    };

    var newfolderpath = this.state.currentpath + this.state.newfoldername;

    var payload = {
      foldername: newfolderpath
    };

    axios
      .post("/temp/createfolder", payload, config)
      .then(res => {
        this.closeModal();
        if (res.data.msg === "success") {
          this.getfolderdata(this.state.currentpath);
          this.setState({
            alerthidden: false,
            alertext: "new folder created successfully",
            alertaction: "success"
          });
        } else {
          this.setState({
            alerthidden: false,
            alertext: "error craeting new folder",
            alertaction: "danger"
          });
        }
      })
      .catch(err => {
        this.setState({
          alerthidden: false,
          alertext: "error craeting new folder",
          alertaction: "danger"
        });
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
          this.getfolderdata(this.state.currentpath);
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

  openfolder = foldername => {
    console.log("open folder");
    this.setState({ currentpath: this.state.currentpath + foldername + "/" });
    this.getfolderdata(this.state.currentpath + foldername + "/");
  };

  previousfolder = () => {
    console.log("back");

    var curpath = this.state.currentpath;
    console.log(curpath);
    var ssd = curpath.split("/");
    console.log("before pop");
    console.log(ssd);
    ssd.pop();
    ssd.pop();

    var newpath = "";

    console.log("after pop");
    console.log(ssd);
    ssd.forEach(ele => {
      console.log(ele);
      newpath = newpath + ele + "/";
    });

    console.log(newpath);
    this.setState({ currentpath: newpath });
    // this.setState({ currentpath: this.state.currentpath + foldername + "/" });
    this.getfolderdata(newpath);
  };

  downloadfolder = folderpath => {
    var jwt = localStorage.getItem("jwtguest");
    var config = {
      headers: {
        responseType: "blob",
        authorization: jwt
      }
    };

    var formdata = { path: folderpath };

    axios
      .post("/api/downloadzip", formdata, config)
      .then(result => {
        console.log(result);

        const pdfBlob = new Blob([result.data], {
          type: "application/x-zip-compressed"
        });
        //FileDownload(res.data, "evalpdf.pdf");
        FileDownload.saveAs(
          pdfBlob,
          this.state.out_Name + "_outprojectpdf.zip"
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <Navbar type="dashboardlite" useractive="true" />
        <div className="container dashboardmain">
          <Altert
            action={this.state.alertaction}
            text={this.state.alertext}
            hiddenalert={this.state.alerthidden}
          />

          <div className="timeremain">
            {" "}
            time remaining till session expire : {this.state.remain}
          </div>

          <div className="dashboardbtngroup">
            {this.state.currentpath === "/" ? (
              ""
            ) : (
              <button className="dashboardbtn" onClick={this.previousfolder}>
                <img
                  src="https://img.icons8.com/back/ffffff"
                  className="dashboardbackicon"
                />
              </button>
            )}

            <div className="dashboardbtnbr"></div>

            <button
              className=" file-field fileuploadbtn dashboardbtn dashboardbtncreatefolder "
              onClick={this.openModal}
            >
              {" "}
              create folder{" "}
            </button>

            <form action={this.uploadfile}>
              <div class=" file-field">
                <div class="btn fileuploadbtn ">
                  <span>upload </span>
                  <input type="file" name="resobj" onChange={this.uploadfile} />
                </div>
              </div>
            </form>
          </div>

          {/* <button onClick={this.openModal}> create folder </button> */}
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <button
              className="createfolderclosemodalbtn"
              onClick={this.closeModal}
            >
              close
            </button>
            <div className="container">
              <h2 ref={subtitle => (this.subtitle = subtitle)}>
                create a new folder
              </h2>
              <form onSubmit={this.createfolder}>
                <input
                  type="text"
                  required
                  onChange={e =>
                    this.setState({ newfoldername: e.target.value })
                  }
                />

                <button type="submit" className="btn">
                  {" "}
                  Create folder{" "}
                </button>
              </form>
            </div>
          </Modal>

          <div className="dashboardpathdiv">
            {" "}
            <span> {this.state.currentpath} </span>{" "}
          </div>

          <div hidden={this.state.hideprogressbar} id="myProgress">
            <div id="myBar"></div>
          </div>

          <table>
            <thead>
              <tr>
                <th>item type</th>
                <th>Item Name</th>
                <th>Item last modified</th>
                <th>Item size</th>
              </tr>
            </thead>

            <tbody>
              {this.state.filedata.map(ele => {
                // console.log(ele);
                if (ele.isFolder) {
                  return (
                    <tr onDoubleClick={() => this.openfolder(ele.name)}>
                      <td>
                        <img src="https://img.icons8.com/ultraviolet/40/000000/folder-invoices.png" />
                      </td>
                      <td>{ele.name}</td>
                      <td>{ele.modified ? " - " : ele.modified}</td>
                      <td>{ele.size ? " - " : ele.size}</td>
                      <td>
                        {" "}
                        <button
                          onClick={() => {
                            console.log("unsupported");
                            //this.allowaccess(ele.path, ele.type);
                          }}
                        >
                          allow access
                        </button>{" "}
                      </td>
                      <td>
                        {" "}
                        <button
                          onClick={() => {
                            this.downloadfolder(ele.path);
                          }}
                        >
                          download
                        </button>{" "}
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr>
                      <td>
                        {" "}
                        <img src="https://img.icons8.com/color/48/000000/file.png"></img>
                      </td>
                      <td>{ele.name}</td>
                      <td>{ele.modified}</td>

                      <td>{ele.size}</td>
                      {/* <td>
                        {" "}
                        <button
                          onClick={() => {
                            this.allowaccess(
                              ele.path,
                              ele.type,
                              ele.isallowedaccesss
                            );
                          }}
                        >
                          {ele.isallowedaccesss
                            ? "revoke access"
                            : "allow access"}
                        </button>{" "}
                      </td> */}
                      <td>
                        {" "}
                        <button
                          onClick={() => {
                            this.downloadfile(ele.path);
                          }}
                        >
                          download
                        </button>{" "}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Dashboardlite;
