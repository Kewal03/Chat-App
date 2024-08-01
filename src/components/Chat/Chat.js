import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import FileUpload from "../FileUpload/FileUpload";

let socket;

const Chat = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const endpoint = "http://localhost:3000";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    setName(name);
    setRoom(room);

    socket = io(endpoint);

    socket.emit("join", { name, room }, () => {});

    socket.on("message", (message) => {
      setMessages((msgs) => [...msgs, message]);
    });

    socket.on("fileUploaded", (fileData) => {
      const fileMessage = {
        text: `${fileData.user} sent a file: ${fileData.file.fileName}`,
        fileUrl: fileData.file.fileUrl,
      };
      setMessages((msgs) => [...msgs, fileMessage]);
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket.off();
      }
    };
  }, [endpoint, location.search]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  const handleFileUpload = (fileUrl) => {
    const fileMessage = {
      text: `A file has been uploaded: ${fileUrl}`,
      fileUrl,
    };
    setMessages((msgs) => [...msgs, fileMessage]);
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
        <FileUpload onFileUpload={handleFileUpload} />
      </div>
    </div>
  );
};

export default Chat;
