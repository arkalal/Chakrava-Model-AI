import React, { useRef } from "react";
import styles from "../Chat.module.scss";
import { IoIosArrowForward } from "react-icons/io";
import { FiUpload } from "react-icons/fi"; // Send and Upload icons

const ChatInput = ({
  value,
  onChange,
  onSubmit,
  handleImageUpload,
  resetFileInput,
}) => {
  const fileInputRef = useRef(null); // Define file input ref

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit(event);
    }
  };

  return (
    <form
      className={styles.chatForm}
      onSubmit={(e) => {
        onSubmit(e);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input after form submit
          resetFileInput(); // Reset parent component state
        }
      }}
    >
      <div className={styles.inputControls}>
        {/* <label htmlFor="imageUpload">
          <FiUpload className={styles.uploadIcon} />
        </label> */}
        <input
          type="file"
          id="imageUpload"
          ref={fileInputRef} // Attach ref to file input
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload} // Handle image upload
        />
        <textarea
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your query here"
        />
        <div className={styles.icons}>
          <button type="submit">
            Submit <IoIosArrowForward className={styles.icon} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
