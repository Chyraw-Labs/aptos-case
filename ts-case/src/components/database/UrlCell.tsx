import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { ExternalLink, AlertTriangle, X, Copy, Check } from 'lucide-react'
import { createPortal } from 'react-dom'

interface UrlCellProps {
  url: string
  maxLength?: number
}

interface UrlPreviewProps {
  url: string | null
  onClose: () => void
}

let globalSetPreviewUrl: React.Dispatch<
  React.SetStateAction<string | null>
> | null = null

const UrlPreviewWrapper: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  globalSetPreviewUrl = setPreviewUrl

  return <UrlPreview url={previewUrl} onClose={() => setPreviewUrl(null)} />
}

const UrlCell: React.FC<UrlCellProps> = ({ url, maxLength = 32 }) => {
  const [isHovering, setIsHovering] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [canOpenPreview, setCanOpenPreview] = useState(true)
  const [isCopied, setIsCopied] = useState(false)

  const truncatedUrl = useMemo(
    () => (url.length > maxLength ? url.slice(0, maxLength) + '...' : url),
    [url, maxLength]
  )

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
    if (canOpenPreview && globalSetPreviewUrl) {
      globalSetPreviewUrl(url)
      setIsPreviewOpen(true)
    }
  }, [url, canOpenPreview])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
  }, [])

  const handleClosePreview = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (globalSetPreviewUrl) {
      globalSetPreviewUrl(null)
      setIsPreviewOpen(false)
      setCanOpenPreview(false)
      setTimeout(() => setCanOpenPreview(true), 300)
    }
  }, [])

  const handleCopyUrl = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      navigator.clipboard.writeText(url).then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
    },
    [url]
  )

  useEffect(() => {
    return () => {
      if (globalSetPreviewUrl) {
        globalSetPreviewUrl(null)
      }
    }
  }, [])

  return (
    <td className="px-4 py-3 whitespace-nowrap relative">
      <div
        className="flex items-center space-x-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isHovering && (
          <>
            {isPreviewOpen && (
              <button
                onClick={handleClosePreview}
                className="p-1 rounded-full bg-red-400 hover:bg-red-500 transition-colors duration-150 flex-shrink-0"
                title="关闭预览"
              >
                <X size={14} />
              </button>
            )}
            <button
              onClick={handleCopyUrl}
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-150 flex-shrink-0"
              title="复制链接"
            >
              {isCopied ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </>
        )}
        <div className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-150 cursor-pointer">
          <ExternalLink size={16} className="mr-1 flex-shrink-0" />
          <span className="underline truncate">{truncatedUrl}</span>
        </div>
      </div>
    </td>
  )
}

const UrlPreview: React.FC<UrlPreviewProps> = ({ url, onClose }) => {
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false)
    setPreviewError(null)
  }, [])

  const handleIframeError = useCallback(() => {
    setIsLoading(false)
    setPreviewError('无法加载预览内容。请尝试在新标签页中打开链接。')
  }, [])

  useEffect(() => {
    setIsLoading(true)
    setPreviewError(null)
  }, [url])

  if (!url) return null

  return createPortal(
    <div
      className="fixed left-0 bg-opacity-10 backdrop-blur top-0 z-[9999] bg-white rounded shadow-lg"
      style={{ width: '40vw', height: '100vh' }}
    >
      <div className="p-4 bg-gray-100 border-b border-gray-400 flex justify-between items-center bg-white bg-opacity-10 backdrop-blur">
        <h3 className="font-bold text-sm truncate flex-grow">{url}</h3>
        <button
          className="text-red-300 hover:text-red-500 text-md"
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>
      <div className="p-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline flex items-center mb-4"
        >
          <ExternalLink size={16} className="mr-2" />
          在浏览器中打开
        </a>
      </div>
      <div className="relative" style={{ height: 'calc(100% - 116px)' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        {previewError ? (
          <div className="p-4 m-4 bg-yellow-800 bg-opacity-10 text-yellow-100 rounded">
            <div className="flex items-center mb-2 text-yellow-700">
              <AlertTriangle size={20} className="mr-2" />
              <span className="font-semibold">预览功能不可用</span>
            </div>
            <p>{previewError}</p>
          </div>
        ) : (
          <iframe
            src={url}
            className="w-full h-full bg-white bg-opacity-10 backdrop-blur-sm"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </div>
    </div>,
    document.body
  )
}

export { UrlCell, UrlPreviewWrapper as UrlPreview }
