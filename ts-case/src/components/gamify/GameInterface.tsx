'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import styles from '@/styles/GameInterface.module.css'

interface Tile {
  id: number
  src: string
}

// 预定义的 tile 类型
const tileTypes: Tile[] = [
  { id: 0, src: '/game_assets/tile_0000.png' }, // 空草地
  { id: 1, src: '/game_assets/tile_0001.png' }, // 杂草草地
  { id: 2, src: '/game_assets/tile_0002.png' }, // 花草地
  { id: 3, src: '/game_assets/tile_0003.png' }, // 黄色的树尖
  { id: 4, src: '/game_assets/tile_0004.png' }, // 绿色的树尖
  { id: 5, src: '/game_assets/tile_0005.png' }, // 绿色的灌木丛
  { id: 6, src: '/game_assets/tile_0006.png' }, // 右 - 绿色的小树尖和灌木丛
  { id: 7, src: '/game_assets/tile_0007.png' }, // 绿色的小树尖
  { id: 8, src: '/game_assets/tile_0008.png' }, // 左 - 绿色的小树尖和灌木丛
  { id: 9, src: '/game_assets/tile_0009.png' }, // 右 - 黄色的小树尖和灌木丛
  { id: 10, src: '/game_assets/tile_0010.png' }, // 黄色的小树尖,
  { id: 11, src: '/game_assets/tile_0011.png' }, // 左 - 黄色的小树尖和灌木丛
  { id: 12, src: '/game_assets/tile_0012.png' }, // 左上 - 路
  { id: 13, src: '/game_assets/tile_0013.png' }, // 上 - 路
  { id: 14, src: '/game_assets/tile_0014.png' }, // 右上 - 路
  { id: 15, src: '/game_assets/tile_0015.png' }, // 黄 - 树干
  { id: 16, src: '/game_assets/tile_0016.png' }, // 绿 - 树干
  { id: 17, src: '/game_assets/tile_0017.png' }, // 草丛
  { id: 18, src: '/game_assets/tile_0018.png' }, // 左 - 半棵树 - 绿
  { id: 19, src: '/game_assets/tile_0019.png' }, // 聚拢的树 - 绿
  { id: 20, src: '/game_assets/tile_0020.png' }, // 右 - 半棵树 - 绿
  { id: 21, src: '/game_assets/tile_0021.png' }, // 左 - 半棵树 - 黄
  { id: 22, src: '/game_assets/tile_0022.png' }, // 聚拢的树 - 黄
  { id: 23, src: '/game_assets/tile_0023.png' }, // 右 - 半棵树 - 黄
  { id: 24, src: '/game_assets/tile_0024.png' }, // 左 - 路
  { id: 25, src: '/game_assets/tile_0025.png' }, // 空白 - 路
  { id: 26, src: '/game_assets/tile_0026.png' }, // 右 - 路
  { id: 27, src: '/game_assets/tile_0027.png' }, // 黄色的树
  { id: 28, src: '/game_assets/tile_0028.png' }, // 绿色的树
  { id: 29, src: '/game_assets/tile_0029.png' }, // 蘑菇
  { id: 30, src: '/game_assets/tile_0030.png' }, // 绿树 - 右上 （在图片）
  { id: 31, src: '/game_assets/tile_0031.png' }, // 绿树 - 上（在图片）
  { id: 32, src: '/game_assets/tile_0032.png' }, // 绿树 - 左上（在图片）
  { id: 33, src: '/game_assets/tile_0033.png' }, // 黄树 - 右上 （在图
  { id: 34, src: '/game_assets/tile_0034.png' }, // 黄树 - 上（在图片）
  { id: 35, src: '/game_assets/tile_0035.png' }, // 黄树 - 左上（在图片）
  { id: 36, src: '/game_assets/tile_0036.png' }, // 路 - 左下
  { id: 37, src: '/game_assets/tile_0037.png' }, // 路 - 下
  { id: 38, src: '/game_assets/tile_0038.png' }, // 路 - 右下
  { id: 39, src: '/game_assets/tile_0039.png' }, // 路 - 左上点
  { id: 40, src: '/game_assets/tile_0040.png' }, // 路 - 右上点
  { id: 41, src: '/game_assets/tile_0041.png' }, // 路 - 右下点
  { id: 42, src: '/game_assets/tile_0042.png' }, // 路 - 左下点
  { id: 43, src: '/game_assets/tile_0043.png' }, // 路 - 碎石
  { id: 44, src: '/game_assets/tile_0044.png' }, // 左 - 栅栏
  { id: 45, src: '/game_assets/tile_0045.png' }, // 中 - 栅栏
  { id: 46, src: '/game_assets/tile_0046.png' }, // 右 - 栅栏
  { id: 47, src: '/game_assets/tile_0047.png' }, // 单 - 栅栏
  { id: 48, src: '/game_assets/tile_0048.png' }, // 左上 - 灰 - 屋顶
  { id: 49, src: '/game_assets/tile_0049.png' }, // 上 - 灰 - 屋顶
  { id: 50, src: '/game_assets/tile_0050.png' }, // 右上 - 灰- 屋顶
  { id: 51, src: '/game_assets/tile_0051.png' }, // 上 - 灰 - 烟囱
  { id: 52, src: '/game_assets/tile_0052.png' }, // 左上 - 红 - 屋顶
  { id: 53, src: '/game_assets/tile_0053.png' }, // 上 - 红 - 屋顶
  { id: 54, src: '/game_assets/tile_0054.png' }, // 右上 - 红- 屋顶
  { id: 55, src: '/game_assets/tile_0055.png' }, // 上 - 红 - 烟囱
  { id: 56, src: '/game_assets/tile_0056.png' }, // 左 - 围栏
  { id: 57, src: '/game_assets/tile_0057.png' }, // 中 - 水井
  { id: 58, src: '/game_assets/tile_0058.png' }, // 右 - 围栏
  { id: 59, src: '/game_assets/tile_0059.png' }, // 单 - 围栏
  { id: 60, src: '/game_assets/tile_0060.png' }, // 左下 - 灰 - 屋顶
  { id: 61, src: '/game_assets/tile_0061.png' }, // 下 - 灰 - 屋顶
  { id: 62, src: '/game_assets/tile_0062.png' }, // 右下 - 灰 - 屋顶
  { id: 63, src: '/game_assets/tile_0063.png' }, // 灰 - 屋顶尖顶
  { id: 64, src: '/game_assets/tile_0064.png' }, // 左下 - 红 - 屋顶
  { id: 65, src: '/game_assets/tile_0065.png' }, // 下 - 红 - 屋顶
  { id: 66, src: '/game_assets/tile_0066.png' }, // 右下 - 红 - 屋顶
  { id: 67, src: '/game_assets/tile_0067.png' }, // 红 - 屋顶尖顶
  { id: 68, src: '/game_assets/tile_0068.png' }, // 左下 - 围栏
  { id: 69, src: '/game_assets/tile_0069.png' }, // 中 - 围栏
  { id: 70, src: '/game_assets/tile_0070.png' }, // 右下 - 围栏
  { id: 71, src: '/game_assets/tile_0071.png' }, // 下 - 单 - 围栏
  { id: 72, src: '/game_assets/tile_0072.png' }, // 左 - 房屋 - 墙
  { id: 73, src: '/game_assets/tile_0073.png' }, // 空 - 房屋 - 墙
  { id: 74, src: '/game_assets/tile_0074.png' }, // 房屋 - 门
  { id: 75, src: '/game_assets/tile_0075.png' }, // 右 - 房屋 - 墙
  { id: 76, src: '/game_assets/tile_0076.png' }, // 左 - 房屋 - 灰墙
  { id: 77, src: '/game_assets/tile_0077.png' }, // 空 - 房屋 - 灰墙
  { id: 78, src: '/game_assets/tile_0078.png' }, // 房屋 - 灰墙 - 门
  { id: 79, src: '/game_assets/tile_0079.png' }, // 右 - 房屋 - 灰墙
  { id: 80, src: '/game_assets/tile_0080.png' }, // 左 - 下围栏
  { id: 81, src: '/game_assets/tile_0081.png' }, // 中 - 下围栏
  { id: 82, src: '/game_assets/tile_0082.png' }, // 右 - 下围栏
  { id: 83, src: '/game_assets/tile_0083.png' }, // 公告牌
  { id: 84, src: '/game_assets/tile_0084.png' }, // 窗户
  { id: 85, src: '/game_assets/tile_0085.png' }, // 单开门
  { id: 86, src: '/game_assets/tile_0086.png' }, // 对开门 - 左
  { id: 87, src: '/game_assets/tile_0087.png' }, // 对开门 - 右

  { id: 88, src: '/game_assets/tile_0088.png' }, // 灰墙 - 窗户
  { id: 89, src: '/game_assets/tile_0089.png' }, // 灰墙 - 单开门
  { id: 90, src: '/game_assets/tile_0090.png' }, // 灰墙 - 对开门 - 左
  { id: 91, src: '/game_assets/tile_0091.png' }, // 灰墙 - 对开门 - 右
  { id: 92, src: '/game_assets/tile_0092.png' }, // 单屋顶 - 末尾
  { id: 93, src: '/game_assets/tile_0093.png' }, // 未知
  { id: 94, src: '/game_assets/tile_0094.png' }, // 干草垛
  { id: 95, src: '/game_assets/tile_0095.png' }, // 靶
  { id: 96, src: '/game_assets/tile_0096.png' }, // 左上 - 城墙顶
  { id: 97, src: '/game_assets/tile_0097.png' }, // 上 - 城墙顶
  { id: 98, src: '/game_assets/tile_0098.png' }, // 右上 - 城墙顶
  { id: 99, src: '/game_assets/tile_0099.png' }, // 左 - 城墙顶 - 道
  { id: 100, src: '/game_assets/tile_0100.png' }, // 中 - 城墙顶 - 道
  { id: 101, src: '/game_assets/tile_0101.png' }, // 右 - 城墙顶 - 道
  { id: 102, src: '/game_assets/tile_0102.png' }, // 单 - 城墙顶 - 道
  { id: 103, src: '/game_assets/tile_0103.png' }, // 城墙顶 - 储物
  { id: 104, src: '/game_assets/tile_0104.png' }, // 单房屋 - 墙
  { id: 105, src: '/game_assets/tile_0105.png' }, // 炸弹
  { id: 106, src: '/game_assets/tile_0106.png' }, // 木头
  { id: 107, src: '/game_assets/tile_0107.png' }, // 袋子
  { id: 108, src: '/game_assets/tile_0108.png' }, // 左 - 城墙顶
  { id: 109, src: '/game_assets/tile_0109.png' }, // 空白 - 城墙顶
  { id: 110, src: '/game_assets/tile_0110.png' }, // 右 - 城墙顶
  { id: 111, src: '/game_assets/tile_0111.png' }, // 左上 - 城门 - 防具
  { id: 112, src: '/game_assets/tile_0112.png' }, // 右上 - 城门 - 防具
  { id: 113, src: '/game_assets/tile_0113.png' }, // 左上 - 城门
  { id: 114, src: '/game_assets/tile_0114.png' }, // 右上 - 城门
  { id: 115, src: '/game_assets/tile_0115.png' }, // 铁镐
  { id: 116, src: '/game_assets/tile_0116.png' }, // 铁耙
  { id: 117, src: '/game_assets/tile_0117.png' }, // 钥匙
  { id: 118, src: '/game_assets/tile_0118.png' }, // 弓
  { id: 119, src: '/game_assets/tile_0119.png' }, // 箭
  { id: 120, src: '/game_assets/tile_0120.png' }, // 左下 - 城墙顶
  { id: 121, src: '/game_assets/tile_0121.png' }, // 下 - 城墙顶
  { id: 122, src: '/game_assets/tile_0122.png' }, // 右下 - 城墙顶
  { id: 123, src: '/game_assets/tile_0123.png' }, // 右 - 城墙
  { id: 124, src: '/game_assets/tile_0124.png' }, // 左 - 城墙
  { id: 125, src: '/game_assets/tile_0125.png' }, // 窗户 - 城墙
  { id: 126, src: '/game_assets/tile_0126.png' }, // 城墙
  { id: 127, src: '/game_assets/tile_0127.png' }, // 刀
  { id: 128, src: '/game_assets/tile_0128.png' }, // 铁铲
  { id: 129, src: '/game_assets/tile_0129.png' }, // 镰
  { id: 130, src: '/game_assets/tile_0130.png' }, // 空水桶
  { id: 131, src: '/game_assets/tile_0131.png' }, // 满水桶
  { id: 132, src: '/game_assets/man/tile_0132.png' }, // 男人
  { id: 133, src: '/game_assets/man/tile_0133.png' }, // 女
]

