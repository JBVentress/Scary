import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera, 
  Sky, 
  Loader, 
  Stats 
} from "@react-three/drei";
import ThreeDCharacter from "./ThreeDCharacter";
import { useClickGame } from "@/lib/stores/useClickGame";
import * as THREE from "three";

// Simple Floor component
const Floor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#f8e1ff" />
    </mesh>
  );
};

// Decorative trees for the scene
const Trees = () => {
  // Precomputed tree positions as properly typed arrays
  const treePositions: [number, number, number][] = [
    [-6, -2, -6],
    [6, -2, -6],
    [-8, -2, -3],
    [8, -2, -3], 
    [-9, -2, 2],
    [9, -2, 2],
  ];
  
  return (
    <>
      {treePositions.map((position, i) => (
        <mesh key={i} position={position}>
          {/* Tree trunk */}
          <cylinderGeometry args={[0.2, 0.3, 1, 8]} />
          <meshStandardMaterial color="#8B4513" />
          
          {/* Tree foliage */}
          <mesh position={[0, 1, 0]}>
            <coneGeometry args={[1, 2, 8]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        </mesh>
      ))}
    </>
  );
};

export default function ThreeDScene() {
  const { clickSpeed } = useClickGame();
  
  // Handle click events in the 3D scene
  const handleSceneClick = () => {
    // Animation for scene clicks could be added here
  };
  
  return (
    <>
      <Canvas shadows dpr={[1, 2]}>
        {process.env.NODE_ENV === "development" && <Stats />}
        
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, 5]} 
          fov={45}
        />
        
        {/* Scene lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        
        {/* Sky for background */}
        <Sky sunPosition={[100, 10, 100]} />
        
        {/* Main content */}
        <Suspense fallback={null}>
          <ThreeDCharacter onClick={handleSceneClick} />
          <Floor />
          <Trees />
          {/* Removed environment causing errors */}
        </Suspense>
        
        {/* Camera controls - limited to prevent weird angles */}
        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2 - 0.1}
          minPolarAngle={Math.PI / 6}
          maxDistance={10}
          minDistance={3}
          maxAzimuthAngle={Math.PI / 4}
          minAzimuthAngle={-Math.PI / 4}
        />
      </Canvas>
      
      <Loader 
        containerStyles={{
          background: "rgba(255, 230, 255, 0.8)",
          backdropFilter: "blur(10px)"
        }}
        innerStyles={{
          backgroundColor: "#ff69b4",
          width: "10px",
          height: "10px"
        }}
        barStyles={{
          backgroundColor: "#ff69b4",
          height: "6px"
        }}
        dataStyles={{
          color: "#ff69b4",
          fontSize: "14px",
          fontWeight: "bold"
        }}
        dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`}
      />
    </>
  );
}