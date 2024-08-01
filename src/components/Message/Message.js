import React from "react";
import "./Message.css";

const Message = ({ message: { user, text, file }, name }) => {
  let isSentByCurrentUser = false;
  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimmedName}</p>
      <div className="messageBox backgroundBlue">
        {text && <p className="messageText colorWhite">{text}</p>}
        {file && (
          <a href={`http://localhost:3000/uploads/${file.filename}`} download>
            {file.filename}
          </a>
        )}
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        {text && <p className="messageText colorDark">{text}</p>}
        {file && (
          <a href={`http://localhost:3000/uploads/${file.filename}`} download>
            {file.filename}
          </a>
        )}
      </div>
      <p className="sentText pl-10">{user}</p>
    </div>
  );
};

export default Message;
