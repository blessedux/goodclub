"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import ErrorBoundary from "@/components/error-boundary"

// Dynamically import the 3D gallery component to avoid SSR issues
const InfiniteGallery = dynamic(
  () => import("@/components/ui/3d-gallery-photography"),
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
  // Coffee Products
  { src: "/brazilian-coffee-beans-quarter-kg-package.jpg", alt: "Premium Brazilian Beans - Quarter Package" },
  { src: "/brazilian-coffee-beans-one-kg-package.jpg", alt: "Premium Brazilian Beans - Family Size" },
  
  // Merchandise
  { src: "/premium-coffee-shop-hoodie-earth-tones.jpg", alt: "Joia Hoodie - Premium Comfort" },
  { src: "/coffee-shop-t-shirt-minimalist-design.jpg", alt: "Joia T-Shirt - Minimalist Design" },
  { src: "/coffee-shop-baseball-cap-earth-tones.jpg", alt: "Joia Cap - Embroidered Logo" },
  { src: "/minimalist-jewelry-set-coffee-inspired.jpg", alt: "Joia Jewelry Set - Coffee Inspired" },
  
  // Magazine
  { src: "/premium-coffee-magazine-cover-minimalist-design.jpg", alt: "Joia Magazine - Coffee Culture" },
  
  // Additional GOODCLUB Images
  { src: "/d144e9_1da20c62e326486c8a73a048df815828~mv2.jpg", alt: "GOODCLUB Coffee Experience" },
  { src: "/d144e9_1fad2d95a7e348cd90e38ec957d7cd55~mv2.jpg", alt: "GOODCLUB Coffee Culture" },
  { src: "/d144e9_494da961124e4af39d5fc6944d59a27f~mv2.png", alt: "GOODCLUB Premium Coffee" },
  { src: "/d144e9_4ce62630c5c74029a01b4b98d5172d67~mv2_d_4000_6016_s_4_2.jpg", alt: "GOODCLUB Coffee Art" },
  { src: "/d144e9_8cb8eaa760a24eeb97ff48dd5e589e73~mv2.jpg", alt: "GOODCLUB Coffee Lifestyle" },
  { src: "/d144e9_a281419c4ef748abaebe47f8944882ec~mv2_d_3024_4032_s_4_2.jpg", alt: "GOODCLUB Coffee Moments" },
  { src: "/d144e9_a99204c7b0be4ecf8fb85be0a1ccb2ac~mv2.jpg", alt: "GOODCLUB Coffee Heritage" },
  { src: "/d144e9_ce3c650dc787453185890f95d8a7a654~mv2.jpg", alt: "GOODCLUB Coffee Craft" },
  { src: "/d144e9_d66a30533bbb47a796f2eb6b5209c66f~mv2.jpg", alt: "GOODCLUB Coffee Passion" },
  { src: "/d144e9_df1fe87ccc424f98b807aa52d7ecda9e~mv2.jpeg", alt: "GOODCLUB Coffee Excellence" },
  { src: "/d144e9_e3ca50d7d14d469a9a86c09455cf9e86~mv2.jpg", alt: "GOODCLUB Coffee Tradition" },
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
    <main style={{ minHeight: '100vh', height: '100%', width: '100%', backgroundColor: 'black' }}>
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
        <img 
          src="/icon/goodclub_icon.png" 
          alt="GOODCLUB Logo" 
          style={{
            width: '6rem',
            height: '6rem',
            objectFit: 'contain'
          }}
        />
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