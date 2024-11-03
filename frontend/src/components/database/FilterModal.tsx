import { useState } from 'react'
import { Filter } from './Database'
import { Dialog } from '@headlessui/react'
import { Trash2, X } from 'lucide-react'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: Filter[]) => void
  currentFilters: Filter[]
}

export const FilterModal: React.FC<FilterModalProps> = ({
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
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md p-6 text-left align-middle shadow-xl transition-all border border-white/20">
          <Dialog.Title
            as="h3"
            className="text-xl font-semibold leading-6 text-white mb-4"
          >
            高级过滤
          </Dialog.Title>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white focus:outline-none"
          >
            {/* <XIcon className="h-6 w-6" /> */}
            <X className="h-6 w-6" />
          </button>
          <div className="mt-2 space-y-4">
            {filters.map((filter, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <select
                  value={filter.field}
                  onChange={(e) =>
                    handleFilterChange(index, 'field', e.target.value)
                  }
                  className="w-1/4 p-2 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
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
                  className="w-1/4 p-2 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
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
                  className="w-1/3 p-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="值"
                />
                <button
                  onClick={() => removeFilter(index)}
                  className="p-2 rounded bg-red-500/70 text-white hover:bg-red-600/70 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              onClick={addFilter}
              className="mt-2 text-blue-300 hover:text-blue-400 focus:outline-none"
            >
              + 添加过滤条件
            </button>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 rounded bg-blue-500/70 text-white hover:bg-blue-600/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                onApply(filters)
                onClose()
              }}
            >
              应用
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
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
