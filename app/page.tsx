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
    <div className="min-h-screen relative bg-black text-white overflow-hidden">
      {/* Enhanced Background with Grid Pattern and Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="relative border-b border-gray-800/50 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/25">
                <span className="text-white font-bold text-sm">哄</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg blur opacity-50 -z-10"></div>
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Boss Coaxing Simulator</h1>
            </div>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 shadow-lg shadow-orange-500/10">
              极简MVP版
            </Badge>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 relative">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
              哄老板模拟器
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent blur-2xl -z-10"></div>
          </h1>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            职场求生指南 · 化解老板怒火的艺术
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-700/50 shadow-2xl">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="text-sm text-gray-300">AI驱动的职场模拟器</span>
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {scenarios.map((scenario, index) => (
            <Card
              key={scenario.id}
              className="relative bg-gray-900/40 border-gray-700/50 hover:border-orange-500/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer group backdrop-blur-xl overflow-hidden"
              onClick={() => handleScenarioSelect(scenario)}
              style={{
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.6) 0%, rgba(17, 24, 39, 0.3) 100%)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg blur-xl"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="relative w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center text-xl group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-all duration-300 shadow-lg">
                      {scenario.icon}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg"></div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg font-semibold group-hover:text-orange-100 transition-colors">
                    {scenario.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                    {scenario.description}
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white border-0 h-10 font-medium text-sm transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:shadow-lg relative overflow-hidden group/btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleScenarioSelect(scenario)
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      开始挑战
                      <svg className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </CardContent>
              </div>

              {/* Animated Border */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/20 via-transparent to-red-500/20 animate-pulse"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Game Rules */}
        <Card className="relative bg-gray-900/40 border-gray-700/50 backdrop-blur-xl overflow-hidden" style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.4) 0%, rgba(17, 24, 39, 0.2) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-purple-500/5"></div>
          <CardContent className="relative z-10 p-8">
            <div className="flex items-center mb-6">
              <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">游戏规则</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start group">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5 shadow-lg group-hover:shadow-orange-500/25 transition-shadow">
                    <span className="text-orange-400 text-sm font-bold">1</span>
                  </div>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors">老板满意度从0分开始，目标是10轮对话内达到100分</p>
                </div>
                <div className="flex items-start group">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5 shadow-lg group-hover:shadow-orange-500/25 transition-shadow">
                    <span className="text-orange-400 text-sm font-bold">2</span>
                  </div>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors">每次选择都会影响老板的情绪，选择要慎重哦</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start group">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5 shadow-lg group-hover:shadow-orange-500/25 transition-shadow">
                    <span className="text-orange-400 text-sm font-bold">3</span>
                  </div>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors">有些选项看起来很搞笑，但可能让情况更糟糕</p>
                </div>
                <div className="flex items-start group">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5 shadow-lg group-hover:shadow-orange-500/25 transition-shadow">
                    <span className="text-orange-400 text-sm font-bold">4</span>
                  </div>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors">保持职场礼貌，展现你的情商和智慧</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
