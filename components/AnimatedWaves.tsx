import * as React from 'react';
import * as Three from 'three';
import * as Fiber from '@react-three/fiber';
import circleImg from 'public/circle.png';

export const AnimationPoints: React.FC = () => {
	//
	const bufferRef = React.useRef<Three.BufferAttribute | null>(null);
	const imgTexture = Fiber.useLoader(Three.TextureLoader, circleImg.src);

	let t = 0;
	const frequency = 0.002;
	const amplitude = 3;

	const graph = React.useCallback(
		(x: number, z: number) => Math.sin(frequency * (x ** 2 + z ** 2 + t)) * amplitude,
		[t, frequency, amplitude],
	);

	const count = 500;
	const sep = 3;

	const bufferAttrPositions = React.useMemo(() => {
		const positions = [];
		for (let xi = 0; xi < count; xi += 1) {
			for (let zi = 0; zi < count; zi += 1) {
				let x = sep * (xi - count / 2);
				let z = sep * (zi - count / 2);
				let y = graph(x, z);
				positions.push(x, y, z);
			}
		}
		return new Float32Array(positions);
	}, [graph]);

	Fiber.useFrame(() => {
		const positions = bufferRef.current.array;
		t += 5;
		let i = 0;
		for (let xi = 0; xi < count; xi += 1) {
			for (let zi = 0; zi < count; zi += 1) {
				let x = sep * (xi - count / 2);
				let z = sep * (zi - count / 2);
				positions[i + 1] = graph(x, z);
				i += 3;
			}
		}
		bufferRef.current.needsUpdate = true;
	});

	return (
		<points>
			<bufferGeometry attach="geometry">
				<bufferAttribute
					ref={bufferRef}
					attach="attributes-position"
					array={bufferAttrPositions}
					count={bufferAttrPositions.length / 3}
					itemSize={3}
				/>
			</bufferGeometry>
			<pointsMaterial
				attach="material"
				map={imgTexture}
				color={0x00aaff}
				size={0.5}
				sizeAttenuation
				transparent={false}
				alphaTest={0.5}
				opacity={0.5}
			/>
		</points>
	);
};

export const AnimatedWaves: React.FC = () => {
	return (
		<React.Suspense fallback={null}>
			<Fiber.Canvas camera={{ position: [100, 10, 0], fov: 75 }}>
				<React.Suspense fallback={null}>
					<AnimationPoints />
				</React.Suspense>
			</Fiber.Canvas>
		</React.Suspense>
	);
};
