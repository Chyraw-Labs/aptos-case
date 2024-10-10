import { Item } from './Database'

interface GalleryViewProps {
  data: Item[]
}

export const GalleryView: React.FC<GalleryViewProps> = ({ data }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {data.map((item) => (
      <div key={item.id} className="border rounded-lg p-4 shadow">
        <h3 className="font-bold text-lg mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-2">{item.status}</p>
        <p className="text-sm">{item.description}</p>
      </div>
    ))}
  </div>
)
