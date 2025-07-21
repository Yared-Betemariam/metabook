import React from "react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types";
import ReactMarkdown from "react-markdown";
import { IoPerson } from "react-icons/io5";
import remarkGfm from "remark-gfm";
import { ThreeDots } from "react-loader-spinner";

// Optional: Icons for each author
const authorIcons: Record<ChatMessage["author"], React.ReactNode> = {
  user: (
    <div className="bg-gradient-to-b from-blue-600 to-primary rounded-full size-8 text-white/40 relative overflow-hidden">
      <IoPerson className="absolute -bottom-0.5 -left-0 size-7" />
    </div>
  ),
  ai: (
    <svg
      className="size-8"
      xmlns="http://www.w3.org/2000/svg"
      width="55"
      height="55"
      viewBox="0 0 55 55"
      fill="none"
    >
      <rect
        width="55"
        height="55"
        rx="27.5"
        fill="url(#paint0_radial_2794_2)"
      />
      <path
        d="M24.4613 44.185C21.3505 45.3172 17.9108 43.7132 16.7785 40.6025L10.0046 21.9912C13.343 21.1908 16.8227 23.0041 18.025 26.3072L24.501 44.0999C24.5133 44.1343 24.4956 44.1722 24.4613 44.185Z"
        stroke="white"
        stroke-width="2"
      />
      <path
        d="M45.2794 34.5542C41.9519 35.3749 38.4722 33.5713 37.2734 30.2776L30.2576 11.002C33.4339 9.91156 36.9108 11.5617 38.0643 14.7307L45.2794 34.5542Z"
        stroke="white"
        stroke-width="2"
      />
      <path
        d="M33.1403 34.8852C29.8127 35.706 26.333 33.9024 25.1342 30.6087L21.8931 21.7036C25.2314 20.9033 28.7111 22.7166 29.9134 26.0196L33.1403 34.8852Z"
        stroke="white"
        stroke-width="2"
      />
      <defs>
        <radialGradient
          id="paint0_radial_2794_2"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(27.5 27.5) rotate(90) scale(27.5)"
        >
          <stop stop-color="#4184D1" />
          <stop offset="1" stop-color="#2F35A2" />
        </radialGradient>
      </defs>
    </svg>
  ),
  metabook: null,
};

type MessageProps = {
  message?: ChatMessage;
  isLoading?: boolean;
};

const Message: React.FC<MessageProps> = ({ message, isLoading }) => {
  if (message?.author === "metabook") return null;
  return (
    <div
      className={cn("mb-4 flex flex-col gap-2.5", {
        "items-end": message?.author === "user",
        "items-start": message?.author === "ai",
      })}
    >
      {authorIcons[message?.author || "ai"]}
      <div
        className={cn(
          "text-sm max-w-[80%] relative p-3 py-2 rounded-lg flex flex-col gap-2 drop-shadow-md",
          {
            "bg-primary text-white ml-auto": message?.author === "user",
            "bg-white text-gray-900 mr-auto": message?.author === "ai",
          }
        )}
      >
        <span
          className={cn("size-3 rotate-45  absolute -top-1.5", {
            "right-2.5 bg-primary": message?.author === "user",
            "left-2.5 bg-white": message?.author === "ai",
          })}
        />
        {message && !isLoading && (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        )}
        {isLoading && (
          <>
            <ThreeDots
              height="20"
              width="32"
              radius="9"
              color="#000000"
              ariaLabel="three-dots-loading"
              visible={true}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Message;
