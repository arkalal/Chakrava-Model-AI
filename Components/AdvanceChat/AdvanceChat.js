"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import styles from "../Chat.module.scss";
import ChatMessage from "../ChatMessage/ChatMessage";
import ChatInput from "../ChatInput/ChatInput";
import axios from "../../axios/api"; // For backend interaction

const AdvanceChat = () => {
  const [chatHistory, setChatHistory] = useState([]); // Chat history
  const [input, setInput] = useState(""); // User input
  const [isLoading, setIsLoading] = useState(false); // State to manage loader for texts
  const [isBoxLoading, setIsBoxLoading] = useState(false); // State to manage loader for the box (component)
  const messagesEndRef = useRef(null); // For auto-scroll to bottom

  // Scroll to the bottom whenever messages update
  useLayoutEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // Function to handle fetching training data from the /train endpoint
  const fetchTrainingData = async () => {
    try {
      const res = await axios.get("train");
      return res.data.message; // Get the message from the training API response
    } catch (error) {
      console.error("Error fetching training data:", error);
      return "Error fetching training data.";
    }
  };

  // Handle submission and interaction with backend
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const currentInput = input.trim(); // Capture the input before resetting

    if (!currentInput) return; // Prevent empty messages from being submitted
    setInput(""); // Clear the input after submission

    // Add user input to chat history
    const userMessage = { role: "user", content: currentInput };
    setChatHistory((prev) => [...prev, userMessage]);

    // Add loading indicator message for AI
    const loaderMessage = { role: "assistant", content: "", isLoading: true };
    setChatHistory((prev) => [...prev, loaderMessage]);
    setIsLoading(true);

    // Make API request to the backend
    try {
      const response = await axios.post("functionChat", {
        prompt: currentInput, // Use captured input
        conversationHistory: [...chatHistory, userMessage],
      });

      const aiMessage = response.data;
      console.log("AI response:", aiMessage);

      // Check if there's a function call in the AI response
      if (aiMessage.function_call) {
        const functionCall = aiMessage.function_call;

        if (functionCall.name === "render_box_component") {
          const boxMessage = {
            role: "assistant",
            content: "", // Empty content because we are rendering the box
            boxData: "This is rendered from AI response!", // Data for the box
            isLoading: true, // Indicate loading state
          };

          // Replace loader message with the AI box message
          setChatHistory((prev) => {
            const updatedHistory = [...prev];
            updatedHistory[updatedHistory.length - 1] = boxMessage;
            return updatedHistory;
          });

          // Set the box loader state
          setIsBoxLoading(true); // Box is now loading

          // Simulate loading time for the box
          setTimeout(() => {
            setChatHistory((prev) => {
              const updatedHistory = [...prev];
              updatedHistory[updatedHistory.length - 1] = {
                ...boxMessage,
                isLoading: false, // Box has finished loading
              };
              return updatedHistory;
            });
            setIsBoxLoading(false); // Box has finished loading
          }, 3000); // Simulate a 3-second delay
        } else if (functionCall.name === "get_training_data") {
          // Fetch the training data from the /train API
          const trainingData = await fetchTrainingData();

          const trainingMessage = {
            role: "assistant",
            content: `The training data is: ${trainingData}`, // AI responds with the fetched data
            isLoading: false,
          };

          // Replace loader message with the AI's training data response
          setChatHistory((prev) => {
            const updatedHistory = [...prev];
            updatedHistory[updatedHistory.length - 1] = trainingMessage;
            return updatedHistory;
          });
        }
      } else {
        // Replace loader message with AI response (normal conversation)
        setChatHistory((prev) => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1] = {
            ...aiMessage,
            isLoading: false,
          };
          return updatedHistory;
        });
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setChatHistory((prev) => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1] = {
          role: "assistant",
          content: "Error fetching response. Please try again.",
          isLoading: false,
        };
        return updatedHistory;
      });
    } finally {
      setIsLoading(false); // Ensure loader is hidden after response
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox}>
        <div className={styles.chatWindow}>
          <div className={styles.chatHistory}>
            {chatHistory.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                isLoading={message.isLoading}
                isBoxLoading={isBoxLoading}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
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

export default AdvanceChat;
