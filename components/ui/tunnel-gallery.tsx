import type React from 'react';
import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

type ImageItem = string | { src: string; alt?: string };

interface TunnelGalleryProps {
	images: ImageItem[];
	speed?: number;
	spacing?: number;
	visibleCount?: number;
	className?: string;
	style?: React.CSSProperties;
}

interface PlaneData {
	index: number;
	z: number;
	imageIndex: number;
	scale: number;
}

const TUNNEL_DEPTH = 100;
const TUNNEL_SPACING = 8;
const MIN_SCALE = 0.1;
const MAX_SCALE = 2.0;

// Simple material for tunnel effect
const createTunnelMaterial = () => {
	return new THREE.MeshBasicMaterial({
		transparent: true,
		opacity: 1.0,
	});
};

function TunnelPlane({
	texture,
	position,
	scale,
	material,
	opacity,
}: {
	texture: THREE.Texture;
	position: [number, number, number];
	scale: [number, number, number];
	material: THREE.MeshBasicMaterial;
	opacity: number;
}) {
	const meshRef = useRef<THREE.Mesh>(null);

	useEffect(() => {
		if (material && texture) {
			material.map = texture;
			material.needsUpdate = true;
		}
	}, [material, texture]);

	useEffect(() => {
		if (material) {
			material.opacity = opacity;
			material.needsUpdate = true;
		}
	}, [material, opacity]);

	return (
		<mesh
			ref={meshRef}
			position={position}
			scale={scale}
			material={material}
		>
			<planeGeometry args={[1, 1]} />
		</mesh>
	);
}

function TunnelScene({
	images,
	speed = 1,
	spacing = TUNNEL_SPACING,
	visibleCount = 12,
}: Omit<TunnelGalleryProps, 'className' | 'style'>) {
	const [scrollVelocity, setScrollVelocity] = useState(0);
	const [autoPlay, setAutoPlay] = useState(true);
	const lastInteraction = useRef(Date.now());

	const normalizedImages = useMemo(
		() =>
			images.map((img) =>
				typeof img === 'string' ? { src: img, alt: '' } : img
			),
		[images]
	);

	const textures = useTexture(normalizedImages.map((img) => img.src));

	// Create materials pool
	const materials = useMemo(
		() => Array.from({ length: visibleCount }, () => createTunnelMaterial()),
		[visibleCount]
	);

	const totalImages = normalizedImages.length;

	// Initialize plane data for tunnel effect
	const planesData = useRef<PlaneData[]>(
		Array.from({ length: visibleCount }, (_, i) => ({
			index: i,
			z: -i * spacing, // Start planes behind camera
			imageIndex: totalImages > 0 ? i % totalImages : 0,
			scale: 1.0,
		}))
	);

	// Handle scroll input
	const handleWheel = useCallback(
		(event: WheelEvent) => {
			event.preventDefault();
			setScrollVelocity((prev) => prev + event.deltaY * 0.01 * speed);
			setAutoPlay(false);
			lastInteraction.current = Date.now();
		},
		[speed]
	);

	// Handle keyboard input
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
				setScrollVelocity((prev) => prev - 2 * speed);
				setAutoPlay(false);
				lastInteraction.current = Date.now();
			} else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
				setScrollVelocity((prev) => prev + 2 * speed);
				setAutoPlay(false);
				lastInteraction.current = Date.now();
			}
		},
		[speed]
	);

	useEffect(() => {
		const canvas = document.querySelector('canvas');
		if (canvas) {
			canvas.addEventListener('wheel', handleWheel, { passive: false });
			document.addEventListener('keydown', handleKeyDown);

			return () => {
				canvas.removeEventListener('wheel', handleWheel);
				document.removeEventListener('keydown', handleKeyDown);
			};
		}
	}, [handleWheel, handleKeyDown]);

	// Auto-play logic
	useEffect(() => {
		const interval = setInterval(() => {
			if (Date.now() - lastInteraction.current > 3000) {
				setAutoPlay(true);
			}
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	useFrame((state, delta) => {
		// Apply auto-play
		if (autoPlay) {
			setScrollVelocity((prev) => prev + 0.5 * delta);
		}

		// Damping
		setScrollVelocity((prev) => prev * 0.95);

		// Update plane positions for tunnel effect
		planesData.current.forEach((plane, i) => {
			// Move planes forward (towards camera)
			plane.z += scrollVelocity * delta * 20;

			// When plane passes camera, move it to the back
			if (plane.z > 5) {
				plane.z -= visibleCount * spacing;
				// Cycle to next image
				plane.imageIndex = (plane.imageIndex + 1) % totalImages;
			}

			// Calculate scale based on distance from camera (perspective effect)
			const distanceFromCamera = Math.abs(plane.z);
			const normalizedDistance = Math.min(distanceFromCamera / TUNNEL_DEPTH, 1);
			
			// Scale gets smaller as distance increases (tunnel effect)
			plane.scale = MAX_SCALE * (1 - normalizedDistance) + MIN_SCALE;

			// Calculate opacity based on distance
			let opacity = 1.0;
			if (distanceFromCamera < 2) {
				// Fade out when very close to camera
				opacity = Math.max(0, distanceFromCamera / 2);
			} else if (distanceFromCamera > TUNNEL_DEPTH * 0.8) {
				// Fade out when very far
				opacity = Math.max(0, 1 - (distanceFromCamera - TUNNEL_DEPTH * 0.8) / (TUNNEL_DEPTH * 0.2));
			}

			// Update material opacity
			const material = materials[i];
			if (material) {
				material.opacity = opacity;
				material.needsUpdate = true;
			}
		});
	});

	if (normalizedImages.length === 0) return null;

	return (
		<>
			{planesData.current.map((plane, i) => {
				const texture = textures[plane.imageIndex];
				const material = materials[i];

				if (!texture || !material) return null;

				// Calculate scale to maintain aspect ratio
				const aspect = texture.image
					? texture.image.width / texture.image.height
					: 1;
				const baseScale = plane.scale;
				const scale: [number, number, number] =
					aspect > 1 
						? [baseScale * aspect, baseScale, 1] 
						: [baseScale, baseScale / aspect, 1];

				return (
					<TunnelPlane
						key={`${plane.index}-${plane.imageIndex}`}
						texture={texture}
						position={[0, 0, plane.z]} // Center planes in tunnel
						scale={scale}
						material={material}
						opacity={material.opacity}
					/>
				);
			})}
		</>
	);
}

// Fallback component for when WebGL is not available
function FallbackGallery({ images }: { images: ImageItem[] }) {
	const normalizedImages = useMemo(
		() =>
			images.map((img) =>
				typeof img === 'string' ? { src: img, alt: '' } : img
			),
		[images]
	);

	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			height: '100%',
			background: 'linear-gradient(to bottom right, #1e293b, #334155, #1e293b)',
			padding: '1rem'
		}}>
			<p style={{ color: 'white', marginBottom: '1rem' }}>
				WebGL not supported. Showing image list:
			</p>
			<div style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(2, 1fr)',
				gap: '1rem',
				maxHeight: '24rem',
				overflowY: 'auto'
			}}>
				{normalizedImages.map((img, i) => (
					<img
						key={i}
						src={img.src || '/placeholder.svg'}
						alt={img.alt}
						style={{
							width: '100%',
							height: '8rem',
							objectFit: 'cover',
							borderRadius: '0.25rem'
						}}
					/>
				))}
			</div>
		</div>
	);
}

