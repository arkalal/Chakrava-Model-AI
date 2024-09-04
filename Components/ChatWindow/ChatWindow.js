"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import styles from "../Chat.module.scss";
import ChatMessage from "../ChatMessage/ChatMessage";
import SliderControl from "../SliderControl/SliderControl";
import ChatInput from "../ChatInput/ChatInput";
import { useChat } from "ai/react";

const ChatWindow = () => {
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [outputLength, setOutputLength] = useState(1000); // Default value
  const [temperature, setTemperature] = useState(0.8); // Default value
  const [topP, setTopP] = useState(1.0); // Default value
  const [topK, setTopK] = useState(50); // Default value
  const [repetitionPenalty, setRepetitionPenalty] = useState(1.0);
  const [loading, setLoading] = useState(false);

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

  // Scroll to the bottom as messages update
  useLayoutEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [messages]);

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
          {/* <div className={styles.settingsPanel}>
            <div className={styles.modifications}>
              <SliderControl
                label="Output Length"
                value={outputLength}
                setValue={setOutputLength}
                min={1}
                max={1024}
              />
              <SliderControl
                label="Temperature"
                value={temperature}
                setValue={setTemperature}
                min={0}
                max={1}
                step={0.01}
              />
              <SliderControl
                label="Top-P"
                value={topP}
                setValue={setTopP}
                min={0}
                max={1}
                step={0.01}
              />
              <SliderControl
                label="Top-K"
                value={topK}
                setValue={setTopK}
                min={0}
                max={100}
              />
              <SliderControl
                label="Repetition Penalty"
                value={repetitionPenalty}
                setValue={setRepetitionPenalty}
                min={0}
                max={2}
                step={0.01}
              />
            </div>
          </div> */}
        </div>

        <div className={styles.chatInput}>
          <ChatInput
            value={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
