import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useClickGame } from "@/lib/stores/useClickGame";
import { useAudio } from "@/lib/stores/useAudio";

export default function Character() {
  const { 
    clickSpeed, 
    lastClickTime,
    registerClick,
    responseState,
    setResponseState 
  } = useClickGame();
  
  const { playHit, playSuccess } = useAudio();
  const [animation, setAnimation] = useState<string>("idle");
  const [showResponse, setShowResponse] = useState(false);
  const [response, setResponse] = useState("");
  const [isTalking, setIsTalking] = useState(false);
  const [showDrool, setShowDrool] = useState(false);
  const [blushIntensity, setBlushIntensity] = useState(0.3);
  const [lipSize, setLipSize] = useState(1);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [poseState, setPoseState] = useState("normal");
  const characterRef = useRef<HTMLDivElement>(null);
  const mouthAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const lastRenderTimeRef = useRef<number>(Date.now());
  const lastClickTimeRef = useRef<number | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Performance optimization: memoize animation values
  const isWobbling = useMemo(() => clickSpeed > 4.5, [clickSpeed]);
  const eyeScale = useMemo(() => 
    responseState === "fast" ? 0.4 : 1, 
    [responseState]
  );
  
  // Add a timer to reset to normal state after some time without clicks
  useEffect(() => {
    // Reset any existing timer
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    if (responseState !== "none") {
      // Set timer to reset back to normal state after 5 seconds of no interaction
      resetTimerRef.current = setTimeout(() => {
        setResponseState("none");
        setBlushIntensity(0.3);
        setLipSize(1);
        setShowDrool(false);
        setPoseState("normal");
      }, 5000);
    }

    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, [responseState, setResponseState, lastClickTime]);
  
  // Handle talking animation
  const animateTalking = useCallback(() => {
    setIsTalking(true);
    
    // Clear any existing animation
    if (mouthAnimationRef.current) {
      clearInterval(mouthAnimationRef.current);
    }
    
    // Create mouth animation
    let talkStep = 0;
    mouthAnimationRef.current = setInterval(() => {
      talkStep = (talkStep + 1) % 3;
      const mouthElement = document.getElementById('character-mouth');
      if (mouthElement) {
        if (talkStep === 0) {
          mouthElement.setAttribute('d', 'M150 95 Q175 110 200 95');
        } else if (talkStep === 1) {
          mouthElement.setAttribute('d', 'M150 95 Q175 100 200 95');
        } else {
          mouthElement.setAttribute('d', 'M150 95 Q175 105 200 95');
        }
      }
    }, 150);
    
    // Stop talking animation after response time
    setTimeout(() => {
      if (mouthAnimationRef.current) {
        clearInterval(mouthAnimationRef.current);
        mouthAnimationRef.current = null;
      }
      setIsTalking(false);
    }, 2000);
  }, []);
  
  // Create dynamic responses based on click speed
  const getFastResponse = useCallback(() => {
    const responses = [
      "Stop weirdo get off the game",
      "🥵 I SAID STOP!",
      "WHY ARE YOU GOING SO FAST! YOU ARE SUCH A WEIRDO",
      "STAWP IT FEELS TOO GOOD!",
      "STOP, STOP DOING IT YOURE GOING TO MAKE ME BUST",
      "NONONONONO",
      "DONT YOU DARE!",
      "IM SO SLIPPERY",
      "I can feel it coming! STOP NOW!!!",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }, []);
  
  const getSlowResponse = useCallback(() => {
    const responses = [
      "Bro what are you doing to me",
      "If you're going to go slow then thats gonna make me more mad than i already am",
      "I need more from you...",
      "Stop dude i dont want your BBC in me",
      "Is that all you've got for me?",
      "You call that touching?!",
      "I'm waiting for you to get serious",
      "Tease me like you mean it",
      "Show me what you're really capable of",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }, []);
  
  // Make eye position follow cursor - subtle effect - optimized
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (document.hasFocus()) {
        // Throttle updates to improve performance
        const now = Date.now();
        if (now - lastRenderTimeRef.current < 50) return;
        lastRenderTimeRef.current = now;
        
        const rect = characterRef.current?.getBoundingClientRect();
        if (rect) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 3;
          
          // Calculate distance from center with limited movement
          const maxMove = 5;
          const dx = Math.max(-maxMove, Math.min(maxMove, (e.clientX - centerX) / 100));
          const dy = Math.max(-maxMove, Math.min(maxMove, (e.clientY - centerY) / 100));
          
          setEyePosition({ x: dx, y: dy });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Handle character click
  const handleClick = () => {
    const currentTime = Date.now();
    registerClick(currentTime);
    lastClickTimeRef.current = currentTime;
    
    // Trigger animation
    setAnimation("clicked");
    setTimeout(() => {
      setAnimation("idle");
    }, 300);
    
    // Set pose based on click speed
    if (clickSpeed > 4) {
      setPoseState("excited");
    } else if (clickSpeed > 2) {
      setPoseState("interested");
    } else {
      setPoseState("normal");
    }
    
    // Check if we should respond to click speed
    if (lastClickTime && (currentTime - lastClickTime) < 1000) {
      // Fast click - increase intensity
      if (responseState !== "fast") {
        playHit();
        setResponse(getFastResponse());
        setResponseState("fast");
        showResponseBubble();
        animateTalking();
        
        // Show drool and increase blush for fast clicks
        setShowDrool(true);
        setBlushIntensity(0.9);
        setLipSize(1.2);
      }
    } else if (lastClickTime) {
      // Slow click
      if (responseState !== "slow") {
        playSuccess();
        setResponse(getSlowResponse());
        setResponseState("slow");
        showResponseBubble();
        animateTalking();
      }
    }
  };
  
  // Show response bubble with text
  const showResponseBubble = () => {
    setShowResponse(true);
    setTimeout(() => {
      setShowResponse(false);
    }, 2000);
  };
  
  // Animate background with click speed - optimized
  useEffect(() => {
    const element = document.getElementById("game-background");
    if (element) {
      if (clickSpeed > 5) {
        element.style.animationDuration = "0.3s";
      } else if (clickSpeed > 3) {
        element.style.animationDuration = "0.8s";
      } else if (clickSpeed > 1) {
        element.style.animationDuration = "1.5s";
      } else {
        element.style.animationDuration = "3s";
      }
    }
    
    // Cleanup
    return () => {
      if (mouthAnimationRef.current) {
        clearInterval(mouthAnimationRef.current);
      }
    };
  }, [clickSpeed]);
  
  // Precomputed heart positions for performance - reduced count for better performance
  const heartPositions = useMemo(() => {
    return Array.from({ length: 6 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 10}s`,
      scale: 0.5 + Math.random() * 1
    }));
  }, []);
  
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full">
      <div 
        id="game-background" 
        className="absolute w-full h-full bg-gradient-to-r from-pink-200 via-purple-200 to-pink-200 animate-pulse"
        style={{ animationDuration: "3s" }}
      />
      
      {/* Optimized background hearts - reduced quantity for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {heartPositions.map((pos, index) => (
          <div 
            key={index}
            className="absolute animate-float"
            style={{
              left: pos.left,
              top: pos.top,
              animationDelay: pos.delay,
              animationDuration: pos.duration,
              opacity: 0.6,
              transform: `scale(${pos.scale})`,
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#ff85c0">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}
      </div>
      
      {/* Character container */}
      <div 
        ref={characterRef}
        onClick={handleClick}
        className={`relative cursor-pointer transition-transform ${animation === "clicked" ? "scale-95" : "scale-100"} ${isWobbling ? "animate-wobble" : ""} hover:scale-105`}
        style={{
          filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))",
          willChange: "transform"
        }}
      >
        {/* Realistic standing human girl */}
        <div className="relative">
          {/* Using actual image for the character - much more realistic */}
          <img 
            src="/character.png" 
            alt="Character" 
            className={`w-80 h-auto ${isWobbling ? "animate-wobble" : ""} ${animation === "clicked" ? "scale-95" : "scale-100"} transition-all duration-300`}
            style={{
              filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
            }}
          />
          
          {/* Facial expressions overlay - positioned on face */}
          <div className="absolute top-[15%] left-0 right-0 pointer-events-none">
            {/* Eyes that follow mouse */}
            <div className="relative mx-auto w-48 h-16 flex justify-center items-center">
              {/* Left eye */}
              <div className="absolute left-12 w-12 h-12 rounded-full bg-white flex justify-center items-center overflow-hidden">
                <div 
                  className={`w-8 h-8 rounded-full ${responseState === "fast" ? "bg-pink-500" : "bg-purple-500"} transition-colors duration-300`}
                  style={{ 
                    transform: `translate(${eyePosition.x * 2}px, ${eyePosition.y * 2}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                >
                  <div 
                    className={`w-4 h-4 rounded-full bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                    style={{ 
                      transform: `translate(${eyePosition.x * 3}px, ${eyePosition.y * 3}px) scale(${responseState === "fast" ? 0.8 : 1})`,
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full bg-white absolute top-0 right-0"
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Right eye */}
              <div className="absolute right-12 w-12 h-12 rounded-full bg-white flex justify-center items-center overflow-hidden">
                <div 
                  className={`w-8 h-8 rounded-full ${responseState === "fast" ? "bg-pink-500" : "bg-purple-500"} transition-colors duration-300`}
                  style={{ 
                    transform: `translate(${eyePosition.x * 2}px, ${eyePosition.y * 2}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                >
                  <div 
                    className={`w-4 h-4 rounded-full bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                    style={{ 
                      transform: `translate(${eyePosition.x * 3}px, ${eyePosition.y * 3}px) scale(${responseState === "fast" ? 0.8 : 1})`,
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full bg-white absolute top-0 right-0"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mouth with expressions */}
            <div className="relative mx-auto w-48 mt-4">
              <svg viewBox="0 0 100 30" width="100" height="30" className="mx-auto">
                <path 
                  id="character-mouth"
                  d={responseState === "fast" 
                    ? "M20,15 Q50,30 80,15" 
                    : responseState === "slow" 
                      ? "M20,20 Q50,5 80,20" 
                      : "M20,20 Q50,15 80,20"} 
                  fill={isTalking ? "rgba(255,92,138,0.2)" : "none"}
                  stroke={responseState === "fast" ? "#ff5c8a" : "#ff8db0"} 
                  strokeWidth={3 * lipSize}
                  strokeLinecap="round" 
                />
              </svg>
            </div>
            
            {/* Blush effect */}
            {(responseState === "fast" || responseState === "slow") && (
              <div className="flex justify-center mt-2">
                <div 
                  className="w-16 h-6 rounded-full bg-pink-300 opacity-70 mx-1"
                  style={{ opacity: blushIntensity }}
                ></div>
                <div 
                  className="w-16 h-6 rounded-full bg-pink-300 opacity-70 mx-1"
                  style={{ opacity: blushIntensity }}
                ></div>
              </div>
            )}
          </div>
          
          {/* Show drool effect when in excited state */}
          {showDrool && (
            <div className="absolute top-[38%] left-1/2 transform -translate-x-1/2 pointer-events-none z-10">
              <svg width="20" height="40" viewBox="0 0 20 40">
                <path 
                  d="M10,0 C12,10 8,20 10,30" 
                  stroke="white" 
                  strokeWidth="3" 
                  fill="none" 
                  strokeLinecap="round"
                  className="animate-pulse" 
                  style={{ filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.7))' }}
                />
                <circle 
                  cx="10" 
                  cy="30" 
                  r="3" 
                  fill="white" 
                  className="animate-pulse" 
                  style={{ filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.9))' }}
                />
              </svg>
            </div>
          )}
          
          {/* Response bubble */}
          {showResponse && (
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg max-w-xs animate-in fade-in zoom-in z-10">
              <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-white"></div>
              <p className="text-pink-500 font-bold text-center">{response}</p>
            </div>
          )}
        </div>
        

      </div>
      
      {/* Game UI with performance improvements */}
      <div className="absolute bottom-24 flex flex-col items-center gap-2">
        <div className="bg-white/70 backdrop-blur-sm px-5 py-2 rounded-full shadow-md border border-pink-200">
          <p className="text-lg font-medium text-purple-700">
            Click Speed: <span className="font-bold text-pink-600">{clickSpeed.toFixed(1)} CPS</span>
          </p>
        </div>
        
        {/* Excitement meter */}
        <div className="w-64 bg-white/50 rounded-full h-4 overflow-hidden border border-pink-200">
          <div 
            className="h-full bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-300 ease-out"
            style={{ width: `${Math.min(clickSpeed * 10, 100)}%` }}
          />
        </div>
        <p className="text-sm font-medium text-purple-800 bg-white/70 px-3 py-1 rounded-full">
          {clickSpeed > 5 
            ? "She's not loving it!" 
            : clickSpeed > 3 
              ? "stop going!" 
              : clickSpeed > 1 
                ? "stop! stop!" 
                : "stop completely!"}
        </p>
      </div>
      
      {/* Click count achievement system */}
      {clickSpeed > 6 && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
          <span className="font-bold"> She's Close Dude... just stop doing it, crazy how you're doing it with a game character... </span>
        </div>
      )}
    </div>
  );
}
