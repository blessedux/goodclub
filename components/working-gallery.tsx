"use client"

import { useState, useEffect } from "react"
import { Canvas } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function WorkingGallery() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-4xl">Loading Gallery...</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen h-full w-full bg-black">
      <div className="h-screen w-full">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="hotpink" />
          </mesh>
        </Canvas>
      </div>
      <div className="h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-3 mix-blend-exclusion text-white">
        <h1 className="font-serif text-4xl md:text-7xl tracking-tight">
          <span className="italic">Shadway</span>
        </h1>
      </div>
      <div className="text-center fixed bottom-10 left-0 right-0 font-mono uppercase text-[11px] font-semibold">
        <p>3D Gallery Working!</p>
        <p className="opacity-60">
          Basic Three.js scene loaded successfully
        </p>
      </div>
    </main>
  );
}
