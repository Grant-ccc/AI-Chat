import Sidebar from "./pages/Sidebar"
import { Outlet } from "react-router-dom"
import { useChatStore } from "./store/useChatStore"
import { HiBars3 } from 'react-icons/hi2'

export default function Layout() {
  const toggleSidebar = useChatStore((s) => s.toggleSidebar)
  const sidebarOpen = useChatStore((s) => s.sidebarOpen)
  const closeSidebar = useChatStore((s) => s.closeSidebar)

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* 手机遮罩层 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-white flex items-center px-4 shrink-0">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg mr-2 lg:hidden"
          >
            <HiBars3 className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-semibold text-gray-800">AI Chat</span>
          <div className="flex-1" />
          <button
            onClick={() => useChatStore.getState().clearMessages()}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            清空对话
          </button>
        </header>

        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
