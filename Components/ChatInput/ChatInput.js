// components/ChatInput.js

import React from "react";
import styles from "../Chat.module.scss";
import { IoIosArrowForward } from "react-icons/io";
import { FiSend } from "react-icons/fi";

const ChatInput = ({ value, onChange, onSubmit }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit(event);
    }
  };

  return (
    <form className={styles.chatForm} onSubmit={onSubmit}>
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your query here"
      />
      <div className={styles.icons}>
        <button>
          Submit
          <IoIosArrowForward className={styles.icon} onClick={onSubmit} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
