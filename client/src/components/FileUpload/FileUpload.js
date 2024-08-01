import React, { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [room, setRoom] = useState(""); // Set this dynamically
  const [user, setUser] = useState(""); // Set this dynamically

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("room", room);
    formData.append("user", user);

    axios
      .post("http://localhost:3000/upload", formData)
      .then((response) => {
        const fileData = response.data;
        onFileUpload(fileData.fileUrl); // Notify parent component with file URL
        setFile(null); // Clear the file input
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  return (
    <div className="fileUpload">
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
    </div>
  );
};

export default FileUpload;
