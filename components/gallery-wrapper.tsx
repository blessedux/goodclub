"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"

const FinalGallery = dynamic(() => import("@/components/final-gallery"), {
	ssr: false,
	loading: () => (
		<div className="min-h-screen bg-black text-white flex items-center justify-center">
			<h1 className="text-4xl">Loading 3D Gallery...</h1>
		</div>
	)
})

export default function GalleryWrapper() {
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

	// ALL images from the public directory
	const localImages = [
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
		
		// GOODCLUB Brand Images
		{ src: "/goodclub3.png", alt: "GOODCLUB Brand Image 3" },
		{ src: "/goodclub4.png", alt: "GOODCLUB Brand Image 4" },
		{ src: "/goodclub5.png", alt: "GOODCLUB Brand Image 5" },
		{ src: "/goodclub6.png", alt: "GOODCLUB Brand Image 6" },
		{ src: "/goodclubspot2.png", alt: "GOODCLUB Spot 2" },
		
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
	];

	return (
		<main className="h-screen w-screen bg-black overflow-hidden" style={{ height: '100vh', width: '100vw' }}>
			{/* Header */}
			<header 
				className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-auto"
				style={{ 
					height: '80px',
					background: 'rgba(0, 0, 0, 0.7)',
					backdropFilter: 'blur(10px)',
					borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
				}}
			>
				<Link href="/" className="hover:opacity-80 transition-opacity">
					<img 
						src="/icon/goodclub_icon.png" 
						alt="GOODCLUB Logo" 
						className="w-16 h-16 object-contain"
					/>
				</Link>
				<Link href="/merch">
					<button 
						className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg border border-white/20 transition-all duration-300 backdrop-blur-sm font-medium"
					>
						🛍️ SHOP
					</button>
				</Link>
			</header>

			<FinalGallery
				images={localImages}
				speed={1.2}
				zSpacing={3}
				visibleCount={12}
				falloff={{ near: 0.8, far: 14 }}
				className="h-screen w-screen"
				style={{ height: '100vh', width: '100vw' }}
			/>
			<div 
				className="pointer-events-none fixed flex items-center justify-center text-center px-3 mix-blend-exclusion text-white"
				style={{ 
					height: '100vh', 
					width: '100vw', 
					top: 0, 
					left: 0, 
					zIndex: 10,
					paddingTop: '80px' // Account for header height
				}}
			>
				<h1 className="font-serif text-4xl md:text-7xl tracking-tight">
					<span className="italic">Shadway</span>
				</h1>
			</div>

			<div 
				className="text-center fixed font-mono uppercase text-[11px] font-semibold text-white"
				style={{ 
					bottom: '2.5rem', 
					left: 0, 
					right: 0, 
					zIndex: 10 
				}}
			>
				<p>Use mouse wheel, arrow keys, or touch to navigate</p>
				<p className="opacity-60">
					Auto-play resumes after 3 seconds of inactivity
				</p>
			</div>
		</main>
	);
}
