// components/ChatMessage.js

import React from "react";
import styles from "../Chat.module.scss";

const ChatMessage = ({ message }) => {
  return (
    <div className={styles.chatMessage}>
      <div
        className={message.role === "user" ? styles.userText : styles.aiText}
      >
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
