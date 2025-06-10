"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, RotateCcw } from "lucide-react"

interface Scenario {
  id: number
  title: string
  description: string
  icon: string
}

interface Message {
  role: "user" | "boss"
  content: string
  timestamp: Date
}

interface Option {
  text: string
  score: number
}

interface ChatInterfaceProps {
  scenario: Scenario
  onBack: () => void
}

export default function ChatInterface({ scenario, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentScore, setCurrentScore] = useState(0)
  const [round, setRound] = useState(1)
  const [options, setOptions] = useState<Option[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // 初始化游戏
    initializeGame()
  }, [])

  const initializeGame = async () => {
    setIsLoading(true)

    // 添加初始老板消息
    const initialBossMessage: Message = {
      role: "boss",
      content: getInitialBossMessage(scenario.id),
      timestamp: new Date(),
    }

    setMessages([initialBossMessage])

    // 生成初始选项
    await generateNextOptions([
      { role: "system", content: `场景：${scenario.description}` },
      { role: "assistant", content: initialBossMessage.content },
    ])

    setIsLoading(false)
  }

  const getInitialBossMessage = (scenarioId: number): string => {
    const initialMessages = {
      1: "你知道现在几点了吗？客户都等了两个小时了！你到底在干什么？",
      2: "我发现你已经一周没交日报了，这是什么情况？你是不是觉得工作可有可无？",
      3: "昨天晚上我发微信找你处理紧急事务，你竟然没回复！你把工作当儿戏吗？",
      4: "我看别人用AI工具效率提升了1000%，你怎么只提升了10%？是工具不行还是人不行？",
    }
    return initialMessages[scenarioId as keyof typeof initialMessages] || "我们需要谈谈。"
  }

  const generateNextOptions = async (conversationHistory: any[]) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationHistory,
          scenario: scenario.description,
          currentScore,
          round,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate options")
      }

      const data = await response.json()
      setOptions(data.options || [])
    } catch (error) {
      console.error("Error generating options:", error)
      // 提供默认选项
      setOptions([
        { text: "对不起，这确实是我的错", score: 10 },
        { text: "我会立即改正这个问题", score: 8 },
        { text: "我有我的理由", score: -10 },
        { text: "这不全是我的问题", score: -15 },
        { text: "要不我们先冷静一下？", score: -5 },
        { text: "老板，您今天吃了吗？", score: -20 },
      ])
    }
  }

  const handleOptionSelect = async (option: Option) => {
    setIsLoading(true)

    // 添加用户消息
    const userMessage: Message = {
      role: "user",
      content: option.text,
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)

    // 更新分数
    const newScore = Math.max(0, Math.min(100, currentScore + option.score))
    setCurrentScore(newScore)

    // 检查游戏结束条件
    if (round >= 10 || newScore >= 100) {
      setGameOver(true)
      setGameResult(newScore >= 100 ? "win" : "lose")
      setIsLoading(false)
      return
    }

    // 生成老板回复
    try {
      const conversationHistory = [
        { role: "system", content: `场景：${scenario.description}` },
        ...newMessages.map((msg) => ({
          role: msg.role === "boss" ? "assistant" : "user",
          content: msg.content,
        })),
      ]

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationHistory,
          scenario: scenario.description,
          currentScore: newScore,
          round: round + 1,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()

      // 确保数据格式正确
      if (!data.bossMessage || !data.options || !Array.isArray(data.options)) {
        throw new Error("Invalid response format")
      }

      // 添加老板回复
      const bossMessage: Message = {
        role: "boss",
        content: data.bossMessage,
        timestamp: new Date(),
      }

      const finalMessages = [...newMessages, bossMessage]
      setMessages(finalMessages)
      setOptions(data.options)
      setRound(round + 1)
    } catch (error) {
      console.error("Error generating boss response:", error)

      // 提供备用选项，确保游戏可以继续
      const fallbackOptions = [
        { text: "老板，我深刻反思了，制定了详细的改进计划", score: 15 },
        { text: "这次确实是我的问题，我会立即整改", score: 12 },
        { text: "我以后会更加注意这个问题", score: 8 },
        { text: "老板您说得对，我接受批评", score: -5 },
        { text: "我觉得这个问题不算太严重吧", score: -10 },
        { text: "要不我们先吃个饭再聊？", score: -15 },
      ]

      const fallbackBossMessage: Message = {
        role: "boss",
        content: "我需要看到你的诚意和具体的改进措施！",
        timestamp: new Date(),
      }

      const finalMessages = [...newMessages, fallbackBossMessage]
      setMessages(finalMessages)
      setOptions(fallbackOptions)
      setRound(round + 1)
    }

    setIsLoading(false)
  }

  const resetGame = () => {
    setMessages([])
    setCurrentScore(0)
    setRound(1)
    setOptions([])
    setGameOver(false)
    setGameResult(null)
    initializeGame()
  }

  const BossAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">👔</div>
  )

  const UserAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">😅</div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <div>
              <h2 className="font-semibold text-green-800">{scenario.title}</h2>
              <p className="text-sm text-green-600">第 {round}/10 轮</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-green-600">老板满意度</p>
              <div className="flex items-center space-x-2">
                <Progress value={currentScore} className="w-24" />
                <Badge variant={currentScore >= 70 ? "default" : currentScore >= 40 ? "secondary" : "destructive"}>
                  {currentScore}/100
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={resetGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              重新开始
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg h-[70vh] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  {message.role === "boss" ? <BossAvatar /> : <UserAvatar />}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.role === "user" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2">
                  <BossAvatar />
                  <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Options or Game Over */}
          <div className="border-t border-gray-200 p-4">
            {gameOver ? (
              <Card className={`${gameResult === "win" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-4">{gameResult === "win" ? "🎉" : "😅"}</div>
                  <h3 className={`text-xl font-bold mb-2 ${gameResult === "win" ? "text-green-800" : "text-red-800"}`}>
                    {gameResult === "win" ? "恭喜过关！" : "挑战失败"}
                  </h3>
                  <p className={`mb-4 ${gameResult === "win" ? "text-green-600" : "text-red-600"}`}>
                    {gameResult === "win"
                      ? `你成功让老板满意度达到了${currentScore}分！职场高手就是你！`
                      : `老板满意度只有${currentScore}分，还需要继续努力哦！`}
                  </p>
                  <div className="space-x-2">
                    <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">
                      再来一次
                    </Button>
                    <Button variant="outline" onClick={onBack}>
                      选择其他场景
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">选择你的回复：</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left h-auto p-3 whitespace-normal hover:bg-green-50 hover:border-green-300"
                      onClick={() => handleOptionSelect(option)}
                      disabled={isLoading}
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
