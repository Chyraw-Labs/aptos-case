import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import '@/styles/mermaid.css'

interface MermaidRendererProps {
  chart: string
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart }) => {
  const mermaidRef = useRef<HTMLDivElement>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose',
      logLevel: 'debug',
    })

    const renderChart = async () => {
      if (mermaidRef.current) {
        try {
          mermaidRef.current.innerHTML = chart
          await mermaid.run({ nodes: [mermaidRef.current] })
          console.log('Mermaid chart rendered successfully')
        } catch (error) {
          console.error('Error rendering Mermaid chart:', error)
        }
      }
    }

    renderChart()

    // Force a re-render after a short delay
    const timer = setTimeout(() => setKey((prevKey) => prevKey + 1), 100)

    return () => clearTimeout(timer)
  }, [chart, key])

  return (
    <div className="mermaid-wrapper" key={key}>
      <div className="mermaid" ref={mermaidRef}></div>
    </div>
  )
}

export default MermaidRenderer
