import { Card } from './Card'

export const GettingStarted = () => {
  return (
    <>
      <div className="flex flex-col items-center mx-4 my-4">
        <p className="font-bold text-9xl mb-4">快速开始</p>
        <Card imagePath="/images/test.jpeg">
          <p>image</p>
        </Card>
      </div>
    </>
  )
}