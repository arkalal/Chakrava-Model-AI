"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import styles from "../Chat.module.scss";
import ChatMessage from "../ChatMessage/ChatMessage";
import { useChat } from "ai/react";
import ChatInput from "../ChatInput/ChatInput";

const ChatWindow = () => {
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [outputLength, setOutputLength] = useState(1000);
  const [temperature, setTemperature] = useState(0.8);
  const [topP, setTopP] = useState(1.0);
  const [topK, setTopK] = useState(50);
  const [repetitionPenalty, setRepetitionPenalty] = useState(1.0);
  const [imageFile, setImageFile] = useState(null); // Store uploaded image
  const [imagePreview, setImagePreview] = useState(null); // For image preview

  const messagesEndRef = useRef(null);

  const { messages, input, setInput, handleInputChange, handleSubmit } =
    useChat({
      api: "/api/chat",
      body: {
        model,
        outputLength,
        temperature,
        topP,
        topK,
        repetitionPenalty,
      },
    });

  // Scroll to the bottom when messages update
  useLayoutEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [messages]);

  // Handle image upload and preview
  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files && files[0]) {
      setImageFile(files); // Store the FileList
      setImagePreview(URL.createObjectURL(files[0])); // Preview image
    }
  };

  // Reset file input
  const resetFileInput = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Submit with prompt and image attachments
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(e, {
      experimental_attachments: imageFile, // Send image attachments
    });

    // Reset input and file after submission
    setInput("");
    resetFileInput(); // Clear file input via the passed function
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
              <button onClick={() => setImagePreview(null)}>Remove</button>
            </div>
          )}

          <ChatInput
            value={input}
            onChange={handleInputChange}
            onSubmit={handleFormSubmit}
            handleImageUpload={handleImageUpload} // Pass image handler
            resetFileInput={resetFileInput} // Pass reset function
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
