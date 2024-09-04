import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism"; // Choose your preferred theme
import styles from "../Chat.module.scss";

const renderMessage = (content) => {
  const codeRegex = /```(javascript|bash|css|scss)?\n([\s\S]*?)```/g; // Regex to detect code blocks
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

    // Add code block with a copy button
    parts.push(
      <CodeBlockWithCopy
        key={match.index}
        code={code.trim()}
        language={language || "text"}
      />
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

// Component to handle displaying a code block with a copy button
const CodeBlockWithCopy = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={styles.codeBlockContainer}>
      <SyntaxHighlighter language={language} style={tomorrow}>
        {code}
      </SyntaxHighlighter>
      <button className={styles.copyButton} onClick={handleCopy}>
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};
