'use client'
import SynologyCMS from './Cms'

const categories = [
  { name: '应用教学 & 常见问题', count: 1293 },
  { name: '帮助', count: 1161 },
  { name: '故障排除', count: 854 },
  { name: '产品介绍', count: 732 },
  { name: '用户反馈', count: 623 },
  { name: '用户', count: 53 },
  { name: '反馈', count: 70 },
  // ... 其他类别
]

const systems = [
  { name: 'DSM 7.0 及以上版本', count: 11 },
  { name: 'DSM 6.2 及以下版本', count: 9 },
  { name: 'DSM 6.0 版本', count: 15 },
  { name: 'DSM 5.2 版本', count: 22 },
  { name: 'DSM 5.0 版本', count: 30 },
  // ... 其他系统
]

const packages = [
  { name: 'Surveillance Station', count: 3 },
  { name: 'Cloud Sync', count: 2 },
  { name: 'DS File', count: 5 },
  { name: 'DS Photo', count: 7 },
  { name: 'DS Video', count: 4 },
  // ... 其他包
]

const articles = [
  {
    title: 'CC400W | 针对 Synology Camera 的 RMA 服务外观检测规范',
    date: 'Aug 28, 2024',
    description: '针对 Synology Camera 的 RMA 服务外观检测规范',
    tags: [],
  },
  {
    title: 'DSM 7.0 更新指南',
    date: 'Aug 27, 2024',
    description: '了解如何更新到 DSM 7.0 并获得新功能的全面概览。',
    tags: ['更新', 'DSM'],
  },
  {
    title: '如何设置 RAID',
    date: 'Aug 26, 2024',
    description: '一步一步指导如何为您的 Synology NAS 设置 RAID。',
    tags: ['存储', 'RAID'],
  },
  {
    title: 'Synology Assistant 的新功能',
    date: 'Aug 25, 2024',
    description: '探索 Synology Assistant 的新功能和改进。',
    tags: ['助手', '功能'],
  },
  {
    title: '保护您的数据免受勒索软件攻击',
    date: 'Aug 24, 2024',
    description: '了解如何使用 Synology NAS 保护您的数据免受勒索软件攻击。',
    tags: ['安全', '勒索软件'],
  },
  // ... 其他文章
]

export const AptosDoc = () => {
  return (
    <SynologyCMS
      categories={categories}
      systems={systems}
      packages={packages}
      articles={articles}
    />
  )
}
