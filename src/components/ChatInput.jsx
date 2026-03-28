import { useState, useRef, useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'

export default function ChatInput() {
    const textareaRef = useRef(null)
    const [value, setValue] = useState("")

    const isStreaming = useChatStore((s) => s.isStreaming)
    const stopStreaming = useChatStore((s) => s.stopStreaming)
    const sendMessage = useChatStore((s) => s.sendMessage)

    const currentModel = useChatStore((s) => s.currentModel)
    const setModel = useChatStore((s) => s.setModel)

    const handleSend = () => {
        if (!value.trim()) return
        sendMessage(value)
        setValue("")
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
            e.preventDefault()
            handleSend()
        }
    }

    useEffect(() => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = "auto"
        el.style.height = el.scrollHeight + "px"
    }, [value])

    return (
        <div className="w-full flex items-end gap-2">
            {/* 输入框主体 */}
            <div className="flex-1 bg-white border rounded-xl shadow-sm px-4 py-2 flex items-center gap-3">
                {/* 模型选择器 */}
                <select
                    value={currentModel}
                    onChange={(e) => setModel(e.target.value)}
                    className="text-sm border-none bg-transparent outline-none text-gray-600"
                >
                    <option value="ollama">Ollama</option>
                    <option value="deepseek">DeepSeek</option>
                    <option value="coze">Coze RAG</option>
                </select>

                {/* 输入框 */}
                <textarea
                ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="说点什么..."
                    rows={1}
                    className="flex-1 resize-none outline-none text-sm leading-5"
                />

                {/* 发送 / 停止按钮 */}
                {!isStreaming ? (
                    <button
                        onClick={handleSend}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        ↑
                    </button>
                ) : (
                    <button
                        onClick={stopStreaming}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white"
                    >
                        ■
                    </button>
                )}
            </div>
        </div>
    )
}