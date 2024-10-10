//
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Item } from './Database'

interface ItemCardProps {
  item: Item
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  // We'll implement drag functionality here
  return (
    <div className="bg-black p-2 mb-2 rounded border border-white shadow">
      <h4 className="font-semibold">{item.name}</h4>
      <p className="text-sm text-gray-500">{item.status}</p>
      <p className="text-sm text-gray-500">截止: {item.dueDate}</p>
    </div>
  )
}

interface ColumnDropZoneProps {
  status: string
  children: React.ReactNode
  onDrop: (itemId: number, newStatus: string) => void
}

interface ItemCardProps {
  item: Item
}

interface BoardViewProps {
  data: { [key: string]: Item[] }
  groupBy: keyof Item | null
  onDrop: (itemId: number, newStatus: string) => void
}

const ColumnDropZone: React.FC<ColumnDropZoneProps> = ({
  status,
  children,
}) => {
  // We'll implement drop functionality here
  return (
    <div className="flex-shrink-0 w-64 bg-white bg-opacity-10  rounded-md p-4">
      <h3 className="font-bold mb-2">{status}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

const BoardView: React.FC<BoardViewProps> = ({ data, onDrop }) => (
  <div className="flex space-x-4 overflow-x-auto bg-black">
    {Object.entries(data).map(([group, items]) => (
      <ColumnDropZone key={group} status={group} onDrop={onDrop}>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </ColumnDropZone>
    ))}
  </div>
)

const BoardViewWrapper: React.FC<BoardViewProps> = (props) => (
  <DndProvider backend={HTML5Backend}>
    <BoardView {...props} />
  </DndProvider>
)

export default BoardViewWrapper
