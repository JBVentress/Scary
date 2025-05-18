import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "select" | "ready" | "playing" | "ended";
export type SkinType = "white" | "mexican" | "black";

interface GameState {
  phase: GamePhase;
  skinType: SkinType;
  
  // Actions
  start: () => void;
  restart: () => void;
  end: () => void;
  setSkinType: (type: SkinType) => void;
  selectCharacter: (type: SkinType) => void;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set) => ({
    phase: "select", // Start with character selection
    skinType: "white", // Default is white
    
    start: () => {
      set((state) => {
        // Only transition from ready to playing
        if (state.phase === "ready") {
          return { phase: "playing" };
        }
        return {};
      });
    },
    
    restart: () => {
      set(() => ({ phase: "ready" }));
    },
    
    end: () => {
      set((state) => {
        // Only transition from playing to ended
        if (state.phase === "playing") {
          return { phase: "ended" };
        }
        return {};
      });
    },
    
    // Set skin type without changing phase
    setSkinType: (type) => {
      set(() => ({ skinType: type }));
    },
    
    // Select character and move to ready phase
    selectCharacter: (type) => {
      set(() => ({
        skinType: type,
        phase: "ready"
      }));
    }
  }))
);
