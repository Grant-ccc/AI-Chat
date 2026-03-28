import { useChatStore } from '../store/useChatStore'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import { useEffect, useRef } from "react"
import { HiBars3 } from 'react-icons/hi2'

export default function Chat() {
    const toggleSidebar = useChatStore((s) => s.toggleSidebar)
    const clearMessages = useChatStore((s) => s.clearMessages)
    const bottomRef = useRef(null)
    const activeId = useChatStore((s) => s.activeId)
const conversations = useChatStore((s) => s.conversations)
const messages = conversations.find(c => c.id === activeId)?.messages ?? []

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    return (
        <div className="flex flex-col h-full">

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gray-50">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} {...msg} />
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="bg-white border-t px-4 py-3">
                <ChatInput />
            </div>
        </div>
    )
}