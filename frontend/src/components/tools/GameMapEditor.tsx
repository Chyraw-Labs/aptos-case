/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Menu } from '@headlessui/react'
import {
  Upload,
  Save,
  Grid,
  Trash2,
  ZoomIn,
  ZoomOut,
  Edit,
  Check,
} from 'lucide-react'

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
  // const [isDragging, setIsDragging] = useState(false)
  // const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
  //   null
  // )
  const [zoom, setZoom] = useState(1)
  const [editingMatrix, setEditingMatrix] = useState(false)
  const [matrixInput, setMatrixInput] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const TILE_SIZE = 50
  const EDITOR_WIDTH = 800
  const EDITOR_HEIGHT = 600

  useEffect(() => {
    initializeMap()
  }, [])

  useEffect(() => {
    drawMap()
  }, [map, showGrid, hoverCell, draggedTile, zoom, tiles])

  const formatMatrix = (matrix: number[][], forEditing: boolean = false) => {
    if (forEditing) {
      return (
        '[\n' + matrix.map((row) => `  [${row.join(', ')}]`).join(',\n') + '\n]'
      )
    }
    return (
      '[\n' + matrix.map((row) => `  [${row.join(',')}]`).join('\n') + '\n]'
    )
  }

  const handleMatrixEdit = () => {
    setEditingMatrix(true)
    setMatrixInput(formatMatrix(map, true))
  }

  const initializeMap = useCallback(() => {
    const width = Math.max(1, Math.floor(mapSize.width))
    const height = Math.max(1, Math.floor(mapSize.height))
    const newMap = Array(height)
      .fill(null)
      .map(() => Array(width).fill(0))
    setMap(newMap)
    setMatrixInput(JSON.stringify(newMap, null, 2))
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
        } else {
          // Draw a placeholder for unknown tile IDs
          ctx.fillStyle = 'rgba(128, 128, 128, 0.0)' // 初始背景
          ctx.fillRect(
            x * scaledTileSize,
            y * scaledTileSize,
            scaledTileSize,
            scaledTileSize
          )
        }
      })
    })

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)' // 王哥
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
  }, [map, mapSize, tiles, showGrid, hoverCell, zoom])

  // const handleMatrixEdit = () => {
  //   setEditingMatrix(true)
  //   setMatrixInput(JSON.stringify(map, null, 2))
  // }

  const handleMatrixSave = () => {
    try {
      const newMap = JSON.parse(matrixInput)
      if (Array.isArray(newMap) && newMap.every((row) => Array.isArray(row))) {
        setMap(newMap)
        setMapSize({ width: newMap[0].length, height: newMap.length })
        setEditingMatrix(false)
        drawMap() // Force redraw after saving
      } else {
        alert('Invalid matrix format. Please enter a valid 2D array.')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert('Invalid JSON format. Please check your input.')
    }
  }

  const handleMatrixImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const importedMap = JSON.parse(content)

          if (
            Array.isArray(importedMap) &&
            importedMap.every(
              (row) =>
                Array.isArray(row) &&
                row.every((cell) => typeof cell === 'number')
            )
          ) {
            setMap(importedMap)
            setMapSize({
              width: importedMap[0].length,
              height: importedMap.length,
            })
            setMatrixInput(JSON.stringify(importedMap, null, 2))
          } else {
            throw new Error('Invalid matrix format')
          }
        } catch (error) {
          console.error('Error parsing the imported file:', error)
          alert(
            'Error parsing the imported file. Please ensure it contains a valid 2D array of numbers.'
          )
        }
      }
      reader.readAsText(file)
    }
  }

  const handleDoubleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      const x = Math.floor((event.clientX - rect.left) / (TILE_SIZE * zoom))
      const y = Math.floor((event.clientY - rect.top) / (TILE_SIZE * zoom))
      setMap((prevMap) => {
        const newMap = [...prevMap]
        newMap[y] = [...newMap[y]]
        newMap[y][x] = 0 // Set to 0 (empty) when double-clicked
        return newMap
      })
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    const { x, y } = getCellCoordinates(event)
    if (isValidCell(x, y) && draggedTile) {
      setMap((prevMap) => {
        const newMap = [...prevMap]
        newMap[y] = [...newMap[y]]
        newMap[y][x] = draggedTile.id
        return newMap
      })
    }
    setDraggedTile(null)
    setHoverCell(null)
  }

  const getCellCoordinates = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.DragEvent<HTMLCanvasElement>
  ) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return { x: -1, y: -1 }
    const x = Math.floor((event.clientX - rect.left) / (TILE_SIZE * zoom))
    const y = Math.floor((event.clientY - rect.top) / (TILE_SIZE * zoom))
    return { x, y }
  }

  const isValidCell = (x: number, y: number) => {
    return x >= 0 && x < mapSize.width && y >= 0 && y < mapSize.height
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
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
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
            }}
            multiple
          />
        </label>
        {tiles.map((tile, index) => (
          <div
            key={index}
            className="flex items-center mb-2 mt-4 cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', JSON.stringify(tile))
              setDraggedTile(tile)
            }}
            onDoubleClick={() =>
              setTiles((prevTiles) => prevTiles.filter((_, i) => i !== index))
            }
          >
            <img src={tile.src} alt={tile.name} className="w-8 h-8 mr-2" />
            <input
              type="number"
              value={tile.id}
              onChange={(e) => {
                const newId = parseInt(e.target.value)
                setTiles((prevTiles) => {
                  const newTiles = [...prevTiles]
                  newTiles[index] = { ...newTiles[index], id: newId }
                  return newTiles
                })
              }}
              className="w-16 p-1 border rounded bg-black text-white"
            />
            <span className="ml-2 flex-grow text-white">{tile.name}</span>
            <Trash2
              className="w-5 h-5 text-red-500 cursor-pointer"
              onClick={() =>
                setTiles((prevTiles) => prevTiles.filter((_, i) => i !== index))
              }
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
            onClick={() => setZoom((prev) => Math.min(prev + 0.1, 2))}
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            <ZoomIn className="inline-block mr-2" />
            Zoom In
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))}
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
                      onClick={() => setSelectedTile(tile)}
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
            onDoubleClick={handleDoubleClick}
            onClick={(e) => {
              const rect = canvasRef.current?.getBoundingClientRect()
              if (rect) {
                const x = Math.floor(
                  (e.clientX - rect.left) / (TILE_SIZE * zoom)
                )
                const y = Math.floor(
                  (e.clientY - rect.top) / (TILE_SIZE * zoom)
                )
                if (selectedTile) {
                  setMap((prevMap) => {
                    const newMap = [...prevMap]
                    newMap[y] = [...newMap[y]]
                    newMap[y][x] = selectedTile.id
                    return newMap
                  })
                }
              }
            }}
            onMouseMove={(e) => {
              const { x, y } = getCellCoordinates(e)
              if (isValidCell(x, y)) {
                setHoverCell({ x, y })
              } else {
                setHoverCell(null)
              }
            }}
            onMouseLeave={() => setHoverCell(null)}
            onDragOver={(e) => {
              e.preventDefault()
              const { x, y } = getCellCoordinates(e)
              if (isValidCell(x, y)) {
                setHoverCell({ x, y })
              } else {
                setHoverCell(null)
              }
            }}
            onDrop={handleDrop}
            //   onDrop={(e) => {
            //     e.preventDefault()
            //     const rect = canvasRef.current?.getBoundingClientRect()
            //     if (rect && draggedTile) {
            //       const x = Math.floor(
            //         (e.clientX - rect.left) / (TILE_SIZE * zoom)
            //       )
            //       const y = Math.floor(
            //         (e.clientY - rect.top) / (TILE_SIZE * zoom)
            //       )
            //       setMap((prevMap) => {
            //         const newMap = [...prevMap]
            //         newMap[y] = [...newMap[y]]
            //         newMap[y][x] = draggedTile.id
            //         return newMap
            //       })
            //     }
            //     setDraggedTile(null)
            //     setHoverCell(null)
            //   }
            // }
          />
        </div>
        <button
          onClick={() => {
            const canvas = canvasRef.current
            if (canvas) {
              const dataUrl = canvas.toDataURL('image/png')
              const a = document.createElement('a')
              a.href = dataUrl
              a.download = 'game-map.png'
              a.click()
            }
            const jsonData = JSON.stringify(map)
            const blob = new Blob([jsonData], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'game-map.json'
            link.click()
          }}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          <Save className="inline-block mr-2" />
          Export Map
        </button>
      </div>

      {/* Right Panel */}
      <div className="w-1/4 p-4 bg-black text-white shadow-md overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Map Matrix</h2>
        {editingMatrix ? (
          <div>
            <textarea
              value={matrixInput}
              onChange={(e) => setMatrixInput(e.target.value)}
              className="w-full h-64 p-2 bg-gray-800 text-white font-mono text-xs"
            />
            <button
              onClick={handleMatrixSave}
              className="mt-2 px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-blue-700"
            >
              <Check className="inline-block mr-2" />
              Save Matrix
            </button>
          </div>
        ) : (
          <div>
            <pre className="font-mono text-xs whitespace-pre overflow-x-auto">
              {formatMatrix(map)}
            </pre>
            <button
              onClick={handleMatrixEdit}
              className="mt-2 px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              <Edit className="inline-block mr-2" />
              Edit Matrix
            </button>
          </div>
        )}
        <div className="mt-4">
          <label className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg shadow-lg tracking-wide uppercase border border-purple cursor-pointer hover:bg-purple-600">
            <Upload className="w-6 h-6 mr-2" />
            <span className="text-base leading-normal">Import Matrix</span>
            <input
              type="file"
              className="hidden"
              onChange={handleMatrixImport}
              accept=".json"
            />
          </label>
        </div>
      </div>
    </div>
  )
}

export default GameMapEditor
