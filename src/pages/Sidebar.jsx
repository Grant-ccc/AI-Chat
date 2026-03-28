import { useChatStore } from '../store/useChatStore'
import { HiOutlineChatBubbleLeftRight, HiPlus, HiTrash } from 'react-icons/hi2'

export default function Sidebar() {
  const sidebarOpen = useChatStore((s) => s.sidebarOpen)
  const currentModel = useChatStore((s) => s.currentModel)
  const setModel = useChatStore((s) => s.setModel)
  const conversations = useChatStore((s) => s.conversations)
  const activeId = useChatStore((s) => s.activeId)
  const createConversation = useChatStore((s) => s.createConversation)
  const setActive = useChatStore((s) => s.setActive)
  const deleteConversation = useChatStore((s) => s.deleteConversation)

  return (
    <div className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200
      flex flex-col transition-transform duration-300 ease-in-out
      lg:relative lg:translate-x-0
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    `}>
      <div className="flex items-center gap-2 p-4 border-b h-14">
        <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-blue-500 shrink-0" />
        <span className="font-semibold text-base">AI Chat</span>
      </div>

      <div className="p-2">
        <button 
          onClick={createConversation}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-gray-100 text-gray-700"
        >
          <HiPlus className="w-4 h-4" />
          新对话
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {conversations.map(conv => (
          <div
            key={conv.id}
            onClick={() => setActive(conv.id)}
            className={`
              flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer group
              ${activeId === conv.id ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}
            `}
          >
            <span className="truncate flex-1">{conv.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id) }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 shrink-0"
            >
              <HiTrash className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="text-xs text-gray-400 mb-1">模型</div>
        <select
          value={currentModel}
          onChange={(e) => setModel(e.target.value)}
          className="w-full border rounded-lg px-2 py-1.5 text-sm outline-none"
        >
          <option value="ollama">Ollama（本地）</option>
          <option value="deepseek">DeepSeek</option>
          <option value="coze">Coze RAG</option>
        </select>
      </div>
    </div>
  )
}