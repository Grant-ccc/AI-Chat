export const modelConfig = {
    current: "ollama",

    ollama: {
        baseURL:"http://localhost:11434",
        apiPath:"/api/chat",
        model: "llama3.2",
        headers: {
            "Content-Type": "application/json",
        },
    },

    deepseek: {
        baseURL: "https://api.deepseek.com/v1",
        apiPath: "/chat/completions",
        model: "deepseek-chat",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_KEY}`,
        },
    },

    coze: {
    baseURL: "https://api.coze.cn",
    apiPath: "/v3/chat",
    botId: import.meta.env.VITE_COZE_BOT_ID,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_COZE_KEY}`,
    },
},
}