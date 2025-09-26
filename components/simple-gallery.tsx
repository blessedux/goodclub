"use client"

import { useState, useEffect } from "react"

interface SimpleGalleryProps {
  images: Array<{ src: string; alt: string }>
  className?: string
}

export default function SimpleGallery({ images, className = "h-screen w-full" }: SimpleGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length, isAutoPlaying])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setIsAutoPlaying(false)
    
    if (e.deltaY > 0) {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    } else {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }
    
    // Resume auto-play after 3 seconds
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setIsAutoPlaying(false)
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }
    
    // Resume auto-play after 3 seconds
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }

  return (
    <div 
      className={className}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ 
        background: `linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(0.5px) brightness(0.3)',
            }}
          />
        ))}
      </div>

      {/* Main Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative max-w-4xl max-h-4xl w-full h-full flex items-center justify-center">
          <img
            src={images[currentIndex]?.src}
            alt={images[currentIndex]?.alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            style={{
              filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))',
            }}
          />
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setIsAutoPlaying(false)
              setTimeout(() => setIsAutoPlaying(true), 3000)
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-8 right-8 text-white/80 text-sm font-mono">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}
