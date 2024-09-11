"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import styles from "../Chat.module.scss";
import ChatMessage from "../ChatMessage/ChatMessage";
import ChatInput from "../ChatInput/ChatInput";
import { useChat } from "ai/react"; // Vercel's AI SDK

const AdvanceChat = () => {
  const [imageFile, setImageFile] = useState(null); // Store uploaded image
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const messagesEndRef = useRef(null);

  const { messages, input, setInput, handleSubmit, addToolResult } = useChat({
    api: "/api/functionChat",
    body: { experimental_attachments: imageFile }, // Attach image
    maxToolRoundtrips: 2, // Enable tool roundtrips
  });

  // Scroll to the bottom when messages update
  useLayoutEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle image upload and preview
  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files && files[0]) {
      setImageFile(files[0]); // Store the file
      setImagePreview(URL.createObjectURL(files[0])); // Preview image
    }
  };

  // Reset file input
  const resetFileInput = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Submit the form with prompt and image attachments
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(e);
    setInput(""); // Clear input after submission
    resetFileInput(); // Reset file input after submission
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox}>
        <div className={styles.chatWindow}>
          <div className={styles.chatHistory}>
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className={styles.chatInput}>
          {imagePreview && (
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt="Preview" />
              <button onClick={resetFileInput}>Remove</button>
            </div>
          )}

          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSubmit={handleFormSubmit}
            handleImageUpload={handleImageUpload} // Pass image handler
          />
        </div>
      </div>
    </div>
  );
};

export default AdvanceChat;
