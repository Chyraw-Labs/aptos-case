import { Item } from './Database'

interface GalleryViewProps {
  data: Item[]
}

export const GalleryView: React.FC<GalleryViewProps> = ({ data }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4 shadow-2xl p-4 m-4 gap-2 ">
    {data.map((item) => (
      <div
        key={item.id}
        className="border-gray-500 rounded-lg p-4 shadow-2xl p-4 m-4 gap-2 rounded-lg"
      >
        <h3 className="font-bold text-lg mb-2 text-cyan-500">{item.name}</h3>
        <p className="text-gray-400 mb-2">{item.status}</p>
        <p className="text-sm text-gray-200">{item.description}</p>
      </div>
    ))}
  </div>
)
