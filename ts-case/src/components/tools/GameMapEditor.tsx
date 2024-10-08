import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Menu } from '@headlessui/react'
import { Upload, Save, Grid, Trash2, ZoomIn, ZoomOut } from 'lucide-react'

const GameMapEditor = () => {
  const [tiles, setTiles] = useState<
    Array<{ id: number; name: string; src: string }>
  >([])
  const [mapSize, setMapSize] = useState({ width: 10, height: 10 })
  const [map, setMap] = useState<number[][]>([])
  const [selectedTile, setSelectedTile] = useState<{
    id: number
    name: string
    src: string
  } | null>(null)
  const [showGrid, setShowGrid] = useState(false)
  const [draggedTile, setDraggedTile] = useState<{
    id: number
    name: string
    src: string
  } | null>(null)
  const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(
    null
  )
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  )
  const [zoom, setZoom] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const TILE_SIZE = 50
  const EDITOR_WIDTH = 800
  const EDITOR_HEIGHT = 600

  useEffect(() => {
    initializeMap()
  }, [mapSize])

  useEffect(() => {
    drawMap()
  }, [map, showGrid, hoverCell, draggedTile, zoom])

  const initializeMap = useCallback(() => {
    const width = Math.max(1, Math.floor(mapSize.width))
    const height = Math.max(1, Math.floor(mapSize.height))
    const newMap = Array(height)
      .fill(null)
      .map(() => Array(width).fill(0))
    setMap(newMap)
  }, [mapSize])

  const drawMap = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const scaledTileSize = TILE_SIZE * zoom

    // Draw tiles
    map.forEach((row, y) => {
      row.forEach((cellId, x) => {
        if (cellId) {
          const tile = tiles.find((t) => t.id === cellId)
          if (tile) {
            const img = new Image()
            img.onload = () => {
              ctx.drawImage(
                img,
                x * scaledTileSize,
                y * scaledTileSize,
                scaledTileSize,
                scaledTileSize
              )
            }
            img.src = tile.src
          }
        }
      })
    })

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1
      for (let x = 0; x <= mapSize.width; x++) {
        ctx.beginPath()
        ctx.moveTo(x * scaledTileSize, 0)
        ctx.lineTo(x * scaledTileSize, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y <= mapSize.height; y++) {
        ctx.beginPath()
        ctx.moveTo(0, y * scaledTileSize)
        ctx.lineTo(canvas.width, y * scaledTileSize)
        ctx.stroke()
      }
    }

    // Draw hover highlight
    if (hoverCell) {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)'
      ctx.fillRect(
        hoverCell.x * scaledTileSize,
        hoverCell.y * scaledTileSize,
        scaledTileSize,
        scaledTileSize
      )
    }
  }, [map, mapSize, tiles, showGrid, hoverCell, draggedTile, zoom])

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5))
  }

  const handleTileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    Promise.all(
      files.map((file, index) => {
        return new Promise<{ id: number; name: string; src: string }>(
          (resolve) => {
            const reader = new FileReader()
            reader.onload = (e) =>
              resolve({
                id: tiles.length + index + 1,
                name: file.name,
                src: e.target?.result as string,
              })
            reader.readAsDataURL(file)
          }
        )
      })
    ).then((newTiles) => {
      setTiles((prevTiles) => [...prevTiles, ...newTiles])
    })
  }

  const handleTileSelect = (tile: {
    id: number
    name: string
    src: string
  }) => {
    setSelectedTile(tile)
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCellCoordinates(event)

    if (event.detail === 2) {
      // Double click
      updateMap(x, y, 0) // Remove tile (set to 0)
    } else if (selectedTile) {
      updateMap(x, y, selectedTile.id)
    }
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCellCoordinates(event)
    if (map[y][x] !== 0) {
      setIsDragging(true)
      setDragStart({ x, y })
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && dragStart) {
      const { x, y } = getCellCoordinates(event)
      setHoverCell({ x, y })
    }
  }

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && dragStart) {
      const { x: endX, y: endY } = getCellCoordinates(event)
      const tileId = map[dragStart.y][dragStart.x]

      // Move tile
      updateMap(endX, endY, tileId)
      updateMap(dragStart.x, dragStart.y, 0)

      setIsDragging(false)
      setDragStart(null)
      setHoverCell(null)
    }
  }

  const getCellCoordinates = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.DragEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const scaledTileSize = TILE_SIZE * zoom
    const x = Math.floor(
      (event.clientX - rect.left + container.scrollLeft) / scaledTileSize
    )
    const y = Math.floor(
      (event.clientY - rect.top + container.scrollTop) / scaledTileSize
    )
    return { x, y }
  }

  const updateMap = (x: number, y: number, tileId: number) => {
    setMap((prevMap) => {
      const newMap = [...prevMap]
      newMap[y] = [...newMap[y]]
      newMap[y][x] = tileId
      return newMap
    })
  }

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    tile: { id: number; name: string; src: string }
  ) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(tile))
    setDraggedTile(tile)
  }

  const handleDragOver = (event: React.DragEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    const { x, y } = getCellCoordinates(event)
    setHoverCell({ x, y })
  }

  const handleDragLeave = () => {
    setHoverCell(null)
    setDraggedTile(null)
  }

  const handleDrop = (event: React.DragEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    const tileData = event.dataTransfer.getData('text/plain')
    const tile = JSON.parse(tileData)
    const { x, y } = getCellCoordinates(event)
    updateMap(x, y, tile.id)
    setHoverCell(null)
    setDraggedTile(null)
  }

  const exportMap = () => {
    if (!canvasRef.current) return

    const dataUrl = canvasRef.current.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'game-map.png'
    a.click()

    const jsonData = JSON.stringify(map)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'game-map.json'
    link.click()
  }

  const updateTileId = (index: number, newId: string) => {
    setTiles((prevTiles) => {
      const newTiles = [...prevTiles]
      newTiles[index] = { ...newTiles[index], id: parseInt(newId) }
      return newTiles
    })
  }

  const handleTileDoubleClick = (index: number) => {
    setTiles((prevTiles) => prevTiles.filter((_, i) => i !== index))
  }

  return (
    <div className="flex h-screen bg-black">
      {/* Left Panel */}
      <div className="w-1/4 p-4 bg-black shadow-md overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-white">Tiles</h2>
        <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-600">
          <Upload className="w-6 h-6 mr-2" />
          <span className="text-base leading-normal">选择文件</span>
          <input
            type="file"
            className="hidden"
            onChange={handleTileUpload}
            multiple
          />
        </label>
        {/* tiles */}
        {tiles.map((tile, index) => (
          <div
            key={index}
            className="flex items-center mb-2 mt-4 cursor-move"
            draggable
            onDragStart={(e) => handleDragStart(e, tile)}
            onDoubleClick={() => handleTileDoubleClick(index)}
          >
            <img src={tile.src} alt={tile.name} className="w-8 h-8 mr-2" />
            <input
              type="number"
              value={tile.id}
              onChange={(e) => updateTileId(index, e.target.value)}
              className="w-16 p-1 border rounded bg-black text-white"
            />
            <span className="ml-2 flex-grow text-white">{tile.name}</span>
            <Trash2
              className="w-5 h-5 text-red-500 cursor-pointer"
              onClick={() => handleTileDoubleClick(index)}
            />
          </div>
        ))}
      </div>

      {/* Main Editor */}
      <div className="flex-1 p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-white">Game Map Editor</h1>
        <div className="mb-4 flex space-x-2">
          <input
            type="number"
            value={mapSize.width}
            onChange={(e) =>
              setMapSize((prev) => ({
                ...prev,
                width: Math.max(1, parseInt(e.target.value) || 1),
              }))
            }
            className="w-20 p-2 border rounded bg-black text-white"
            placeholder="Width"
          />
          <input
            type="number"
            value={mapSize.height}
            onChange={(e) =>
              setMapSize((prev) => ({
                ...prev,
                height: Math.max(1, parseInt(e.target.value) || 1),
              }))
            }
            className="w-20 p-2 border rounded bg-black text-white"
            placeholder="Height"
          />
          <button
            onClick={() => setShowGrid((prev) => !prev)}
            className={`px-4 py-2 font-bold text-white rounded ${
              showGrid
                ? 'bg-green-500 hover:bg-green-700'
                : 'bg-blue-500 hover:bg-blue-700'
            }`}
          >
            <Grid className="inline-block mr-2" />
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </button>
          <button
            onClick={handleZoomIn}
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            <ZoomIn className="inline-block mr-2" />
            Zoom In
          </button>
          <button
            onClick={handleZoomOut}
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            <ZoomOut className="inline-block mr-2" />
            Zoom Out
          </button>
        </div>
        <Menu as="div" className="relative inline-block text-left mb-4">
          <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            Select Tile
          </Menu.Button>
          <Menu.Items className="absolute left-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              {tiles.map((tile) => (
                <Menu.Item key={tile.id}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-blue-500 text-white' : 'text-gray-900'
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      onClick={() => handleTileSelect(tile)}
                    >
                      <img
                        src={tile.src}
                        alt={tile.name}
                        className="w-6 h-6 mr-2"
                      />
                      {tile.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Menu>
        <div
          ref={containerRef}
          className="border border-gray-300 mb-4 overflow-auto"
          style={{ width: EDITOR_WIDTH, height: EDITOR_HEIGHT }}
        >
          <canvas
            ref={canvasRef}
            width={mapSize.width * TILE_SIZE * zoom}
            height={mapSize.height * TILE_SIZE * zoom}
            className="cursor-pointer"
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onMouseLeave={() => {
              setIsDragging(false)
              setDragStart(null)
              setHoverCell(null)
            }}
          />
        </div>
        <button
          onClick={exportMap}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          <Save className="inline-block mr-2" />
          Export Map
        </button>
      </div>

      {/* Right Panel */}
      <div className="w-1/4 p-4 bg-black text-white shadow-md overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Map Matrix</h2>
        <div className="font-mono text-xs whitespace-pre">
          {map.map((row, i) => (
            <div key={i}>[{row.join(', ')}]</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GameMapEditor
