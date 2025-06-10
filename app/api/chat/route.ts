import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages, scenario, currentScore, round } = await req.json()

    const systemPrompt = `你是一个职场老板角色扮演AI。当前场景：${scenario}

游戏规则：
1. 老板当前满意度：${currentScore}/100分
2. 当前第${round}/10轮对话
3. 你需要根据用户之前的回答，生成老板的下一句话和6个用户回复选项
4. 选项分配：2个加分项(+8到+20分)，4个减分项(-5到-15分)
5. 减分项中要有1-2个特别奇葩搞笑的选项
6. 保持对话连贯性，体现老板的情绪变化
7. 文风要职场化但带点幽默

你必须严格按照以下JSON格式返回，不要添加任何其他内容：
{
  "bossMessage": "老板的具体回复内容",
  "options": [
    {"text": "认真道歉并提出具体改进措施", "score": 15},
    {"text": "承认错误并立即整改", "score": 12},
    {"text": "找借口推脱责任", "score": -8},
    {"text": "质疑老板的管理方式", "score": -12},
    {"text": "提议先去吃饭再谈工作", "score": -15},
    {"text": "转移话题问老板心情", "score": -10}
  ]
}`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "Boss Coaxing Simulator",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-preview-05-20",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // 尝试解析JSON，如果失败则提供默认响应
    let parsedContent
    try {
      parsedContent = JSON.parse(content)
    } catch (e) {
      parsedContent = {
        bossMessage: "我需要看到你的诚意和改进措施！",
        options: [
          { text: "老板，我深刻反思了，制定了详细的改进计划", score: 15 },
          { text: "这次确实是我的问题，我会立即整改", score: 10 },
          { text: "老板您说得对，我以后注意", score: -5 },
          { text: "我觉得这个问题不算太严重吧", score: -10 },
          { text: "要不我们先吃个饭再聊？", score: -15 },
          { text: "老板，您今天心情不好吗？", score: -8 },
        ],
      }
    }

    return NextResponse.json(parsedContent)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
