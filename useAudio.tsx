import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  moanSounds: HTMLAudioElement[];
  isMuted: boolean;
  lastMoanTime: number;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  loadMoanSounds: () => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playMoan: (pleasureLevel: number) => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  moanSounds: [],
  isMuted: true, // Start muted by default
  lastMoanTime: 0,
  
  setBackgroundMusic: (music) => {
    // Configure background music
    music.loop = true;
    music.volume = 0.35;
    set({ backgroundMusic: music });
  },
  
  setHitSound: (sound) => {
    // Configure hit sound for faster reactions
    sound.volume = 0.8;
    set({ hitSound: sound });
  },
  
  setSuccessSound: (sound) => {
    // Configure success sound
    sound.volume = 0.7;
    set({ successSound: sound });
  },
  
  loadMoanSounds: () => {
    try {
      // Create moan sounds at different pitches using oscillators
      // This ensures we have moan sounds even without actual audio files
      const createMoanSound = (frequency: number, duration: number): HTMLAudioElement => {
        const audio = new Audio();
        audio.volume = 0.5;
        
        // Try to create oscillator-based sound if supported
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.type = 'sine';
          oscillator.frequency.value = frequency;
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          gainNode.gain.value = 0;
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
          gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
          console.error("Oscillator not supported:", e);
        }
        
        return audio;
      };
      
      // Create three different moan sounds with different frequencies
      const moan1 = createMoanSound(280, 0.6); // Soft moan
      const moan2 = createMoanSound(320, 0.8); // Medium moan
      const moan3 = createMoanSound(360, 1.2); // Intense moan
      
      set({ moanSounds: [moan1, moan2, moan3] });
    } catch (e) {
      console.error("Error creating moan sounds:", e);
    }
  },
  
  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const newMutedState = !isMuted;
    
    // Update the muted state
    set({ isMuted: newMutedState });
    
    // Start background music if unmuting
    if (!newMutedState && backgroundMusic && backgroundMusic.paused) {
      backgroundMusic.play().catch(error => {
        console.log("Background music play prevented:", error);
      });
    }
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.6;
      
      // Add slight pitch variation for more realistic effect
      const pitchVariation = 0.9 + Math.random() * 0.3; // Between 0.9 and 1.2
      try {
        // @ts-ignore - TypeScript doesn't know about playbackRate
        soundClone.playbackRate = pitchVariation;
      } catch (e) {
        // Fallback if playbackRate isn't supported
      }
      
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      successSound.currentTime = 0;
      
      // Add slight pitch variation for more realistic effect
      const pitchVariation = 0.95 + Math.random() * 0.1; // Between 0.95 and 1.05
      try {
        // @ts-ignore - TypeScript doesn't know about playbackRate
        successSound.playbackRate = pitchVariation;
      } catch (e) {
        // Fallback if playbackRate isn't supported
      }
      
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },
  
  playMoan: (pleasureLevel) => {
    const { moanSounds, isMuted, lastMoanTime } = get();
    const now = Date.now();
    
    // Rate limit moans to avoid overwhelming audio
    const moanCooldown = 1500 - (pleasureLevel * 200); // Higher pleasure = faster moans
    if (now - lastMoanTime < moanCooldown) {
      return;
    }
    
    // Don't play moans at low pleasure levels
    if (pleasureLevel < 2) {
      return;
    }
    
    if (moanSounds.length > 0 && !isMuted) {
      // Select a moan based on pleasure level
      let moanIndex = 0;
      
      if (pleasureLevel >= 4) {
        // High pleasure - use the most intense moan (index 2)
        moanIndex = Math.min(2, moanSounds.length - 1);
      } else if (pleasureLevel >= 3) {
        // Medium pleasure - use medium intensity moan (index 1)
        moanIndex = Math.min(1, moanSounds.length - 1);
      }
      
      const selectedMoan = moanSounds[moanIndex];
      
      if (selectedMoan) {
        // Clone the node to allow overlapping sounds
        const moanClone = selectedMoan.cloneNode() as HTMLAudioElement;
        
        // Volume and pitch variations based on pleasure
        const volumeLevel = 0.4 + (pleasureLevel * 0.1); // 0.4 to 0.9
        moanClone.volume = volumeLevel;
        
        // Slight random pitch variations for more natural sound
        const pitchVariation = 0.9 + Math.random() * 0.2;
        try {
          // @ts-ignore
          moanClone.playbackRate = pitchVariation; 
        } catch (e) {
          // Fallback if playbackRate isn't supported
        }
        
        moanClone.play().catch(error => {
          console.log("Moan sound play prevented:", error);
        });
        
        set({ lastMoanTime: now });
      }
    } else if (isMuted) {
      console.log("Moan sound skipped (muted)");
    }
  }
}));