export default function TunnelGallery({
	images,
	className = 'h-96 w-full',
	style,
	speed = 1,
	spacing = TUNNEL_SPACING,
	visibleCount = 12,
}: TunnelGalleryProps) {
	const [webglSupported, setWebglSupported] = useState(true);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);

		// Check WebGL support
		try {
			const canvas = document.createElement('canvas');
			const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
			if (!gl) {
				setWebglSupported(false);
				return;
			}

			// Additional WebGL context checks
			if (!(gl instanceof WebGLRenderingContext)) {
				setWebglSupported(false);
				return;
			}

		} catch (e) {
			console.warn('WebGL not supported:', e);
			setWebglSupported(false);
		}
	}, []);

	if (!isMounted) {
		return (
			<div className={className} style={style}>
				<div style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					background: 'linear-gradient(to bottom right, #1e293b, #334155, #1e293b)'
				}}>
					<div style={{ textAlign: 'center', color: 'white' }}>
						<div style={{
							animation: 'spin 1s linear infinite',
							borderRadius: '50%',
							height: '3rem',
							width: '3rem',
							borderBottom: '2px solid white',
							margin: '0 auto 1rem'
						}}></div>
						<p>Loading 3D Tunnel...</p>
					</div>
				</div>
			</div>
		);
	}

	if (!webglSupported) {
		return (
			<div className={className} style={style}>
				<FallbackGallery images={images} />
			</div>
		);
	}

	return (
		<div className={className} style={style}>
			<Canvas
				camera={{ position: [0, 0, 0], fov: 75 }}
				gl={{
					antialias: true,
					alpha: true,
					powerPreference: "high-performance",
					failIfMajorPerformanceCaveat: false
				}}
				onCreated={({ gl }) => {
					// Additional safety check
					if (!gl) {
						console.warn('WebGL context creation failed');
						setWebglSupported(false);
					}
				}}
			>
				<TunnelScene
					images={images}
					speed={speed}
					spacing={spacing}
					visibleCount={visibleCount}
				/>
			</Canvas>
		</div>
	);
}
