'use client'
import FileViewer from '@/components/database/Database'

// 假设这是我们的初始数据
const initialData = [
  {
    id: 1,
    name: '项目 A',
    status: '进行中',
    priority: '高',
    dueDate: '2023-07-15',
    assignee: '张三',
    progress: 60,
    relatedTo: [2, 3],
    subItems: [6, 7],
    description: '这是项目 A 的详细描述。',
    attachments: ['https://example.com/fileA.pdf'],
    comments: [
      {
        id: 1,
        user: '李四',
        content: '请尽快完成！',
        timestamp: '2023-07-10T10:00:00Z',
      },
    ],
    formula: { totalTime: 120 },
    createdAt: '2023-07-01T09:00:00Z',
    createdBy: '王五',
    lastEditedAt: '2023-07-10T11:00:00Z',
    lastEditedBy: '张三',
  },
]

// import ProjectTrack from '@/components/TrackNFT'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <div className="flex flex-col h-screen w-screen">
        <a href="/" className="flex justify-center items-center my-2 ">
          <Image
            className="flex-shrink-0"
            src="/assets/logo.svg"
            alt="logo"
            width={40}
            height={40}
          />
          <h1 className="flex-none justify-start px-2 font-bold text-md">
            Aptos Case
          </h1>
        </a>
        <div className="flex-grow overflow-auto">
          <FileViewer initialData={initialData || []} />
        </div>
      </div>
    </>
  )
}
