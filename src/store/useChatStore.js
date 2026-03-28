import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { streamChat } from "../utils/sse"
import { createChatRequest } from "../api/openai"

const genId = () => Math.random().toString(36).slice(2, 10)

export const useChatStore = create(
    persist(
        (set, get) => ({
            conversations: [],
            activeId: null,
            messages: [],
            isStreaming: false,
            sidebarOpen: false,
            abortController: null,
            currentModel: "ollama",

            toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
            closeSidebar: () => set({ sidebarOpen: false }),
            setModel: (model) => set({ currentModel: model }),

            setStreaming: (v) => set({ isStreaming: v }),
            stopStreaming: () => {
                get().abortController?.abort()
                set({ isStreaming: false })
            },

            createConversation() {
                const id = genId()
                set((s) => ({
                    conversations: [
                        { id, title: "新对话", messages: [] },
                        ...s.conversations,
                    ],
                    activeId: id,
                }))
            },

            setActive: (id) => set({ activeId: id }),

            deleteConversation: (id) => set((s) => {
                const list = s.conversations.filter(c => c.id !== id)
                return {
                    conversations: list,
                    activeId: s.activeId === id ? (list[0]?.id ?? null) : s.activeId,
                }
            }),

            addMessage: (msg) => set((s) => ({
                conversations: s.conversations.map(c =>
                    c.id === s.activeId
                        ? { ...c, messages: [...c.messages, msg] }
                        : c
                )
            })),

            updateLastMessage: (delta) => set((s) => ({
                conversations: s.conversations.map(c => {
                    if (c.id !== s.activeId) return c
                    const msgs = [...c.messages]
                    const last = msgs[msgs.length - 1]
                    if (!last || last.role !== "assistant") return c
                    msgs[msgs.length - 1] = { ...last, content: last.content + delta }
                    return { ...c, messages: msgs }
                })
            })),

            sendMessage: async (text) => {
                const controller = new AbortController()
                const { currentModel, activeId } = get()
                if (!activeId) return

                set((s) => ({
                    conversations: s.conversations.map(c =>
                        c.id === activeId && c.messages.length === 0
                            ? { ...c, title: text.slice(0, 20) }
                            : c
                    )
                }))

                get().addMessage({ id: Date.now(), role: "user", content: text })
                get().addMessage({ id: Date.now() + 1, role: "assistant", content: "" })
                set({ isStreaming: true, abortController: controller })

                const activeMessages = get().conversations
                    .find(c => c.id === activeId)?.messages ?? []

                const req = createChatRequest(
                    activeMessages
                        .filter(m => m.content)
                        .map(({ role, content }) => ({ role, content })),
                    currentModel
                )

                await streamChat({
                    url: req.url,
                    headers: req.headers,
                    body: req.body,
                    signal: controller.signal,
                    onMessage: (delta) => get().updateLastMessage(delta),
                    onDone: () => set({ isStreaming: false }),
                    onError: (err) => {
                        set({isStreaming: false})
                        const activeId = get().activeId
                        if(!activeId) return

                        set((s) => ({
                            conversations: s.conversations.map(c =>
                                c.id === activeId
                                ? {
                                    ...c,
                                    messages: [
                                        ...c.messages.filter(m => m.content !== ""),
                                        { id: Date.now(), role: "system", content: `❌ 出错啦：${err.message || "未知错误"}` }
                                    ]
                                }
                                : c
                            )
                        }))
                    },
                })
            },

            clearMessages: () => set((s) => ({
                conversations: s.conversations.map(c =>
                    c.id === s.activeId ? { ...c, messages: [] } : c
                )
            }))

        }),
        {
            name: 'ai-chat-storage',
            partialize: (state) => ({
                conversations: state.conversations,
                activeId: state.activeId,
                currentModel: state.currentModel,
            })
        }
    )
)