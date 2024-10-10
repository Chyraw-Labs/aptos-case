'use client'
import React, {
  useState,
  useMemo,
  useCallback,
  ElementType,
  useEffect,
} from 'react'
import { Menu, Transition, Dialog } from '@headlessui/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  ChevronDown,
  Plus,
  Calendar,
  LayoutGrid,
  List,
  BarChart2,
  Filter,
  Clock,
  Image,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
// import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import BoardViewWrapper from './BoardViewWrapper'
import TableView from './TableView'
import EditModal from './EditModal'
import { v4 as uuidv4 } from 'uuid'
import { TimelineView } from './TimelineView'
import { CalendarView } from './CalendarView'
import { GalleryView } from './GalleryView'

interface DatabaseProps {
  initialData: Item[]
}

export interface Item {
  id?: number | string
  name: string
  status: string
  priority: string
  dueDate: string
  assignee: string
  progress: number
  description: string
  relatedTo?: number[] // 新增字段
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: Filter[]) => void
  currentFilters: Filter[]
}

interface DatabaseProps {
  initialData: Item[]
}

// interface CalendarViewProps {
//   data: Item[]
// }

// 属性类型
// const propertyTypes = {
//   text: { name: '文本', icon: 'align-left' },
//   number: { name: '数字', icon: 'hash' },
//   date: { name: '日期', icon: 'calendar' },
//   person: { name: '人员', icon: 'user' },
//   file: { name: '文件', icon: 'paperclip' },
//   checkbox: { name: '复选框', icon: 'check-square' },
//   url: { name: 'URL', icon: 'link' },
//   email: { name: '电子邮件', icon: 'mail' },
//   phone: { name: '电话', icon: 'phone' },
//   formula: { name: '公式', icon: 'function-square' },
//   relation: { name: '关联', icon: 'git-branch' },
//   rollup: { name: '汇总', icon: 'database' },
//   createdTime: { name: '创建时间', icon: 'clock' },
//   createdBy: { name: '创建者', icon: 'user-plus' },
//   lastEditedTime: { name: '最后编辑时间', icon: 'clock' },
//   lastEditedBy: { name: '最后编辑者', icon: 'user-check' },
// }

// const CalendarView: React.FC<CalendarViewProps> = ({ data }) => {
//   const events = (data as unknown as Item[]).reduce((acc, item) => {
//     const date = new Date(item.dueDate)
//     const dateString = date.toISOString().split('T')[0]
//     if (!acc[dateString]) acc[dateString] = []
//     acc[dateString].push(item)
//     return acc
//   }, {} as { [key: string]: Item[] })

//   return (
//     <div className="overflow-x-auto">
//       <DayPicker
//         mode="single"
//         showOutsideDays
//         modifiers={{
//           hasEvents: (date) => {
//             const dateString = date.toISOString().split('T')[0]
//             return !!events[dateString]
//           },
//         }}
//         modifiersStyles={{
//           hasEvents: { backgroundColor: '#e6f2ff' },
//         }}
//         onDayClick={(date) => {
//           const dateString = date.toISOString().split('T')[0]
//           if (events[dateString]) {
//             console.log(events[dateString]) // 这里可以显示当天的事件详情
//           }
//         }}
//       />
//       <div className="mt-4">
//         {Object.entries(events).map(([date, items]) => (
//           <div key={date} className="mb-4">
//             <h3 className="font-bold">{date}</h3>
//             {items.map((item) => (
//               <div key={item.id} className="bg-white p-2 rounded shadow mt-2">
//                 <h4 className="font-semibold">{item.name}</h4>
//                 <p className="text-sm text-gray-500">{item.status}</p>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// interface TimelineProps {
//   data: Item[]
// }

type PropertyType = {
  name: string
  icon: string
}

