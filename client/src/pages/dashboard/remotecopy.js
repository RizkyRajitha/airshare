import io from "socket.io-client";
// const api = "http://localhost:5000";
// const api = "https://airsharebetav2.herokuapp.com";
const api = "https://airsharebeta.herokuapp.com";
const socket = io(api, {
  transports: ["websocket"],
  upgrade: false
});

const remotecopyclientfunction = data => {
  socket.emit("remotecopynew", data);
};

const remoteuploadclientfunction = data => {
  socket.emit("newfileupload", data);
};

export { remotecopyclientfunction, remoteuploadclientfunction };
