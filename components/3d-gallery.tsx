"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import ErrorBoundary from "@/components/error-boundary"

// Dynamically import the 3D gallery component to avoid SSR issues
const InfiniteGallery = dynamic(
  () => import("@/components/ui/3d-gallery-photography").catch(() => {
    // Fallback to a simple gallery if the 3D component fails
    return { default: () => (
      <div style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #1e293b, #334155, #1e293b)',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <h2 style={{ color: 'white', fontSize: '2rem', textAlign: 'center' }}>
          GOODCLUB Gallery
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          maxWidth: '800px',
          padding: '2rem'
        }}>
          {galleryImages.map((image, index) => (
            <div key={index} style={{
              width: '200px',
              height: '200px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={image.src} 
                alt={image.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          ))}
        </div>
        <p style={{ color: 'white', opacity: 0.7, textAlign: 'center' }}>
          3D Gallery is not supported in this browser. Showing static gallery instead.
        </p>
      </div>
    )}
  }),
  { 
    ssr: false,
    loading: () => (
      <div style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #1e293b, #334155, #1e293b)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '2px solid white',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading 3D Gallery...</p>
        </div>
      </div>
    )
  }
)

const galleryImages = [
  { src: "/brazilian-coffee-beans-quarter-kg-package.jpg", alt: "Premium Brazilian Beans - Quarter Package" },
  { src: "/brazilian-coffee-beans-one-kg-package.jpg", alt: "Premium Brazilian Beans - Family Size" },
  { src: "/premium-coffee-shop-hoodie-earth-tones.jpg", alt: "Joia Hoodie - Premium Comfort" },
  { src: "/coffee-shop-t-shirt-minimalist-design.jpg", alt: "Joia T-Shirt - Minimalist Design" },
  { src: "/coffee-shop-baseball-cap-earth-tones.jpg", alt: "Joia Cap - Embroidered Logo" },
  { src: "/minimalist-jewelry-set-coffee-inspired.jpg", alt: "Joia Jewelry Set - Coffee Inspired" },
  { src: "/premium-coffee-magazine-cover-minimalist-design.jpg", alt: "Joia Magazine - Coffee Culture" },
]

export default function Gallery3D() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div style={{
        minHeight: '100vh',
        height: '100%',
        width: '100%',
        background: 'linear-gradient(to bottom right, #1e293b, #334155, #1e293b)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '2px solid white',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', height: '100%', width: '100%' }}>
      {/* Header */}
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          letterSpacing: '0.05em',
          color: 'white'
        }}>GOODCLUB</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/merch">
            <button style={{
              color: 'white',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.25rem',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              🛍️ SHOP
            </button>
          </Link>
        </div>
      </header>

      {/* 3D Gallery Container */}
      <ErrorBoundary>
        <InfiniteGallery
          images={galleryImages}
          speed={1.2}
          zSpacing={3}
          visibleCount={12}
          falloff={{ near: 0.8, far: 14 }}
          className="h-screen w-full"
          fadeSettings={{
            fadeIn: { start: 0.05, end: 0.25 },
            fadeOut: { start: 0.4, end: 0.43 },
          }}
          blurSettings={{
            blurIn: { start: 0.0, end: 0.1 },
            blurOut: { start: 0.4, end: 0.43 },
            maxBlur: 8.0,
          }}
        />
      </ErrorBoundary>

      {/* Overlay Content */}
      <div style={{
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 0.75rem',
        mixBlendMode: 'exclusion',
        color: 'white'
      }}>
        <h1 style={{
          fontFamily: 'serif',
          fontSize: '2.25rem',
          letterSpacing: '-0.025em'
        }}>
          <span style={{ fontStyle: 'italic' }}>GOODCLUB</span>
        </h1>
      </div>

      {/* Instructions */}
      <div style={{
        textAlign: 'center',
        position: 'fixed',
        bottom: '2.5rem',
        left: 0,
        right: 0,
        fontFamily: 'monospace',
        textTransform: 'uppercase',
        fontSize: '11px',
        fontWeight: '600',
        color: 'white'
      }}>
        <p>Use mouse wheel, arrow keys, or touch to navigate</p>
        <p style={{ opacity: 0.6 }}>
          Auto-play resumes after 3 seconds of inactivity
        </p>
      </div>
    </main>
  )
}