const propertyTypes: Record<string, PropertyType> = {
  text: { name: '文本', icon: 'align-left' },
  number: { name: '数字', icon: 'hash' },
  date: { name: '日期', icon: 'calendar' },
  person: { name: '人员', icon: 'user' },
  file: { name: '文件', icon: 'paperclip' },
  checkbox: { name: '复选框', icon: 'check-square' },
  url: { name: 'URL', icon: 'link' },
  email: { name: '电子邮件', icon: 'mail' },
  phone: { name: '电话', icon: 'phone' },
  formula: { name: '公式', icon: 'function-square' },
  relation: { name: '关联', icon: 'git-branch' },
  rollup: { name: '汇总', icon: 'database' },
  createdTime: { name: '创建时间', icon: 'clock' },
  createdBy: { name: '创建者', icon: 'user-plus' },
  lastEditedTime: { name: '最后编辑时间', icon: 'clock' },
  lastEditedBy: { name: '最后编辑者', icon: 'user-check' },
}

// 时间线视图
// const TimelineView: React.FC<TimelineProps> = ({ data }) => (
//   <Timeline lineColor={'#ddd'}>
//     {data.map((item) => (
//       <TimelineItem
//         key={item.id}
//         dateText={item.dueDate}
//         style={{ color: '#e86971' }}
//       >
//         <h3>{item.name}</h3>
//         <p>{item.description}</p>
//       </TimelineItem>
//     ))}
//   </Timeline>
// )

// interface GalleryViewProps {
//   data: Item[]
// }

// const GalleryView: React.FC<GalleryViewProps> = ({ data }) => (
//   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//     {data.map((item) => (
//       <div key={item.id} className="border rounded-lg p-4 shadow">
//         <h3 className="font-bold text-lg mb-2">{item.name}</h3>
//         <p className="text-gray-600 mb-2">{item.status}</p>
//         <p className="text-sm">{item.description}</p>
//       </div>
//     ))}
//   </div>
// )

interface ChartViewProps {
  data: Item[]
}

const ChartView: React.FC<ChartViewProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="progress" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
)

interface ViewButtonProps {
  icon: ElementType
  text: string
  onClick: () => void
  isActive: boolean
}

