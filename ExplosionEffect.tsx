import { useState, useEffect } from 'react';

interface ExplosionEffectProps {
  onComplete: () => void;
}

export default function ExplosionEffect({ onComplete }: ExplosionEffectProps) {
  const [splatters, setSplatters] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    rotation: number;
    delay: number;
    drip: number; // Amount of drip effect
    width: number; // Different width/height for more organic shapes
    height: number;
  }>>([]);

  const [bigSplats, setBigSplats] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    delay: number;
  }>>([]);
  
  // Generate random splatter particles
  useEffect(() => {
    // Smaller splatter particles
    const numberOfSplatters = 30; // More splatters for complete coverage
    const newSplatters = [];
    
    for (let i = 0; i < numberOfSplatters; i++) {
      newSplatters.push({
        id: i,
        x: Math.random() * 100, // % position
        y: Math.random() * 100, // % position
        size: Math.random() * 70 + 30, // Random size between 30 and 100px
        width: Math.random() * 0.4 + 0.8, // Width multiplier for shape variation
        height: Math.random() * 0.4 + 0.8, // Height multiplier for shape variation
        rotation: Math.random() * 360, // Random rotation
        delay: Math.random() * 0.8, // Random delay for natural effect
        drip: Math.random() * 80 + 20, // Random drip length (20-100px)
      });
    }
    
    setSplatters(newSplatters);
    
    // Add some larger white splats for bigger impact
    const numberOfBigSplats = 8;
    const newBigSplats = [];
    
    for (let i = 0; i < numberOfBigSplats; i++) {
      newBigSplats.push({
        id: i,
        x: Math.random() * 90 + 5, // Keep away from extreme edges
        y: Math.random() * 90 + 5, // Keep away from extreme edges
        size: Math.random() * 200 + 100, // Large splats 100-300px
        opacity: Math.random() * 0.3 + 0.4, // Opacity 0.4-0.7
        delay: Math.random() * 0.3, // Shorter delay for the big ones
      });
    }
    
    setBigSplats(newBigSplats);
    
    // Automatically trigger completion after animation ends
    const timer = setTimeout(() => {
      onComplete();
    }, 6000); // Long enough for the full animation and viewing
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 z-50 pointer-events-auto bg-black/50 flex items-center justify-center">
      {/* Big white slimy splats as background */}
      {bigSplats.map(splat => (
        <div 
          key={splat.id}
          className="absolute bg-white rounded-full opacity-0 animate-splatter"
          style={{
            left: `${splat.x}%`,
            top: `${splat.y}%`,
            width: `${splat.size}px`,
            height: `${splat.size}px`,
            opacity: splat.opacity,
            animationDelay: `${splat.delay}s`,
            boxShadow: '0 0 12px rgba(255, 255, 255, 0.5)',
            filter: 'blur(3px)',
            borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%'
          }}
        />
      ))}
      
      {/* Smaller detailed slimy splatters */}
      {splatters.map(splatter => (
        <div 
          key={splatter.id}
          className="absolute opacity-0 animate-splatter"
          style={{
            left: `${splatter.x}%`,
            top: `${splatter.y}%`,
            width: `${splatter.size * splatter.width}px`,
            height: `${splatter.size * splatter.height}px`,
            background: 'white',
            transform: `rotate(${splatter.rotation}deg)`,
            animationDelay: `${splatter.delay}s`,
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
            // Irregular blob shape with drips
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            // Add dripping effect with pseudo-element
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '30%',
              height: `${splatter.drip}px`,
              background: 'white',
              borderRadius: '0 0 10px 10px',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
            }
          }}
        >
          {/* Adding drip for slimy effect */}
          <div 
            className="absolute"
            style={{
              bottom: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '30%',
              height: `${splatter.drip}px`,
              background: 'white',
              borderRadius: '0 0 10px 10px',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
            }}
          />
        </div>
      ))}
      
      {/* Final message */}
      <div className="text-center animate-fadeIn" style={{ animationDelay: '2s' }}>
        <h1 className="text-5xl font-bold text-white mb-8 animate-bounce">GET OFF THE GAME BITCH YOU PERVERT</h1>
        <p className="text-2xl text-white mb-10">ITS CRAZY HOW YOU HAVE BEEN PLAYING JUST TO MAKE HER DO THAT YOU WEIRDO!</p>
        <div className="mt-4 animate-pulse">
          <button 
            onClick={onComplete}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full text-xl"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}