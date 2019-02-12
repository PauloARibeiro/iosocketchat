var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

let users = [];
let connections = [];

server.listen(3000, () => {
  console.log("listening on *:3000");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.sockets.on("connection", socket => {
  //CONNECT
  connections.push(socket);

  //DISCONNECT
  socket.on("disconnect", socket => {
    users.splice(users.indexOf(socket.username), 1);
    connections.splice(connections.indexOf(socket), 1);

    updateUsernames();
  });

  //SEND MESSAGE
  socket.on("send message", data => {
    io.sockets.emit("new message", { msg: data, user: socket.username });
  });

  //CREATE USER
  socket.on('new user', (data, callback) => {
    callback = true;
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  })

  function updateUsernames(){
    io.sockets.emit('get users', users);
  }
});
