import React, { useState } from 'react'
import { Item } from './Database'
import { ChevronDown, ChevronRight, AlertCircle } from 'lucide-react'
import { Transition } from '@headlessui/react'
import { UrlCell, UrlPreview } from './UrlCell'

interface TableViewProps {
  data: Item[]
  onEdit?: (item: Item) => void
  onDelete?: (id: string | number) => void
}

const keyToChineseMap: Record<keyof Item, string> = {
  id: 'ID',
  name: '名称',
  status: '状态',
  priority: '重要性',
  dueDate: '最后更新日期',
  assignee: '作者',
  progress: '进度',
  description: '描述',
  relatedTo: '相关文章',
  url: '链接',
}

const TruncatedCell: React.FC<{ content: string; maxLength?: number }> = ({
  content,
  maxLength = 32,
}) => {
  const truncatedContent =
    content.length > maxLength ? content.slice(0, maxLength) + '...' : content
  return (
    <td className="px-4 py-3 whitespace-nowrap">
      <div
        className="max-w-[150px] overflow-hidden text-ellipsis"
        title={content}
      >
        {truncatedContent}
      </div>
    </td>
  )
}

const ExpandableRow: React.FC<{
  item: Item
  headers: (keyof Item)[]
  isExpanded: boolean
  onToggle: () => void
}> = ({ item, headers, isExpanded, onToggle }) => {
  return (
    <>
      <tr
        className="cursor-pointer hover:bg-white/5 transition-colors duration-150 ease-in-out"
        onClick={onToggle}
      >
        <td className="px-4 py-3 whitespace-nowrap">
          {isExpanded ? (
            <ChevronDown size={20} className="text-blue-400" />
          ) : (
            <ChevronRight size={20} className="text-gray-400" />
          )}
        </td>
        {headers
          .filter((key) => key !== 'id' && key !== 'description')
          .map((key) =>
            key === 'url' ? (
              <UrlCell key={key} url={String(item[key] ?? '')} />
            ) : (
              <TruncatedCell key={key} content={String(item[key] ?? '')} />
            )
          )}
        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
          <button className="text-yellow-400 hover:text-yellow-300 transition-colors duration-150 ease-in-out">
            <AlertCircle size={20} />
          </button>
        </td>
      </tr>
      <Transition
        show={isExpanded}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <tr>
          <td
            colSpan={headers.length + 2}
            className="px-4 py-3 whitespace-pre-wrap bg-white/5 backdrop-blur-sm"
          >
            <div className="text-sm">
              <p>
                <strong className="text-blue-400">ID:</strong>{' '}
                {item.id ?? 'N/A'}
              </p>
              <p>
                <strong className="text-blue-400">描述:</strong>{' '}
                {item.description ?? 'N/A'}
              </p>
            </div>
          </td>
        </tr>
      </Transition>
      <UrlPreview />
    </>
  )
}

// const ExpandableRow: React.FC<{
//   item: Item
//   headers: (keyof Item)[]
//   isExpanded: boolean
//   onToggle: () => void
// }> = ({ item, headers, isExpanded, onToggle }) => {
//   return (
//     <>
//       <tr
//         className="cursor-pointer hover:bg-white/5 transition-colors duration-150 ease-in-out"
//         onClick={onToggle}
//       >
//         <td className="px-4 py-3 whitespace-nowrap">
//           {isExpanded ? (
//             <ChevronDown size={20} className="text-blue-400" />
//           ) : (
//             <ChevronRight size={20} className="text-gray-400" />
//           )}
//         </td>
//         {headers
//           .filter((key) => key !== 'id' && key !== 'description')
//           .map((key) => (
//             <TruncatedCell key={key} content={String(item[key] ?? '')} />
//           ))}
//         <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
//           <button className="text-yellow-400 hover:text-yellow-300 transition-colors duration-150 ease-in-out">
//             <AlertCircle size={20} />
//           </button>
//         </td>
//       </tr>
//       <Transition
//         show={isExpanded}
//         enter="transition-opacity duration-75"
//         enterFrom="opacity-0"
//         enterTo="opacity-100"
//         leave="transition-opacity duration-150"
//         leaveFrom="opacity-100"
//         leaveTo="opacity-0"
//       >
//         <tr>
//           <td
//             colSpan={headers.length + 2}
//             className="px-4 py-3 whitespace-pre-wrap bg-white/5 backdrop-blur-sm"
//           >
//             <div className="text-sm">
//               <p>
//                 <strong className="text-blue-400">ID:</strong>{' '}
//                 {item.id ?? 'N/A'}
//               </p>
//               <p>
//                 <strong className="text-blue-400">描述:</strong>{' '}
//                 {item.description ?? 'N/A'}
//               </p>
//             </div>
//           </td>
//         </tr>
//       </Transition>
//     </>
//   )
// }

const TableView: React.FC<TableViewProps> = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(
    new Set()
  )

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 bg-white/5 backdrop-blur-sm rounded-lg">
        <AlertCircle size={48} className="mx-auto text-yellow-400 mb-4" />
        <p className="text-lg text-gray-300">暂无数据</p>
      </div>
    )
  }

  const headers = Object.keys(data[0]).filter(
    (key) => key !== 'id' && key !== 'description'
  ) as (keyof Item)[]

  const toggleRow = (id: string | number | undefined) => {
    if (id === undefined) return
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="overflow-x-auto bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-lg shadow-xl">
      <table className="min-w-full divide-y divide-gray-200/20">
        <thead className="bg-white/10">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
            {headers.map((key) => (
              <th
                key={key}
                className="px-4 py-3 text-left text-md font-medium text-cyan-200 font-blod uppercase tracking-wider"
              >
                {keyToChineseMap[key] || key}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200/20">
          {data.map((item) => (
            <ExpandableRow
              key={item.id ?? `row-${Math.random()}`}
              item={item}
              headers={headers}
              isExpanded={!!item.id && expandedRows.has(item.id)}
              onToggle={() => toggleRow(item.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableView
