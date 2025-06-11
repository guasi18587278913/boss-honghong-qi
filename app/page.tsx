"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ChatInterface from "./components/ChatInterface"

const scenarios = [
  {
    id: 1,
    title: "迟到危机",
    description: "你今天约客户在公司开会，但是你迟到了两小时，老板很生气。",
    icon: "⏰",
  },
  {
    id: 2,
    title: "日报失踪",
    description: "你连续一周没有发日报。",
    icon: "📝",
  },
  {
    id: 3,
    title: "深夜失联",
    description: "老板昨天晚上有紧急的事情找你，发微信，你没有及时回复。",
    icon: "📱",
  },
  {
    id: 4,
    title: "AI效率质疑",
    description: "老板认为使用AI工具可以提效1000%，而你使用AI工具只提升了10%",
    icon: "🤖",
  },
]

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState<(typeof scenarios)[0] | null>(null)
  const [gameStarted, setGameStarted] = useState(false)

  const handleScenarioSelect = (scenario: (typeof scenarios)[0]) => {
    setSelectedScenario(scenario)
    setGameStarted(true)
  }

  const handleBackToMenu = () => {
    setSelectedScenario(null)
    setGameStarted(false)
  }

  if (gameStarted && selectedScenario) {
    return <ChatInterface scenario={selectedScenario} onBack={handleBackToMenu} />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">哄</span>
              </div>
              <h1 className="text-xl font-semibold">Boss Coaxing Simulator</h1>
            </div>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              极简MVP版
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              哄老板模拟器
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            职场求生指南 · 化解老板怒火的艺术
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-gray-900 rounded-full border border-gray-700">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm text-gray-300">AI驱动的职场模拟器</span>
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="bg-gray-900/50 border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer group backdrop-blur-sm"
              onClick={() => handleScenarioSelect(scenario)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-2xl group-hover:bg-orange-500/20 transition-colors">
                    {scenario.icon}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <CardTitle className="text-white text-xl">{scenario.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-6 leading-relaxed">{scenario.description}</p>
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 h-12 font-medium"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleScenarioSelect(scenario)
                  }}
                >
                  开始挑战
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Rules */}
        <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white">游戏规则</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-orange-400 text-sm font-bold">1</span>
                  </div>
                  <p className="text-gray-300">老板满意度从0分开始，目标是10轮对话内达到100分</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-orange-400 text-sm font-bold">2</span>
                  </div>
                  <p className="text-gray-300">每次选择都会影响老板的情绪，选择要慎重哦</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-orange-400 text-sm font-bold">3</span>
                  </div>
                  <p className="text-gray-300">有些选项看起来很搞笑，但可能让情况更糟糕</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-orange-400 text-sm font-bold">4</span>
                  </div>
                  <p className="text-gray-300">保持职场礼貌，展现你的情商和智慧</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
