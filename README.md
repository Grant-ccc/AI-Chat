# AI Chat

基于 React + Zustand 构建的 AI 对话应用，支持多模型切换、流式输出、多会话管理等功能。

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + Vite 8 |
| 状态管理 | Zustand 5（含持久化） |
| 路由 | React Router DOM 7 |
| 样式 | Tailwind CSS |
| Markdown 渲染 | react-markdown + remark-gfm |
| 代码高亮 | react-syntax-highlighter |
| 图标 | react-icons |
| HTTP 请求 | Axios |

---

## 功能特性

### 多模型支持
- **Ollama**（本地模型，默认 llama3.2）
- **DeepSeek**（云端 API）
- **Coze RAG**（支持知识库检索）
- 对话框内和侧边栏均可随时切换模型

### 流式输出
- 基于原生 `fetch` + `ReadableStream` 实现 SSE 流式响应
- 兼容 OpenAI 格式、Ollama 格式、Coze 格式三种数据协议
- 支持中途**停止生成**

### 多会话管理
- 支持新建、切换、删除会话
- 会话标题自动取第一条消息内容
- 使用 Zustand persist 持久化，刷新后会话记录不丢失

### Markdown 渲染
- 支持代码块语法高亮（oneDark 主题）
- 支持表格、删除线、任务列表等 GFM 扩展语法
- AI 回复流式输出时显示光标动画

### 响应式布局
- 侧边栏在移动端默认收起，点击汉堡菜单展开
- 大屏常驻显示侧边栏

---

## 快速开始

**环境要求：** Node.js >= 20.19.0

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 环境变量配置

在项目根目录新建 `.env.local` 文件：

```env
VITE_DEEPSEEK_KEY=你的DeepSeek API Key
VITE_COZE_KEY=你的Coze API Key
VITE_COZE_BOT_ID=你的Coze Bot ID
```

### 使用 Ollama 本地模型

需要本地安装并启动 Ollama，默认使用 `llama3.2` 模型：

```bash
ollama run llama3.2
```

---

## 目录结构

```
src/
├── App.jsx               # 路由配置
├── Layout.jsx            # 整体布局
├── main.jsx              # 入口文件
├── index.css             # 全局样式（含光标动画）
├── api/
│   └── openai.js         # 各模型请求体构建
├── config/
│   └── modelConfig.js    # 模型配置（baseURL、model、headers）
├── components/
│   ├── ChatMessage.jsx   # 消息气泡（含Markdown渲染）
│   └── ChatInput.jsx     # 输入框（含发送/停止按钮）
├── pages/
│   ├── Chat.jsx          # 对话主页面
│   └── Sidebar.jsx       # 侧边栏（会话列表+模型选择）
├── store/
│   └── useChatStore.js   # 全局状态（会话、流式输出、模型）
└── utils/
    └── sse.js            # SSE 流式请求封装
```

---

## License

MIT
