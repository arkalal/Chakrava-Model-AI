"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import styles from "../Chat.module.scss";
import ChatMessage from "../ChatMessage/ChatMessage";
import ChatInput from "../ChatInput/ChatInput";
import SkeletonBox from "../SkeletonBox/SkeletonBox"; // Import SkeletonBox
import Box from "../Box/Box"; // Import Box
import axios from "../../axios/api"; // For backend interaction

const ChakravaAI = () => {
  const [isRenderingBox, setIsRenderingBox] = useState(false); // Handle box rendering
  const [boxData, setBoxData] = useState(null); // Data to display in Box component
  const [chatHistory, setChatHistory] = useState([]); // Chat history
  const [input, setInput] = useState(""); // User input
  const messagesEndRef = useRef(null); // For auto-scroll to bottom

  // Scroll to the bottom whenever messages update
  useLayoutEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // Function to handle box rendering
  const handleRenderBox = (data) => {
    setIsRenderingBox(true); // Show SkeletonBox for loading
    setTimeout(() => {
      setBoxData(data); // Update the data for the box
      setIsRenderingBox(false); // Hide the SkeletonBox after 3 seconds
    }, 3000);
  };

  // Handle submission and interaction with backend
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setInput(""); // Clear the input after submission

    // Add user input to chat history
    const userMessage = { role: "user", content: input };
    setChatHistory((prev) => [...prev, userMessage]);

    // Make API request to the backend
    try {
      const response = await axios.post("chakravaChat", {
        prompt: input,
        conversationHistory: chatHistory,
      });

      const aiMessage = response.data;

      console.log("AI response:", aiMessage);
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox}>
        <div className={styles.chatWindow}>
          <div className={styles.chatHistory}>
            {chatHistory.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Display SkeletonBox or Box component based on state */}
        <div className={styles.boxComponent}>
          {isRenderingBox ? <SkeletonBox /> : boxData && <Box data={boxData} />}
        </div>

        <div className={styles.chatInput}>
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ChakravaAI;
