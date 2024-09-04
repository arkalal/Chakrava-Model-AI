import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism"; // Choose your preferred theme
import styles from "../Chat.module.scss";

// Function to handle code block detection and rendering
const renderMessage = (content) => {
  const codeRegex = /```(javascript|bash)?\n([\s\S]*?)```/g; // Regex to detect code blocks
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(content)) !== null) {
    // Push text before code block
    if (match.index > lastIndex) {
      parts.push(
        <p key={lastIndex}>{content.slice(lastIndex, match.index)}</p>
      );
    }

    const language = match[1] || ""; // Language detected (javascript, bash)
    const code = match[2];

    parts.push(
      <SyntaxHighlighter
        key={match.index}
        language={language || "text"}
        style={tomorrow}
      >
        {code.trim()}
      </SyntaxHighlighter>
    );

    lastIndex = codeRegex.lastIndex;
  }

  // Push any remaining text after the last code block
  if (lastIndex < content.length) {
    parts.push(<p key={lastIndex}>{content.slice(lastIndex)}</p>);
  }

  return parts;
};

const ChatMessage = ({ message }) => {
  return (
    <div className={styles.chatMessage}>
      <div
        className={message.role === "user" ? styles.userText : styles.aiText}
      >
        {renderMessage(message.content)}
      </div>
    </div>
  );
};

export default ChatMessage;
