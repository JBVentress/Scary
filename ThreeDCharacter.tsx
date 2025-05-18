import { useRef, useState, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useClickGame } from "@/lib/stores/useClickGame";
import { useAudio } from "@/lib/stores/useAudio";
import * as THREE from "three";
import { Group } from "three";

interface ThreeDCharacterProps {
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
}

export default function ThreeDCharacter({ onClick }: ThreeDCharacterProps) {
  const characterRef = useRef<Group>(null);
  const { clickSpeed, responseState, registerClick, setResponseState } = useClickGame();
  const { playHit, playSuccess } = useAudio();
  
  // Load the 3D model
  const { scene, animations } = useGLTF("/character_3d.glb");
  const { actions } = useAnimations(animations, characterRef);
  
  // For wobble animation based on click speed
  const [wobble, setWobble] = useState(0);
  const lastClickTimeRef = useRef<number | null>(null);
  
  // Handle character clicks
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    // Just register the click without stopping propagation
    const now = Date.now();
    
    // Register the click in the store
    registerClick(now);
    lastClickTimeRef.current = now;
    
    // Play appropriate sound
    if (clickSpeed > 4) {
      playSuccess();
    } else {
      playHit();
    }
    
    // Propagate the click event
    if (onClick) onClick(e);
  };
  
  // Animate the character based on click speed
  useFrame((state, delta) => {
    if (!characterRef.current) return;
    
    // Wobble animation for high click speed
    if (clickSpeed > 4) {
      setWobble((prev) => prev + delta * 10);
      characterRef.current.rotation.y = Math.sin(wobble * 0.5) * 0.1;
    } else {
      // Slowly return to normal position
      characterRef.current.rotation.y *= 0.9;
    }
    
    // Bounce animation for excited state
    if (responseState === "fast") {
      characterRef.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.05 - 1.8;
    } else {
      // Smoothly return to normal height
      characterRef.current.position.y = THREE.MathUtils.lerp(
        characterRef.current.position.y,
        -1.8,
        delta * 5
      );
    }
    
    const now = Date.now();
    
    // Reset to normal state if no clicks for a while
    if (lastClickTimeRef.current && now - lastClickTimeRef.current > 3000) {
      if (responseState !== "none") {
        setResponseState("none");
      }
      lastClickTimeRef.current = null;
    }
  });
  
  // Clone and prepare the model
  useEffect(() => {
    if (scene) {
      // Apply shadows to all meshes
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
    
    // Play idle animation if available
    if (actions && actions.idle) {
      actions.idle.play();
    }
    
    return () => {
      // Cleanup animations
      if (actions) {
        Object.values(actions).forEach(action => action?.stop());
      }
    };
  }, [scene, actions]);
  
  return (
    <group 
      ref={characterRef} 
      position={[0, -1.8, 0]} 
      rotation={[0, 0, 0]}
      scale={[2.5, 2.5, 2.5]}
      onClick={handleClick}
    >
      <primitive object={scene} />
    </group>
  );
}