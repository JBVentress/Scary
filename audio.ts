// Initialize the sound effects for the application
export const loadAudio = () => {
  // Create audio elements
  const backgroundMusic = new Audio('/background.mp3');
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.4;
  
  const hitSound = new Audio('/hit.mp3');
  hitSound.volume = 0.6;
  
  const successSound = new Audio('/success.mp3');
  successSound.volume = 0.6;
  
  // Return the initialized audio elements
  return {
    backgroundMusic,
    hitSound,
    successSound
  };
};