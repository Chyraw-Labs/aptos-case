import React, { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown, X, Check } from 'lucide-react'

interface Category {
  name: string
  count: number
}

interface Article {
  title: string
  date: string
  description: string
  tags: string[]
}

interface SynologyCMSProps {
  categories: Category[]
  systems: Category[]
  packages: Category[]
  articles: Article[]
}

interface CustomCheckboxProps {
  id: string
  checked: boolean
  onChange: () => void
  label: string
  count: number
}

export default function SynologyCMS({
  categories,
  systems,
  packages,
  articles,
}: SynologyCMSProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSystems, setSelectedSystems] = useState<string[]>([])
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [filteredArticles, setFilteredArticles] = useState(articles)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const filtered = articles.filter((article) => {
      const matchesSearch =
        searchTerm === '' ||
        Object.values(article).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        article.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )

      const matchesCategories =
        selectedCategories.length === 0 ||
        selectedCategories.some((category) => article.tags.includes(category))

      const matchesSystems =
        selectedSystems.length === 0 ||
        selectedSystems.some((system) => article.tags.includes(system))

      const matchesPackages =
        selectedPackages.length === 0 ||
        selectedPackages.some((pkg) => article.tags.includes(pkg))

      return (
        matchesSearch && matchesCategories && matchesSystems && matchesPackages
      )
    })
    setFilteredArticles(filtered)

    // Generate search suggestions
    if (searchTerm.length > 0) {
      const allTerms = articles.flatMap((article) => [
        article.title,
        ...article.tags,
      ])
      const uniqueTerms = Array.from(new Set(allTerms))
      const newSuggestions = uniqueTerms
        .filter((term) => term.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5)
      setSuggestions(newSuggestions)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [
    searchTerm,
    selectedCategories,
    selectedSystems,
    selectedPackages,
    articles,
  ])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 选择
  const toggleFilter = (
    item: string,
    currentSelection: string[],
    setSelection: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelection((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }
  // 复选框

  const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    id,
    checked,
    onChange,
    label,
    count,
  }) => (
    <div className="flex items-center p-2">
      <label htmlFor={id} className="flex items-center w-full cursor-pointer">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 border rounded mr-3 flex items-center justify-center ${
              checked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400'
            }`}
          >
            {checked && <Check size={12} color="white" />}
          </div>
        </div>
        <span className="flex-grow">{label}</span>
        <span className="ml-2">{count}</span>
      </label>
    </div>
  )

  // 过滤选择器
  const renderFilterSection = (
    title: string,
    items: Category[],
    selectedItems: string[],
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => (
    <>
      <h2 className="font-bold mt-6 mb-4">{title}</h2>
      {items.map((item) => (
        <CustomCheckbox
          key={item.name}
          id={item.name}
          checked={selectedItems.includes(item.name)}
          onChange={() =>
            toggleFilter(item.name, selectedItems, setSelectedItems)
          }
          label={item.name}
          count={item.count}
        />
      ))}
    </>
  )

  //

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white overflow-hidden">
      <header className="bg-white bg-opacity-10 p-4 shadow">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Aptos | 知识中心与文档库</h1>
          {/* 搜索框 */}
          <div className="relative w-1/3" ref={searchRef}>
            <input
              type="text"
              placeholder="搜索知识中心"
              className="w-full p-2 pl-10 rounded text-whtie bg-black outline  outline-gray-500 focus:outline-white focus:outline-1 focus:outline-offset-0 focus:bg-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
            {searchTerm && (
              <X
                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                size={20}
                onClick={() => setSearchTerm('')}
              />
            )}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white mt-1 rounded shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                    onClick={() => {
                      setSearchTerm(suggestion)
                      setShowSuggestions(false)
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex overflow-hidden">
        {/* 左侧面板 */}

        <aside className="w-1/4 bg-white bg-opacity-10 p-4 overflow-y-auto scrollbar-hide">
          {renderFilterSection(
            '公链',
            categories,
            selectedCategories,
            setSelectedCategories
          )}
          {renderFilterSection(
            '合约-Move',
            systems,
            selectedSystems,
            setSelectedSystems
          )}
          {renderFilterSection(
            '安全',
            packages,
            selectedPackages,
            setSelectedPackages
          )}
          {renderFilterSection(
            '技术文章',
            packages,
            selectedPackages,
            setSelectedPackages
          )}
        </aside>

        {/* 右侧 */}

        <section className="flex-grow flex flex-col bg-white bg-opacity-10">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">筛选结果</h2>
              <button
                className="text-blue-600"
                onClick={() => {
                  setSelectedCategories([])
                  setSelectedSystems([])
                  setSelectedPackages([])
                }}
              >
                全部清除
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                ...selectedCategories,
                ...selectedSystems,
                ...selectedPackages,
              ].map((item) => (
                <span
                  key={item}
                  className="bg-gray-200 text-black px-3 py-1 rounded-full flex items-center"
                >
                  {item}
                  <X
                    size={14}
                    className="ml-2 cursor-pointer"
                    onClick={() => {
                      setSelectedCategories((prev) =>
                        prev.filter((i) => i !== item)
                      )
                      setSelectedSystems((prev) =>
                        prev.filter((i) => i !== item)
                      )
                      setSelectedPackages((prev) =>
                        prev.filter((i) => i !== item)
                      )
                    }}
                  />
                </span>
              ))}
            </div>
            <p className="mb-4">{filteredArticles.length} 条结果</p>
          </div>

          {/* 搜索结果条目 */}
          <div className="flex-grow overflow-y-auto scrollbar-hide">
            <div className="p-4  mb-8">
              {filteredArticles.map((article) => (
                <article
                  key={article.title}
                  className="bg-white bg-opacity-10 text-black p-4 mb-4 rounded shadow hover:shadow-lg hover:bg-opacity-20 transition-shadow duration-200 "
                >
                  <h3 className="text-lg font-bold text-blue-100 hover:underline hover:text-white cursor-pointer">
                    {article.title}
                  </h3>
                  {/* 描述 */}
                  <p className="text-sm text-gray-400 mb-2">
                    {article.date} - {article.description}
                  </p>
                  {/* tag */}
                  <div className="flex gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-600 text-gray-300 px-2 py-1 rounded-full text-sm hover:bg-gray-200 hover:text-black cursor-pointer transition-colors duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      {/* <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style> */}
    </div>
  )
}
