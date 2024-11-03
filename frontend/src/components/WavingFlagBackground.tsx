import Script from 'next/script'
import { useEffect, useState } from 'react'

const WavingFlagBackground = () => {
  const [threeLoaded, setThreeLoaded] = useState(false)
  const [tileLoaded, setTileLoaded] = useState(false)

  useEffect(() => {
    if (threeLoaded && tileLoaded) {
      console.log('Both Three.js and Tile.js are loaded')
      // Initialize your 3D background here
      setupMoon()
    }
  }, [threeLoaded, tileLoaded])

  return (
    <>
      <div
        id="main"
        className="fixed top-0 left-0 w-full h-20 z-1 pointer-events-none "
      />
      <Script
        src="/js/three.min.js"
        strategy="afterInteractive"
        onLoad={() => setThreeLoaded(true)}
        onError={(e) => console.error('Error loading Three.js', e)}
      />
      <Script
        src="/js/tile.js"
        strategy="afterInteractive"
        onLoad={() => setTileLoaded(true)}
        onError={(e) => console.error('Error loading Tile.js', e)}
      />
    </>
  )
}

// Make sure to define this function
function setupMoon() {
  // Your Three.js initialization code here
  console.log('Setting up Moon background')
  // ... (rest of your Three.js setup code)
}

export default WavingFlagBackground
