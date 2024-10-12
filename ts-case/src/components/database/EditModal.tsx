import React, { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import { Item } from './Database'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  item: Item | null
  onSave: (item: Item) => void
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
}) => {
  const [editedItem, setEditedItem] = useState<Item>({
    id:1,
    name: '',
    status: '未开始',
    priority: '中',
    dueDate: '',
    assignee: '',
    progress: 0,
    description: 'description',
    url: 'url',
  })

  useEffect(() => {
    if (item) {
      setEditedItem(item)
    }
  }, [item])

  const handleChange = (key: keyof Item, value: string | number) => {
    setEditedItem((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave(editedItem)
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {editedItem.id ? '编辑项目' : '新建项目'}
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  <input
                    type="text"
                    value={editedItem.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="项目名称"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={editedItem.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="未开始">未开始</option>
                    <option value="进行中">进行中</option>
                    <option value="已完成">已完成</option>
                  </select>
                  <select
                    value={editedItem.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="低">低</option>
                    <option value="中">中</option>
                    <option value="高">高</option>
                  </select>
                  <input
                    type="date"
                    value={editedItem.dueDate}
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={editedItem.assignee}
                    onChange={(e) => handleChange('assignee', e.target.value)}
                    placeholder="负责人"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={editedItem.progress}
                    onChange={(e) =>
                      handleChange('progress', parseInt(e.target.value))
                    }
                    placeholder="进度"
                    min="0"
                    max="100"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleSave}
                  >
                    保存
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default EditModal
