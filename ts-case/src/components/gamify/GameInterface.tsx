'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import styles from '@/styles/GameInterface.module.css'
import MoveEditorWrapper from '../EditorWrapper'
import { useMoveEditor } from '../MoveEditorProvider'
import DocsTable from '../DocsTable'
import { MoveWasm } from '@/move-wasm/MoveWasm'
import useCompileMove from '@/move-wasm/CompileMove'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
// import WalletButton from '../WalletButton'
import { ClipboardList, X } from 'lucide-react'

import EnhancedWalletButton from '../EnhancedWalletButton'
interface CompileMoveResult {
  response: string
  // 其他属性
}

interface Tile {
  id: number
  src: string
}

// 预定义的 tile 类型
const tileTypes: Tile[] = [
  { id: 0, src: '/game_assets/road_1.png' }, // 空草地
  // 城墙

  { id: 1, src: '/game_assets/walls/wall_1.png' }, // 空草地
  { id: 2, src: '/game_assets/walls/wall_2.png' }, // 空草地
  { id: 3, src: '/game_assets/walls/wall_3.png' }, // 空草地
  { id: 4, src: '/game_assets/walls/wall_4.png' }, // 空草地
  { id: 5, src: '/game_assets/walls/wall_5.png' }, // 空草地
  { id: 6, src: '/game_assets/walls/wall_6.png' }, // 空草地
  { id: 7, src: '/game_assets/walls/wall_7.png' }, // 空草地
  { id: 8, src: '/game_assets/walls/wall_8.png' }, // 空草地

  // { id: 1, src: '/game_assets/tile_0001.png' }, // 杂草草地
  // { id: 2, src: '/game_assets/tile_0002.png' }, // 花草地
  // { id: 3, src: '/game_assets/tile_0003.png' }, // 黄色的树尖
  // { id: 4, src: '/game_assets/tile_0004.png' }, // 绿色的树尖
  // { id: 5, src: '/game_assets/tile_0005.png' }, // 绿色的灌木丛
  // { id: 6, src: '/game_assets/tile_0006.png' }, // 右 - 绿色的小树尖和灌木丛
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
    8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 2,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3,
  ],
  [
    6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 4,
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
        const mapX = playerX - centerTileX + x
        const mapY = playerY - centerTileY + y

        const isOutOfBounds =
          mapX < 0 ||
          mapX >= mapData[0].length ||
          mapY < 0 ||
          mapY >= mapData.length

        if (isOutOfBounds) {
          // 渲染透明的 tiles
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
              }}
            />
          )
        } else {
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

interface TaskProps {
  task: string
}
const TaskListButton: React.FC<TaskProps> = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
      >
        <ClipboardList size={20} className="mr-1" />
        任务
      </button>
      {isOpen && (
        <div className="fixed top-4 right-4 w-96 bg-white text-black p-4 rounded-lg shadow-lg z-50 border-l-4 border-blue-500">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">任务列表</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <pre className="text-sm whitespace-pre-wrap">{task}</pre>
          </div>
        </div>
      )}
    </>
  )
}

const GameInterface: React.FC = () => {
  const tileSize = 32

  const [viewportWidth, setViewportWidth] = useState(564)
  const [viewportHeight, setViewportHeight] = useState(248)
  const { account } = useWallet()
  const [code, setCode] = useState('// 请在此处输入您的代码，输入前删除此行')
  const [output, setOutput] = useState('')
  const [task] = useState('正在开发中，感谢关注！')
  const { exportCode } = useMoveEditor()
  const editorCode = exportCode()
  useEffect(() => {
    setCode(editorCode)
  }, [editorCode])

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

  const result = useCompileMove() as CompileMoveResult | null

  const handleRunCode = () => {
    console.log(result)
    if (!account?.address) {
      setOutput(
        `Address: 未找到\n\n请连接钱包后重试（您可能需要复制当前代码）\n\n[END]`
      )
      return
    }
    if (result) {
      console.log('address: ', account?.address, 'result: ', result.response)
      if (result.response) {
        setOutput(
          `Address: ${account?.address} \n\n编译失败\n\n${result.response}\n[END]`
        )
      } else {
        setOutput(`Address: ${account?.address} \n\n编译成功\n\n[END]`)
      }
    } else {
      setOutput(
        `Address: ${account?.address} \n\n请编辑代码后重新运行\n\n[END]`
      )
      console.log('Result is null or undefined')
    }
  }
  // const TaskList = ({ task }) => {
  //   task = 'test'
  //   return (
  //     <div className="bg-gray-800 text-white p-2  flex flex-col">
  //       <h1 className="text-lg font-bold mb-2">任务列表</h1>
  //       <div className="overflow-y-auto flex-grow">
  //         <pre className="text-sm whitespace-pre-wrap">{task}</pre>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="flex h-full w-screen bg-black">
      {/* 左侧 */}
      <div className="w-1/2 h-full flex flex-col overflow-hidden">
        <div className="p-2 flex justify-between">
          <EnhancedWalletButton />
          {/* <WalletButton /> */}
          <TaskListButton task={task} />
        </div>
        <div className="flex-grow overflow-hidden">
          <TileMap
            tileSize={tileSize}
            viewportWidth={viewportWidth}
            viewportHeight={viewportHeight}
          />
        </div>
      </div>

      {/* 右侧 */}
      <div className="w-1/2 flex flex-col bg-gray-100 overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex flex-wrap justify-between items-center p-2 sm:p-4">
            <h2 className="text-lg sm:text-xl font-bold text-black mr-2">
              编辑器
            </h2>
            <div className="flex-grow flex justify-end items-center space-x-2">
              <DocsTable />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <MoveEditorWrapper initialCode={code} />
          </div>
        </div>
        {/* Command Line */}
        <div className="h-1/3 bg-black text-white flex flex-col overflow-hidden">
          <div className="flex flex-wrap justify-between items-center p-2 sm:p-4">
            <h2 className="text-lg sm:text-xl font-bold">输出</h2>
            <div className="flex items-center space-x-2">
              <MoveWasm />
              <button
                onClick={handleRunCode}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
              >
                运行
              </button>
            </div>
          </div>
          <pre className="flex-1 overflow-y-auto p-2 bg-gray-800 rounded m-2 sm:m-4 text-sm">
            {output}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default GameInterface
