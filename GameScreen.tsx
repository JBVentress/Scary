import { useState, useEffect, useMemo, useCallback } from "react";
import Instructions from "./Instructions";
import { Button } from "../ui/button";
import { useAudio } from "@/lib/stores/useAudio";
import { useClickGame } from "@/lib/stores/useClickGame";
import { useLovePoints } from "@/lib/stores/useLovePoints";
import { useGame } from "@/lib/stores/useGame";
import GirlFace from "./GirlFace";
import UpgradeShop from "./UpgradeShop";
import AutoClicker from "./AutoClicker";
import CharacterSelect from "./CharacterSelect";
import EmojiManager from "./EmojiManager";
import ExplosionEffect from "./ExplosionEffect";

export default function GameScreen() {
  const { phase, start, selectCharacter, restart, end, skinType } = useGame();
  const { isMuted, toggleMute, backgroundMusic, playHit, playSuccess } = useAudio();
  const { resetGame, clickSpeed, totalClicks, currentStreak, longestStreak, registerClick, responseState, readyToCum, triggerCumStage, checkReadyToCum } = useClickGame();
  const [showStats, setShowStats] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [firstInteraction, setFirstInteraction] = useState(false);
  const [currentInteraction, setCurrentInteraction] = useState(''); // Added state for current interaction

  useEffect(() => {
    resetGame();
    selectCharacter("white");
  }, [resetGame, selectCharacter]);

  // Performance optimization for background particles
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      width: Math.random() * 8 + 4,
      height: Math.random() * 8 + 4,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animDuration: Math.random() * 15 + 10,
      animDelay: Math.random() * 5
    }));
  }, []);

  // Handle first user interaction to enable audio
  const handleFirstInteraction = () => {
    if (!firstInteraction) {
      setFirstInteraction(true);
      if (isMuted) {
        toggleMute();
      }

      // Start background music
      if (backgroundMusic) {
        backgroundMusic.play().catch(e => console.error("Error playing background music:", e));
      }
    }
  };

  // Toggle stats panel
  const toggleStats = () => {
    setShowStats(prev => !prev);
  };

  // Check for explosion trigger when clickSpeed reaches 1000+
  useEffect(() => {
    if (phase === "playing") {
      if (clickSpeed >= 1000 && !showExplosion) {
        setShowExplosion(true);
        playSuccess();
      }
      if (clickSpeed >= 50) {
        checkReadyToCum();
      }
    }
  }, [clickSpeed, phase, showExplosion, playSuccess, checkReadyToCum]);


  const handleInteraction = (interactionType) => {
    setCurrentInteraction(interactionType);
    switch (interactionType) {
      case 'slap':
        playHit(); // Play a sound effect for slapping
        break;
      case 'kiss':
        playHit(); // Play a sound effect for kissing
        break;
      case 'pullHair':
        playHit(); // Play a sound effect for pulling hair
        break;
      default:
        break;
    }
  };


  // Handle explosion completion
  const handleExplosionComplete = () => {
    setShowExplosion(false);
    end(); // End the current game
    resetGame(); // Reset the click game state
    restart(); // Restart the game flow
  };

  useEffect(() => {
    // Add event listener for first interaction if needed
    const handleInteraction = () => {
      handleFirstInteraction();
    };

    document.addEventListener("click", handleInteraction, { once: true });

    // Initialize audio when component mounts
    try {
      // Pre-load audio files if not already loaded
      const bg = new Audio('/background.mp3');
      bg.preload = 'auto';
      bg.volume = 0.4;
      bg.loop = true;

      const hit = new Audio('/hit.mp3');
      hit.preload = 'auto';

      const success = new Audio('/success.mp3');
      success.preload = 'auto';
    } catch (e) {
      console.error("Audio preload error:", e);
    }

    return () => {
      document.removeEventListener("click", handleInteraction);
    };
  }, []);

  return (
    <div 
      className="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-100 via-red-200 to-red-200 overflow-hidden"
      onClick={handleFirstInteraction}
    >
      {/* Show explosion effect when excitement reaches 1000 */}
      {showExplosion && <ExplosionEffect onComplete={handleExplosionComplete} />}
      {/* Optimized background particles - reduced quantity for performance */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-40"
            style={{
              width: `${p.width}px`,
              height: `${p.height}px`,
              left: p.left,
              top: p.top,
              animation: `float ${p.animDuration}s linear infinite`,
              animationDelay: `${p.animDelay}s`,
              boxShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff69b4, 0 0 20px #ff69b4',
              willChange: 'transform'
            }}
          />
        ))}
      </div>

      {/* Character selection phase */}
      {phase === "select" && (
        <CharacterSelect onSelect={selectCharacter} />
      )}

      {/* Instructions phase */}
      {phase === "ready" && (
        <Instructions onStart={start} />
      )}

      {/* Main game playing phase */}
      {phase === "playing" && (
        <>
          {/* Emoji effects removed as requested */}

          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleMute}
              className="rounded-full bg-red/90 hover:bg-red shadow-md border border-red-200"
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5 6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={restart}
              className="rounded-full bg-red/90 hover:bg-red shadow-md border border-red-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleStats}
              className="rounded-full bg-red/90 hover:bg-red shadow-md border border-red-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
              </svg>
            </Button>
          </div>

          {/* Stats panel */}
          {showStats && (
            <div className="absolute top-16 right-4 z-10 bg-red/90 p-4 rounded-xl shadow-lg border border-red-200 backdrop-blur-sm">
              <h3 className="font-bold text-red-600 mb-2">Your Stats</h3>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span className="text-red-600">Total Clicks:</span>
                  <span className="font-medium text-red-600">{totalClicks}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-red-600">Current Streak:</span>
                  <span className="font-medium text-red-600">{currentStreak}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-red-600">Longest Streak:</span>
                  <span className="font-medium text-red-600">{longestStreak}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-red-600">Current Speed:</span>
                  <span className="font-medium text-red-600">{clickSpeed.toFixed(1)} CPS</span>
                </li>
              </ul>
              {longestStreak >= 10 && (
                <div className="mt-2 text-xs text-center bg-red-100 p-1 rounded">
                  <span className="text-red-600">Getting acheivements in a sus game is crazy: {longestStreak >= 20 ? "Insatiable" : "Fast Fingers"}</span>
                </div>
              )}
            </div>
          )}

          {/* Current streak counter */}
          {currentStreak > 5 && (
            <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-red-500 text-red px-4 py-2 rounded-full shadow-lg animate-pulse">
              <span className="font-bold">Your weird ass Streak: {currentStreak}x</span>
            </div>
          )}

          <div className="w-full h-full relative bg-gradient-to-b from-pink-100 to-purple-100 flex items-center justify-center">
            <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 p-4">
              {/* Left side - character and main interaction */}
              <div className="flex-1 flex flex-col items-center justify-center">
                {/* AutoClicker component handles automatic clicks */}
                <AutoClicker />

                <h2 className="text-2xl font-bold text-red-600 mb-2">Click to Pleasure Her</h2>
                <p className="mb-4 text-red-600 text-center max-w-md">
                  The faster you click, the more she does'nt enjoy it! Earn Love Points to buy dumb weird sus upgrades.
                </p>

                {/* Girl Face component - handles all the animations and expressions */}
                <GirlFace />

                {/* Stats display */}
                <div className="mt-6 w-full max-w-md flex flex-col items-center">
                  <div className="w-full flex justify-between items-center">
                    <div className="text-sm text-red-600">Excitement Level:</div>
                    <div className="text-lg font-semibold text-red-600">
                      {clickSpeed.toFixed(1)} / 1000
                    </div>
                  </div>
                  <div className="w-full h-4 bg-red/50 rounded-full mt-1 overflow-hidden border border-red-200">
                    <div 
                      className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-300 ease-out"
                      style={{ width: `${Math.min(clickSpeed / 15, 100)}%` }}
                    />
                  </div>
                  <div className="w-full text-center mt-1">
                    <span className="text-sm font-medium text-red-600">
                      {readyToCum 
                        ? "Your dick is full of cum, you better stop now!"
                        : clickSpeed > 800 
                          ? "She's about to CUM STOP!" 
                          : clickSpeed > 500 
                            ? "She's NOT loving it!" 
                            : clickSpeed > 300 
                              ? "She's NOT getting excited!" 
                              : clickSpeed > 100 
                                ? "She's NOT warming up!" 
                                : "DONT CLICK AT ALL!"}
                    </span>
                    {readyToCum && (
                              <div className="flex flex-col items-center gap-2">
                                <div className="text-red-600 font-bold">Stop! you're about to bust</div>
                                <button
                                  onClick={triggerCumStage}
                                  className="px-4 py-2 bg-red-500 text-white rounded-full animate-pulse"
                                >
                                  Do not press, get off the game
                                </button>
                              </div>
                            )}
                  </div>
                </div>
              </div>

              {/* Right side - shop and upgrades */}
              <div className="flex-1 flex flex-col items-center justify-start">
                <UpgradeShop />
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <Button
              variant="secondary"
              onClick={resetGame}
              className="bg-red/90 hover:bg-red shadow-md border border-red-200 px-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
              Reset Game
            </Button>
          </div>

          {/* Achievement notification */}
          {currentStreak === 10 && (
            <div className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="bg-red/70 text-red px-8 py-4 rounded-xl animate-bounce shadow-lg">
                <h3 className="text-xl font-bold text-red-300">Achievement Unlocked!</h3>
                <p>Fast Fingers: 10 clicks in a row!</p>
              </div>
            </div>
          )}

          {/* Easter egg for very fast clicking */}
          {clickSpeed > 800 && (
            <div className="fixed bottom-24 left-0 right-0 flex justify-center pointer-events-none z-20">
              <div className="bg-red-600/80 text-red px-4 py-1 rounded-full text-sm animate-pulse">
                She's about to...
              </div>
            </div>
          )}
        </>
      )}

      {/* Game ended phase */}
      {phase === "ended" && (
        <div className="bg-red rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Game Over!</h2>
          <p className="text-red-700 mb-4">You've reached the end of the game!</p>
          <Button 
            onClick={() => restart()}
            className="bg-red-500 hover:bg-pink-600 text-white"
          >
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}