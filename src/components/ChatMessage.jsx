import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useChatStore } from "../store/useChatStore"

export default function ChatMessage({ role, content }) {
  const isUser = role === "user"
  const isSystem = role === "system"
  const isLoading = !isUser && content.length === 0

  return (
    <div
      className={`chat-message ${isUser ? 'assistant' : 'user'}`}
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "12px"
      }}
    >
      <div
        className="chat-bubble"
        style={{
          maxWidth: "80%",
          padding: "10px 14px",
          borderRadius: "10px",
          background: isSystem ? "#fff1f0" : (isUser ? "#1677ff" : "#e8e8e8"),
          color: isSystem ? "#ff4d4f" : (isUser ? "white" : "black"),
          border: isSystem ? "1px solid #ffccc7" : "none",
          lineHeight: "1.6",
          wordBreak: "break-word",
          overflowWrap: "antwhere",
        }}
      >
        {isSystem && <b className="mr-1">系统通知:</b>}
        {/* Markdown渲染 */}
        {isLoading ? (
          <div className="flex items-center">
            <span className="text-gray-500 text-sm mr-2">AI 正在思考</span>
            <span className="cursor-loading"></span>
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "")

                return (!inline && match) ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customSytle={{
                      margin: "8px 0",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    style={{
                      background: "rgba(0, 0 , 0, 0.1)",
                      padding: "2px 4px",
                      borderRadius: "4px",
                      fontSize: "13px",
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                )
              }
            }}
          >
            {content}
          </ReactMarkdown>
        )}

        {!isUser && content.length > 0 && useChatStore.getState().isStreaming && (
          <span className="cursor-loading !bg-current opacity-70 w-[2px] h-[1em]"></span>
        )}

      </div>
    </div>
  )
}