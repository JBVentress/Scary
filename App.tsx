import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "@fontsource/inter";
import { Toaster } from "sonner";
import GameScreen from "./components/game/GameScreen";
import { useAudio } from "./lib/stores/useAudio";

function App() {
  // Initialize audio effects
  useEffect(() => {
    // Create audio elements for game sounds
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    const fastResponseSound = new Audio("/sounds/fast_response.mp3");
    fastResponseSound.volume = 0.7;

    const slowResponseSound = new Audio("/sounds/slow_response.mp3");
    slowResponseSound.volume = 0.7;
    
    // Set audio in store
    useAudio.getState().setBackgroundMusic(backgroundMusic);
    useAudio.getState().setHitSound(fastResponseSound);
    useAudio.getState().setSuccessSound(slowResponseSound);

    // Start with audio muted by default
    // User will need to interact with the page to unmute
    return () => {
      backgroundMusic.pause();
      fastResponseSound.pause();
      slowResponseSound.pause();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <main className="flex flex-col min-h-screen">
          <GameScreen />
        </main>
      </div>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

export default App;
