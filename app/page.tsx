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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-4">哄老板模拟器</h1>
          <p className="text-lg text-green-600 mb-2">职场求生指南 · 化解老板怒火的艺术</p>
          <Badge variant="secondary" className="bg-green-200 text-green-800">
            极简MVP版
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-green-200 hover:border-green-400"
              onClick={() => handleScenarioSelect(scenario)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{scenario.icon}</div>
                <CardTitle className="text-green-800">{scenario.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">{scenario.description}</p>
                <Button
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleScenarioSelect(scenario)
                  }}
                >
                  开始挑战
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">游戏规则</h3>
              <div className="text-sm text-green-600 space-y-1">
                <p>• 老板满意度从0分开始，目标是10轮对话内达到100分</p>
                <p>• 每次选择都会影响老板的情绪，选择要慎重哦</p>
                <p>• 有些选项看起来很搞笑，但可能让情况更糟糕</p>
                <p>• 保持职场礼貌，展现你的情商和智慧</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
