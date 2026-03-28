import { modelConfig } from "../config/modelConfig";

export function getModelConfig() {
  const key = modelConfig.current;
  return modelConfig[key];
}

export function createChatRequest(messages, modelKey) {
  const config = modelConfig[modelKey];
  const { baseURL, apiPath, headers } = config;
  const url = `${baseURL}${apiPath}`;

  // ✅ Coze 的请求体格式和 OpenAI 不同，单独处理
  if (modelKey === "coze") {
    // Coze 只需要发最后一条用户消息，历史由 auto_save_history 控制
    // 这里我们自己管历史，所以只传最新一条 user 消息
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
    return {
      url,
      headers,
      body: {
        bot_id: config.botId,
        user_id: "frontend-user",        // 固定值即可，用来标识会话用户
        stream: true,
        auto_save_history: false,        // 历史由你的前端自己管理
        additional_messages: [
          { role: "user", content: lastUserMsg?.content ?? "" }
        ],
      },
    };
  }

  // OpenAI / Ollama / DeepSeek 走原来的逻辑
  return {
    url,
    headers,
    body: {
      model: config.model,
      messages,
      stream: true,
    },
  };
}