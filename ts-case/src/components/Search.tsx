import React, { useState, useEffect, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import toml from 'toml'

interface ContentItem {
  title: string
  content: string
  keywords: string[]
}

interface Category {
  name: string
  items: ContentItem[]
}

interface KnowledgeBase {
  [key: string]: Category
}

const AdvancedSearch: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('')
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase>({})
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  async function fetchTomlContent() {
    try {
      const response = await fetch('/base/KnowledgeBase.toml')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const tomlContent = await response.text() // 获取文本内容
      return tomlContent // 返回 TOML 文件内容
    } catch (error) {
      console.error('Fetch error: ', error)
      return null // 在发生错误时返回 null
    }
  }

  useEffect(() => {
    const fetchAndParseToml = async () => {
      const tomlContent = await fetchTomlContent()
      if (tomlContent) {
        const parsedData = toml.parse(tomlContent) as KnowledgeBase
        setKnowledgeBase(parsedData)
      }
    }

    fetchAndParseToml() // 调用异步函数
  }, [])

  const semanticMatch = (text: string, query: string): number => {
    const textWords = text.toLowerCase().split(/\s+/)
    const queryWords = query.toLowerCase().split(/\s+/)

    let score = 0
    for (const queryWord of queryWords) {
      for (const textWord of textWords) {
        if (textWord.includes(queryWord) || queryWord.includes(textWord)) {
          score += 1
        }
      }
    }
    return score
  }

  const searchResults = useMemo(() => {
    if (!keyword.trim()) return []

    const results: {
      category: string
      item: ContentItem
      relevance: number
    }[] = []

    Object.entries(knowledgeBase).forEach(([categoryKey, category]) => {
      category.items.forEach((item) => {
        console.log(categoryKey)
        const searchableText = `${item.title} ${
          item.content
        } ${item.keywords.join(' ')}`
        const relevance = semanticMatch(searchableText, keyword)

        if (relevance > 0) {
          results.push({ category: category.name, item, relevance })
        }
      })
    })

    return results.sort((a, b) => b.relevance - a.relevance)
  }, [keyword, knowledgeBase])

  const toggleItem = (category: string, title: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      const key = `${category}-${title}`
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  // 透明效果 bg-opacity-80 backdrop-blur-sm

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-black bg-opacity-80 backdrop-blur-sm shadow-lg rounded-lg">
      <div className="relative mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full px-4 py-2 pr-10 border rounded-full text-white bg-black focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="输入搜索关键词"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
      </div>

      {searchResults.length > 0 ? (
        <div className="space-y-4 bg-black">
          {searchResults.map(({ category, item }, index) => {
            const isExpanded = expandedItems.has(`${category}-${item.title}`)
            return (
              <div
                key={index}
                className="p-4 rounded-lg bg-black hover:bg-gray-900 transition-colors"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleItem(category, item.title)}
                >
                  {/* 搜索标题 */}
                  <h3 className="text-lg font-semibold text-blue-500">
                    {item.title}
                  </h3>
                  {isExpanded ? (
                    <ChevronUp size={20} className="text-blue-700" />
                  ) : (
                    <ChevronDown size={20} className="text-blue-500" />
                  )}
                </div>
                {/* 分类 */}
                <p className="text-sm text-gray-500 mt-1">{category}</p>
                {isExpanded && (
                  <div className="mt-2">
                    <p className="text-gray-200">{item.content}</p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {/* 搜索关键字 */}
                      {item.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="bg-gray-600 text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        keyword && (
          <p className="text-center mt-4 text-gray-500">没有找到匹配的结果</p>
        )
      )}
    </div>
  )
}

export default AdvancedSearch
