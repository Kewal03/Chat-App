import React from "react";
import "./Messages.css";

const Messages = ({ messages }) => (
  <div>
    {messages.map((msg, i) => (
      <div key={i} className="message">
        <p>
          <strong>{msg.user || "System"}: </strong>
          {msg.text}
        </p>
        {msg.fileUrl && (
          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
            {msg.fileUrl}
          </a>
        )}
      </div>
    ))}
  </div>
);

export default Messages;
