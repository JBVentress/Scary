import { HTMLAttributes } from 'react';
import { SkinType } from '@/lib/stores/useGame';

interface EyeProps extends HTMLAttributes<HTMLDivElement> {
  eyePosition: { x: number; y: number };
  eyesClosed: boolean;
  skinType: SkinType;
  isLeftEye?: boolean;
}

export default function Eye({ 
  eyePosition, 
  eyesClosed, 
  skinType,
  isLeftEye = true,
  ...props 
}: EyeProps) {
  return (
    <div className="relative" {...props}>
      {/* Eyelashes - color matched to skin tone */}
      {!eyesClosed && (
        <div className={`absolute -top-3 ${isLeftEye ? 'left-1' : 'right-1'} w-10 flex justify-between`}>
          <div 
            className="w-0.5 h-2.5 rotate-[-15deg]"
            style={{
              backgroundColor: skinType === 'white' 
                ? '#FF0000' 
                : skinType === 'mexican' 
                  ? '#111111' 
                  : '#000000'
            }}
          ></div>
          <div 
            className="w-0.5 h-3"
            style={{
              backgroundColor: skinType === 'white' 
                ? '#FF0000' 
                : skinType === 'mexican' 
                  ? '#FF0000' 
                  : '#000000'
            }}
          ></div>
          <div 
            className="w-0.5 h-2.5 rotate-[15deg]"
            style={{
              backgroundColor: skinType === 'white' 
                ? '#FF0000' 
                : skinType === 'mexican' 
                  ? '#FF0000' 
                  : '#FF0000'
            }}
          ></div>
        </div>
      )}
      
      <div 
        className="bg-red rounded-full overflow-hidden relative flex items-center justify-center transition-all duration-200"
        style={{
          width: '56px',
          height: eyesClosed ? '2px' : '32px', 
          marginTop: eyesClosed ? '16px' : '0',
          transform: eyesClosed ? 'rotate(-5deg)' : 'rotate(0)',
          boxShadow: eyesClosed ? 'none' : 'inset 0 0 10px rgba(0,0,0,0.05)'
        }}
      >
        {/* No eye shadow at all - completely removed to fix mask issue */}
        
        {!eyesClosed && (
          <>
            <div 
              className="w-8 h-8 rounded-full absolute" 
              style={{
                background: 'radial-gradient(circle, #7a55c7 0%, #5e4399 100%)',
                transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
                transition: 'transform 0.1s ease-out',
                boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2)'
              }}
            >
              <div 
                className="w-4 h-4 rounded-full bg-red absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  transform: `translate(${eyePosition.x * 0.5}px, ${eyePosition.y * 0.5}px) translate(-50%, -50%)`,
                  boxShadow: '0 0 3px rgba(0,0,0,0.3)'
                }}
              >
                {/* Main reflection */}
                <div className="w-1.5 h-1.5 rounded-full bg-red absolute top-0 right-0"></div>
                
                {/* Secondary smaller reflection */}
                <div className="w-1 h-1 rounded-full bg-red/70 absolute bottom-1 left-1"></div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Lower eyelid shadow */}
      <div className="absolute w-14 h-1 bg-ree/5 bottom-0 rounded-t-full"></div>
    </div>
  );
}