import React, { useState, useEffect, useCallback } from 'react'
import { ExternalLink, AlertTriangle, X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface UrlCellProps {
  url: string
  maxLength?: number
}

let globalSetPreviewUrl: React.Dispatch<
  React.SetStateAction<string | null>
> | null = null

// 包装器
const UrlPreviewWrapper: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  globalSetPreviewUrl = setPreviewUrl

  return <UrlPreview url={previewUrl} onClose={() => setPreviewUrl(null)} />
}

const UrlCell: React.FC<UrlCellProps> = ({ url, maxLength = 32 }) => {
  const [isHovering, setIsHovering] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [canOpenPreview, setCanOpenPreview] = useState(true)
  const truncatedUrl =
    url.length > maxLength ? url.slice(0, maxLength) + '...' : url

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
    if (canOpenPreview && globalSetPreviewUrl) {
      globalSetPreviewUrl(url)
      setIsPreviewOpen(true)
    }
  }, [url, canOpenPreview])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    // We don't close the preview here to allow users to move the mouse to the preview window
  }, [])

  const handleClosePreview = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (globalSetPreviewUrl) {
      globalSetPreviewUrl(null)
      setIsPreviewOpen(false)
      setCanOpenPreview(false)
      // Add a short delay before allowing the preview to be reopened
      setTimeout(() => setCanOpenPreview(true), 300)
    }
  }, [])

  useEffect(() => {
    // Cleanup function to ensure preview is closed when component unmounts
    return () => {
      if (globalSetPreviewUrl) {
        globalSetPreviewUrl(null)
      }
    }
  }, [])

  return (
    <td className="px-4 py-3 whitespace-nowrap relative ">
      <div
        className="flex items-center space-x-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isHovering && isPreviewOpen && (
          // 关闭按钮
          <button
            onClick={handleClosePreview}
            className="p-1 rounded-full bg-red-400 hover:bg-red-500 transition-colors duration-150 flex-shrink-0"
            title="关闭预览"
          >
            <X size={14} />
          </button>
        )}
        {/* 链接 */}
        <div className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-150 cursor-pointer">
          <ExternalLink size={16} className="mr-1 flex-shrink-0" />
          <span className="underline truncate">{truncatedUrl}</span>
        </div>
      </div>
    </td>
  )
}

interface UrlPreviewProps {
  url: string | null
  onClose: () => void
}

// 预览窗口
const UrlPreview: React.FC<UrlPreviewProps> = ({ url, onClose }) => {
  const [iframeError, setIframeError] = useState(false)

  useEffect(() => {
    setIframeError(false)
  }, [url])

  if (!url) return null

  const handleIframeLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    const iframe = event.currentTarget
    try {
      // Access the href property and do something with it
      const iframeHref = iframe.contentWindow?.location.href
      console.log('Iframe loaded successfully:', iframeHref)
      setIframeError(false)
    } catch (error) {
      console.error('Error accessing iframe content:', error)
      setIframeError(true)
    }
  }
  return createPortal(
    <div
      className="fixed left-0 bg-opacity-10 backdrop-blur top-0 z-[9999] bg-white rounded shadow-lg"
      style={{ width: '40vw', height: '100vh' }}
    >
      <div className="p-4 bg-gray-100 border-b border-gray-400 flex justify-between items-center bg-hite bg-opacity-10 backdrop-blur">
        <h3 className="font-bold text-sm truncate flex-grow ">{url}</h3>
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
        {iframeError ? (
          <div className="p-4 m-4 bg-yellow-800 bg-opacity-10 text-yellow-100 rounded">
            <div className="flex items-center mb-2 text-yellow-700">
              <AlertTriangle size={20} className="mr-2" />
              <span className="font-semibold">预览功能不可用</span>
            </div>
            <p>
              由于安全限制，无法在预览中显示此网站。请使用上面的链接在新浏览器选项卡中打开它。
            </p>
          </div>
        ) : (
          <div className="w-full h-full">
            {iframeError ? (
              <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-500">
                Unable to load content
              </div>
            ) : (
              <iframe
                src={url}
                className="w-full h-full"
                onLoad={handleIframeLoad}
              />
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export { UrlCell, UrlPreviewWrapper as UrlPreview }
