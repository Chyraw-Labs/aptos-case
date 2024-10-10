import { Item } from '@/components/database/Database'

export const DOCSBASE: Omit<Item, 'id'>[] = [
  {
    name: '项目 A',
    status: '进行中',
    priority: '高',
    dueDate: '2023-07-15',
    assignee: '张三',
    progress: 60,
    relatedTo: [2, 3],
    description: '这是项目 A 的详细描述。',
  },
]
