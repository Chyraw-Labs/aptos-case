import React, { useEffect, useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export interface Item {
  id: number | string
  name: string
  status: string
  priority: string
  dueDate: string
  assignee: string
  progress: number
  description: string
  relatedTo?: number[]
  url: string
}

interface ItemCardProps {
  item: Item
}

const ItemCard: React.FC<ItemCardProps> = React.memo(({ item }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { id: item.id, status: item.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  useEffect(() => {
    drag(ref)
  }, [drag])

  return (
    <div
      ref={ref}
      className={`
        bg-white  bg-opacity-10 backdrop-blur rounded-lg shadow-sm p-4 mb-3 cursor-move
        transition-all duration-200 ease-in-out
        ${isDragging ? 'opacity-50' : 'opacity-100 hover:shadow-md'}
      `}
    >
      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
        {item.name}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
        状态: {item.status}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
        优先级: {item.priority}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
        截止日期: {item.dueDate}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
        分配给: {item.assignee}
      </p>
      <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${item.progress}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        进度: {item.progress}%
      </p>
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 text-sm mt-2 block"
        >
          查看详情
        </a>
      )}
    </div>
  )
})

ItemCard.displayName = 'ItemCard'

interface ColumnDropZoneProps {
  status: string
  items: Item[]
  onDrop: (itemId: number | string, newStatus: string) => void
}

const ColumnDropZone: React.FC<ColumnDropZoneProps> = ({
  status,
  items,
  onDrop,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isOver }, drop] = useDrop({
    accept: 'ITEM',
    drop: (item: { id: number | string; status: string }) => {
      if (item.status !== status) {
        onDrop(item.id, status)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  useEffect(() => {
    drop(ref)
  }, [drop])

  return (
    <div
      ref={ref}
      className={`
        bg-white  rounded-lg bg-opacity-10 p-4 w-80 flex-shrink-0
        transition-all duration-200 ease-in-out
        ${isOver ? 'shadow-lg scale-105' : 'shadow-md'}
      `}
    >
      <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {status}
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

ColumnDropZone.displayName = 'ColumnDropZone'

interface BoardViewProps {
  data: { [key: string]: Item[] }
  groupBy: keyof Item | null
  onDrop: (itemId: number | string, newStatus: string) => void
}

const BoardView: React.FC<BoardViewProps> = ({ data, onDrop }) => {
  return (
    <div className="flex space-x-4 overflow-x-auto p-6 bg-white min-h-screen  bg-opacity-10 backdrop-blur rounded-lg">
      {Object.entries(data).map(([status, items]) => (
        <ColumnDropZone
          key={status}
          status={status}
          items={items}
          onDrop={onDrop}
        />
      ))}
    </div>
  )
}

BoardView.displayName = 'BoardView'

const BoardViewWrapper: React.FC<BoardViewProps> = (props) => (
  <DndProvider backend={HTML5Backend}>
    <BoardView {...props} />
  </DndProvider>
)

BoardViewWrapper.displayName = 'BoardViewWrapper'

export default BoardViewWrapper
