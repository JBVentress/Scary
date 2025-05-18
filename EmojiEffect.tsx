import { useState, useEffect } from 'react';

interface EmojiEffectProps {
  emoji: string;
  position: { x: number; y: number };
  onComplete: () => void;
}

export default function EmojiEffect({ emoji, position, onComplete }: EmojiEffectProps) {
  const [animationState, setAnimationState] = useState({
    opacity: 1,
    scale: 1,
    yOffset: 0
  });

  useEffect(() => {
    // Initial animation pop-in
    setAnimationState(prev => ({
      ...prev,
      scale: 1.5
    }));
    
    // Start fading out and moving up after a brief delay
    const fadeTimeout = setTimeout(() => {
      setAnimationState({
        opacity: 0,
        yOffset: -30, // Move up 30px while fading
        scale: 1.2 // Slightly shrink while fading
      });
    }, 200);
    
    // Remove the component when animation completes
    const removeTimeout = setTimeout(() => {
      onComplete();
    }, 700); // Total animation duration
    
    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed select-none pointer-events-none z-50"
      style={{
        left: position.x,
        top: position.y,
        opacity: animationState.opacity,
        transform: `translateY(${animationState.yOffset}px) scale(${animationState.scale})`,
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        fontSize: '2rem'
      }}
    >
      {emoji}
    </div>
  );
}