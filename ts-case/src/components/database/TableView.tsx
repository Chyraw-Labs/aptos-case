import React from 'react'
import { Item } from './Database'

interface TableViewProps {
  data: Item[]
  onEdit: (item: Item) => void
  onDelete: (id: string | number) => void
}

const TableView: React.FC<TableViewProps> = ({ data, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-4">No data available</div>
  }

  const headers = Object.keys(data[0]) as (keyof Item)[]

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white bg-opacity-10">
          <tr>
            {headers.map((key) => (
              <th
                key={key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {key}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white bg-opacity-10 divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id}>
              {headers.map((key) => (
                <td key={key} className="px-6 py-4 whitespace-nowrap">
                  {String(item[key])}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(item)}
                  className="text-indigo-600 hover:text-indigo-900 mr-2"
                >
                  编辑
                </button>
                <button
                  onClick={() => item.id !== undefined && onDelete(item.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableView
