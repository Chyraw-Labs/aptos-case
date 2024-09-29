'use client'
import React, { useState, useEffect } from 'react'
import MarkdownRenderer from './MarkdownRenderer'

const MarkdownPage: React.FC = () => {
  const [mdContent, setMdContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMdContent = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const url = `/api/mdx?path=${encodeURIComponent(
          '/Docs/primitive_types.md'
        )}`
        const response = await fetch(url)
        // console.log(response)
        if (!response.ok) {
          throw new Error('Failed to fetch Markdown content')
        }
        const content = await response.text()
        console.log(content)
        setMdContent(content)
      } catch (err) {
        console.error('Error fetching Markdown:', err)
        setError('Failed to load Markdown content')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMdContent()
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <MarkdownRenderer content={mdContent} />
    </div>
  )
}

export default MarkdownPage