// 预定义的地图数据
const mapData = [
  [
    96, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
    98,
  ],
  [99, 28, 27, 28, 0, 0, 0, 27, 28, 0, 0, 0, 0, 27, 28, 27, 0, 0, 27, 101],
  [99, 28, 0, 0, 0, 1, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 1, 0, 0, 101],
  [99, 0, 1, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 2, 0, 101],
  [99, 0, 0, 24, 48, 49, 49, 50, 0, 72, 73, 73, 75, 0, 52, 53, 53, 26, 0, 101],
  [99, 1, 2, 24, 60, 61, 61, 62, 0, 72, 84, 74, 75, 0, 64, 65, 65, 26, 0, 101],
  [99, 0, 0, 24, 0, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 94, 0, 26, 1, 101],
  [99, 27, 28, 24, 44, 45, 45, 46, 0, 0, 1, 132, 0, 0, 44, 45, 46, 26, 0, 101],
  [99, 0, 0, 24, 0, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 133, 26, 0, 101],
  [99, 1, 2, 24, 0, 0, 83, 0, 0, 0, 2, 0, 0, 0, 29, 0, 2, 26, 0, 101],
  [99, 0, 0, 36, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 38, 0, 0, 101],
  [99, 2, 0, 0, 1, 0, 2, 0, 1, 0, 0, 2, 0, 1, 0, 2, 0, 0, 1, 101],
  [99, 28, 27, 0, 0, 17, 0, 17, 0, 0, 28, 27, 0, 0, 17, 0, 17, 0, 0, 101],
  [99, 28, 27, 0, 0, 17, 0, 17, 0, 0, 28, 27, 0, 0, 17, 0, 17, 0, 0, 101],
  [
    120, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121,
    121, 121, 121, 121, 122,
  ],
]

