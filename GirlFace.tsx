import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useClickGame } from '@/lib/stores/useClickGame';
import { useLovePoints } from '@/lib/stores/useLovePoints';
import { useAudio } from '@/lib/stores/useAudio';
import { useGame } from '@/lib/stores/useGame';

interface GirlFaceProps {
  currentInteraction?: 'none' | 'slap' | 'kiss' | 'pullHair';
  setCurrentInteraction: React.Dispatch<React.SetStateAction<'none' | 'slap' | 'kiss' | 'pullHair'>>;
}

export default function GirlFace({ currentInteraction = 'none', setCurrentInteraction }: GirlFaceProps) {
  const { skinType } = useGame();
  const { clickSpeed, responseState } = useClickGame();
  const { addPoints, multiplier } = useLovePoints();
  const { playHit, playSuccess, playMoan, loadMoanSounds } = useAudio();

  // Initialize moan sounds
  useEffect(() => {
    loadMoanSounds();
  }, [loadMoanSounds]);

  // State for face expressions
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [mouthOpen, setMouthOpen] = useState(0);
  const [blushIntensity, setBlushIntensity] = useState(0);
  const [sweatDrops, setSweatDrops] = useState(0);
  const [isDrooling, setIsDrooling] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const [satisfied, setSatisfied] = useState(false);
  const [tongueOut, setTongueOut] = useState(false);
  const [eyesClosed, setEyesClosed] = useState(false);
  const [eyesTwitching, setEyesTwitching] = useState(false);
  const [isAhegao, setIsAhegao] = useState(false); // Cross-eyed pleasure expression
  const [isShaking, setIsShaking] = useState(false); // Head shaking
  const [lipBite, setLipBite] = useState(false); // Biting lip expression
  const [eyebrowsRaised, setEyebrowsRaised] = useState(false); // Raised eyebrows
  const [isEcstatic, setIsEcstatic] = useState(false); // Extreme pleasure

  // New expressions
  const [isSmiling, setIsSmiling] = useState(false); // Gentle smile expression
  const [isWhimpering, setIsWhimpering] = useState(false); // Whimpering expression
  const [isMoaning, setIsMoaning] = useState(false); // Moaning expression
  const [isQuivering, setIsQuivering] = useState(false); // Lip quivering
  const [isGasping, setIsGasping] = useState(false); // Gasping expression
  const [isFlushed, setIsFlushed] = useState(false); // Heavily flushed/red face
  const [isTearingUp, setIsTearingUp] = useState(false); // Tearing up from intense pleasure
  const [isPanting, setIsPanting] = useState(false); // Panting expression
  const [isOverwhelmed, setIsOverwhelmed] = useState(false); // Overwhelmed expression
  const [pleasureLevel, setPleasureLevel] = useState(0);

  // References for animations
  const lastRenderTimeRef = useRef<number>(Date.now());
  const faceRef = useRef<HTMLDivElement>(null);
  const droolRef = useRef<HTMLDivElement>(null);

  // Update pleasure level based on click speed and multiplier
  useEffect(() => {
    // Map click speed to pleasure level based on multiplier
    const baseIncrease = Math.max(1, clickSpeed * 0.6); // Base increase from click speed
    const multiplierFactor = Math.log10(multiplier + 1) * 2; // Smaller factor for multiplier

    // Calculate new pleasure level with diminishing returns
    const newPleasureLevel = Math.min(Math.round(baseIncrease * multiplierFactor * 10), 100);

    setPleasureLevel(newPleasureLevel);
  }, [clickSpeed, multiplier, playMoan]);

  // Handle clicking/tapping on the face - enhanced with more reactions
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    // For touch events, count each finger as a separate click
    if (window.TouchEvent && e.nativeEvent instanceof TouchEvent) {
      const touches = e.nativeEvent.touches;
      for (let i = 0; i < touches.length; i++) {
        const bonus = i * 5;
        processSingleClick(bonus);
      }
    } else {
      processSingleClick(0);
    }

    // Enhanced visual feedback for clicks
    if (faceRef.current) {
      // Basic scale animation
      faceRef.current.classList.add('scale-95');
      
      // Random jiggle effect
      const angle = (Math.random() - 0.5) * 10;
      faceRef.current.style.transform = `rotate(${angle}deg) scale(0.95)`;
      
      // Create impact effect at click position
      if (e instanceof MouseEvent) {
        const rect = faceRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const impact = document.createElement('div');
        impact.className = 'absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none';
        impact.style.left = `${x}px`;
        impact.style.top = `${y}px`;
        
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'absolute inset-0 rounded-full animate-ripple';
        ripple.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)';
        impact.appendChild(ripple);
        
        faceRef.current.appendChild(impact);
        
        // Cleanup impact effect
        setTimeout(() => impact.remove(), 1000);
      }
      
      // Random expression change on click
      if (Math.random() < 0.3) {  // 30% chance for extra expression
        const expressions = [
          () => { setEyesClosed(true); setTimeout(() => setEyesClosed(false), 200); },
          () => { setTongueOut(true); setTimeout(() => setTongueOut(false), 300); },
          () => { setEyebrowsRaised(true); setTimeout(() => setEyebrowsRaised(false), 250); },
          () => { setIsWhimpering(true); setTimeout(() => setIsWhimpering(false), 400); },
          () => { setLipBite(true); setTimeout(() => setLipBite(false), 300); }
        ];
        expressions[Math.floor(Math.random() * expressions.length)]();
      }

      // Reset all animations
      setTimeout(() => {
        if (faceRef.current) {
          faceRef.current.classList.remove('scale-95');
          faceRef.current.style.transform = '';
        }
      }, 200);
    }
  };

  // Process individual click or touch
  const processSingleClick = (bonus: number) => {
    // Play appropriate sound based on click speed
    if (clickSpeed > 4) {
      playSuccess();
    } else {
      playHit();
    }

    // Base points (1) plus smaller bonus for additional fingers
    addPoints(1 + (bonus * 0.25));

    // Higher chance to trigger a moan
    if (Math.random() < 0.5) {
      const level = Math.min(Math.floor(pleasureLevel / 50), 5);
      playMoan(level);
    }
  };

  // State for cum effects
  const [hasCumEffect, setHasCumEffect] = useState(false);

  // Update face based on interactions and click speed
  useEffect(() => {
    if (currentInteraction === 'slap') {
      setEyesClosed(true);
      setBlushIntensity(1);
      setMouthOpen(40);
      playMoan(3);
      if (faceRef.current) {
        faceRef.current.style.transform = 'translateX(10px)';
        setTimeout(() => {
          if (faceRef.current) {
            faceRef.current.style.transform = 'translateX(0)';
          }
        }, 100);
      }
      setTimeout(() => {
        setEyesClosed(false);
        setBlushIntensity(0.3);
        setMouthOpen(10);
      }, 1000);
      return;
    }

    if (currentInteraction === 'kiss') {
      setEyesClosed(true);
      setBlushIntensity(0.8);
      setMouthOpen(15);
      setLipBite(true);
      setTimeout(() => {
        setEyesClosed(false);
        setBlushIntensity(0.3);
        setLipBite(false);
      }, 1500);
      return;
    }

    if (currentInteraction === 'pullHair') {
      setEyesClosed(true);
      setMouthOpen(50);
      setBlushIntensity(1);
      setIsBreathing(true);
      setTimeout(() => {
        setEyesClosed(false);
        setBlushIntensity(0.3);
        setIsBreathing(false);
      }, 2000);
      return;
    }

    // Default behavior for clicking
    const mappedMouthOpen = Math.min(clickSpeed * 5, 35);
    setMouthOpen(mappedMouthOpen);

    // Blush gets more intense with faster clicking & pleasure
    const mappedBlushIntensity = Math.min((clickSpeed / 8) + (pleasureLevel / 100), 1);
    setBlushIntensity(mappedBlushIntensity);

    // Add sweat drops at high speeds
    const mappedSweatDrops = clickSpeed > 3 ? Math.min(Math.floor(clickSpeed / 2), 8) : 0;
    setSweatDrops(mappedSweatDrops);

    // Update facial expressions based on pleasure levels and click speed
    // INITIAL RANGE (0-10%)
    setIsSmiling(pleasureLevel >= 0 && pleasureLevel < 10);
    setEyebrowsRaised(pleasureLevel >= 5 && pleasureLevel < 15);

    // WARM-UP RANGE (10-25%)
    setLipBite(pleasureLevel >= 10 && pleasureLevel < 20);
    setIsWhimpering(pleasureLevel >= 15 && pleasureLevel < 25);
    setBlushIntensity(Math.min((pleasureLevel / 100) * 0.3, 0.3));

    // AROUSED RANGE (25-40%)
    setIsDrooling(pleasureLevel >= 25);
    setIsGasping(pleasureLevel >= 25 && pleasureLevel < 35);
    setIsBreathing(pleasureLevel >= 30 || (clickSpeed > 3 && pleasureLevel < 40));
    setMouthOpen(Math.min(20 + (pleasureLevel / 2), 35));

    // EXCITED RANGE (40-60%)
    setIsPanting(pleasureLevel >= 40 && pleasureLevel < 50);
    setIsQuivering(pleasureLevel >= 45 && pleasureLevel < 55);
    setIsMoaning(pleasureLevel >= 50);
    setBlushIntensity(Math.min((pleasureLevel / 100) * 0.6, 0.6));
    setSweatDrops(Math.min(Math.floor(pleasureLevel / 10), 6));

    // INTENSE RANGE (60-80%)
    setTongueOut(pleasureLevel >= 60 && pleasureLevel < 70);
    setEyesTwitching(pleasureLevel >= 65);
    setIsFlushed(pleasureLevel >= 70);
    setSatisfied(pleasureLevel >= 75 || (clickSpeed > 7 && pleasureLevel >= 60));
    setIsTearingUp(pleasureLevel >= 75);
    setBlushIntensity(Math.min((pleasureLevel / 100) * 0.8, 0.8));

    // CLIMAX RANGE (80-95%)
    setEyesClosed(((pleasureLevel >= 80 && pleasureLevel < 90) || clickSpeed > 8) && !isAhegao);
    setIsShaking(pleasureLevel >= 85);
    setIsOverwhelmed(pleasureLevel >= 90);
    setMouthOpen(Math.min(35 + (pleasureLevel / 3), 50));
    setBlushIntensity(Math.min((pleasureLevel / 100) * 0.9, 0.9));
    setSweatDrops(Math.min(Math.floor(pleasureLevel / 8), 12));

    // ECSTASY RANGE (95-100%)
    if (pleasureLevel >= 95) {
      setIsAhegao(true);
      setTongueOut(true);
      setIsDrooling(true);
      setIsShaking(true);
      setBlushIntensity(1);
      setSweatDrops(15);
      setMouthOpen(60);
    }

    // Maximum pleasure state
    if (pleasureLevel >= 99) {
      setIsEcstatic(true);
      setIsTearingUp(true);
      setIsOverwhelmed(true);
      setMouthOpen(70);
    }

    // Special white splatter effect starts at level 100 and increases with level
    // Only create new splatter if we don't have any yet, or if we crossed a new threshold
    const shouldCreateSplatter = (
      (pleasureLevel >= 100 && !hasCumEffect) ||
      (pleasureLevel >= 200 && document.querySelectorAll('.splatter-effect').length < 4) ||
      (pleasureLevel >= 350 && document.querySelectorAll('.splatter-effect').length < 8) ||
      (pleasureLevel >= 500 && document.querySelectorAll('.splatter-effect').length < 12)
    );

    if (shouldCreateSplatter && faceRef.current) {
      setHasCumEffect(true);

      // Calculate how many splatters to add based on pleasure level
      const baseCount = 2; // Start with fewer at level 100
      const extraCount = Math.floor(pleasureLevel / 100) * 2; // Add 2 more every 100 levels
      const count = Math.min(baseCount + extraCount, 4); // Limit how many we add at once

      // Create white splatter effect
      for (let i = 0; i < count; i++) {
        const splat = document.createElement('div');
        const size = Math.random() * 15 + 5; // Smaller initially
        const left = Math.random() * 80 + 10;
        const top = Math.random() * 40 + 20;

        splat.className = 'absolute rounded-full z-50 animate-drip splatter-effect';
        splat.style.width = `${size}px`;
        splat.style.height = `${size * 1.2}px`;
        splat.style.left = `${left}%`;
        splat.style.top = `${top}%`;
        splat.style.background = 'rgba(255, 255, 255, 0.9)';
        splat.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.8)';

        faceRef.current.appendChild(splat);
      }
    }

  }, [clickSpeed, pleasureLevel, hasCumEffect, currentInteraction]);

  // Animate drooling
  useEffect(() => {
    if (!isDrooling || !droolRef.current) return;

    const droolAnimation = () => {
      if (droolRef.current) {
        droolRef.current.style.height = '0px';

        // Gradually increase drool length
        setTimeout(() => {
          if (droolRef.current) {
            droolRef.current.style.height = `${10 + pleasureLevel * 4}px`;
          }
        }, 300);

        // Reset after drool drops
        setTimeout(() => {
          if (droolRef.current) {
            droolRef.current.style.height = '0px';
          }
        }, 2000 + pleasureLevel * 200);
      }
    };

    // Start drool animation
    droolAnimation();
    const interval = setInterval(droolAnimation, 3000);

    return () => clearInterval(interval);
  }, [isDrooling, pleasureLevel]);

  // Eye tracking with mouse
  useEffect(() => {
    if (eyesClosed) {
      setEyePosition({ x: 0, y: 2 }); // Look slightly down when closed
      return;
    }

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = faceRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Calculate face center and viewing distance
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const viewingDistance = rect.width * 1.5; // Approximate viewing distance

      // Calculate 3D coordinates relative to face
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dz = viewingDistance;

      // Convert to spherical coordinates for more natural eye movement
      const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const theta = Math.atan2(dy, dx);
      const phi = Math.acos(dz / r);

      // Apply non-linear mapping for more realistic eye movement
      const maxAngle = Math.PI / 6; // Maximum eye rotation angle
      const normalizedPhi = Math.min(phi, maxAngle) / maxAngle;

      // Calculate final eye position with smooth dampening
      targetX = Math.cos(theta) * normalizedPhi * 3.5;
      targetY = Math.sin(theta) * normalizedPhi * 3.5;

      // Add subtle micro-movements for lifelike effect
      const microMove = Math.sin(Date.now() / 1000) * 0.1;
      targetX += microMove;
      targetY += microMove;
    };

    // Smooth animation loop with natural dampening
    const animate = () => {
      // Smooth interpolation
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      // Clamp values
      currentX = Math.max(-4, Math.min(4, currentX));
      currentY = Math.max(-4, Math.min(4, currentY));

      setEyePosition({ x: currentX, y: currentY });
      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [eyesClosed]);

  // Animation loops for various expressions
  // Breathing animation
  useEffect(() => {
    if (!isBreathing) return;

    const breathingInterval = setInterval(() => {
      if (faceRef.current) {
        faceRef.current.classList.add('scale-y-[1.02]');
        setTimeout(() => {
          if (faceRef.current) {
            faceRef.current.classList.remove('scale-y-[1.02]');
          }
        }, 500);
      }
    }, 1000);

    return () => clearInterval(breathingInterval);
  }, [isBreathing]);

  // Eye twitching animation
  useEffect(() => {
    if (!eyesTwitching) return;

    const twitchInterval = setInterval(() => {
      // Random chance to trigger a twitch
      if (Math.random() < 0.6 && faceRef.current) {
        // Find eye elements
        const eyes = faceRef.current.querySelectorAll('.eye-iris');
        if (eyes.length) {
          // Apply random twitching to both eyes
          eyes.forEach(eye => {
            const element = eye as HTMLElement;
            const origTransform = element.style.transform;

            // Add a quick twitch
            element.style.transform = `${origTransform} translateX(${(Math.random() * 2 - 1) * 3}px)`;

            // Reset after a short time
            setTimeout(() => {
              if (element) element.style.transform = origTransform;
            }, 150);
          });
        }
      }
    }, 800);

    return () => clearInterval(twitchInterval);
  }, [eyesTwitching]);

  // Head shaking animation
  useEffect(() => {
    if (!isShaking) return;

    let direction = 1;
    const shakeInterval = setInterval(() => {
      if (faceRef.current) {
        // Small rapid shaking movement
        faceRef.current.style.transform = `translateX(${direction * 2}px)`;
        direction *= -1; // Flip direction each time
      }
    }, 50); // Very rapid for intense effect

    return () => {
      clearInterval(shakeInterval);
      if (faceRef.current) {
        faceRef.current.style.transform = ''; // Reset transform
      }
    };
  }, [isShaking]);

  // Ahegao (cross-eyed) effect
  useEffect(() => {
    if (!isAhegao) return;

    // Find the eye pupils
    const eyes = document.querySelectorAll('.eye-pupil');
    eyes.forEach(eye => {
      const element = eye as HTMLElement;
      // Cross eyes - both pupils move inward
      if (element.dataset.isLeft === 'true') {
        element.style.transform = 'translate(2px, 0) translate(-50%, -50%)';
      } else {
        element.style.transform = 'translate(-2px, 0) translate(-50%, -50%)';
      }
    });

    return () => {
      // Reset eye positions
      eyes.forEach(eye => {
        const element = eye as HTMLElement;
        element.style.transform = 'translate(-50%, -50%)';
      });
    };
  }, [isAhegao]);

  // Ecstatic effect (extreme pleasure)
  useEffect(() => {
    if (!isEcstatic) return;

    // Create pulsing effect on the whole face
    const pulseInterval = setInterval(() => {
      if (faceRef.current) {
        faceRef.current.classList.add('scale-[1.03]', 'brightness-110');
        setTimeout(() => {
          if (faceRef.current) {
            faceRef.current.classList.remove('scale-[1.03]', 'brightness-110');
          }
        }, 200);
      }
    }, 400);

    return () => clearInterval(pulseInterval);
  }, [isEcstatic]);

  // Get dialogue based on pleasure level - expanded with more variety
  const getDialogue = () => {
    if (responseState && responseState === "fast") {
      if (pleasureLevel >= 90) {
        return "OH GOD! I'M CUMMING SO HARD! DON'T STOP! AHHHH!";
      } else if (pleasureLevel >= 80) {
        return "YES YES YES! I'M CUMMING! FUCK ME HARDER!";
      } else if (pleasureLevel >= 70) {
        return "I'M SO CLOSE! DON'T STOP! I'M GONNA CUM!";
      } else if (pleasureLevel >= 60) {
        return "OH GOD! RIGHT THERE! I'M GETTING SO CLOSE!";
      } else if (pleasureLevel >= 50) {
        return "MMMMM! HARDER! FASTER! GIVE ME MORE!";
      } else if (pleasureLevel >= 40) {
        return "Yes! Faster! Harder! More! Don't stop!";
      } else if (pleasureLevel >= 30) {
        return "Oh yes! That's it! Keep going like that!";
      } else if (pleasureLevel >= 20) {
        return "Mmm! You're making me so wet!";
      } else if (pleasureLevel >= 10) {
        return "Oh! That feels so good! Don't stop!";
      } else {
        return "Yes! That feels nice! Faster!";
      }
    } else if (responseState && responseState === "slow") {
      if (pleasureLevel >= 70) {
        return "NO! Don't slow down now! I was about to cum!";
      } else if (pleasureLevel >= 50) {
        return "Why are you stopping? I was so close!";
      } else if (pleasureLevel >= 30) {
        return "Don't tease me... keep going faster!";
      } else if (pleasureLevel >= 10) {
        return "I need more... don't stop now!";
      } else {
        return "Is that all you've got? I need much more...";
      }
    }
    return "";
  };

  const handleInteraction = (interactionType: 'slap' | 'kiss' | 'pullHair') => {
    // Reset any previous interaction first
    setCurrentInteraction('none');

    // Set the new interaction after a brief delay
    setTimeout(() => {
      setCurrentInteraction(interactionType);

      // Play appropriate sound effect
      switch (interactionType) {
        case 'slap':
          playHit();
          break;
        case 'kiss':
          playMoan(1);
          break;
        case 'pullHair':
          playMoan(2);
          break;
      }

      // Reset interaction after animation completes
      setTimeout(() => {
        setCurrentInteraction('none');
      }, 1000);
    }, 50);
  };

  return (
    <div
      ref={faceRef}
      className={`relative w-80 h-96 overflow-hidden flex flex-col items-center justify-center cursor-pointer border-4 border-red-400 shadow-lg transition-all duration-300`}
      style={{
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
        borderRadius: '40% 40% 35% 35% / 45% 45% 30% 30%',
        // Different skin tones based on selection
        background: skinType === 'white' ? '#f5e1da' :
                   skinType === 'mexican' ? '#d4a675' :
                   skinType === 'black' ? '#5c3c2e' : '#f5e1da',
      }}
      onClick={handleClick}
      onTouchStart={handleClick}
    >
      {/* Hair */}
      {/* More realistic hair with style and shading */}
      <div className="absolute top-0 left-0 right-0 h-44 overflow-hidden z-0">
        {/* Hair base layer - always above forehead to avoid skin showing through */}
        <div
          className="absolute inset-0 top-10"
          style={{
            background: skinType === 'white'
              ? 'linear-gradient(to bottom, #a58e7d, #c8b09f)'
              : skinType === 'mexican'
                ? 'linear-gradient(to bottom, #403020, #554030)'
                : 'linear-gradient(to bottom, #1c1410, #2e221c)'
          }}
        ></div>

        {/* Hair highlight layer - adjusted for each skin tone */}
        <div
          className="absolute inset-0 top-10"
          style={{
            background: skinType === 'white'
              ? 'linear-gradient(to right, transparent 30%, rgba(255,240,230,0.2) 50%, transparent 70%)'
              : skinType === 'mexican'
                ? 'linear-gradient(to right, transparent 30%, rgba(200,170,140,0.15) 50%, transparent 70%)'
                : 'linear-gradient(to right, transparent 30%, rgba(120,100,80,0.1) 50%, transparent 70%)',
          }}
        ></div>

        {/* Hair strands at front - subtle details */}
        <div
          className="absolute w-full h-8 top-12"
          style={{
            background: skinType === 'white'
              ? 'radial-gradient(ellipse at top, #bca596 0%, rgba(188,165,150,0) 70%)'
              : skinType === 'mexican'
                ? 'radial-gradient(ellipse at top, #4a3828 0%, rgba(74,56,40,0) 70%)'
                : 'radial-gradient(ellipse at top, #28201c 0%, rgba(40,32,28,0) 70%)',
          }}
        ></div>
      </div>

      {/* Upper face - forehead and eyes */}
      <div className="relative mt-12 flex flex-col items-center z-10">
        {/* Forehead highlight - varies by skin tone */}
        <div
          className="absolute w-full h-6 -top-8 opacity-50"
          style={{
            background: skinType === 'white'
              ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)'
              : skinType === 'mexican'
                ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)'
                : 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          }}
        ></div>

        {/* Eyebrows - matched to skin tone */}
        <div className="flex w-64 justify-between mb-6">
          {/* Left eyebrow */}
          <div
            className="w-16 h-2 rounded-full"
            style={{
              background: skinType === 'white'
                ? '#8a746a'
                : skinType === 'mexican'
                  ? '#332518'
                  : '#1a1412',
              transform: `rotate(${eyesClosed ? -8 : satisfied ? -10 : -5}deg)`,
              transition: 'transform 0.3s ease'
            }}
          ></div>

          {/* Right eyebrow */}
          <div
            className="w-16 h-2 rounded-full"
            style={{
              background: skinType === 'white'
                ? '#8a746a'
                : skinType === 'mexican'
                  ? '#332518'
                  : '#1a1412',
              transform: `rotate(${eyesClosed ? 8 : satisfied ? 10 : 5}deg)`,
              transition: 'transform 0.3s ease'
            }}
          ></div>
        </div>

        {/* Eyes - with reactive pupils that follow mouse */}
        <div className="flex space-x-20 relative">
          {/* Left eye */}
          <div className="relative">
            {/* Eyelashes */}
            {!eyesClosed && (
              <div className="absolute -top-3 left-1 w-10 flex justify-between">
                <div
                  className="w-0.5 h-2.5 rotate-[-15deg]"
                  style={{
                    backgroundColor: skinType === 'white' ? '#222222' :
                                     skinType === 'mexican' ? '#111111' :
                                     '#000000'
                  }}
                ></div>
                <div
                  className="w-0.5 h-3"
                  style={{
                    backgroundColor: skinType === 'white' ? '#222222' :
                                     skinType === 'mexican' ? '#111111' :
                                     '#00000'
                  }}
                ></div>
                <div
                  className="w-0.5 h-2.5 rotate-[15deg]"
                  style={{
                    backgroundColor: skinType === 'white' ? '#222222' :
                                     skinType === 'mexican' ? '#111111' :
                                     '#000000'
                  }}
                ></div>
              </div>
            )}

            <div
              className={`w-14 h-${eyesClosed ? '1' : '8'} bg-white rounded-full overflow-hidden relative flex items-center justify-center transition-all duration-200`}
              style={{
                height: eyesClosed ? '2px' : '32px',
                marginTop: eyesClosed ? '16px' : '0',
                transform: eyesClosed ? 'rotate(-5deg)' : 'rotate(0)',
                boxShadow: 'none' // No shadow to avoid mask effect
              }}
            >
              {/* No eye socket shadow */}

              {!eyesClosed && (
                <>
                  <div
                    className="w-8 h-8 rounded-full absolute"
                    style={{
                      background: 'radial-gradient(circle, #7a55c7 0%, #5e4399 100%)',
                      transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
                      transition: 'transform 0.1s ease-out',
                      boxShadow: 'none' // No shadow to avoid mask effect
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden"
                      style={{
                        transform: `translate(${eyePosition.x * 0.5}px, ${eyePosition.y * 0.5}px) translate(-50%, -50%)`,
                        background: 'radial-gradient(circle at 40% 40%, #000000 60%, #1a1a1a 100%)',
                      }}
                    >
                      {/* Complex iris texture */}
                      <div className="absolute inset-0" style={{
                        background: 'repeating-conic-gradient(from 0deg, rgba(0,0,0,0.8) 0deg 10deg, rgba(0,0,0,0.6) 10deg 20deg)',
                      }}></div>

                      {/* Main catchlight */}
                      <div className="w-2 h-2 rounded-full bg-white absolute -top-0.5 -right-0.5 opacity-90"></div>

                      {/* Secondary catchlight */}
                      <div className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-0 left-0 opacity-60"></div>

                      {/* Subtle rim light */}
                      <div className="absolute inset-0 rounded-full" style={{
                        background: 'radial-gradient(circle at 70% 70%, transparent 50%, rgba(255,255,255,0.15) 100%)',
                      }}></div>
                    </div>
                  </div>

                  {/* Eye vein at high pleasure levels */}
                  {pleasureLevel >= 4 && (
                    <div className="absolute w-10 h-8 top-1 left-2 pointer-events-none">
                      <div className="absolute h-0.5 w-5 bg-red-400/30"
                          style={{ top: '15%', left: '10%', transform: 'rotate(-5deg)' }}>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Lower eyelid - no shadow */}
            <div className="absolute w-14 h-1 bottom-0 rounded-t-full opacity-0"></div>
          </div>

          {/* Right eye */}
          <div className="relative">
            {/* Eyelashes */}
            {!eyesClosed && (
              <div className="absolute -top-3 right-1 w-10 flex justify-between">
                <div
                  className="w-0.5 h-2.5 rotate-[-15deg]"
                  style={{
                    backgroundColor: skinType === 'white' ? '#222222' :
                                     skinType === 'mexican' ? '#111111' :
                                     '#000000'
                  }}
                ></div>
                <div
                  className="w-0.5 h-3"
                  style={{
                    backgroundColor: skinType === 'white' ? '#222222' :
                                     skinType === 'mexican' ? '#111111' :
                                     '#000000'
                  }}
                ></div>
                <div
                  className="w-0.5 h-2.5 rotate-[15deg]"
                  style={{
                    backgroundColor: skinType === 'white' ? '#222222' :
                                     skinType === 'mexican' ? '#111111' :
                                     '#000000'
                  }}
                ></div>
              </div>
            )}

            <div
              className={`w-14 h-${eyesClosed ? '1' : '8'} bg-white rounded-full overflow-hidden relative flex items-center justify-center transition-all duration-200`}
              style={{
                height: eyesClosed ? '2px' : '32px',
                marginTop: eyesClosed ? '16px' : '0',
                transform: eyesClosed ? 'rotate(-5deg)' : 'rotate(0)',
                boxShadow: 'none' // No shadow to avoid mask effect
              }}
            >
              {/* No eye socket shadow */}

              {!eyesClosed && (
                <>
                  <div
                    className="w-8 h-8 rounded-full absolute"
                    style={{
                      background: 'radial-gradient(circle, #7a55c7 0%, #5e4399 100%)',
                      transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
                      transition: 'transform 0.1s ease-out',
                      boxShadow: 'none' // No shadow to avoid mask effect
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden"
                      style={{
                        transform: `translate(${eyePosition.x * 0.5}px, ${eyePosition.y * 0.5}px) translate(-50%, -50%)`,
                        background: 'radial-gradient(circle at 40% 40%, #000000 60%, #1a1a1a 100%)',
                      }}
                    >
                      {/* Complex iris texture */}
                      <div className="absolute inset-0" style={{
                        background: 'repeating-conic-gradient(from 0deg, rgba(0,0,0,0.8) 0deg 10deg, rgba(0,0,0,0.6) 10deg 20deg)',
                      }}></div>

                      {/* Main catchlight */}
                      <div className="w-2 h-2 rounded-full bg-white absolute -top-0.5 -right-0.5 opacity-90"></div>

                      {/* Secondary catchlight */}
                      <div className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-0 left-0 opacity-60"></div>

                      {/* Subtle rim light */}
                      <div className="absolute inset-0 rounded-full" style={{
                        background: 'radial-gradient(circle at 70% 70%, transparent 50%, rgba(255,255,255,0.15) 100%)',
                      }}></div>
                    </div>
                  </div>

                  {/* Eye vein at high pleasure levels */}
                  {pleasureLevel >= 4 && (
                    <div className="absolute w-10 h-8 top-1 left-2 pointer-events-none">
                      <div className="absolute h-0.5 w-5 bg-red-400/30"
                          style={{ top: '15%', left: '10%', transform: 'rotate(-5deg)' }}>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Lower eyelid - no shadow */}
            <div className="absolute w-14 h-1 bottom-0 rounded-t-full opacity-0"></div>
          </div>
        </div>

        {/* Blush on cheeks - more natural and reactive with gradient */}
        {blushIntensity > 0 && (
          <div className="flex justify-between w-64 mt-3">
            {/* Left cheek blush */}
            <div className="relative">
              <div
                className="w-16 h-6 rounded-full"
                style={{
                  background: `radial-gradient(circle, rgba(251,113,133,${blushIntensity}) 0%, rgba(251,113,133,0) 70%)`,
                  transform: `scale(${1 + blushIntensity * 0.5})`,
                  opacity: blushIntensity * 0.9
                }}
              ></div>

              {/* Highlight for more dimension */}
              <div
                className="w-8 h-3 rounded-full absolute top-1 left-4"
                style={{
                  background: `radial-gradient(circle, rgba(255,174,188,${blushIntensity * 0.7}) 0%, rgba(255,174,188,0) 70%)`,
                  opacity: blushIntensity * 0.8
                }}
              ></div>
            </div>

            {/* Right cheek blush */}
            <div className="relative">
              <div
                className="w-16 h-6 rounded-full"
                style={{
                  background: `radial-gradient(circle, rgba(251,113,133,${blushIntensity}) 0%, rgba(251,113,133,0) 70%)`,
                  transform: `scale(${1 + blushIntensity * 0.5})`,
                  opacity: blushIntensity * 0.9
                }}
              ></div>

              {/* Highlight for more dimension */}
              <div
                className="w-8 h-3 rounded-full absolute top-1 left-4"
                style={{
                  background: `radial-gradient(circle, rgba(255,174,188,${blushIntensity * 0.7}) 0%, rgba(255,174,188,0) 70%)`,
                  opacity: blushIntensity * 0.8
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Nose - more realistic with natural bridge and tip */}
        <div className="mt-3 relative">
          {/* Nose bridge */}
          <div
            className="w-3 h-8 relative"
            style={{
              background: skinType === 'white'
                ? 'linear-gradient(to right, transparent, #f2bdbd 40%, #f8d3d3, #f2bdbd 60%, transparent)'
                : skinType === 'mexican'
                  ? 'linear-gradient(to right, transparent, #c99c76 40%, #d5a782, #c99c76 60%, transparent)'
                : 'linear-gradient(to right, transparent, #5c3c30 40%, #693f2f, #5c3c30 60%, transparent)',
            }}
          >
            {/* Nose tip highlight */}
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-3 rounded-full"
              style={{
                background: skinType === 'white'
                  ? 'radial-gradient(circle at center, #f8d3d3 30%, transparent 100%)'
                  : skinType === 'mexican'
                    ? 'radial-gradient(circle at center, #d5a782 30%, transparent 100%)'
                  : 'radial-gradient(circle at center, #693f2f 30%, transparent 100%)',
              }}
            ></div>
          </div>

          {/* Nostrils with more natural shape */}
          <div className="flex justify-between w-7 -mt-2 relative">
            <div
              className="w-2 h-1.5 rounded-full transform -rotate-15 relative"
              style={{
                background: skinType === 'white'
                  ? 'radial-gradient(circle at center, #d6999f, transparent 150%)'
                  : skinType === 'mexican'
                    ? 'radial-gradient(circle at center, #b5866b, transparent 150%)'
                  : 'radial-gradient(circle at center, #472f27, transparent 150%)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)'
              }}
            ></div>
            <div
              className="w-2 h-1.5 rounded-full transform rotate-15 relative"
              style={{
                background: skinType === 'white'
                  ? 'radial-gradient(circle at center, #d6999f, transparent 150%)'
                  : skinType === 'mexican'
                    ? 'radial-gradient(circle at center, #b5866b, transparent 150%)'
                  : 'radial-gradient(circle at center, #472f27, transparent 150%)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)'
              }}
            ></div>
          </div>
        </div>

        {/* Mouth - now more expressive with realistic lip details */}
        <div className="mt-4 relative flex justify-center">
          {/* Lip shine/highlight */}
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              width: `${56 + mouthOpen * 0.7}px`,
              height: `${4 + mouthOpen * 0.2}px`,
              top: '-2px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
              borderRadius: '100% 100% 0 0',
              opacity: 0.6,
            }}
          ></div>

          {/* Main lips - with more natural curves and shading */}
          <div
            className="overflow-hidden flex justify-center relative"
            style={{
              height: `${12 + mouthOpen}px`,
              width: `${64 + mouthOpen * 0.8}px`,
              background: skinType === 'white'
                ? 'linear-gradient(to bottom, #ff5988 0%, #ff3874 100%)'
                : skinType === 'mexican'
                  ? 'linear-gradient(to bottom, #d84f7b 0%, #c43767 100%)'
                : 'linear-gradient(to bottom, #8a3853 0%, #762a47 100%)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              borderRadius: pleasureLevel >= 3
                ? '40% 40% 40% 40% / 50% 50% 30% 30%'
                : '35% 35% 40% 40% / 50% 50% 30% 30%',
              transform: `scale(${1 + (mouthOpen * 0.005)}, 1)`
            }}
          >
            {/* Upper lip definition */}
            <div
              className="absolute top-0 left-0 right-0"
              style={{
                height: '30%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)',
                borderRadius: '100% 100% 0 0',
              }}
            ></div>

            {/* Inside mouth - visible when open */}
            {mouthOpen > 10 && (
              <div className="w-full h-full absolute -bottom-1 flex items-start justify-center overflow-hidden"
                style={{
                  background: skinType === 'white'
                    ? 'linear-gradient(to bottom, #ff3874 0%, #e02d6a 40%, #d01c56 100%)'
                    : skinType === 'mexican'
                      ? 'linear-gradient(to bottom, #c43767 0%, #a22d57 40%, #8a2246 100%)'
                    : 'linear-gradient(to bottom, #762a47 0%, #5f2039 40%, #48172a 100%)',
                  borderRadius: '100% 100% 0 0',
                }}
              >
                {/* Inner mouth shadow */}
                <div
                  className="absolute inset-0 opacity-70"
                  style={{
                    background: 'radial-gradient(circle at center 70%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 60%)',
                  }}
                ></div>

                {/* Tongue - more detailed and realistic */}
                {tongueOut && (
                  <div
                    className="absolute -bottom-2 rounded-t-full"
                    style={{
                      width: '12px',
                      height: '10px',
                      background: skinType === 'white'
                        ? 'linear-gradient(to bottom, #ff8bac 0%, #ff6b9e 100%)'
                        : skinType === 'mexican'
                          ? 'linear-gradient(to bottom, #d77c99 0%, #c3687f 100%)'
                        : 'linear-gradient(to bottom, #9c5a6e 0%, #824757 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    {/* Tongue texture */}
                    <div
                      className="absolute top-2 left-0 right-0 h-2 rounded-full"
                      style={{
                        background: skinType === 'white'
                          ? 'linear-gradient(to right, #ff4d88 0%, #ff6b9e 50%, #ff4d88 100%)'
                          : skinType === 'mexican'
                            ? 'linear-gradient(to right, #c43767 0%, #d1597e 50%, #c43767 100%)'
                            : 'linear-gradient(to right, #8a3853 0%, #97425f 50%, #8a3853 100%)',
                      }}
                    ></div>

                    {/* Tongue center line */}
                    <div
                      className="absolute top-2 left-1/2 transform -translate-x-1/2 h-3 w-0.5"
                      style={{
                        background: skinType === 'white'
                          ? 'rgba(255,255,255,0.4)'
                          : skinType === 'mexican'
                            ? 'rgba(255,255,255,0.3)'
                            : 'rgba(255,255,255,0.2)',
                      }}
                    ></div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Drool - animated */}
          {isDrooling && (
            <div
              ref={droolRef}
              className="absolute w-1.5 bottom-0 left-1/2 transform -translate-x-1/2"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.2) 100%)',
                borderRadius: '0 0 2px 2px',
                height: '0px',
                transition: 'height 1s ease',
                boxShadow: '0 0 2px rgba(255,255,255,0.4)',
              }}
            ></div>
          )}

          {/* Dialogue/text bubble shows when user is clicking fast or slow */}
          {responseState && responseState !== "none" && (
            <div
              className={`absolute rounded-xl p-2 text-sm w-60 bg-red border border-red-200 shadow-md z-20 transition-all duration-300`}
              style={{
                right: '-14rem',
                top: '-2rem',
                transform: `scale(${responseState && responseState !== "none" ? 1 : 0})`,
                transformOrigin: 'bottom left',
                opacity: responseState && responseState !== "none" ? 1 : 0,
              }}
            >
              <div className="absolute w-3 h-3 bg-red border-b border-l border-red-200 transform rotate-45 -left-1.5 bottom-4"></div>
              <p className={`${responseState && responseState === "fast" ? "text-pink-600" : "text-blue-600"} font-medium`}>
                {getDialogue()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lower face - chin */}
      <div className="mt-6 w-32 h-16 relative">
        {/* Chin highlight - varies by skin tone */}
        <div
          className="absolute w-24 h-10 left-1/2 transform -translate-x-1/2 rounded-b-full opacity-40"
          style={{
            background: skinType === 'white'
              ? 'radial-gradient(ellipse at center bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)'
              : skinType === 'mexican'
                ? 'radial-gradient(ellipse at center bottom, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)'
                : 'radial-gradient(ellipse at center bottom, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
          }}
        ></div>
      </div>

      {/* Sweat drops display when click speed is high */}
      {sweatDrops > 0 && (
        <div className="absolute top-0 right-0 left-0 h-full pointer-events-none">
          {[...Array(sweatDrops)].map((_, i) => (
            <div key={i}
              className="absolute animate-drip"
              style={{
                top: `${Math.random() * 40 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                width: '4px',
                height: '8px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '2px 2px 6px 6px',
                boxShadow: '0 0 3px rgba(255,255,255,0.4)',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}