// 视图按钮
const ViewButton: React.FC<ViewButtonProps> = ({
  icon: Icon,
  text,
  onClick,
  isActive,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
      isActive
        ? 'bg-cyan-400 text-white'
        : 'text-gray-600 hover:bg-white hover:bg-opacity-30 hover:text-gray-200'
    }`}
  >
    <Icon className="mr-2 h-5 w-5" />
    {text}
  </button>
)

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: Filter[]) => void
  currentFilters: Filter[]
}

interface Filter {
  field: keyof Item
  operator: 'equals' | 'contains' | 'greater' | 'less'
  value: string
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}) => {
  const [filters, setFilters] = useState(currentFilters)

  const handleFilterChange = (
    index: number,
    key: keyof Filter,
    value: string
  ) => {
    const newFilters = [...filters]
    if (key === 'operator') {
      newFilters[index] = {
        ...newFilters[index],
        [key]: value as Filter['operator'],
      }
    } else {
      newFilters[index] = { ...newFilters[index], [key]: value }
    }
    setFilters(newFilters)
  }

  const addFilter = () => {
    setFilters([
      ...filters,
      { field: 'name', operator: 'equals', value: '' } as Filter,
    ])
  }

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index)
    setFilters(newFilters)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* 对话框定位 */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            高级过滤
          </Dialog.Title>
          <div className="mt-2">
            {filters.map((filter, index) => (
              <div key={index} className="mb-4 flex items-center">
                <select
                  value={filter.field}
                  onChange={(e) =>
                    handleFilterChange(
                      index,
                      'field',
                      e.target.value as keyof Item
                    )
                  }
                  className="mr-2 p-2 border rounded"
                >
                  <option value="">选择字段</option>
                  <option value="name">名称</option>
                  <option value="status">状态</option>
                  <option value="priority">优先级</option>
                  <option value="assignee">负责人</option>
                </select>
                <select
                  value={filter.operator}
                  onChange={(e) =>
                    handleFilterChange(index, 'operator', e.target.value)
                  }
                  className="mr-2 p-2 border rounded"
                >
                  <option value="">选择操作符</option>
                  <option value="equals">等于</option>
                  <option value="contains">包含</option>
                  <option value="greater">大于</option>
                  <option value="less">小于</option>
                </select>
                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) =>
                    handleFilterChange(index, 'value', e.target.value)
                  }
                  className="mr-2 p-2 border rounded"
                  placeholder="值"
                />
                <button
                  onClick={() => removeFilter(index)}
                  className="text-red-500"
                >
                  删除
                </button>
              </div>
            ))}
            <button onClick={addFilter} className="mt-2 text-blue-500">
              + 添加过滤条件
            </button>
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={() => {
                onApply(filters)
                onClose()
              }}
            >
              应用
            </button>
            <button
              type="button"
              className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              onClick={onClose}
            >
              取消
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

interface SortConfig {
  key: keyof Item
  order: 'asc' | 'desc'
}

const Database: React.FC<DatabaseProps> = ({ initialData }) => {
  const [data, setData] = useState<Item[]>([])
  const [view, setView] = useState<string>('table')

  const [filters, setFilters] = useState<Filter[]>([]) // You may want to define a more specific type for filters
  const [groupBy, setGroupBy] = useState<keyof Item | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [sortConfig] = useState<SortConfig | null>(null)

  const sortedAndFilteredData = useMemo(() => {
    if (!Array.isArray(data)) {
      console.error('Data is not an array:', data)
      return []
    }
    let result = [...data]
    // 应用过滤器
    filters.forEach((filter) => {
      if (filter.field && filter.operator && filter.value) {
        result = result.filter((item) => {
          const itemValue = String(item[filter.field]).toLowerCase()
          const filterValue = filter.value.toLowerCase()
          switch (filter.operator) {
            case 'equals':
              return itemValue === filterValue
            case 'contains':
              return itemValue.includes(filterValue)
            case 'greater':
              return parseFloat(itemValue) > parseFloat(filterValue)
            case 'less':
              return parseFloat(itemValue) < parseFloat(filterValue)
            default:
              return true
          }
        })
      }
    })

    // 应用搜索
    if (searchTerm) {
      result = result.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // 排序
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        // Handle cases where the values might be undefined
        if (aValue === undefined && bValue === undefined) return 0
        if (aValue === undefined) return sortConfig.order === 'asc' ? 1 : -1
        if (bValue === undefined) return sortConfig.order === 'asc' ? -1 : 1

        // Compare values
        if (aValue < bValue) return sortConfig.order === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.order === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, sortConfig, filters, searchTerm])

  const groupedData = useMemo(() => {
    if (!groupBy) return { 所有项目: sortedAndFilteredData }
    return sortedAndFilteredData.reduce((acc, item) => {
      const key = String(item[groupBy]) || '未分组'
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {} as { [key: string]: Item[] })
  }, [sortedAndFilteredData, groupBy])

  const handleDrop = useCallback((itemId: number, newStatus: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    )
  }, [])

  const handleEdit = (item: React.SetStateAction<Item | null>) => {
    setEditingItem(item)
    setIsEditModalOpen(true)
  }

  const handleDelete = (itemId: number | string) => {
    setData((prevData) => prevData.filter((item) => item.id !== itemId))
  }
  useEffect(() => {
    setData(initialData.map((item) => ({ ...item, id: uuidv4() })))
  }, [initialData])
  // const handleSaveEdit = (editedItem: Item) => {
  //   setData((prevData) =>
  //     prevData.map((item) => (item.id === editedItem.id ? editedItem : item))
  //   )
  // }

  // TODO
  const renderView = () => {
    switch (view) {
      case 'table':
        return (
          <TableView
            data={sortedAndFilteredData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )
      case 'board':
        return (
          <BoardViewWrapper
            data={groupedData}
            groupBy={groupBy}
            onDrop={handleDrop}
          />
        )
      case 'calendar':
        return <CalendarView data={sortedAndFilteredData} />
      case 'timeline':
        return <TimelineView data={sortedAndFilteredData} />
      case 'gallery':
        return <GalleryView data={sortedAndFilteredData} />
      case 'chart':
        return <ChartView data={sortedAndFilteredData} />
      default:
        return null
    }
  }
  const isKeyOfItem = (key: string): key is keyof Item => {
    return key in initialData[0] // 假设initialData至少有一个元素
  }

  const createNewItem = (): Item => {
    return {
      id: uuidv4(), // 或者使用其他方式生成唯一ID
      name: '',
      status: 'New', // 或其他默认状态
      priority: 'Medium', // 或其他默认优先级
      dueDate: new Date().toISOString().split('T')[0], // 今天的日期作为默认截止日期
      assignee: '',
      progress: 0,
      description: '',
    }
  }

  return (
    <>
      <div className="flex flex-col items-center mx-4 my-4 z-10">
        <p className="font-bold text-7xl mb-4">信息看板</p>
        <div className="text-center mx-auto max-w-prose">
          <span className="text-base mb-4 block">
            你可以在这里查阅关于 Aptos、Move
            和区块链的信息，如果你需要更系统的信息，可以在
            <span>
              <a
                href="/doc"
                className="text-blue-400 hover:underline hover:text-blue-600"
              >
                知识中心与文档库
              </a>
            </span>
            查询
          </span>
        </div>

        <div className="flex flex-row items-center gap-4 my-2">
          <DndProvider backend={HTML5Backend}>
            <div className="container mx-auto p-4 bg-black z-100">
              <div className="mb-4 flex justify-between items-center flex-wrap">
                {/* 选择按钮 */}
                <div className="space-x-2 mb-2 flex justify-between">
                  <ViewButton
                    icon={List}
                    text="Table"
                    onClick={() => setView('table')}
                    isActive={view === 'table'}
                  />
                  <ViewButton
                    icon={LayoutGrid}
                    text="Board"
                    onClick={() => setView('board')}
                    isActive={view === 'board'}
                  />
                  <ViewButton
                    icon={Calendar}
                    text="Calendar"
                    onClick={() => setView('calendar')}
                    isActive={view === 'calendar'}
                  />
                  <ViewButton
                    icon={Clock}
                    text="Timeline"
                    onClick={() => setView('timeline')}
                    isActive={view === 'timeline'}
                  />
                  <ViewButton
                    icon={Image}
                    text="Gallery"
                    onClick={() => setView('gallery')}
                    isActive={view === 'gallery'}
                  />
                  <ViewButton
                    icon={BarChart2}
                    text="Chart"
                    onClick={() => setView('chart')}
                    isActive={view === 'chart'}
                  />
                </div>
                {/* 搜索框 */}
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-2 py-1 border rounded"
                  />
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                      Group by
                      <ChevronDown
                        className="-mr-1 ml-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {Object.keys(propertyTypes).map((key) => (
                            <Menu.Item key={key}>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={`${
                                    active
                                      ? 'bg-gray-100 text-gray-900'
                                      : 'text-gray-700'
                                  } block px-4 py-2 text-sm`}
                                  onClick={() => {
                                    if (isKeyOfItem(key)) {
                                      setGroupBy(key)
                                    } else {
                                      console.warn(
                                        `${key} is not a valid key of Item`
                                      )
                                    }
                                  }}
                                >
                                  {propertyTypes[key].name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Filter className="mr-2 h-5 w-5" />
                    Filter
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(createNewItem())
                      setIsEditModalOpen(true)
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add New
                  </button>
                </div>
              </div>
              {/* 渲染内容 */}
              {renderView()}
              {/* 过滤器 */}
              <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={setFilters}
                currentFilters={filters}
              />
              {/* 编辑模式 */}
              <EditModal
                isOpen={isEditModalOpen}
                onClose={() => {
                  setIsEditModalOpen(false)
                  setEditingItem(null) // 重置editingItem
                }}
                item={editingItem}
                onSave={(savedItem) => {
                  // 处理保存逻辑
                  setData((prevData) => [...prevData, savedItem])
                  setIsEditModalOpen(false)
                  setEditingItem(null)
                }}
              />
            </div>
          </DndProvider>
        </div>
      </div>
    </>
  )
}

export default Database