interface TileMapProps {
  tileSize: number
  viewportWidth: number
  viewportHeight: number
}

const TileMap: React.FC<TileMapProps> = ({
  tileSize,
  viewportWidth,
  viewportHeight,
}) => {
  const [playerX, setPlayerX] = useState(0)
  const [playerY, setPlayerY] = useState(0)
  const [tilesInViewX, setTilesInViewX] = useState(0)
  const [tilesInViewY, setTilesInViewY] = useState(0)

  useEffect(() => {
    setTilesInViewX(Math.floor(viewportWidth / tileSize))
    setTilesInViewY(Math.floor(viewportHeight / tileSize))
  }, [viewportWidth, viewportHeight, tileSize])

  useEffect(() => {
    // 找到玩家(132)的初始位置
    for (let y = 0; y < mapData.length; y++) {
      for (let x = 0; x < mapData[y].length; x++) {
        if (mapData[y][x] === 132) {
          setPlayerX(x)
          setPlayerY(y)
          return
        }
      }
    }
  }, [])

  const movePlayer = useCallback((dx: number, dy: number) => {
    setPlayerX((x) => {
      const newX = x + dx
      return newX >= 0 && newX < mapData[0].length ? newX : x
    })
    setPlayerY((y) => {
      const newY = y + dy
      return newY >= 0 && newY < mapData.length ? newY : y
    })
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          movePlayer(0, -1)
          break
        case 'ArrowDown':
          movePlayer(0, 1)
          break
        case 'ArrowLeft':
          movePlayer(-1, 0)
          break
        case 'ArrowRight':
          movePlayer(1, 0)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [movePlayer])

  const renderTiles = () => {
    const tiles = []
    const centerTileX = Math.floor(tilesInViewX / 2)
    const centerTileY = Math.floor(tilesInViewY / 2)

    for (let y = 0; y < tilesInViewY; y++) {
      for (let x = 0; x < tilesInViewX; x++) {
        const mapX = Math.max(
          0,
          Math.min(playerX - centerTileX + x, mapData[0].length - 1)
        )
        const mapY = Math.max(
          0,
          Math.min(playerY - centerTileY + y, mapData.length - 1)
        )

        const tileId = mapData[mapY][mapX]
        const tile = tileTypes.find((t) => t.id === tileId)
        const backgroundTile = tileTypes.find((t) => t.id === 0)

        tiles.push(
          <div
            key={`${x}-${y}`}
            className={styles.tileContainer}
            style={{
              position: 'absolute',
              left: `${x * tileSize}px`,
              top: `${y * tileSize}px`,
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              overflow: 'hidden',
            }}
          >
            <Image
              src={backgroundTile?.src || ''}
              alt="Background"
              width={tileSize}
              height={tileSize}
              className={styles.pixelPerfect}
            />
            {tile && tile.id !== 0 && (
              <Image
                src={tile.src}
                alt={`Tile ${tileId}`}
                width={tileSize}
                height={tileSize}
                className={`${styles.pixelPerfect} ${styles.tileOverlay}`}
              />
            )}
            <div className={styles.tileNumber}>{tileId}</div>
          </div>
        )
      }
    }

    // 渲染玩家
    const playerTile = tileTypes.find((t) => t.id === 132)
    if (playerTile) {
      tiles.push(
        <div
          key="player"
          className={styles.tileContainer}
          style={{
            position: 'absolute',
            left: `${centerTileX * tileSize}px`,
            top: `${centerTileY * tileSize - tileSize / 2}px`, // 向上偏移半个tile的高度
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            zIndex: 1000,
          }}
        >
          <Image
            src={playerTile.src}
            alt="Player"
            width={tileSize}
            height={tileSize}
            className={styles.pixelPerfect}
          />
        </div>
      )
    }

    return tiles
  }

  return (
    <div
      className={styles.tileMapContainer}
      style={{
        width: `${tilesInViewX * tileSize}px`,
        height: `${tilesInViewY * tileSize}px`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div className={styles.tileMap}>{renderTiles()}</div>
    </div>
  )
}

interface TilePreviewProps {
  tileSize: number
  tilesPerRow: number
}

const TilePreview: React.FC<TilePreviewProps> = ({ tileSize }) => {
  return (
    <div className={styles.tilePreviewContainer}>
      <h2 className="text-black">图像预览</h2>
      <div className={styles.tilePreview}>
        {tileTypes.map((tile) => (
          <div
            key={tile.id}
            className={styles.tilePreviewItem}
            style={{
              width: `${tileSize}px`,
              height: `${tileSize}px`,
            }}
          >
            <Image
              src={tile.src}
              alt={`Tile ${tile.id}`}
              width={tileSize}
              height={tileSize}
            />
            <div className={styles.tileId}>{tile.id}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const GameInterface: React.FC = () => {
  const tileSize = 32
  const tilesPerRow = 10
  const [viewportWidth, setViewportWidth] = useState(684)
  const [viewportHeight, setViewportHeight] = useState(768)

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(
        Math.floor((window.innerWidth * 0.6) / tileSize) * tileSize
      )
      setViewportHeight(
        Math.floor((window.innerHeight * 0.9) / tileSize) * tileSize
      )
    }

    handleResize() // 初始化大小
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [tileSize])

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.title}>Game</h1>
      <div style={{ display: 'flex' }}>
        <TileMap
          tileSize={tileSize}
          viewportWidth={viewportWidth}
          viewportHeight={viewportHeight}
        />
        <TilePreview tileSize={tileSize} tilesPerRow={tilesPerRow} />
      </div>
    </div>
  )
}

export default GameInterface
