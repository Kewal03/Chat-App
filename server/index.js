const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");
const newsRouter = require("./routes/news");

const PORT = process.env.PORT || 3000;
const router = require("./router");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const fileData = {
    fileName: req.file.filename,
    fileUrl: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname,
  };

  io.to(req.body.room).emit("fileUploaded", {
    user: req.body.user,
    file: fileData,
  });

  res.send(fileData);
});

app.use("/uploads", express.static("uploads"));

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name}, has joined!` });
    socket.join(user.room);

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", { user: user.name, text: message });
    }
    callback();
  });

  socket.on("sendFile", (fileData, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("file", { user: user.name, ...fileData });
    }
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left.`,
      });
    }
  });
});

app.use(router);

app.use("/news", newsRouter);

server.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
