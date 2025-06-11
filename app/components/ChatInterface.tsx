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
    <div className="min-h-screen relative bg-black text-white overflow-hidden">
      {/* Enhanced Background with Grid Pattern and Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="relative border-b border-gray-800/50 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="hover:bg-gray-800/50 text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回
              </Button>
              <div>
                <h2 className="font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{scenario.title}</h2>
                <p className="text-sm text-gray-400">第 {round}/10 轮</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">老板满意度</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Progress value={currentScore} className="w-32 h-2" />
                  <span className="text-sm font-medium text-white">{currentScore}/100</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetGame}
                className="hover:bg-gray-800/50 text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="relative max-w-4xl mx-auto px-6 py-6">
        <div className="space-y-4 mb-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-500`} style={{animationDelay: `${index * 100}ms`}}>
              <div className="flex items-start space-x-3 max-w-3xl">
                {message.role === "boss" && <BossAvatar />}
                <div
                  className={`relative p-3 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                    message.role === "user" 
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20" 
                      : "bg-gray-900/80 text-white border border-gray-700/50 shadow-lg"
                  }`}
                  style={{
                    background: message.role === "user" 
                      ? 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)'
                      : 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(17, 24, 39, 0.6) 100%)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: message.role === "user"
                      ? '0 8px 32px rgba(249, 115, 22, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      : '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                  {/* Glow effect for user messages */}
                  {message.role === "user" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur opacity-50 -z-10"></div>
                  )}
                </div>
                {message.role === "user" && <UserAvatar />}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Game Over */}
        {gameOver && (
          <div className="mb-6 animate-in fade-in-0 zoom-in-95 duration-500">
            <Card className={`relative backdrop-blur-xl overflow-hidden ${
              gameResult === "win" 
                ? "bg-green-900/30 border-green-700/50" 
                : "bg-red-900/30 border-red-700/50"
            }`} style={{
              background: gameResult === "win"
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}>
              <div className={`absolute inset-0 ${
                gameResult === "win" ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10" : "bg-gradient-to-r from-red-500/10 to-rose-500/10"
              }`}></div>
              <CardContent className="relative z-10 p-6 text-center">
                <div className="text-4xl mb-3 animate-bounce">{gameResult === "win" ? "🎉" : "😵"}</div>
                <h3 className={`text-xl font-bold mb-3 ${
                  gameResult === "win" ? "text-green-400" : "text-red-400"
                }`}>
                  {gameResult === "win" ? "成功哄好老板！" : "游戏结束"}
                </h3>
                <p className={`mb-4 ${
                  gameResult === "win" ? "text-green-300" : "text-red-300"
                }`}>
                  {gameResult === "win"
                    ? `恭喜你！经过 ${round} 轮对话，老板满意度达到了 ${currentScore} 分！`
                    : `很遗憾，${round} 轮对话后老板满意度只有 ${currentScore} 分。`}
                </p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={resetGame} 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 px-8 py-3 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300"
                  >
                    重新开始
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onBack} 
                    className="border-gray-600/50 hover:bg-gray-800/50 text-white px-8 py-3 backdrop-blur-sm transition-all duration-300"
                  >
                    返回主页
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Options */}
        {!gameOver && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleOptionSelect(option)}
                disabled={isLoading}
                className="relative text-left h-auto p-3 whitespace-normal hover:bg-gray-800/50 border-gray-700/50 bg-gray-900/40 text-white group transition-all duration-300 backdrop-blur-xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.4) 0%, rgba(17, 24, 39, 0.2) 100%)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg"></div>
                </div>
                
                <div className="relative z-10 flex justify-between items-start">
                  <span className="text-sm leading-relaxed flex-1 pr-2 group-hover:text-gray-200 transition-colors">{option.text}</span>
                  <span
                    className={`ml-2 text-xs px-2 py-1 rounded-full transition-all duration-300 ${
                      option.score > 0
                        ? "bg-green-500/20 text-green-400 border border-green-500/30 group-hover:bg-green-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30 group-hover:bg-red-500/30"
                    }`}
                  >
                    {option.score > 0 ? "+" : ""}{option.score}
                  </span>
                </div>
                
                {/* Animated border */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/20 via-transparent to-red-500/20"></div>
                </div>
              </Button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce shadow-lg shadow-orange-500/50"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce shadow-lg shadow-orange-500/50" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce shadow-lg shadow-orange-500/50" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
