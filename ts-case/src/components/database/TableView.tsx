import React from 'react'
import { Item } from './Database'

interface TableViewProps {
  data: Item[]
  onEdit: (item: Item) => void
  onDelete: (id: string | number) => void
}

// 创建一个映射对象，将英文键名映射到中文
const keyToChineseMap: Record<keyof Item, string> = {
  id: 'ID',
  name: '名称',
  status: '状态',
  priority: '优先级',
  dueDate: '截止日期',
  assignee: '负责人',
  progress: '进度',
  description: '描述',
  relatedTo: '相关项目',
}

const TableView: React.FC<TableViewProps> = ({ data, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-4">暂无数据</div>
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
                className="px-2 py-2 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                {keyToChineseMap[key] || key}
              </th>
            ))}
            <th className="px-2 py-2 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
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
