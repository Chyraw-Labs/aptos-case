import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckCircle2 } from 'lucide-react'

const CompletionDialog = ({
  project,
  onConfirm,
  onSubmit,
  isOpen,
  onClose,
}) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="w-full max-w-4xl p-6 bg-black rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white flex justify-center items-center">
        恭喜完成项目!
      </h2>
      <div className="flex flex-col items-center mb-6">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-xl mb-2 text-white">项目里程碑</h3>
        {project.steps.map((step) => (
          <div key={step.id} className="flex items-center mb-2 text-white">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            <span>{step.title}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          确认
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          提交
        </button>
      </div>
    </div>

    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
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

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                项目已提交
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  您的项目已成功提交。感谢您的完成！
                </p>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  onClick={() => {
                    onClose()
                    onConfirm()
                  }}
                >
                  确定
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  </div>
)

export default CompletionDialog
