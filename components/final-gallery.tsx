"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

type ImageItem = string | { src: string; alt?: string };

interface InfiniteGalleryProps {
	images: ImageItem[];
	speed?: number;
	zSpacing?: number;
	visibleCount?: number;
	falloff?: { near: number; far: number };
	className?: string;
	style?: React.CSSProperties;
}

const DEFAULT_DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;

function ImagePlane({ texture, position, scale }: { 
	texture: THREE.Texture; 
	position: [number, number, number]; 
	scale: [number, number, number]; 
}) {
	const meshRef = useRef<THREE.Mesh>(null);

	return (
		<mesh ref={meshRef} position={position} scale={scale}>
			<planeGeometry args={[1, 1, 32, 32]} />
			<meshBasicMaterial map={texture} transparent />
		</mesh>
	);
}

function GalleryScene({ images, speed = 1, visibleCount = 8 }: Omit<InfiniteGalleryProps, 'className' | 'style'>) {
	const [scrollVelocity, setScrollVelocity] = useState(0);
	const [autoPlay, setAutoPlay] = useState(true);
	const lastInteraction = useRef(Date.now());

	const normalizedImages = useMemo(
		() => images.map((img) => typeof img === 'string' ? { src: img, alt: '' } : img),
		[images]
	);

	const textures = useTexture(normalizedImages.map((img) => img.src));

	const spatialPositions = useMemo(() => {
		const positions: { x: number; y: number }[] = [];
		for (let i = 0; i < visibleCount; i++) {
			const horizontalAngle = (i * 2.618) % (Math.PI * 2);
			const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
			const horizontalRadius = (i % 3) * 1.2;
			const verticalRadius = ((i + 1) % 4) * 0.8;
			const x = (Math.sin(horizontalAngle) * horizontalRadius * MAX_HORIZONTAL_OFFSET) / 3;
			const y = (Math.cos(verticalAngle) * verticalRadius * MAX_VERTICAL_OFFSET) / 4;
			positions.push({ x, y });
		}
		return positions;
	}, [visibleCount]);

	const totalImages = normalizedImages.length;
	const depthRange = DEFAULT_DEPTH_RANGE;

	const planesData = useRef(
		Array.from({ length: visibleCount }, (_, i) => ({
			index: i,
			z: visibleCount > 0 ? ((depthRange / visibleCount) * i) % depthRange : 0,
			imageIndex: totalImages > 0 ? i % totalImages : 0,
			x: spatialPositions[i]?.x ?? 0,
			y: spatialPositions[i]?.y ?? 0,
		}))
	);

	const handleWheel = useCallback((event: WheelEvent) => {
		event.preventDefault();
		setScrollVelocity((prev) => prev + event.deltaY * 0.01 * speed);
		setAutoPlay(false);
		lastInteraction.current = Date.now();
	}, [speed]);

	const handleKeyDown = useCallback((event: KeyboardEvent) => {
		if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
			setScrollVelocity((prev) => prev - 2 * speed);
			setAutoPlay(false);
			lastInteraction.current = Date.now();
		} else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
			setScrollVelocity((prev) => prev + 2 * speed);
			setAutoPlay(false);
			lastInteraction.current = Date.now();
		}
	}, [speed]);

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

	useEffect(() => {
		const interval = setInterval(() => {
			if (Date.now() - lastInteraction.current > 3000) {
				setAutoPlay(true);
			}
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	useFrame((state, delta) => {
		if (autoPlay) {
			setScrollVelocity((prev) => prev + 0.3 * delta);
		}
		setScrollVelocity((prev) => prev * 0.95);

		const imageAdvance = totalImages > 0 ? visibleCount % totalImages || totalImages : 0;
		const totalRange = depthRange;
		const halfRange = totalRange / 2;

		planesData.current.forEach((plane, i) => {
			let newZ = plane.z + scrollVelocity * delta * 10;
			let wrapsForward = 0;
			let wrapsBackward = 0;

			if (newZ >= totalRange) {
				wrapsForward = Math.floor(newZ / totalRange);
				newZ -= totalRange * wrapsForward;
			} else if (newZ < 0) {
				wrapsBackward = Math.ceil(-newZ / totalRange);
				newZ += totalRange * wrapsBackward;
			}

			if (wrapsForward > 0 && imageAdvance > 0 && totalImages > 0) {
				plane.imageIndex = (plane.imageIndex + wrapsForward * imageAdvance) % totalImages;
			}

			if (wrapsBackward > 0 && imageAdvance > 0 && totalImages > 0) {
				const step = plane.imageIndex - wrapsBackward * imageAdvance;
				plane.imageIndex = ((step % totalImages) + totalImages) % totalImages;
			}

			plane.z = ((newZ % totalRange) + totalRange) % totalRange;
			plane.x = spatialPositions[i]?.x ?? 0;
			plane.y = spatialPositions[i]?.y ?? 0;
		});
	});

	if (normalizedImages.length === 0) return null;

	return (
		<>
			{planesData.current.map((plane, i) => {
				const texture = textures[plane.imageIndex];
				if (!texture) return null;

				const worldZ = plane.z - depthRange / 2;
				const aspect = texture.image ? texture.image.width / texture.image.height : 1;
				const scale: [number, number, number] = aspect > 1 ? [4 * aspect, 4, 1] : [4, 4 / aspect, 1];

				return (
					<ImagePlane
						key={plane.index}
						texture={texture}
						position={[plane.x, plane.y, worldZ]}
						scale={scale}
					/>
				);
			})}
		</>
	);
}

export default function FinalGallery({
	images,
	speed = 1,
	zSpacing = 3,
	visibleCount = 8,
	falloff = { near: 0.8, far: 14 },
	className = 'h-96 w-full',
	style,
}: InfiniteGalleryProps) {
	const [webglSupported, setWebglSupported] = useState(true);

	useEffect(() => {
		try {
			const canvas = document.createElement('canvas');
			const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
			if (!gl) {
				setWebglSupported(false);
			}
		} catch (e) {
			setWebglSupported(false);
		}
	}, []);

	if (!webglSupported) {
		return (
			<div className={className} style={style}>
				<div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
					<p className="text-gray-600 mb-4">WebGL not supported. Showing image list:</p>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
						{images.map((img, i) => (
							<img
								key={i}
								src={typeof img === 'string' ? img : img.src}
								alt={typeof img === 'string' ? '' : img.alt}
								className="w-full h-32 object-cover rounded"
							/>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div 
			className={className} 
			style={{ 
				...style, 
				backgroundColor: 'black',
				height: '100vh',
				width: '100vw',
				position: 'absolute',
				top: 0,
				left: 0,
				zIndex: 1
			}}
		>
			<Canvas 
				camera={{ position: [0, 0, 0], fov: 55 }} 
				gl={{ antialias: true, alpha: true }}
				style={{ 
					background: 'black',
					height: '100vh',
					width: '100vw'
				}}
			>
				<GalleryScene images={images} speed={speed} visibleCount={visibleCount} />
			</Canvas>
		</div>
	);
}
