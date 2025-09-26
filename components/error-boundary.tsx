"use client"

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #1e293b, #334155, #1e293b)',
          color: 'white',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              GOODCLUB Gallery
            </h2>
            <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
              3D Gallery is not supported in this browser. Showing static gallery instead.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {[
                { src: "/brazilian-coffee-beans-quarter-kg-package.jpg", alt: "Premium Brazilian Beans" },
                { src: "/brazilian-coffee-beans-one-kg-package.jpg", alt: "Premium Brazilian Beans" },
                { src: "/premium-coffee-shop-hoodie-earth-tones.jpg", alt: "Joia Hoodie" },
                { src: "/coffee-shop-t-shirt-minimalist-design.jpg", alt: "Joia T-Shirt" },
                { src: "/coffee-shop-baseball-cap-earth-tones.jpg", alt: "Joia Cap" },
                { src: "/minimalist-jewelry-set-coffee-inspired.jpg", alt: "Joia Jewelry Set" }
              ].map((image, index) => (
                <div key={index} style={{
                  width: '150px',
                  height: '150px',
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
            <button 
              onClick={() => this.setState({ hasError: false })}
              style={{
                background: 'white',
                color: '#1e293b',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                marginTop: '2rem',
                fontWeight: 'bold'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
