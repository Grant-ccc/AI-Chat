// onMessage — 每收到一个字就调用它
// onDone — 全部收完了调用它
// onError — 出错了调用它
export async function streamChat({ url, headers, body, onMessage, onDone, onError, signal }) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            signal,
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            const errorMsg = errorData.error?.message || `服务器返回了 ${response.status}`
            throw new Error(errorMsg)
        }

        const reader = response.body.getReader()//这个body是数据流 getReader() 就是接上一根"水管"，之后可以一块一块地读。
        const decoder = new TextDecoder("utf-8")//TextDecoder 是把二进制字节转成字符串用的

        // Coze SSE 是 event + data 成对出现，需要记住上一行的 event 类型
        let lastEvent = ""

        //循环读数据
        while (true) {
            const { value, done } = await reader.read()
            if (done) break //是否读完

            const chunk = decoder.decode(value, { stream: true })

            const lines = chunk
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean)

            for (const line of lines) {
                // Coze 格式：先一行 "event: xxx"，再一行 "data: {...}"
                if (line.startsWith("event:")) {
                    lastEvent = line.slice(6).trim()
                    continue
                }

                const jsonStr = line.startsWith("data:")
                    ? line.slice(5).trim()
                    : line

                if (jsonStr === "[DONE]") {
                    onDone?.()
                    return
                }

                try {
                    const data = JSON.parse(jsonStr) //每次返回都是Json 取出message。content就是这一帧的文字

                    // Coze 流：只处理 delta 事件里的 answer 类型
                    if (lastEvent === "conversation.message.delta") {
                        if (data.type === "answer" && data.content) {
                            onMessage?.(data.content)
                        }
                        continue
                    }
 
                    // Coze 流：对话完成事件
                    if (lastEvent === "conversation.chat.completed") {
                        onDone?.()
                        return
                    }

                    //ollama格式
                    if (data.message?.content) {
                        onMessage?.(data.message.content)
                        continue
                    }

                    const delta = data.choices?.[0]?.delta?.content
                    if (delta) {
                        onMessage?.(delta)
                    }
                } catch (err) {
                    console.warn("JSON parse error:", err)
                }
            }
        }
        onDone?.()
    } catch (err) {
        onError?.(err)
    }
}