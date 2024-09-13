import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism"; // Choose your preferred theme
import styles from "../Chat.module.scss";
import Image from "next/image";
import { HashLoader } from "react-spinners"; // Import HashLoader
import SkeletonBox from "../SkeletonBox/SkeletonBox"; // Import SkeletonBox
import Box from "../Box/Box"; // Import Box

// Function to render content including code blocks and images
const renderMessage = (message, isLoading, isBoxLoading) => {
  // Check if the message contains boxData and render SkeletonBox or Box
  if (message.boxData) {
    return isBoxLoading ? <SkeletonBox /> : <Box data={message.boxData} />;
  }

  // Check if loading is enabled and show the loader for AI assistant text messages
  if (isLoading && message.role === "assistant") {
    return (
      <div className={styles.loaderContainer}>
        <HashLoader color="#4A90E2" size={40} />
      </div>
    );
  }

  // Detect code blocks using regex
  const content = message.content;
  const codeRegex =
    /```(javascript|bash|css|scss|code|SCSS|CSS|jsx|JSX|js|JS)?\n([\s\S]*?)```/g; // Regex to detect code blocks
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(content)) !== null) {
    // Push text before the code block
    if (match.index > lastIndex) {
      parts.push(
        <p key={lastIndex}>{content.slice(lastIndex, match.index)}</p>
      );
    }

    const language = match[1] || ""; // Language detected (e.g. javascript, bash)
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
  if (lastIndex < content?.length) {
    parts.push(<p key={lastIndex}>{content.slice(lastIndex)}</p>);
  }

  return parts;
};

// Main ChatMessage component to handle message rendering
const ChatMessage = ({ message, isLoading, isBoxLoading }) => {
  return (
    <div className={styles.chatMessage}>
      <div
        className={message.role === "user" ? styles.userText : styles.aiText}
      >
        {renderMessage(message, isLoading, isBoxLoading)}

        {/* Render images if any exist in the experimental_attachments */}
        <div>
          {message?.experimental_attachments
            ?.filter((attachment) =>
              attachment?.contentType?.startsWith("image/")
            )
            .map((attachment, index) => (
              <Image
                key={`${message.id}-${index}`}
                src={attachment.url}
                width={80} // Adjust width based on your design
                alt={attachment.name}
                height={80}
              />
            ))}
        </div>
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
