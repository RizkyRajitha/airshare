import io from "socket.io-client";
const api = "http://127.0.0.1:5000";
const socket = io(api, {
  transports: ["websocket"],
  upgrade: false
});

const remotecopyclientfunction = data => {
  socket.emit("remotecopynew", data);
};

const remoteuploadclientfunction = ( data) => {
  socket.emit('newfileupload', data);
};

export { remotecopyclientfunction ,remoteuploadclientfunction};
